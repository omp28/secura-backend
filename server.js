// const express = require("express");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const dotenv = require("dotenv");
// const cors = require("cors");
// console.log("env", process.env.MONGO_URI);
// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow only requests from frontend
//   })
// );

// // Middleware to parse incoming JSON data
// app.use(express.json());

// // Define routes
// app.use("/auth", authRoutes);

// // Define a simple route
// app.get("/", (req, res) => res.send("API is running..."));

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Replace this with the port where your frontend is running
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
