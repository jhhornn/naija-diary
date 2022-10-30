const User = require("../models/users")

//! Instantiating users test parameters
const initialUsers = [
  {
    email: "seun@gmail.com",
    firstName: "John",
    lastName: "Doe",
    password: "Password"
  },
  {
    email: "tobi@gmail.com",
    firstName: "Tobi",
    lastName: "Doe",
    password: "Password2"
  }
]

const nonExistingId = async () => {
  const user = new User({
    email: "tempUser@gmail.com",
    firstName: "Tobi",
    lastName: "Doe",
    password: "temppword"
  })
  await user.save()
  await user.remove()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((note) => note.toJSON())
}

const newUser = {
  email: "jhhornn@gmail.com",
  firstName: "John",
  lastName: "Doe",
  password: "Password"
}

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
  newUser
}
