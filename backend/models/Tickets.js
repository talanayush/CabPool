const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  time: String,
  source: String,
  destination: String,
  membersNeeded: Number,
  userId: String, // Creator's Enrollment Number
  riders: [
    {
      enrollmentNumber: String, // Unique identifier
      name: String, // Rider's name
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
