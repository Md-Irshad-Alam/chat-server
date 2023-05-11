require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const config = require('../config')
async function connectDatabase() {

    const result = await mongoose.connect(process.env.hostuser);
    console.log(" connected")
    return result;
  }
  
  async function  userdatabase() {
    try {
      const result = await mongoose.connect(`mongodb+srv://${config.username}:${config.password}@cluster0.usgs7zg.mongodb.net/?retryWrites=true&w=majority`);
     console.log(" user connected")
      return result;
    } catch (error) {
      console.log(error)
    }
  }

module.exports = userdatabase