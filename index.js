require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "https://votting-app.netlify.app", // frontend URL
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Todo App Running ...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todos"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

