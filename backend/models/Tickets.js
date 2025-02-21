const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  time: String,
  source: String,
  destination: String,
  membersNeeded: Number,
  userId: String, // Store the user who created the ticket
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
