const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// User Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, enrollmentNumber, upiId } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = await User.findOne({ enrollmentNumber });
        if (user) return res.status(400).json({ message: "Enrollment number already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, enrollmentNumber, upiId });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Login & JWT Token Generation
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
        res.json({ message: "Login successful", token, user: { name: user.name, email: user.email, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Logout (Clears Cookie)
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
