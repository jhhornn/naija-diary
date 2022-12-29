const Joi = require("joi")

const validateUser = async (req, res, next) => {
  const userPayload = req.body
  try {
    await userValidator.validateAsync(userPayload)
    next()
  } catch (err) {
    next(err)
  }
}

const userValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string()
    .required()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeatPassword: Joi.ref("password")
}).with("password", "repeatPassword")

module.exports = validateUser
