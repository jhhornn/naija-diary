const app = require("./app")
const connectDB = require("./config/database")
const http = require("http")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config({ path: path.join(__dirname, "./config/.env") })

const PORT = process.env.PORT || 4040
const server = http.createServer(app)

server.listen(PORT, async () => {
  await connectDB()
  console.log("Server running on port ", PORT)
})
