const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", err)
  next(err)
}

const errorResponder = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong"
  }

  if (err.name == " ValidationError") {
    customError.msg = Objects.values(err.errors)
      .map((item) => item.message)
      .join(",")
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }
  if (err.name == "CastError") {
    customError.msg = `No item with id: ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = {
  errorLogger,
  errorResponder
}
