const express = require("express");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const signupRoutes = require("./routes/auth/signup");
const loginRoutes = require("./routes/auth/login");
const fileuploadRoutes = require("./routes/files/upload");
const getfilesRoutes = require("./routes/files/getfiles");
const deleteAllRoutes = require("./routes/files/delete-all");
const folderRoutes = require("./routes/files/folder");
const verifyToken = require("./middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth/signup", signupRoutes);
app.use("/api/auth/login", loginRoutes);
app.use("/api/files/upload", fileuploadRoutes);
app.use("/api/files/getfiles", getfilesRoutes);
app.use("/api/files/delete-all", deleteAllRoutes);
app.use("/api/folders", folderRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
