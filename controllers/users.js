const passport = require("passport")
const jwt = require("jsonwebtoken")

const signUp = async (req, res, next) => {
  try {
    res.status(201).json({
      message: "Signup Successful",
      user: req.user
    })
  } catch (err) {
    next(err)
  }
}

module.exports = signUp
