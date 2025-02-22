const express = require("express");
const Ticket = require("../models/Tickets");
const router = express.Router();

// ✅ Save a ticket
router.post("/add", async (req, res) => {
  try {
    console.log("Received Ticket Data:", req.body);

    const { time, source, destination, userId } = req.body;
    const membersNeeded = Number(req.body.membersNeeded);

    const ticket = new Ticket({ time, source, destination, membersNeeded, userId });
    console.log("hello");
    console.log(ticket);
    await ticket.save();
    
    console.log("Ticket Saved:", ticket);
    res.status(201).json({ message: "Ticket added successfully!", ticket });
  } catch (error) {
    console.error("Error saving ticket:", error);
    res.status(500).json({ error: "Server error while adding ticket" });
  }
});


// ✅ Fetch all tickets
router.get("/all", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    //console.log(tickets);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching tickets" });
  }
});

module.exports = router;
