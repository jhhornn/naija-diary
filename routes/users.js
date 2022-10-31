const express = require("express")
const passport = require("passport")
const { signUp, logIn } = require("../controllers/users")

const userRouter = express.Router()

userRouter
  .route("/signup")
  .post(passport.authenticate("signup", { session: false }), signUp)

userRouter.route("/login").post(logIn)

module.exports = userRouter
