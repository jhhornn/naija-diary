const UserModel = require("../models/users")
const BlogModel = require("../models/blog")

const createBlog = async (req, res, next) => {
  const { id } = req.user
  const { title, description, body, tags } = req.body

  const user = await UserModel.findById({ _id:id })

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
  const { tag, author, title, state, blogsPerPage, numOfBlogsToSkip } =
    req.filterObject
  const sorts = req.sort

  try {
   if (tag|| author || title)
   { const blog = await BlogModel.find(
      {
        state: { $in: state }, 
          $or: [
            { tags: { $in: tag } },
            { owner: { $in: author } },
            { title: { $in: title } }
      ] 
      },
      { title: 1, description: 1, _id: 0 }
    )
      .sort(sorts)
      .skip(numOfBlogsToSkip)
      .limit(blogsPerPage)

    return res.status(200).json(blog)
  }
  const blog = await BlogModel.find({state: { $in: state }}, { title: 1, description: 1, _id: 0 })
    .sort(sorts)
    .skip(numOfBlogsToSkip)
    .limit(blogsPerPage)

  return res.status(200).json(blog)
  } catch (err) {
    next(err)
  }
}

const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await BlogModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { readCount: 1 } },
      { new: true }
    )
    res.status(200).json(blog)
  } catch (err) {
    next(err)
  }
}

const getAllUsersBlogs = async (req, res, next) => {
  const { id } = req.user
  const { tag, title, state, blogsPerPage, numOfBlogsToSkip } = req.filterObject
  const sorts = req.sort
  const loggedInUser = await UserModel.findById({ _id:id })

  try {
    const blog = await loggedInUser.populate({
      path: "blogs",
      match: {
        $or: [
          {
            $or: [{ tags: { $in: tag } }, { title: { $in: title } }]
          },
          { state: { $in: state } }
        ]
      },
      select: "title description",
      options: {
        skip: parseInt(numOfBlogsToSkip),
        limit: parseInt(blogsPerPage),
        sort: sorts
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
        const updatedBlog = await BlogModel.findByIdAndUpdate(
          { _id: id },
          { title, description, body, $push: { tags: tags } },
          { new: true }
        )
        return res.status(201).json(updatedBlog)
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
      const updatedState = await BlogModel.findByIdAndUpdate(
        { _id: id },
        { $set: { state: "published" } },
        { new: true }
      )
      return res.status(201).json(updatedState)
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
      return res.status(200).json({ message: "blog deleted" })
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
  getBlogById
}
