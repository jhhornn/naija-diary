const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/naija-diary'

const connectDB = async () =>{
  try{
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    console.log(`MongoDB Conected: ${conn.connection.host}`)
  } catch (err) {
    console.err(err)
    process.exit(1)
  }
}

module.exports = connectDB
