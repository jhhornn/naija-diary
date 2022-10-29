const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI


const connectDB = async (next) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`MongoDB Conected: ${conn.connection.host}`)
  } catch (err) {
    next(err)
    console.err(err)
    process.exit(1)
  }
}


//! hook functions for test database
const dropDbBeforeEachTest = async (next) => {
  try {
    await mongoose.connect(MONGODB_URI)
    await mongoose.connection.db.dropDatabase()
  } catch (err) {
    next(err)
    console.error("Couldn't connect to MongoDB")
  }
}


const dropDbAfterAllTestAndCloseConnection = async (next) => {
  try {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  } catch (err) {
    next(err)
    console.error("Failed to drop database")
  }
}

module.exports = {
  dropDbBeforeEachTest,
  dropDbAfterAllTestAndCloseConnection,
  connectDB
}

