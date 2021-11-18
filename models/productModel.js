const { mongoose } = require("./connection")
const { handleError } = require("../helper")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
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
  const [data, isError] = await handleError(Item.create(itemDetail))
  if(isError) {
    return [false]
  } else {
    return [true, data]
  }
}

const getItems = async (query = {}) => {
    const [data, isError] = await handleError(Item.find(query))
    if(isError) {
      return [false]
    } else {
      return [true, data]
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
    const [data, isError] = await handleError(Item.findOneAndUpdate({"id": id}, payload))
    if(isError) {
      return [false]
    } else {
      return [true, data]
    }
}

const deleteItem = async(id) => {
    const [data, isError] = await handleError(Item.deleteOne(id))
    if(isError) {
      return [false]
    } else {
      return [true, data]
    }    
} 

const getItemById = async(id) => {
    const [status, data] = await getItems({id})
    if (status == true) { //returns an array containing a boolean and an response object from the query
      return [true, data] 
    } else {
      return [false, data]
    }
}

module.exports = { createItem, getItemId, updateItem, deleteItem, getItems, getItemById }
