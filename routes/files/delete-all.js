const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");
const Folder = require("../../models/FolderSchema");

router.delete("/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    await File.deleteMany({ userID });

    const deleteFoldersRecursively = async (parentFolderID) => {
      const folders = await Folder.find({ parentFolderID, userID });
      for (const folder of folders) {
        await deleteFoldersRecursively(folder._id);
        await Folder.findByIdAndDelete(folder._id);
      }
    };

    await deleteFoldersRecursively(null);

    await Folder.deleteMany({ userID });

    res
      .status(200)
      .json({ message: "All files and folders deleted successfully" });
  } catch (error) {
    console.error("Error deleting all files and folders:", error);
    res
      .status(500)
      .json({ message: "Error deleting all files and folders", error });
  }
});

module.exports = router;
