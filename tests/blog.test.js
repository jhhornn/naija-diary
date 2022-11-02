const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("../utils/testHelper")
const app = require("../app")
const api = supertest(app)
const connectDB = require("../config/database")

jest.setTimeout(50000)

const BlogModel = require("../models/blog")

// let token

beforeAll(async () => {
  await connectDB()

  //   const user = await helper.existingUser()
  //   await api
  //   .post('api/login')
  //   .send({
  //     email: user.email,
  //     password: user.password,
  //   })
  //   .end((err, res) => {
  //     token = res.body.token
  //     done();
  //   });
})

beforeEach(async () => {
  await BlogModel.deleteMany({})

  const blogObject = helper.initialBlogs.map((blog) => new BlogModel(blog))
  const promiseArray = blogObject.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe("create blog route", () => {
  test("blog successfully created", async () => {
    await api
      .post("/api/blog")
      .send(helper.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length + 1)
  })

  test("blog requires field to be created", async () => {
    const result = await api
      .post("/api/blog")
      .send()
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.message).toContain("input required field")
    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await BlogModel.deleteMany({})
  await mongoose.connection.close()
})
