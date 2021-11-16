const mongoose = require("mongoose")
const { handleError } = require("./helper")
const { v4: uuidv4 } = require('uuid');

// const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const url = 'mongodb://localhost:27017/inventory'
const options = { useNewUrlParser: true, useUnifiedTopology: true }


main()
    .then(() => {
        console.log('succefully connected to DB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(url, options);
}

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

const getID = async () => {
    const [currHighest] = await Item.find()
    .sort({"id": "desc"}) //sorting the results in terms of highest id value
    .lean().limit(1) //returns a plain Javascript object instead of a mongo object
    return currHighest.id + 1
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

module.exports = { createItem, getID, updateItem, deleteItem, getAllItems }
