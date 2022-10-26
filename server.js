const express = require("express")
const app = express()
const { urlencoded } = require("body-parser")
const connectDB = require("./config/database")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "./config/.env") })

const PORT = process.env.PORT || 4040

connectDB()

app.listen(PORT, async () => {
  console.log("listening on port ", PORT)
})

module.exports = app
