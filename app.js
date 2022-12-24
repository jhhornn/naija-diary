const express = require("express")
const passport = require("passport")
const cors = require("cors")
const morgan = require("morgan")
const { urlencoded } = require("body-parser")
const {
  errorLogger,
  errorResponder,
  invalidPathHandler
} = require("./middlewares/errHandler")

const usersRoute = require("./routes/users")
const blogRoute = require("./routes/blog")

const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./naija-diary.yaml")

const app = express()

app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use(passport.initialize())
require("./middlewares/auth")(passport)

app.use("/api", usersRoute)
app.use("/api", blogRoute)

app.get("/", (req, res, next) => {
  res.send(
    "<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Naija Diary</span>!</h1>\
     <br> <h3 style='color: black;text-align: center'>Click <a href='/api-docs'>here</a> to get started</h3>"
  )
  next()
})
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.all("*", (req, res, next) => {
  next()
})

app.use(errorLogger)
app.use(errorResponder)
app.use(invalidPathHandler)

module.exports = app
