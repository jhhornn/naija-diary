const paginate = (req, res, next) => {
  const blogsPerPage = 20
  try {
    if (req.query.p) {
      const page = req.query.p
      const numOfBlogsToSkip = (page - 1) * blogsPerPage

      req.filterObject.blogsPerPage = blogsPerPage
      req.filterObject.numOfBlogsToSkip = numOfBlogsToSkip
      return next()
    }
    const page = 1
    let numOfBlogsToSkip = (page - 1) * blogsPerPage

    req.filterObject.blogsPerPage = blogsPerPage
    req.filterObject.numOfBlogsToSkip = numOfBlogsToSkip
    return next()
  } catch (err) {
    next(err)
  }
}

module.exports = paginate
