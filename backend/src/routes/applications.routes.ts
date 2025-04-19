import express from 'express';
import { applicationsController } from '../controllers/applications.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/applications
 * @desc    Get all applications (admin/employer)
 * @access  Private
 */
router.get('/', authMiddleware.protect, applicationsController.getAllApplications);

/**
 * @route   GET /api/v1/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get('/:id', authMiddleware.protect, applicationsController.getApplicationById);

/**
 * @route   POST /api/v1/applications
 * @desc    Create a new application
 * @access  Private
 */
router.post('/', authMiddleware.protect, applicationsController.createApplication);

/**
 * @route   PUT /api/v1/applications/:id/status
 * @desc    Update application status
 * @access  Private (Employer or admin)
 */
router.put('/:id/status', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('employer', 'admin'), 
  applicationsController.updateApplicationStatus
);

/**
 * @route   DELETE /api/v1/applications/:id
 * @desc    Delete an application
 * @access  Private (Application owner or admin)
 */
router.delete('/:id', authMiddleware.protect, applicationsController.deleteApplication);

export default router;