const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// CORS configuration for Express
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your client's URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions)); // Enable CORS for Express
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Create HTTP server and configure Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("sendMessage", (messageData) => {
    const chat = messageData.chat;
    chat.users.forEach((user) => {
      if (user._id !== messageData.sender._id) {
        socket.in(user._id).emit("messageReceived", messageData);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
