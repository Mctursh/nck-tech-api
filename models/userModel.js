const bcrypt = require('bcrypt');
const mongoose = require("./connection")
const { handleError } = require("../helper")
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    cartItem: {
        type: Array,
        default: []
    },
    id: {
        type: Number,
        required: true
    }
})

const User = new mongoose.model("User", userSchema)

const createUser = async (username, password, id) => {
    const exist = await User.findOne({"username" : username})
    if (exist == null) {
        return bcrypt.hash(password, saltRounds)
            .then( async (hash) => {
                const [status, itemError] = await handleError(User.create({username, hash, id}))
                if(itemError) {
                    return [false]
                } else {
                    return [true, status]
                }
            })    
    } else {
        return [false, "User already exists"]
    }
}


const loginUser = async (username, password) => {
    const [user, status] = await handleError(User.findOne({"username" : username}))
    if (status == undefined) { //checks if the query operation to the DB was successful
        if (user != null) { //checks if the user with the username provided exists
            return bcrypt.compare(password, user.hash).then(function(result) {
                if (result) { //found user with right password
                    return [true, user]
                } else { //found user but wrong password was provided
                    return [false, "Wrong password provided"]
                }
            });    
        } else {
            return [false, `User with the username ${username} does not exist`]            
        }
        
    } else {
        return [false, "Failed to login"]            
        
    }
}


const getUserId = async () => {
    const [currHighest] = await User.find()
    .sort({"id": "desc"}) //sorting the results in terms of highest id value
    .lean().limit(1) //returns a plain Javascript object instead of a mongo object

    if (currHighest == null) {
      return 1
    } else {
      return currHighest.id + 1      
    }
}

module.exports = { createUser, loginUser, getUserId }