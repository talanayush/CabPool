const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    time: String,
    source: String,
    destination: String,
    membersNeeded: Number,
    userId: String, // Creator's Enrollment Number
    riders: [
      {
        enrollmentNumber: String, // Unique identifier
        name: String, // Rider's name
        paid: { type: Boolean, default: false }, // Payment status
      }
    ],
    fare: { type: Number, default: null }, // Total ride fare (set by owner)
    isCompleted: { type: Boolean, default: false }, // True when ride is completed
    paymentsConfirmed: { type: Boolean, default: false }, // True when all riders have paid
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
