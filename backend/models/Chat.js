const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  message: { type: String, required: true },
  senderName: { type: String, required: true },
  senderId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);
