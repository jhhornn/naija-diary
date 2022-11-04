const passport = require("passport")
const localStrategy = require("passport-local").Strategy
const UserModel = require("../models/users")

const JWTstrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt

const path = require("path")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "../config/.env") })

const opts = {}
opts.secretOrKey = process.env.JWT_SECRET
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()

module.exports = (passport) => {
  passport.use(
    new JWTstrategy(opts, async (token, done) => {
      try {
        const user = token.user
        return done(null, user)
      } catch (err) {
        done(err)
      }
    })
  )

  passport.use(
    "signup",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName, user_type } = req.body
          const userObject = {
            firstName,
            lastName,
            email,
            password
          }
          if (user_type) userObject.user_type = user_type

          const user = new UserModel(userObject)
          const savedUser = await user.save()

          return done(null, savedUser)
        } catch (err) {
          done(err)
        }
      }
    )
  )

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email })

          const validate = await user.comparePassword(password)

          if (!user || !validate) {
            return done(null, false, {
              message: "User not found or Password Incorrect"
            })
          }

          return done(null, user, { message: "Logged in Successfully" })
        } catch (err) {
          done(err)
        }
      }
    )
  )
}
