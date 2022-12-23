const mongoose = require("mongoose")

const Schema = mongoose.Schema
const objectId = Schema.Types.ObjectId

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
      unique: true
    },
    description: {
      type: String,
      required: [true, "Please enter a description"]
    },
    owner: {
      type: String
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
      type: Number
    },
    tags: [String],
    body: {
      type: String,
      required: [true, "Please provide the blog content"]
    }
  },
  { timestamps: true }
)

//! Add the blog reading time before saving
BlogSchema.pre("save", function (next) {
  let blog = this
  let titleLength = blog.title.length
  let descriptionLength = blog.description.length
  let bodyLength = blog.body.length
  let totalLength = titleLength + descriptionLength + bodyLength
  let totalTime = Math.round(totalLength / 200)

  blog.readCount = 0
  blog.readingTime = totalTime == 0 ? 1 : totalTime

  blog.tags = blog.tags.map((tag) => tag.toLowerCase())

  next()
})

//! Delete certain fields before returning result to client
BlogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    // delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model("Blog", BlogSchema)

module.exports = Blog
