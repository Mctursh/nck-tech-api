const express = require("express")
const bodyParser = require("body-parser")

const productsRoutes = require("./routes/product")
const userRoutes = require("./routes/user")

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/product", productsRoutes)
app.use("/user", userRoutes)

app.listen(3000, () => console.log("succefully running on port 3000"))