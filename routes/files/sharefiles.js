const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");

router.get("/", async (req, res) => {
  const { userID } = req.query;

  try {
    const files = await File.find({ sharedWith: userID });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).send("Error retrieving shared files: " + error.message);
  }
});

router.post("/:fileID", async (req, res) => {
  const { fileID } = req.params;
  const { sharedWith } = req.body;

  try {
    const file = await File.findById(fileID);
    if (!file) return res.status(404).send("File not found");

    file.sharedWith = [...new Set([...file.sharedWith, ...sharedWith])];
    await file.save();

    res.status(200).send("File shared successfully");
  } catch (error) {
    res.status(500).send("Error sharing file: " + error.message);
  }
});

module.exports = router;
