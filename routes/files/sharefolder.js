const express = require("express");
const router = express.Router();
const Folder = require("../../models/FolderSchema");
const Share = require("../../models/ShareSchema");

router.post("/:folderId", async (req, res) => {
  const { folderId } = req.params;
  const { sharedWith, permissions = "read" } = req.body;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).send("Folder not found");

    if (folder.userID === sharedWith) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    const share = new Share({
      resourceId: folderId,
      resourceType: "Folder",
      ownerId: folder.userID,
      sharedWith,
      permissions,
    });

    await share.save();

    res.status(200).json({ message: "Folder shared successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Folder already shared with this user" });
    }
    res
      .status(500)
      .json({ message: "Error sharing folder", error: error.message });
  }
});

router.get("/shared-by-me", async (req, res) => {
  const { userId } = req.query;

  try {
    const shares = await Share.find({
      ownerId: userId,
      resourceType: "Folder",
    }).populate("resourceId");

    const sharedFolders = shares.map((share) => ({
      ...share.resourceId._doc,
      sharedWith: share.sharedWith,
      permissions: share.permissions,
      sharedAt: share.sharedAt,
    }));

    res.status(200).json(sharedFolders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shared folders", error: error.message });
  }
});

router.get("/shared-with-me", async (req, res) => {
  const { userId } = req.query;

  try {
    const shares = await Share.find({
      sharedWith: userId,
      resourceType: "Folder",
    }).populate("resourceId");

    const sharedFolders = shares.map((share) => ({
      ...share.resourceId._doc,
      sharedBy: share.ownerId,
      permissions: share.permissions,
      sharedAt: share.sharedAt,
    }));

    res.status(200).json(sharedFolders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shared folders", error: error.message });
  }
});

module.exports = router;
