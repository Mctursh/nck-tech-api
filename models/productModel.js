const mongoose = require("./connection")
const { handleError } = require("../helper")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
})

const Item = new mongoose.model("Item", itemSchema)

const createItem = async (itemDetail) => {
  const [status, itemError] = await handleError(Item.create(itemDetail))
  if(itemError) {
    return [false]
  } else {
    return [true, status]
  }
}

const getAllItems = async () => {
    const [status, itemError] = await handleError(Item.find())
    if(itemError) {
      return [false]
    } else {
      return [true, status]
    }
}

const getItemId = async () => {
    const [currHighest] = await Item.find()
    .sort({"id": "desc"}) //sorting the results in terms of highest id value
    .lean().limit(1) //returns a plain Javascript object instead of a mongo object

    if (currHighest == null) {
      return 1
    } else {
      return currHighest.id + 1      
    }
}

const updateItem = async (id, payload) => {
    const [status, itemError] = await handleError(Item.findOneAndUpdate({"id": id}, payload))
    if(itemError) {
      return [false]
    } else {
      return [true, status]
    }
}

const deleteItem = async(id) => {
    const [status, itemError] = await handleError(Item.deleteOne(id))
    if(itemError) {
      return [false]
    } else {
      return [true, status]
    }
    
} 

module.exports = { createItem, getItemId, updateItem, deleteItem, getAllItems }
