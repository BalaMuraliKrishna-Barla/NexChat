// backend/server.js

const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const helmet = require("helmet"); // Security headers
const rateLimit = require("express-rate-limit"); // Prevents brute-force attacks
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// --- Security Middleware ---
app.use(helmet()); // Apply basic security headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter); // Apply rate limiting to all API routes

// --- API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --- Deployment ---
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Serve the static files from the React build folder
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  // For any request that doesn't match an API route, send back the React app's index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running for Development!");
  });
}
// --- End Deployment ---

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(
  port,
  console.log(`Server is listening on Port: ${port}`.white.bold)
);

// --- Socket.IO Setup ---
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000", // Your frontend URL for development
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
