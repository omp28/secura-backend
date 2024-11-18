const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  parentFolderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  sharedWith: [
    {
      type: String,
      ref: "User",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Folder", FolderSchema);
