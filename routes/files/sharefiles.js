const express = require("express");
const router = express.Router();
const File = require("../../models/FileSchema");
const Share = require("../../models/ShareSchema");
const mongoose = require("mongoose");

router.post("/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const { sharedWith, permissions = "read" } = req.body;
  console.log("Sharing file:", fileId, "with:", sharedWith);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const file = await File.findById(fileId).session(session);
    console.log("Found file:", file);

    if (!file) {
      await session.abortTransaction();
      return res.status(404).send("File not found");
    }

    const share = new Share({
      resourceId: fileId,
      resourceType: "File",
      ownerId: file.userID,
      sharedWith,
      permissions,
    });

    const savedShare = await share.save({ session });
    console.log("Created share:", savedShare);

    await session.commitTransaction();
    res.status(200).json({ message: "File shared successfully" });
  } catch (error) {
    console.error("Error in share file:", error);
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(400).json({
        message: "File already shared with this user",
      });
    }
    res.status(500).json({
      message: "Error sharing file",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

router.get("/shared-by-me", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const shares = await Share.find({
      ownerId: userId,
      resourceType: "File",
    }).lean();

    const sharedFiles = await Promise.all(
      shares.map(async (share) => {
        const file = await File.findById(share.resourceId)
          .select("-fileData")
          .lean();

        if (!file) return null;

        return {
          ...file,
          sharedWith: share.sharedWith,
          permissions: share.permissions,
          sharedAt: share.sharedAt,
        };
      })
    );

    const validFiles = sharedFiles.filter((file) => file !== null);
    res.status(200).json(validFiles);
  } catch (error) {
    console.error("Error fetching shared files:", error);
    res.status(500).json({
      message: "Error fetching shared files",
      error: error.message,
    });
  }
});

router.get("/shared-with-me", async (req, res) => {
  const { userId } = req.query;
  console.log("Fetching shared files for user:", userId);

  try {
    const shares = await Share.find({
      sharedWith: userId,
      resourceType: "File",
    }).populate("resourceId");

    console.log("Found shares:", shares);

    const sharedFiles = shares.map((share) => ({
      _id: share._id,
      fileName: share.resourceId.fileName,
      fileType: share.resourceId.fileType,
      fileData: share.resourceId.fileData,
      sharedBy: share.ownerId,
      sharedWith: userId,
      permissions: share.permissions,
      sharedAt: share.sharedAt,
      resourceType: "File",
    }));

    console.log("Transformed shared files:", sharedFiles);

    res.status(200).json(sharedFiles);
  } catch (error) {
    console.error("Error in shared-with-me:", error);
    res.status(500).json({
      message: "Error fetching shared files",
      error: error.message,
    });
  }
});

router.delete("/:shareId", async (req, res) => {
  const { shareId } = req.params;

  try {
    await Share.findByIdAndDelete(shareId);
    res.status(200).json({ message: "Share removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing share", error: error.message });
  }
});

module.exports = router;
