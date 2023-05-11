const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/Join_user");
const userdatabase = require('./database/db')
const app = express();
const Chat = require("./models/ChatModel")
const port = 5000 || process.env.PORT;
const users = {};
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});

app.get('/getuser', async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/getChatHistory', async (req, res, next) => {
  try {
    const chatHistory = await Chat.find().sort({ timestamp: 1 }).exec();

    return res.status(200).json({
      success: true,
      count: chatHistory.length,
      data: chatHistory,
    
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

io.on("connection", (socket) => {
  socket.on("joined", async ({ user }) => {
    try {
      const existingUser = await User.findOne({ username: user });

      if (existingUser) {
        console.log("User is already logged in");
      } else {
        const newUser = await User.create({ username: user, socketId: socket.id });
        console.log("User is added to the database");
      }

      users[socket.id] = user;

      const messages = await Chat.find({}).sort({ timestamp: 1 }).exec();

      messages.forEach(({ sender, message, timestamp }) => {
        socket.emit("sendMessage", { sender, message, timestamp });
      });

      socket.broadcast.emit("userJoined", {
        sender: "Admin",
        message: `${user} has joined`,
      });

      socket.emit("welcome", {
        sender: "Admin",
        message: `Welcome, ${user}`,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("sendMessage", async ({ sender, message }) => {
    try {
      const chat = new Chat({ sender, message });
      await chat.save();

      io.emit("sendMessage", { sender, message });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const userdetails = await User.findOneAndDelete({ socketId: socket.id });

      if (userdetails) {
        console.log(`${userdetails.username} has left`);
        socket.broadcast.emit("leave", {
          user: "Admin",
          message: `${userdetails.username} has left`,
        });
      }

      delete users[socket.id];
      console.log("User left");
    } catch (err) {
      console.error(err);
    }
  });
});


// io.on("connection", (socket) => {
 
//   socket.on("joined", async ({ user }) => {
//       // when user joind first time 

//           socket.broadcast.emit("userJoined", {
//             sender: "Admin",
//             message: `${user} has joined`,
//           });

//           socket.emit("welcome", {
//             sender: "Admin",
//             message: `Welcome, ${user}`,
//           });


//   // retiving the chat form backend 
//     try {
//       let getuser = await User.findOne({ user });
//       console.log(user);
//       console.log(getuser.username===user);
//       if (getuser.username===user) {
//         console.log("User is already logged in");
//       } else {
//         const newUser = await User.create({username:user, socketId: socket.id });
//         console.log("User is added to the database");
//       }
  
//       users[socket.id] = user;
  
//       const messages = await Chat.find({}).sort({ timestamp: 1 }).exec();
     
//       messages.forEach(({ sender, message, timestamp }) => {
//         socket.emit("sendMessage", { sender, message, timestamp });
//       });
      
// // send the message to the particular user
//       socket.on('sendMessage', async ({ sender, message }) => {
//         try {
//           // Save message to database
//           const chat = new Chat({ sender, message });
//           await chat.save();

//           // Find the recipient user's socket ID
//           const recipientSocketId = Object.keys(users).find((socketId) => users[socketId] === sender);

//           if (recipientSocketId) {
//             // Emit the message only to the recipient user
//             io.to(recipientSocketId).emit('sendMessage', { sender, message });
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       });


//       // after logged out the message to sent to the write user 

//       socket.on("message", ({ message, id }) => {
//         // Save chat message to MongoDB
//         const newMessage = new Chat({ user: users[id], message, id });
//         newMessage.save((err) => {
//           if (err) {
//             console.error(err);
//           }
//         });
      
//         // Find the recipient user's socket ID
//         const recipientSocketId = Object.keys(users).find((socketId) => users[socketId] === users[id]);
//           console.log(recipientSocketId)
      
//         if (recipientSocketId) {
//           // Emit the message only to the recipient user
//           io.to(recipientSocketId).emit("sendMessage", { username: users[id], message, id });
//         }
//       });
      
//     } catch (err) {
//       console.error(err);
//     }

//   });

//   socket.on("disconnect", async () => {
//     try {
//       const userdetails = await User.findOneAndDelete({ socketId: socket.id });
//       // console.log(user)
//       if (userdetails) {
//         console.log(`${userdetails.username} has left`);
//         socket.broadcast.emit("leave", {
//           user: "Admin",
//           message: `${userdetails.username} has left`,
//         });
//       }
  
//       delete users[socket.id];
//       console.log("User left");
//     } catch (err) {
//       console.error(err);
//     }
//   });
  
// });

server.listen(port, async () => {
  try {
    await userdatabase();
    console.log(`Working`);
  } catch (err) {
    console.error(err);
  }
});
