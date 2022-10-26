const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const MONGODB_URI = process.env.MONGODB_URI //|| 'mongodb://0.0.0.0:27017/naija-diary'

function connectDB() {
  try {
    mongoose.connect(MONGODB_URI)

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB Successfully")
    })
  } catch {
    mongoose.connection.on("error", (err) => {
      console.log("An error occurred while connecting to MongoDB")
      console.log(err)
    })
  }
}

module.exports = connectDB
