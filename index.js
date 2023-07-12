const { db_name, db_pass } = require('./config')
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.use(authRouter)

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://vladyslavdobrovolski:${db_pass}@cluster.yl8aci8.mongodb.net/${db_name}?retryWrites=true&w=majority`
    )
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
start()
