const express = require("express")
const passport = require("passport")
const morgan = require("morgan")
const { urlencoded } = require("body-parser")
const { connectDB } = require("./config/database")
const {
  errorLogger,
  errorResponder,
  invalidPathHandler
} = require("./middlewares/errHandler")

const usersRoute = require("./routes/users")

const app = express()

// connectDB()

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use(passport.initialize())
require("./middlewares/auth")(passport)

app.use("/api", usersRoute)

app.use(errorLogger)
app.use(errorResponder)
app.use(invalidPathHandler)

module.exports = app
