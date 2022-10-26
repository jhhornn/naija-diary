const app = require("./index")

connectDB()

app.listen(PORT, async () => {
  console.log("listening on port ", PORT)
})
