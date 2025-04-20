import express from "express";
import { jobsController } from "../controllers/jobs.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs
 * @access  Public
 */
// @ts-ignore
router.get("/", authMiddleware.protect, jobsController.getAllJobs);

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
// @ts-ignore
router.get("/:id", jobsController.getJobById);

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job
 * @access  Private (Employers only)
 */
router.post(
  "/",
  // @ts-ignore
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
  // @ts-ignore
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
  // @ts-ignore
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  jobsController.deleteJob
);

export default router;
