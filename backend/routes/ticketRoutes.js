const express = require("express");
const Ticket = require("../models/Tickets");
const router = express.Router();

// ✅ Save a ticket
router.post("/add", async (req, res) => {
  try {
    const { time, source, destination, membersNeeded, userId, riders } = req.body;

    const ticket = new Ticket({ 
      time, 
      source, 
      destination, 
      membersNeeded, 
      userId, 
      riders // Already includes the creator
    });

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
    //console.log(tickets);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching tickets" });
  }
});


router.post("/join/:ticketId", async (req, res) => {
  try {
    const { user } = req.body;
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.riders.some(rider => rider.enrollmentNumber === user.enrollmentNumber)) {
      return res.status(400).json({ error: "User already joined this ride" });
    }

    if (ticket.membersNeeded <= 0) {
      return res.status(400).json({ error: "No seats left" });
    }

    ticket.riders.push(user);
    ticket.membersNeeded -= 1;
    await ticket.save();

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/unjoin/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { enrollmentNumber } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // Remove user from riders
    ticket.riders = ticket.riders.filter(rider => rider.enrollmentNumber !== enrollmentNumber);
    ticket.membersNeeded += 1; // Increase available seats

    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:ticketId", async (req, res) => {
  try {
      const { enrollmentNumber } = req.body; // Owner's enrollment number from the request
      const ticketId = req.params.ticketId;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      // Check if the requester is the owner (first rider in the list)
      if (ticket.riders.length === 0 || ticket.riders[0].enrollmentNumber !== enrollmentNumber) {
          return res.status(403).json({ error: "Only the ticket owner can delete it" });
      }

      await Ticket.findByIdAndDelete(ticketId);
      res.json({ message: "Ticket deleted successfully" });

  } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
