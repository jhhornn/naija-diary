const express = require("express")
const passport = require("passport")
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  updateBlogState
} = require("../controllers/blog")

const blogRouter = express.Router()

blogRouter
  .route("/blog")
  .post(passport.authenticate("jwt", { session: false }), createBlog)
blogRouter.route("/blog").get(getAllBlogs)
blogRouter.route("/blog").put(updateBlog)
blogRouter.route("/blog").patch(updateBlogState)

module.exports = blogRouter
