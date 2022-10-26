const mongoose = require("mongoose")
//const moment = require('moment')

const Schema = mongoose.Schema
const objectId = Schema.Types.ObjectId

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: objectId,
      ref: "User"
    },
    state: {
      type: String,
      default: "draft",
      enum: ["draft", "published"]
    },
    readCount: {
      type: Number
    },
    readingTime: {
      type: Date
    },
    tags: [String],
    body: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

BlogSchema.pre("save", function () {
  let blog = this
  let titleLength = blog.title.length
  let descriptionLength = blog.description.length
  let bodyLength = blog.body.length
  let totalLength = titleLength + descriptionLength + bodyLength
  let totalTime = Math.round(totalLength / 200)

  blog.readCount = bodyLength
  blog.readingTime = totalTime == 0 ? 1 : totalTime
})

const Blog = mongoose.model("Blog", BlogSchema)

modules.exports = Blog
