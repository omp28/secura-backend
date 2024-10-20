const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
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
