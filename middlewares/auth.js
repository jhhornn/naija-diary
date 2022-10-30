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
        return done(null, token.user)
      } catch (error) {
        done(error)
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
}
