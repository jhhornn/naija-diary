const UserModel = require("../models/users")
const BlogModel = require("../models/blog")

const createBlog = async (req, res, next) => {
  const { id } = req.user
  const { title, description, body, tags } = req.body

  const user = await UserModel.findById({ _id: id })

  try {
    const blog = new BlogModel({
      title,
      description,
      owner: `${user.firstName} ${user.lastName}`,
      body,
      tags,
      author: id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    return res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
}

const getAllBlogs = async (req, res, next) => {
  const filters = req.filterObject
  const { sort } = req.sortObject
  const { blogsPerPage, numOfBlogsToSkip } = req.paginate

  try {
    const blog = await BlogModel.find(filters, { title: 1, description: 1 })
      .sort(sort)
      .skip(numOfBlogsToSkip)
      .limit(blogsPerPage)

    return res.status(200).json(blog)
  } catch (err) {
    next(err)
  }
}

const getBlogById = async (req, res, next) => {
  try {
    const { state } = req.filterObject
    const { id } = req.params
    const blog = await BlogModel.findOneAndUpdate(
      { _id: id, state: state },
      { $inc: { readCount: 1 } },
      { new: true }
    )
    res.status(200).json(blog)
  } catch (err) {
    next(err)
  }
}

const getBlogByIdAuth = async (req, res, next) => {
  try {
    const { state } = req.filterObject
    const userId = req.user.id
    const { id } = req.params
    const blogToGet = await BlogModel.findById(id)
    const blogId = blogToGet.author.valueOf()
    if (blogToGet.state === "draft" && userId !== blogId) {
      return res.status(400).json({ message: "can't access other's draft" })
    }
    if (userId !== blogId) {
      const blog = await BlogModel.findOneAndUpdate(
        { _id: id, state: state },
        { $inc: { readCount: 1 } },
        { new: true }
      )
      return res.status(200).json(blog)
    }
    const blog = await BlogModel.findOne({ _id: id, state: state })
    return res.status(200).json(blog)
  } catch (err) {
    next(err)
  }
}

const getAllUsersBlogs = async (req, res, next) => {
  const { id } = req.user
  const { sort } = req.sortObject
  const { blogsPerPage, numOfBlogsToSkip } = req.paginate
  const filters = req.filterObject
  const loggedInUser = await UserModel.findById({ _id: id })

  try {
    const blog = await loggedInUser.populate({
      path: "blogs",
      match: filters,
      select: "title description",
      options: {
        skip: parseInt(numOfBlogsToSkip),
        limit: parseInt(blogsPerPage),
        sort: sort
      }
    })
    return res.status(200).json(blog.blogs)
  } catch (err) {
    next(err)
  }
}

const updateBlog = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const { id } = req.params
    const blog = await BlogModel.findById(id)
    const blogId = blog.author.valueOf()
    const { title, description, body, tags } = req.body

    if (authorId === blogId) {
      if (tags) {
        await BlogModel.findByIdAndUpdate(
          { _id: id },
          { title, description, body, $push: { tags: tags } },
          { new: true }
        )
        return res.status(201).json({ message: "Blog successfully updated" })
      }
      await BlogModel.findByIdAndUpdate(
        { _id: id },
        { title, description, body },
        { new: true }
      )
      return res.status(201).json({ message: "Blog successfully updated" })
    }
  } catch (err) {
    next(err)
  }
}

const updateBlogState = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const { id } = req.params
    const blog = await BlogModel.findById(id)
    const blogId = blog.author.valueOf()

    if (authorId === blogId) {
      await BlogModel.findByIdAndUpdate(
        { _id: id },
        { $set: { state: "published" } },
        { new: true }
      )
      return res
        .status(200)
        .json({ message: "Blog state successfully updated" })
    }
  } catch (err) {
    next(err)
  }
}

const deleteBlog = async (req, res, next) => {
  try {
    const authorId = req.user.id
    const { id } = req.params
    const blog = await BlogModel.findById(id)
    const blogId = blog.author.valueOf()

    if (authorId === blogId) {
      await BlogModel.findByIdAndDelete({ _id: id })
      return res.status(200).json({ message: "Blog deleted" })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createBlog,
  getAllBlogs,
  updateBlog,
  updateBlogState,
  getAllUsersBlogs,
  deleteBlog,
  getBlogById,
  getBlogByIdAuth
}
