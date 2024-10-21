const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ message: "Public key is required" });
  }

  try {
    const userExists = await User.findOne({ publicKey });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ publicKey });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
