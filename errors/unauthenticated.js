const CustomAPIError = require("./customError")

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = 401
  }
}

module.exports = UnauthenticatedError
