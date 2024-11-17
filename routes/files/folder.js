const express = require("express");
const router = express.Router();
const Folder = require("../../models/FolderSchema");
const File = require("../../models/FileSchema");

router.get("/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const folders = await Folder.find({ userID });
    const files = await File.find({ userID });

    res.status(200).json({ folders, files });
  } catch (error) {
    console.error("Error fetching folders and files:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

router.post("/", async (req, res) => {
  const { userID, name, parentFolderID } = req.body;
  console.log(req.body);

  try {
    const newFolder = new Folder({ userID, name, parentFolderID });
    await newFolder.save();

    res.status(201).json({ message: "Folder created", folder: newFolder });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Error creating folder", error });
  }
});

router.delete("/:folderID", async (req, res) => {
  const { folderID } = req.params;

  try {
    await File.deleteMany({ folderID });

    const deleteSubfolders = async (parentID) => {
      const subfolders = await Folder.find({ parentFolderID: parentID });
      for (const folder of subfolders) {
        await File.deleteMany({ folderID: folder._id });
        await deleteSubfolders(folder._id);
        await Folder.findByIdAndDelete(folder._id);
      }
    };

    await deleteSubfolders(folderID);

    await Folder.findByIdAndDelete(folderID);

    res.status(200).json({ message: "Folder and its contents deleted" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Error deleting folder", error });
  }
});

module.exports = router;
