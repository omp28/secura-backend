const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const File = require("../../models/FileSchema");

router.use("/", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const files = req.files;
    const userID = req.body.userID;

    if (files.length > 0) {
      const fileSavePromises = files.map(async (file) => {
        const newFile = new File({
          userID: userID,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileData: file.buffer,
        });

        await newFile.save();
      });

      await Promise.all(fileSavePromises);

      res
        .status(200)
        .json({ message: "Files uploaded and saved successfully", files });
    } else {
      res.status(400).json({ message: "No files provided" });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

module.exports = router;
