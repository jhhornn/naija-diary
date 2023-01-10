const CustomAPIError = require("./customError")
const UnathenticatedError = require("./unauthenticated")
const BadRequestError = require("./badRequest")
const NotFoundError = require("./notFound")
const UnauthorisedError = require("./unauthorised")

module.exports = {
  CustomAPIError,
  UnathenticatedError,
  BadRequestError,
  NotFoundError,
  UnauthorisedError
}
