import express from "express";
import authRoutes from "./auth.routes.js";
import jobRoutes from "./jobs.routes.js";
import applicationRoutes from "./applications.routes.js";

const router = express.Router();

// Root endpoint
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Job Compass API" });
});

// Mount route groups
router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

export default router;
