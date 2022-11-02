const express = require("express")
const createBlog = require("../controllers/blog")

const blogRouter = express.Router()

blogRouter.route("/blog").post(createBlog)


module.exports = blogRouter