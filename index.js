// server.js (index.js)
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import voteRoutes from "./routes/votes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// CORS setup (allow multiple frontend dev ports)
app.use(
  cors({
    origin: ["https://votting-app.netlify.app", "http://localhost:5174"], // your frontend URLs
    credentials: true, // allow cookies/auth headers
  })
);

// HTTP request logger in dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test route
app.get("/", (req, res) => {
  res.send("✅ Voting App Backend Running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/votes", voteRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

