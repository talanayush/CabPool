const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ User Registration (Now Returns Token)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, enrollmentNumber, upiId } = req.body;

        // 🔹 Check if email or enrollment number already exists
        let existingUser = await User.findOne({ $or: [{ email }, { enrollmentNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Enrollment number already registered" });
        }

        // 🔹 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Save new user
        const user = new User({ name, email, password: hashedPassword, enrollmentNumber, upiId });
        await user.save();

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        // 🔹 Send response with token & user
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ User Login & JWT Token Generation
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        // 🔹 Set cookie & send token
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, enrollmentNumber: user.enrollmentNumber, upiId: user.upiId }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Logout (Clears Token Cookie)
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
