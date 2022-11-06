const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("../utils/testHelper")
const app = require("../app")
const api = supertest(app)
const connectDB = require("../config/database")

jest.setTimeout(50000)

const BlogModel = require("../models/blog")
const UserModel = require("../models/users")
const blogId = "635f9d229a39346186b332cf"

let token
const generateToken = async () => {
  const res = await api.post("/api/login").send({
    email: "tempUser@gmail.com",
    password: "temppword"
  })
  token = res.body.token
}

beforeAll(async () => {
  await connectDB()
  await helper.existingUser()
})

beforeEach(async () => {
  await BlogModel.deleteMany({})

  const blogObject = helper.initialBlogs.map((blog) => new BlogModel(blog))
  const promiseArray = blogObject.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe("POST/ request to api/blog", () => {
  test("blog successfully created", async () => {
    await generateToken()
    const result = await api
      .post("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .send(helper.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(result.body.owner).toBe("Tobi Doe")
  })

  test("blog requires field to be created", async () => {
    await generateToken()
    const result = await api
      .post("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.message).toContain("input required field")
    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("user needs to be authenticated to create blog", async () => {
    await api.post("/api/blog").send(helper.newBlog).expect(401)

    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("GET/ request to api/home/blog", () => {
  test("all published blogs are returned to unautheticated user", async () => {
    const result = await api
      .get("/api/home/blog")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    //! Projection in blog controller
    // result.body.map((n) => expect(n.state).toEqual("published"))
  })

  test("autheticated user can get all published blogs", async () => {
    await generateToken()
    const result = await api
      .get("/api/home/blog")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    //! Projection in blog controller
    // result.body.map((n) => expect(n.state).toEqual("published"))
  })

  test("unauthenticated user can get all published blogs by id", async () => {
    const result = await api
      .get(`/api/home/blog/${blogId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("autheticated user can get all published blogs", async () => {
    await generateToken()
    const result = await api
      .get("/api/home/blog/")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    //! Projection in blog controller
    // result.body.map((n) => expect(n.state).toEqual("published"))
  })

  test("autheticated user can get a published blog by id", async () => {
    await generateToken()
    const result = await api
      .get(`/api/home/blog/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(result.body.state).toEqual("published")
    expect(result.body.readCount).toEqual(1)
  })

  test("unautheticated user can get a published blog by id", async () => {
    const result = await api
      .get(`/api/home/blog/${blogId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(result.body.state).toEqual("published")
    expect(result.body.readCount).toEqual(1)
  })

  test("all blogs are returned queried by tag", async () => {
    const result = await api
      .get("/api/home/blog")
      .query({ tag: "movies" })
      .expect(200)
      .expect("Content-Type", /application\/json/)


    //! Projection in blog controller
    // result.body.map((n) =>
    //   expect(n.tags).toEqual(expect.arrayContaining(["movies"]))
    // )
  })

  test("all blogs are returned queried by tag to authenticated user", async () => {
    await generateToken()
    const result = await api
      .get("/api/home/blog")
      .set("Authorization", `Bearer ${token}`)
      .query({ tag: "movies" })
      .expect(200)
      .expect("Content-Type", /application\/json/)


    //! Projection in blog controller
    // result.body.map((n) =>
    //   expect(n.tags).toEqual(expect.arrayContaining(["movies"]))
    // )
  })

  test("all blogs are returned queried by author", async () => {
    const result = await api
      .get("/api/home/blog")
      .query({ author: "John Doe" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    //! Projection
    // result.body.map((n) => expect(n.owner).toEqual("John Doe"))
    // result.body.map((n) => expect(n.state).toEqual("published"))
    result.body.map((n) => expect(n.title).toEqual("What a title"))
  })

  test("all blogs are returned queried by title", async () => {
    const result = await api
      .get("/api/home/blog")
      .query({ title: "The gods must be crazy" })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    result.body.map((n) => expect(n.title).toEqual("The gods must be crazy"))
    expect(result.body.length).toEqual(1)
  })

  test("all blogs are returned and sorted", async () => {
    const helperQuery = await helper.blogsInDb()
    const result = await api
      .get("/api/home/blog")
      .query({ sortBy: helperQuery.createdAt, orderBy: "desc" })
      .expect(200)
      .expect("Content-Type", /application\/json/)


    //! Projection in blog controller
    // result.body.map((n) => expect(n.state).toBe("published"))
  })

  test("no blog returned on page 2: pagination", async () => {
    const result = await api
      .get("/api/home/blog")
      .query({ p: 2 })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(result.body.length).toEqual(0)
  })
})

describe("GET/ request to users blog api/blog", () => {
  test("all published blogs are returned for authenticated user", async () => {
    await generateToken()
    const result = await api
      .get("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

  })

  test("all blogs are returned queried by tag for authenticated user", async () => {
    await generateToken()
    await api
      .get("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .query({ tag: "movies" })
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("user has to be authenticated to get their individual blogs", async () => {
    await api
      .get("/api/blog")
      .query({ author: "John Doe" })
      .expect(401)
  })

  test("all blogs are returned queried by title for autheticated user", async () => {
    await generateToken()
    await api
      .get("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .query({ title: "The gods must be crazy" })
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs are returned and sorted", async () => {
    await generateToken()
    const helperQuery = await helper.blogsInDb()
    const result = await api
      .get("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .query({ sortBy: helperQuery.createdAt, orderBy: "desc" })
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("no blog returned in page 2: pagination", async () => {
    await generateToken()
    const result = await api
      .get("/api/blog")
      .set("Authorization", `Bearer ${token}`)
      .query({ p: 2 })
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })
})

describe("DELETE/ request to delete blog", () => {
  test("blogs can only be deleted by author", async () => {
    await generateToken()
    await api
      .delete(`/api/blog/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401)
  })
})

describe("PUT/ & PATCH/ request to update authenticated blog route by id", () => {
  test("blogs can only be updated by author", async () => {
    const updates = {
      title: "update title",
      description: "update description",
      body: "update body",
      tags: ["update", "new update"]
    }
    await generateToken()
    await api
      .put(`/api/blog/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updates)
      .expect(401)
  })
  test("blogstate can only be updated by author", async () => {
    await generateToken()
    await api
      .put(`/api/blog/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ state: "published" })
      .expect(401)
  })
})

afterAll(async () => {
  await BlogModel.deleteMany({})
  await UserModel.deleteMany({})
  await mongoose.connection.close()
})
