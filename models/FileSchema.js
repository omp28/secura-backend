const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
    required: true,
  },
  author: {
    type: String,
    ref: "User",
    required: true,
  },
  folderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: false,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileData: {
    type: Buffer,
    require: true,
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

module.exports = mongoose.model("File", FileSchema);
