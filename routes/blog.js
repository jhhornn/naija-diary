const express = require("express")
const passport = require("passport")
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  updateBlogState,
  getAllUsersBlogs,
  getBlogById,
  deleteBlog
} = require("../controllers/blog")
const { filterAndSort, filterByPublished } = require("../middlewares/filter")
const paginate = require("../middlewares/paginate")

const blogRouter = express.Router()

blogRouter
  .route("/home/blog")
  .get(filterAndSort, filterByPublished, paginate, getAllBlogs)
blogRouter.route(`/home/blog/:id`).get(getBlogById)

blogRouter.use("/blog", passport.authenticate("jwt", { session: false }))

blogRouter
  .route("/blog")
  .get(filterAndSort, paginate, getAllUsersBlogs)
  .post(createBlog)

blogRouter
  .route("/blog/:id")
  .put(updateBlog)
  .patch(updateBlogState)
  .delete(deleteBlog)

module.exports = blogRouter
