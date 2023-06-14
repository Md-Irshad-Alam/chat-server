
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

  async function  userdatabase() {
   
      const result = await mongoose.connect(`mongodb+srv://irshad:irshad1234@cluster0.usgs7zg.mongodb.net/?retryWrites=true&w=majority`);
    
      console.log(" user connected")
    return result;
  }

module.exports = userdatabase
