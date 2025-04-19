import express from "express";
import cors from "cors";
import { checkEnv, config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import apiRoutes from "./routes/index.js";

// Check environment variables
checkEnv();

// Create Express app
const app = express();
const PORT = config.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/v1", apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Hello World! Welcome to Job Compass API" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    console.error(`Error: ${err.message}`);
    res.status(statusCode).json({
      status: "error",
      message: err.message,
      stack: config.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
