const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      default: "user",
      enum: ["admin", "user"]
    },
    blogs: [
      {
        type: ObjectId,
        ref: "Blog"
      }
    ]
  },
  { timestamps: true }
)

//! Encrypt password before saving it to database
UserSchema.pre("save", function (next) {
  let user = this

  if (!user.isModified("password")) return next()

  bcrypt.hash(user.password, 8, (err, hash) => {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

//! Compare inputted password with the password in the database
UserSchema.methods.comparePassword = function (pword) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(pword, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

//! Delete certain fields before returning result to client
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const User = mongoose.model("user", UserSchema)
module.exports = User
