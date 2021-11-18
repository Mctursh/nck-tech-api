require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const MongoStore = require('connect-mongo');

const productsRoutes = require("./routes/product")
const userRoutes = require("./routes/user")
const cartRoutes = require("./routes/cart")

const app = express()

const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(session({
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: url, mongoOptions: options }),
  cookie: { maxAge: 60 * 60 * 24 * 7 * 1000} // the cookie expires in 7 days
}));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/product", productsRoutes)
app.use("/user", userRoutes)
app.use("/cart", cartRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App listening on port ${PORT}`);
});