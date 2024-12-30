const mongoose = require("mongoose");

const ShareSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "resourceType",
  },
  resourceType: {
    type: String,
    required: true,
    enum: ["File", "Folder"],
  },
  ownerId: {
    type: String,
    required: true,
  },
  sharedWith: {
    type: String,
    required: true,
  },
  permissions: {
    type: String,
    enum: ["read", "write"],
    default: "read",
  },
  sharedAt: {
    type: Date,
    default: Date.now,
  },
});

ShareSchema.index({ resourceId: 1, sharedWith: 1 }, { unique: true });

module.exports = mongoose.model("Share", ShareSchema);
