const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");

router.delete("/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    await File.deleteMany({ userID });

    res.status(200).json({ message: "All files deleted successfully" });
  } catch (error) {
    console.error("Error deleting files for user:", error);
    res.status(500).json({ message: "Error deleting files", error });
  }
});

module.exports = router;
