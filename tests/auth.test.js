const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("../utils/testHelper")
const app = require("../app")
const api = supertest(app)
const connectDB = require("../config/database")

jest.setTimeout(50000)

const UserModel = require("../models/users")

beforeAll(async () => {
  await connectDB()
})

beforeEach(async () => {
  await UserModel.deleteMany({})

  const userObject = helper.initialUsers.map((user) => new BlogModel(user))
  const promiseArray = userObject.map((user) => user.save())
  await Promise.all(promiseArray)
})

describe("Sign Up", () => {
  test("sign up field must not be empty", async () => {
    await api.post("/api/signup").send().expect(400)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length)
  })

  test("created a user and added to database successfully", async () => {
    await api
      .post("/api/signup")
      .send(helper.newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length + 1)

    const contents = usersAtTheEnd.map((n) => n.firstName)
    expect(contents).toContain("John")
  })

  test("email must be unique", async () => {
    const result = await api
      .post("/api/signup")
      .send(helper.initialUsers[0])
      .expect(400)

    expect(result.body.message).toContain("email already in use")
    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length)
  })

  test("all required field must be provided", async () => {
    const { email, firstName } = helper.newUser
    await api.post("/api/signup").send({ email, firstName }).expect(400)

    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(helper.initialUsers.length)
  })
})

describe("Sign In", () => {
  test("user exists in the database", async () => {
    const { email, password } = helper.initialUsers[0]
    await api
      .post("/api/login")
      .send({ email, password })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const user = await UserModel.findOne({ email: email })
    expect(user.comparePassword(password)).toBeTruthy()
  })

  test("user doesnt't exist in the database", async () => {
    const { email, password } = helper.newUser
    await api
      .post("/api/login")
      .send({ email, password })
      .expect(401)
      .expect("Content-Type", /application\/json/)

    const user = await UserModel.findOne({ email: email })
    expect(user).toBeNull()
  })

  test("password must be correct", async () => {
    const { email } = helper.initialUsers[0]
    await api
      .post("/api/login")
      .send({ email, password: "incorrect" })
      .expect(401)
      .expect("Content-Type", /application\/json/)

    const user = await UserModel.findOne({ email })
    await expect(user.comparePassword("incorrect")).resolves.toEqual(false)
  })

  test("email must be correct", async () => {
    const { password } = helper.initialUsers[0]
    await api
      .post("/api/login")
      .send({ email: "incorrect@gmail.com", password })
      .expect(401)
      .expect("Content-Type", /application\/json/)

    const user = await UserModel.findOne({ email: "incorrect@gmail.com" })
    expect(user).toBeNull()
  })

  test("both fields must be supplied", async () => {
    await api.post("/api/login").send().expect(401)
  })
})

afterAll(async () => {
  await UserModel.deleteMany({})
  await mongoose.connection.close()
})
