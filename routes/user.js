require('dotenv').config()
const express = require("express")
const { createUser, loginUser, getUserId } = require("../models/userModel")
const router = express.Router()
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const [status, data] = await loginUser(username.toLowerCase(), password)
    if (status) { // checks if user was succefully logged in
        jwt.sign({ data }, privateKey, {expiresIn: "1h"}, (err, token) => {
            if (!err) { //checks if token was succefully generated
                res.json({
                    statusCode: 200,
                    statusText: "Success",
                    message: "Succefully logged in user",
                    data : {data, token}
                })    
            } else {
                res.json({
                    statusCode: 403,
                    statusText: "Forbidden",
                    message: err
                })    
            }
        })
    } else { //user was unable to sign in 
        res.json({
            statusCode: 403,
            statusText: "Forbidden",
            message: data
        })    
    }
})

router.post("/create", async (req, res) => {
    const { username, password } = req.body;
    const id = await getUserId()
    const [status, data] = await createUser(username.toLowerCase(), password, id)
    if (status == true) {
        res.json({
            statusCode: 200,
            statusText: "Success",
            message: "Succefully created the user",
            data 
        })    
    } else {
        res.json({
            statusCode: 400,
            statusText: "Failure",
            message: "Failed to createUser",
            data
        })
        
    }
})



module.exports = router