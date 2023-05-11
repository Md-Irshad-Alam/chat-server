// const http = require("http");
// const express = require("express");
// const cors = require("cors");
// const socketIO = require("socket.io");
// const mongoose = require("mongoose");
// const User = require("./models/Join_user");
// const userdatabase = require('./database/db')
// const Chat = require("./models/ChatModel")
// const users = {};
// const app = express();
// const port =5000;

// // Database connection
// // mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('Connected to MongoDB'))
// //   .catch(err => console.error('Error connecting to MongoDB', err));

// // Express middleware
// app.use(cors());

// // Routes
// app.get('/', (req, res) => {
//   res.send('Server is up and running.');
// });

// // Socket.io server
// const server = http.createServer(app);
// const io = socketIO(server);

// io.on('connection', (socket) => {
//   console.log('New client connected.');

//   // User joins chat
//   socket.on('join', async ({ user }) => {
//     // Save user to database
//     const user = new User({ user });
//     console.log(user)
//     await user.save();

//     // Send welcome message to new user
//     socket.emit('message', { sender: 'Admin', message: `Welcome to the chat, ${username}!` });

//     // Notify other users of new user joining
//     socket.broadcast.emit('message', { sender: 'Admin', message: `${username} has joined the chat.` });

//     // Send chat history to new user
//     const chatHistory = await Chat.find().sort({ timestamp: 1 }).exec();
//     socket.emit('chatHistory', chatHistory);
//   });

//   // User sends message
//   socket.on('sendMessage', async ({ sender, message }) => {
//     // Save message to database
//     const chat = new Chat({ sender, message });
//     console.log(chat)
//     await chat.save();

//     // Broadcast message to all connected users
//     io.emit('message', { sender, message });
//   });

//   // User disconnects
//   socket.on('disconnect', () => {
//     console.log('Client disconnected.');
//   });
// });

// // Start server
// server.listen(port, async() => {
//     await userdatabase()
//   console.log(`Server listening on port ${port}.`);
// });
