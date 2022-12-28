const Joi = require("joi")

const validateBlog = async (req, res, next) => {
    const blogPayload = req.body
    try {
        await blogValidator.validateAsync(blogPayload)
        next()
    } catch (err) {
        next(err)
    }
}

const blogValidator = Joi.object({
    title: Joi.string().min(5).max(150).required(),
    description: Joi.string().min(5).max(255).required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
})

module.exports = validateBlog