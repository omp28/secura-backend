const express = require("express");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const verifyToken = require("./middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth/signup", signupRoutes);
app.use("/api/auth/login", loginRoutes);

app.post("/api/upload", upload.array("files", 10), (req, res) => {
  try {
    const files = req.files;

    if (files.length > 0) {
      console.log("Files uploaded:", files);
      res.status(200).json({ message: "Files uploaded successfully", files });
    } else {
      res.status(400).json({ message: "No files provided" });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

app.get("/api/getfiles", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to scan files", err });
    }

    // Return a list of files
    const fileList = files.map((file) => ({
      filename: file,
      url: `http://localhost:5001/uploads/${file}`,
    }));

    res.status(200).json(fileList);
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
