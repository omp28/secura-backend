const express = require("express");
const router = express.Router();
const Folder = require("../../models/FolderSchema");

router.post("/:folderID", async (req, res) => {
  const { folderID } = req.params;
  const { sharedWith } = req.body;

  try {
    const folder = await Folder.findById(folderID);
    if (!folder) return res.status(404).send("Folder not found");

    folder.sharedWith = [...new Set([...folder.sharedWith, ...sharedWith])];
    await folder.save();

    res.status(200).send("Folder shared successfully");
  } catch (error) {
    res.status(500).send("Error sharing folder: " + error.message);
  }
});

router.get("/", async (req, res) => {
  const { userID } = req.query;

  try {
    const folders = await Folder.find({ sharedWith: userID });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).send("Error retrieving shared folders: " + error.message);
  }
});

module.exports = router;
