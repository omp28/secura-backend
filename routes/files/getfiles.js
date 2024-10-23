const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.get("/", (req, res) => {
  const directoryPath = path.join(__dirname, "../../uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to scan files", err });
    }

    const fileList = files.map((file) => ({
      filename: file,
      url: `http://localhost:5001/uploads/${file}`,
    }));

    res.status(200).json(fileList);
  });
});

module.exports = router;
