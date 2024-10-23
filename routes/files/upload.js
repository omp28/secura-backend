const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("files", 10), (req, res) => {
  try {
    const files = req.files;

    if (files.length > 0) {
      console.log("Files uploaded:", files);
      res.status(200).json({ message: "Files uploaded successfully", files });
    } else {
      res.status(400).json({ message: "No files provided" });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

module.exports = router;
