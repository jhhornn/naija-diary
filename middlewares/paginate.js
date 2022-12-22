const paginate = (req, res, next) => {
  req.paginate = {}
  const blogsPerPage = 20
  try {
    if (req.query.p) {
      const page = req.query.p
      const numOfBlogsToSkip = (page - 1) * blogsPerPage

      req.paginate.blogsPerPage = blogsPerPage
      req.paginate.numOfBlogsToSkip = numOfBlogsToSkip
      return next()
    }
    const page = 1
    let numOfBlogsToSkip = (page - 1) * blogsPerPage

    req.paginate.blogsPerPage = blogsPerPage
    req.paginate.numOfBlogsToSkip = numOfBlogsToSkip
    return next()
  } catch (err) {
    next(err)
  }
}

module.exports = paginate
