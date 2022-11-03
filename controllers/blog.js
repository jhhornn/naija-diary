const UserModel = require("../models/users")
const BlogModel = require("../models/blog")

const createBlog = async (req, res, next) => {
  const { title, description, body, tags } = req.body

  try {
    const blog = new BlogModel({
      title,
      description,
      body,
      tags
    })

    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
}

const getAllBlogs = async (req, res, next) => {
    try { const allBlog = await BlogModel.find({})

    res.status(200).json(allBlog)
    } catch (err) {
        next(err)
    }
}

const updateBlog = async (req, res, next) => {
    try{
        const { title, description, body, tags } = req.body

        const updatedBlog = await BlogModel.findOneAndUpdate(title, {title, description, body, $push:{"tags":tags}}, {new:true})
        res.status(201).json(updatedBlog)

    } catch(err) {
        next(err)
    }
}

const updateBlogState = async (req, res, next) => {
    try {
        
    } catch(err) {
        next(err)
    }
}

module.exports = {createBlog, getAllBlogs, updateBlog}
