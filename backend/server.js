require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update based on frontend URL
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/tickets", ticketRoutes);

// Chat Logic (Socket.IO)
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (ticketId) => {
    socket.join(ticketId);
  });

  socket.on("sendMessage", ({ ticketId, senderId, senderName, message }) => {
    const chatMessage = { ticketId, senderId, senderName, message, timestamp: new Date() };
    
    // Emit message to all users in the room
    io.to(ticketId).emit("receiveMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


app.use("/chat", chatRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
