const express = require("express")
const router = express.Router()
const { createItem, getID, updateItem, deleteItem, getAllItems } = require("../model")

//Route 
router.get("/get-all-products", async (req, res) => {
    const [ status, data ] = await getAllItems()
    if (status == true) {
        res.json({
            statusCode: 200,
            statusText: "Success",
            message: "Successfully fetched all the items",
            data
        })    
    } else {
        res.json({
            statusCode: 400,
            statusText: "Failure",
            message: "Failed to fetch all the items",
        })    
    }
})

//Route to Create new Item
router.post("/create-new-product", async (req, res) => {
    const { name, price, quantity } = req.body
    const id = await getID()
    const [status, data] = await createItem({name, price, quantity, id})
    if (status == true) {
        res.json({
            statusCode: 200,
            statusText: "Success",
            message: "Item was succesully created",
            data
        })    
    } else {
        res.json({
            statusCode: 400,
            statusText: "Failure",
            message: "Failed to created item",
        })   
    }
    
})

router.patch("/update-product/:id", async (req, res) => {
    const { id: itemId } = req.params
    const payload = req.body
    const [ status, data ] = await updateItem(itemId, payload)
    if (status == true) {
        res.json({
            statusCode: 200,
            statusText: "Success",
            message: "Item was succesully Updated",
            data
        })    
    } else {
        res.json({
            statusCode: 400,
            statusText: "Failure",
            message: "Failed to update item",
        })   
    }
})

router.delete("/delete-product/:id", async (req, res) => {
    const { id } = req.params
    const [status, data] = await deleteItem({ id })
    if (status == true && data.deletedCount == 1) {;
        res.json({
            statusCode: 200,
            statusText: "Success",
            message: `Item with the ${id} was successfully deleted`
        })
    } else {
        if (data.deletedCount == 0) {
            res.json({
                statusCode: 404,
                statusText: "Not Found",
                message: `Item with the id ${id} doesn't exist`
            })    
        } else {
            res.json({
                statusCode: 400,
                statusText: "Failure",
                message: `Item with the id ${id} Failed to delete`
            })    
            
        }
        
    }

})


module.exports = router