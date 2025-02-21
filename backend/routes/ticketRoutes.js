const express = require("express");
const Ticket = require("../models/Tickets");
const router = express.Router();

// ✅ Save a ticket
router.post("/add", async (req, res) => {
  try {
    console.log("inside server");
    console.log(req.body);
    const { time, source, destination, membersNeeded, userId } = req.body;
    membersNeeded = Number(membersNeeded);
    const ticket = new Ticket({ time, source, destination, membersNeeded, userId });
    await ticket.save();
    res.status(201).json({ message: "Ticket added successfully!", ticket });
  } catch (error) {
    res.status(500).json({ error: "Server error while adding ticket" });
  }
});

// ✅ Fetch all tickets
router.get("/all", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    console.log(tickets);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching tickets" });
  }
});

module.exports = router;
