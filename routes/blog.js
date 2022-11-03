const express = require("express")
const { createBlog, getAllBlogs, updateBlog } = require("../controllers/blog")

const blogRouter = express.Router()

blogRouter.route("/blog").post(createBlog)
blogRouter.route("/blog").get(getAllBlogs)
blogRouter.route("/blog").put(updateBlog)


module.exports = blogRouter
