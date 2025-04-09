const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

router.post("/send", async (req, res) => {
  try {
    const { ticketId, message, senderName, senderId } = req.body;

    console.log(ticketId);
    console.log(message);
    console.log(senderName);
    console.log(senderId);

    if (!ticketId || !message || !senderName || !senderId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const chatMessage = new Chat({ ticketId, message, senderName, senderId });
    await chatMessage.save();

    res.json({ success: true, chatMessage });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/:ticketId", async (req, res) => {
  try {
    const messages = await Chat.find({ ticketId: req.params.ticketId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
