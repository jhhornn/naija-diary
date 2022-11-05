const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("../utils/testHelper")
const app = require("../app")
const api = supertest(app)
const connectDB = require("../config/database")


jest.setTimeout(50000)

const BlogModel = require("../models/blog")
const UserModel = require("../models/users")



let token
const generateToken = async () => {
  const res = await api
.post("/api/login")
.send({
  email: "tempUser@gmail.com",
  password: "temppword",
})
 token = res.body.token
} 


beforeAll(async () => {
  await connectDB()
  await helper.existingUser()
     
})

beforeEach(async () => {
  await BlogModel.deleteMany({})
  // await UserModel.deleteMany({})

  
  // const userObject = helper.initialUsers.map((user) => new BlogModel(user))
  // const promiseUserArray = userObject.map((user) => user.save())
  // await Promise.all(promiseUserArray)

  const blogObject = helper.initialBlogs.map((blog) => new BlogModel(blog))
  const promiseArray = blogObject.map((blog) => blog.save())
  await Promise.all(promiseArray)


})

describe("POST/ request to api/blog", () => {
  test("blog successfully created", async () => {
    await generateToken()
    const result = await api
      .post("/api/blog")
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.message).toContain("input required field")
    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("user needs to be authenticated to create blog", async () => {
    await api
      .post("/api/blog")
      .send(helper.newBlog)
      .expect(401)


      const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("GET/ request to api/blog", () => {
   test("all published blogs are returned", async () => {
    const result = await api
    .get("/api/blog")
    .expect(200)
    .expect("Content-Type", /application\/json/)

    
    expect(result.body).toHaveLength(2)
    expect(result.body[0].state).toBe("published")
  })


  test("all blogs are returned queried by tag", async () => {
    const result = await api
    .get("/api/blog")
    .query({tag: "movies"})
    .expect(200)
    .expect("Content-Type", /application\/json/)

   
    result.body.map((n) => expect(n.tags).toEqual(expect.arrayContaining(["movies"])))
  
  })

  test("all blogs are returned queried by author", async () => {
    const result = await api
    .get("/api/blog")
    .query({author: "John Doe"})
    .expect(200)
    .expect("Content-Type", /application\/json/)

    result.body.map((n) => expect(n.owner).toEqual("John Doe"))
    result.body.map((n) => expect(n.state).toEqual("published"))
    result.body.map((n) => expect(n.title).toEqual("What a title"))
   
  })

  test("all blogs are returned queried by title", async () => {
    const result = await api
    .get("/api/blog")
    .query({title: "The gods must be crazy"})
    .expect(200)
    .expect("Content-Type", /application\/json/)


    result.body.map((n) => expect(n.title).toEqual("The gods must be crazy"))
    result.body.map((n) => expect(n.state).toEqual("published"))
    expect(result.body.length).toEqual(1)
  })


  test("all blogs are returned and sorted", async () => {
    const helperQuery = await helper.blogsInDb()
    const result = await api
    .get("/api/blog")
    .query({sortBy: helperQuery.createdAt, orderBy: "desc"})
    .expect(200)
    .expect("Content-Type", /application\/json/)


    result.body.map((n) => expect(n.state).toBe("published"))
  })

  test("no blog returned in page 2: pagination", async () => {
    const result = await api
    .get("/api/blog")
    .query({p: 2})
    .expect(200)
    .expect("Content-Type", /application\/json/)

    expect(result.body.length).toEqual(0)
  })


  

 

  // test("all blogs are returned", async () => {
  //   const result = await api
  //   .get("/api/blog")
  //   .expect(200)
  //   .expect("Content-Type", /application\/json/)

  //   const blogsAtTheEnd = await helper.blogsInDb()
  //   expect(blogsAtTheEnd).toHaveLength(result.body.length)
  // })
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

  test("blog state is updated and returned", async () => {
    await api
    .patch("/api/blog/")
    .expect(201)
    .expect("Content-Type", /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDb()
    const contents = blogsAtTheEnd.map((n) => n.state)
    expect(contents).toContain("published")

  })
})

afterAll(async () => {
  await BlogModel.deleteMany({})
  await UserModel.deleteMany({})
  await mongoose.connection.close()
})
