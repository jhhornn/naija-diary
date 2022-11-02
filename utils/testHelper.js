const UserModel = require("../models/users")
const BlogModel = require("../models/blog")

//! Instantiating users test parameters for users
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
  const user = new UserModel({
    email: "tempUser@gmail.com",
    firstName: "Tobi",
    lastName: "Doe",
    password: "temppword"
  })
  await user.save()
  await user.remove()

  return user._id.toString()
}

const existingUser = async () => {
  const user = new UserModel({
    email: "tempUser@gmail.com",
    firstName: "Tobi",
    lastName: "Doe",
    password: "temppword"
  })
  await user.save()
}

const usersInDb = async () => {
  const users = await UserModel.find({})
  return users.map((user) => user.toJSON())
}

const newUser = {
  email: "jhhornn@gmail.com",
  firstName: "John",
  lastName: "Doe",
  password: "Password"
}

//! Instantiating users test parameters for blogs
const initialBlogs = [
  {
    title: "The gods must be crazy",
    description: "The gods must be crazy",
    tags: "#movies",
    body: "The gods must be crazy talks about a tribe that has not been open to civilisation"
  },
  {
    title: "The gods are  dead",
    description: "The gods are dead",
    tags: "#movies",
    body: "The gods are dead talks about a th belief of a certain community"
  }
]

const blogsInDb = async () => {
  const blogs = await BlogModel.find({})
  return blogs.map((blog) => blog.toJSON())
}

const newBlog = {
  title: "A new blog",
  description: "The gods are dead",
  tags: "#movies",
  body: "The gods are dead talks about a th belief of a certain community"
}

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
  newUser,
  initialBlogs,
  blogsInDb,
  newBlog,
  existingUser
}
