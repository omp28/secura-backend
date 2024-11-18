const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");

const shareFile = async (fileID, sharedWith, author) => {
  const validUsers = sharedWith.filter((user) => user !== author);

  if (validUsers.length === 0) {
    throw new Error("Cannot share the file with the author.");
  }

  return await File.findByIdAndUpdate(
    fileID,
    { sharedWith: validUsers },
    { new: true }
  );
};

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

    const updatedFile = await shareFile(fileID, sharedWith, file.author);
    res
      .status(200)
      .json({ message: "File shared successfully", file: updatedFile });
  } catch (error) {
    console.error("Error sharing file:", error);
    res.status(500).json({ message: "Error sharing file", error });
  }
});

module.exports = router;
