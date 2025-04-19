import express from "express";
import { jobsController } from "../controllers/jobs.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs
 * @access  Public
 */
router.get("/", authMiddleware.protect, jobsController.getAllJobs);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
router.get("/:id", jobsController.getJobById);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job
 * @access  Private (Employers only)
 */
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  jobsController.createJob
);

/**
 * @route   PUT /api/v1/jobs/:id
 * @desc    Update a job
 * @access  Private (Job owner or admin)
 */
router.patch(
  "/:id",
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  jobsController.updateJob
);

/**
 * @route   DELETE /api/v1/jobs/:id
 * @desc    Delete a job
 * @access  Private (Job owner or admin)
 */
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  jobsController.deleteJob
);

export default router;
