const express = require("express");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const verifyToken = require("./middlewares/auth");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

connectDB();

app.use("/api/auth/signup", signupRoutes);
app.use("/api/auth/login", loginRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
