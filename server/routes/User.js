const express = require("express");
const jwt = require("jsonwebtoken");
const TUser = require("../models/TUser");

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// Register a user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await TUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new TUser({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await TUser.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Token
router.get("/verify", (req, res) => {
  const token = req.headers["x-auth-token"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ id: verified.id });
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
