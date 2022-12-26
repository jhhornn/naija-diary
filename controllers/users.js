const passport = require("passport")
const jwt = require("jsonwebtoken")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "../config/.env") })
const { BadRequestError } = require("../errors")

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

const logIn = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err)
      }

      if (!user) {
        throw new BadRequestError("Username or password is incorrect")
      }

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err)

        const body = { id: user.id, email: user.email }

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "1hr"
        })

        return res.status(200).json({ token: token })
      })
    } catch (err) {
      next(err)
    }
  })(req, res, next)
}

module.exports = { signUp, logIn }
