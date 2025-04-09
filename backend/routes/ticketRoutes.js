const express = require("express");
const Ticket = require("../models/Tickets");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

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


router.patch("/close/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { isCompleted: true },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json({ message: "Ticket archived successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Error closing ticket" });
  }
});


router.get("/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate ticketId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID format" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/get-upi/:enrollmentNumber", async (req, res) => {
  try {
    console.log("Fetching UPI for enrollment number:", req.params.enrollmentNumber);
    
    const user = await User.findOne({ enrollmentNumber: req.params.enrollmentNumber });
    
    if (!user || !user.upiId) {
      console.log("User not found or UPI ID missing");
      return res.status(404).json({ error: "UPI ID not found" });
    }

    console.log("UPI ID fetched:", user.upiId);
    res.json({ upiId: user.upiId });
  } catch (error) {
    console.error("Error fetching UPI ID:", error);
    res.status(500).json({ error: "Server error while fetching UPI ID" });
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
      console.log(ticket.riders[0].enrollmentNumber);
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
router.post("/complete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Error marking ride as completed" });
  }
});

router.post("/set-fare/:id", async (req, res) => {
  const { id } = req.params;
  const { fare } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(id, { fare }, { new: true });
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Error setting fare" });
  }
});
router.patch("/updateFare/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const { fare } = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(ticketId, { fare }, { new: true });
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Error updating fare" });
  }
});




router.patch("/markPaid/:ticketId/:riderId", async (req, res) => {
  try {
    const { ticketId, riderId } = req.params;
    const { paid } = req.body; // Get the paid status from the request body

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const rider = ticket.riders.find(r => r.enrollmentNumber === riderId);
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    rider.paid = paid; // Update the paid status based on request

    // Check if all riders have paid
    ticket.paymentsConfirmed = ticket.riders.every(r => r.paid);

    await ticket.save();

    res.json({ message: "Rider payment updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Error updating rider payment" });
  }
});







module.exports = router;
