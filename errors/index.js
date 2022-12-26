const CustomAPIError = require("./customError")
const UnathenticatedError = require("./unauthenticated")
const BadRequestError = require("./badRequest")
const NotFoundError = require("./notFound")


module.exports = {
    CustomAPIError,
    UnathenticatedError,
    BadRequestError,
    NotFoundError
}