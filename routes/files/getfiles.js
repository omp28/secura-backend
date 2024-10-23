const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");
const path = require("path");

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.get("/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    const files = await File.find({ userID });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    const fileList = files.map((file) => ({
      filename: file.fileName,
      url: `http://localhost:5001/${file.filePath}`,
    }));

    res.status(200).json(fileList);
  } catch (error) {
    console.error("Error fetching files for user:", error);
    res.status(500).json({ message: "Error fetching files", error });
  }
});

module.exports = router;
