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

describe("Create blog route", () => {
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

describe("Get blog route", () => {
  test("all blogs are returned", async () => {
    const result = await api
    .get("/api/blog")
    .expect(200)
    .expect("Content-Type", /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(result.body.length)
  })
})

describe("Update blog route", () => {
  test("blogs are updated and returned", async () => {
    const updates = {title: "update title", description:"update description", body:"update body", tags:["update", "new update"]}
    await api
    .put("/api/blog/")
    .send(updates)
    .expect(201)
    .expect("Content-Type", /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDb()
    const contents = blogsAtTheEnd.map((n) => n.title)
    expect(contents).toContain("update title")
    const tagContents = blogsAtTheEnd.map((n) => n.tags)
    expect(tagContents[0].length).toEqual(3)

  })
})

afterAll(async () => {
  await BlogModel.deleteMany({})
  await mongoose.connection.close()
})
