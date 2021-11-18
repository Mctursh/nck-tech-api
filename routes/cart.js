require('dotenv').config()
const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
const Cart = require('../models/cartModel');
const { getItemById, updateItem } = require('../models/productModel');
const privateKey = process.env.PRIVATE_KEY


const tokenAuth = (req, res, next) => {
    const authToken = req.headers["authorization"]
    if (authToken != undefined) {
        const token = authToken.split(" ")[1] 
        req.token = token
        next()
    } else {
        res.json({
            statusCode: 403,
            statusText: "Forbidden",
            message: "This user does not have the right authorization"
        })
    }
}

router.get("/get-all-carts", tokenAuth, (req, res) => {
    const { token } = req
    jwt.verify(token, privateKey, (err, data) => {
        if (!err) {
            req.session["payLoad"] = data
            res.redirect("/product/get-all-products")   
        } else {    
            res.json({
                statusCode: 403,
                statusText: "Forbidden",
                message: "Invalid verification token"
            })
        }
        
    })
})


router.get("/add-to-cart/:id", async (req, res) => {
    const prevCart = req.session.cart ? req.session.cart : {}
    const { id } = req.params
    const [status, itemData] = await getItemById(id) // gets Item Obj fro DB
    if (status && itemData.length == 1) { 
        //Item with the given ID exits
        const cart = new Cart(prevCart, itemData)
        const [cartStatus, data] = cart.addItem(itemData[0], parseInt(id, 10))
        if (cartStatus) {
            //item was Succefully added to cart
            const [newCart, newItemStockData] = cart.getNewData()
            req.session.cart = cart
            const [updateStatus] = await updateItem(id, newItemStockData)
            if (updateStatus) { // DB stock was succefully updated
                res.json({
                    statusCode: 200,
                    statusText: "Success",
                    message: data,
                    cartData: newCart
                })    
            } else {
                //Failed to add to cart because DB stock was not succefully updated
                res.json({
                    statusCode: 400,
                    statusText: "Failed",
                    message: "Failed to add to cart because DB stock was not succefully updated",
                })    
            }
        } else {
            //Failed to add cart because item is out of stock 
            res.json({
                statusCode: 400,
                statusText: "Failed",
                message: data,
            })
        }
    } else {
        //couldn't find the item 
        res.json({
            statusCode: 404,
            statusText: "Not Found",
            message: "Could not find the given item by its id"
        })
        
    }    
})


module.exports = router 