require("dotenv").config()
const mongoUri = process.env.MONGODB

const mongoose = require("mongoose")

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to Database")
    })
    .catch((error) => {
      console.log("Error connecting to database", error)
    })
}

module.exports = { initializeDatabase }
