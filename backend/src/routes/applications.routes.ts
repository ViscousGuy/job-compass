import express from "express";
import { applicationsController } from "../controllers/applications.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from '../middleware/upload.middleware.js';


const router = express.Router();

/**
 * @route   GET /api/v1/applications
 * @desc    Get all applications (admin/employer)
 * @access  Private
 */
router.get(
  "/",
  // @ts-ignore
  authMiddleware.protect,
  applicationsController.getAllApplications
);

/**
 * @route   GET /api/v1/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get(
  "/:id",
  // @ts-ignore
  authMiddleware.protect,
  applicationsController.getApplicationById
);

/**
 * @route   POST /api/v1/applications
 * @desc    Create a new application
 * @access  Private
 */
router.post(
  "/",
  // @ts-ignore
  authMiddleware.protect,
  authMiddleware.restrictTo("jobseeker"),
  uploadMiddleware.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applicationsController.createApplication,
);

/**
 * @route   PUT /api/v1/applications/:id/status
 * @desc    Update application status
 * @access  Private (Employer or admin)
 */
router.patch(
  "/:id/status",
  // @ts-ignore
  authMiddleware.protect,
  authMiddleware.restrictTo("employer"),
  applicationsController.updateApplicationStatus
);

/**
 * @route   DELETE /api/v1/applications/:id
 * @desc    Delete an application
 * @access  Private (Application owner or admin)
 */
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware.protect,
  applicationsController.deleteApplication
);

export default router;
