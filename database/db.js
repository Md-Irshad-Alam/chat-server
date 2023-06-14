
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

  async function  userdatabase() {
   
      // const result = await mongoose.connect(`mongodb+srv://irshad:irshad1234@cluster0.usgs7zg.mongodb.net/?retryWrites=true&w=majority`);
      const result = await mongoose.connect(`mongodb://0.0.0.0:27017/AllChat`);
      console.log(" user connected")
    return result;
  }

module.exports = userdatabase
