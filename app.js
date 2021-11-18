require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const { dbClient } = require("./models/connection")

const productsRoutes = require("./routes/product")
const userRoutes = require("./routes/user")
const cartRoutes = require("./routes/cart")

const app = express()

app.use(session({
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ client: dbClient }), // iniatilizing the store with an existing connection
  cookie: { maxAge: 60 * 60 * 24 * 7 * 1000} // the cookie expires in 7 days
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/product", productsRoutes)
app.use("/user", userRoutes)
app.use("/cart", cartRoutes)

// app.listen(3000, () => console.log("succefully running on port 3000"))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App listening on port ${PORT}`);
});