const express = require("express")
const userRouter = express.Router()
const passport = require("passport")
const signUp = require("../controllers/users")

userRouter
  .route("/signup")
  .post(passport.authenticate("signup", { session: false }), signUp)

module.exports = userRouter
