import express from "express";
import cors from "cors";
import { checkEnv, config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

// Check environment variables
checkEnv();

// Create Express app
const app = express();
const PORT = config.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working correctly!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: "MongoDB connected",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
