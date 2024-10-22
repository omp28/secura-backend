// const express = require("express");
// const router = express.Router();
// // const multer = require("multer");
// const path = require("path");

// router.post("/api/upload", async (req, res) => {
//   try {
//     const file = req.file;

//     if (file) {
//       console.log("File uploaded:", file);
//       res.status(200).json({ message: "File uploaded successfully" });
//     } else {
//       res.status(400).json({ message: "No file provided" });
//     }
//   } catch (error) {
//     console.error("Error handling upload:", error);
//     res.status(500).json({ message: "File upload failed" });
//   }
// });

// module.exports = router;
const express = require("express");
const multer = require("multer"); // Import multer for handling file uploads
const path = require("path");

const app = express();

// Setup multer to store the files in an "uploads" folder
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (file) {
      console.log("File uploaded:", file);
      res.status(200).json({ message: "File uploaded successfully", file });
    } else {
      res.status(400).json({ message: "No file provided" });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

// Server setup
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
