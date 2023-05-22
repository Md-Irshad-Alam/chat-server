const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const User = require("./models/Join_user");
const userdatabase = require('./database/db')
const app = express();
const Chat = require("./models/ChatModel");
const { receiveMessageOnPort } = require("worker_threads");
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

const userSocketMap = new Map();

io.on("connection", (socket) => {
  socket.on("joined", async ({ sender }) => {
    try {
      const existingUser = await User.findOne({ username: sender });

      if (!existingUser && sender !== "") {
        await User.create({ username: sender, socketId: socket.id });
      }

      users[socket.id] = sender;
      userSocketMap.set(socket.id, socket);

      socket.username = sender;
      socket.broadcast.emit("userJoined", {
        sender: socket.username,
        message: "joined the chat",
      });

      socket.emit("welcome", {
        message: `Welcome, ${sender}`,
      });
    } catch (err) {
      console.error(err);
    }
  });

  // clear all chat

  socket.on("clearChat", async () => {
    try {
      await Chat.deleteMany({}); // Delete all chat messages from the database
  
      io.emit("chatCleared"); // Emit an event to notify all clients that the chat has been cleared
    } catch (error) {
      console.error(error);
    }
  });

socket.on("sendMessage", async ({ sender, message, recipient }) => {
    try {
      const chat = new Chat({ sender, message, recipient });
      await chat.save();

      const recipientSocket = userSocketMap.get(recipient);

      if (recipientSocket) {
        recipientSocket.emit("receiveMessage", { sender, message });
      }
    } catch (error) {
      console.error(error);
    }
  });


  socket.on("disconnect", async () => {
    try {
      const userdetails = await User.findOneAndDelete({ socketId: socket.id });

      userSocketMap.delete(socket.id);

      if (userdetails) {
        console.log(`${userdetails.username} has left`);
        socket.broadcast.emit("leave", {
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

server.listen(port, async () => {
  try {
    await userdatabase();
    console.log(`Working`);
  } catch (err) {
    console.error(err);
  }
});
