const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")

const productsRoutes = require("./routes/product")
const userRoutes = require("./routes/user")
const cartRoutes = require("./routes/cart")

const app = express()

app.use(session({
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/product", productsRoutes)
app.use("/user", userRoutes)
app.use("/cart", cartRoutes)

app.listen(3000, () => console.log("succefully running on port 3000"))