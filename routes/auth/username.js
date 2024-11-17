const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, _id: 0 });
    const usernames = users.map((user) => user.username);
    return res.status(200).json({ usernames });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
