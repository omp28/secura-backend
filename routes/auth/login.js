const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

router.post("/", async (req, res) => {
  const { publicKey } = req.body;
  console.log(publicKey);
  if (!publicKey) {
    return res.status(400).json({ message: "Public key is required" });
  }

  try {
    const user = await User.findOne({ publicKey });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.userID }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      username: user.username,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
