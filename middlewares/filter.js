// const orderByFunc = (value) => {
//   return value === "desc" ? -1 : 1
// }

const filterByPublished = (req, res, next) => {
  req.filterObject.state = "published"
  return next()
}

const filterAndSort = (req, res, next) => {
  const { tag, author, title, state, sort } = req.query
  req.filterObject = {}
  req.sortObject = {}
  // if (sortBy && orderBy) {
  //   let order = orderByFunc(orderBy)
  //   req.sort[sortBy] = order
  // }

  try {
    if (tag) {
      const searchTag = Array.isArray(tag)
        ? tag.toLowerCase()
        : tag.split(", " || " " || ",").map((t) => t.toLowerCase())
      req.filterObject.tags = { $in: searchTag }
    }
    if (author) {
      req.filterObject.owner = { $regex: author, $options: "i" }
    }
    if (title) {
      req.filterObject.title = { $regex: title, $options: "i" }
    }

    if (sort) {
      const sortList = sort.split(",").join(" ")
      req.sortObject.sort = sortList
    } else {
      req.sortObject.sort = "createdAt"
    }

    if (state) {
      req.filterObject.state = state
    } else {
      req.filterObject.state = { $in: ["draft", "published"] }
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
