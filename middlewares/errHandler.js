const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", err)
  next(err)
}

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", "application/json")
  if (err.name === "TypeError") {
    res.status(401).json({
      message: "unauthorised access"
    })
  } else if (err.name === "Error") {
    res.status(401).json({
      message: "unauthorised access"
    })
  } else if (err.message.startsWith("E11000 duplicate key error collection")) {
    res.status(400).json({
      message: "email already in use"
    })
  } else if (err.message.startsWith("Blog validation failed")) {
    res.status(400).json({
      message: "input required field"
    })
  } else {
    next(err)
  }
}

const invalidPathHandler = (err, req, res, next) => {
  res.status(500).send({
    message: `${req.originalUrl} is not a valid path`
  })
}

module.exports = {
  errorLogger,
  errorResponder,
  invalidPathHandler
}
