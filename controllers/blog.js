const UserModel = require("../models/users")
const BlogModel = require("../models/blog")

const orderByFunc = (value) => {
    return value === 'desc' ? -1 : 1
}

const createBlog = async (req, res, next) => {
    const { id } = req.user
  const { title, description, body, tags } = req.body

  const user = await UserModel.findOne({ id })

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
    const {tag, author, title, p, sortBy, orderBy} = req.query
    let page = p || 1
    let blogsPerPage = 20
    let numOfBlogsToSkip = (page - 1) * blogsPerPage


    let sorts = {}
    if (sortBy && orderBy) {
        let order = orderByFunc(orderBy)
        sorts[sortBy] = order
    }

    try { 
    if ((tag || author || title) && (sortBy && orderBy)) {
        const searchTag = Array.isArray(tag) ? tag : tag.split(", ")
        const blog = await BlogModel.find({$and: [{$or: [{tags: { $in: searchTag}},{owner: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]})
        .sort(sorts)
        .skip(numOfBlogsToSkip)
        .limit(blogsPerPage)

        return res.status(200).json(blog)


    } else if (tag || author || title) {
        if (tag) {
            const searchTag = Array.isArray(tag) ? tag : (tag.split(", ") || tag.split(" "))
            const blog = await BlogModel.find({$and: [{$or: [{tags: { $in: searchTag}}, {owner: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]})
            .skip(numOfBlogsToSkip)
            .limit(blogsPerPage)
            return res.status(200).json(blog)
        }

        const blog = await BlogModel.find({$and: [{$or: [{owner: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]})
        .skip(numOfBlogsToSkip)
        .limit(blogsPerPage)

        return res.status(200).json(blog)
    } else if (sortBy && orderBy) {
        const allBlog = await BlogModel.find({state: {$in: "published"}})
        .sort(sorts)
        .skip(numOfBlogsToSkip)
        .limit(blogsPerPage)
         return res.status(200).json(allBlog)

    } else {
        const allBlog = await BlogModel.find({state: {$in: "published"}})
        .skip(numOfBlogsToSkip)
        .limit(blogsPerPage)
        return res.status(200).json(allBlog)

    }

    } catch (err) {
        next(err)
    }
}
const getAllUsersBlogs = async (req, res, next) => {
    const { id } = req.user

    const loggedInUser = await UserModel.findOne({id})

    const {tag, author, title, p, sortBy, orderBy} = req.query
    let page = p || 1
    let blogsPerPage = 20
    let numOfBlogsToSkip = (page - 1) * blogsPerPage


    let sorts = {}
    if (sortBy && orderBy) {
        let order = orderByFunc(orderBy)
        sorts[sortBy] = order
    }

    try { 
    if ((tag || author || title) && (sortBy && orderBy)) {

        const blog = loggedInUser.populate({
            path: 'blogs',
            match: {$and: [{$or: [{tags: { $in: searchTag}},{author: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]},
            select: 'title description -id',
            options:{
                skip: parseInt(numOfBlogsToSkip),
                limit: parseInt(blogsPerPage),
                sort: sorts
            }
        })

        res.status(200).json(blog)

    } else if (tag || author || title) {
        if (tag) {
            const searchTag = Array.isArray(tag) ? tag : tag.split(", ")
        const blog = loggedInUser.populate({
            path: 'blogs',
            match: {$and: [{$or: [{tags: { $in: searchTag}},{author: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]},
            select: 'title description -id',
            options:{
                skip: parseInt(numOfBlogsToSkip),
                limit: parseInt(blogsPerPage),
            }
        })
        res.status(200).json(blog)
        }
        const blog = loggedInUser.populate({
            path: 'blogs',
            match: {$and: [{$or: [{tags: { $in: searchTag}},{author: { $in: author}}, {title: { $in: title}}]}, {state: {$in: "published"}}]},
            select: 'title description -id',
            options:{
                skip: parseInt(numOfBlogsToSkip),
                limit: parseInt(blogsPerPage),
            }
        })

        res.status(200).json(blog)
    } else if (sortBy && orderBy) {

        const blog = loggedInUser.populate({
            path: 'blogs',
            select: 'title description -id',
            options:{
                skip: parseInt(numOfBlogsToSkip),
                limit: parseInt(blogsPerPage),
                sort: sorts
            }
        })

        res.status(200).json(blog)
    } else {
        const blog = loggedInUser.populate({
            path: 'blogs',
            select: 'title description -id',
            options:{
                skip: parseInt(numOfBlogsToSkip),
                limit: parseInt(blogsPerPage),
            }
        })

        res.status(200).json(blog)
    }

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
        const { title } = req.body

        const updatedState = await BlogModel.findOneAndUpdate(title,{$set:{"state":"published"}},{new:true})
        res.status(201).json(updatedState)

    } catch(err) {
        next(err)
    }
}

module.exports = {createBlog, getAllBlogs, updateBlog, updateBlogState}
