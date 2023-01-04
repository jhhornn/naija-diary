const express = require("express")
const passport = require("passport")
const cors = require("cors")
const morgan = require("morgan")
const { urlencoded } = require("body-parser")
require("express-async-errors")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const { errorLogger, errorResponder } = require("./middlewares/errHandler")

const usersRoute = require("./routes/users")
const blogRoute = require("./routes/blog")

const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./naija-diary.yaml")

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // return rate limit info in the RateLimit headers
  legacyHeaders: false // disable the X-RateLimit header
})

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(morgan("dev"))

app.use(passport.initialize())
require("./middlewares/auth")(passport)

app.use("/api", usersRoute)

app.use(limiter)
app.use("/api", blogRoute)

app.get("/", (req, res, next) => {
  res.send(
    "<h1 style='color: black;text-align: center'>Welcome to <span style='color: green'>Naija Diary</span>!</h1>\
     <br> <h3 style='color: black;text-align: center'>Click <a href='/api-docs'>here</a> to get started</h3>"
  )
  next()
})
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(errorLogger)
app.use(errorResponder)

app.all("*", (req, res, next) => {
  res.status(404).send({
    msg: `page not found because ${req.originalUrl} is not a valid path`
  })
})

module.exports = app
