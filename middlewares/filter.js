const { request } = require("../app")

const orderByFunc = (value) => {
  return value === "desc" ? -1 : 1
}

const filterByPublished = (req, res, next) => {
  req.filterObject.state = "published"
  return next()
}

const filterAndSort = (req, res, next) => {
  const { tag, author, title, state, sortBy, orderBy } = req.query
  req.filterObject = {}
  req.sort = {}
  if (sortBy && orderBy) {
    let order = orderByFunc(orderBy)
    req.sort[sortBy] = order
  }

  try {
    if (tag) {
      const searchTag = Array.isArray(tag)
        ? tag
        : tag.split(", ") || tag.split(" ")
      req.filterObject.tag = searchTag
    }
    if (author) {
      req.filterObject.author = author
    }
    if (title) {
      req.filterObject.title = title
    }

    if (sortBy && orderBy) {
      req.sort
    }

    if (state) {
      req.filterObject.state = state
    }
    return next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  filterByPublished,
  filterAndSort
}
