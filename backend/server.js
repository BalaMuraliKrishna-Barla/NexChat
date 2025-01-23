const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("../backend/routes/userRoutes.js");
const chatRoutes = require("../backend/routes/chatRoutes.js");

dotenv.config();
const port = process.env.PORT || 6000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is runnning!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// This is the last line of the server
app.listen(port, console.log(`Server is listening to ${port}`.white.bold));
