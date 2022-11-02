const UserModel = require("../models/users")
const BlogModel = require("../models/blog")


const createBlog = async (req, res, next) => {
    const { title, description, body, tags  } = req.body

  try {  const blog = new BlogModel({
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

const getAllBlog = async (req, res, next) => {

}

module.exports = createBlog