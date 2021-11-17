require('dotenv').config()
const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY


const signToken = (req, res, next) => {
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

router.get("/get-all-carts", signToken, (req, res) => {
    const { token } = req
    jwt.verify(token, privateKey, (err, data) => {
        if (!err) {
            // req['payLoad'] = data
            // router.set("payLoad", data)
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


module.exports = router 