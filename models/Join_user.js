const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type:String, required:true, unique: true},
    socketId: String,
    message:String,
  });

  
const User = mongoose.model('user', userSchema);


module.exports = User;