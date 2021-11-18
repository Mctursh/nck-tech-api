require('dotenv').config()
const mongoose = require("mongoose")

// const url = 'mongodb://localhost:27017/inventory'
const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }


main()
    .then(() => {
        console.log('succefully connected to DB');
    })
    .catch(err => console.log(err));

async function main() {
  return await mongoose.connect(url, options);
}

const db = mongoose.connection;

db.on('error', (err) => {
    console.log("Failed to connect to DB");
});

const dbClient = db.getClient()

module.exports = { dbClient, mongoose }