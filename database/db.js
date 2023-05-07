const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

async function connectDatabase() {

    const result = await mongoose.connect(`mongodb://127.0.0.1:27017/user_details`);
    console.log(" connected")
    return result;
  }
  
  async function  userdatabase() {

    const result = await mongoose.connect(`mongodb://127.0.0.1:27017/AllChat`);
    console.log(" user connected")
    return result;
  }

module.exports = {connectDatabase, userdatabase};