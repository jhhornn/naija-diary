const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("../utils/testHelper")
const app = require("../app")
const api = supertest(app)
const connectDB = require("../config/database")

jest.setTimeout(30000)

const User = require("../models/users")

beforeAll(async () => {
  await connectDB()
})

beforeEach(async () => {
  await User.deleteMany({})

  let userObject = new User(helper.initialUsers[0])
  await userObject.save()

  userObject = new User(helper.initialUsers[1])
  await userObject.save()
})

describe("Sign Up", () => {
  test("created a user and added to database successfully", async () => {
    await api
      .post("/api/signup")
      .send(helper.newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length + 1)
  })

  test("email must be unique", async () => {
    await api.post("/api/signup").send(helper.initialUsers[0]).expect(401)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length)
  })

  test("all required field must be met", async () => {
    const { firstName } = helper.newUser
    await api.post("/api/signup").send({ firstName }).expect(400)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
