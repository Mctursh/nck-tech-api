require('dotenv').config()
const mongoose = require("mongoose")

// const url = 'mongodb://localhost:27017/inventory'
const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

// let dbClient;

main()
    .then(() => {
        console.log('succefully connected to DB');
        // dbClient = await data.getClient()
    })
    .catch(err => console.log(err));
    
    async function main() {
        await mongoose.connect(url, options);
    }
    
const db = mongoose.connection;
// console.log(db);

db.on('error', (err) => {
    console.log("Failed to connect to DB");
});

const dbClient = db.getClient()
// console.log(`this is ${dbClient}`);

module.exports = { dbClient, mongoose }