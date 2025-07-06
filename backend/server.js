// backend/server.js

const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path"); // path is no longer needed for serving files
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const Message = require("./models/messageModel");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Trust the first proxy in front of the app (Render's load balancer)
app.set("trust proxy", 1);


// --- Security & API Setup ---
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --- Deployment Logic (Corrected) ---
// The backend is now API-only. It doesn't need to know about the frontend files.
// The frontend Static Site service on Render will handle serving the React app.
app.get("/", (req, res) => {
  res.send("Konnect Backend API is running successfully!");
});

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(
  port,
  console.log(`Server is listening on Port: ${port}`.white.bold)
);

// --- Socket.IO Setup ---
// Make sure CLIENT_URL is set in your Render environment variables!
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    onlineUsers[userData._id] = socket.id;
    io.emit("online users", Object.keys(onlineUsers));
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("mark as read", async ({ chatId, userId }) => {
    try {
      await Message.updateMany(
        { chat: chatId, sender: { $ne: userId } },
        { isRead: true }
      );
      socket.in(chatId).emit("messages read", { chatId });
    } catch (error) {
      console.log("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED", socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit("online users", Object.keys(onlineUsers));
  });
});
