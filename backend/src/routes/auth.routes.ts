import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    User registration
 * @access  Public
 */
// @ts-ignore
router.post("/register", authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    User login
 * @access  Public
 */
// @ts-ignore
router.post("/login", authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    User logout
 * @access  Private
 */
// @ts-ignore
router.post("/logout", authMiddleware.protect, authController.logout);
// @ts-ignore
router.get("/me", authMiddleware.protect, authController.getCurrentUser);

export default router;
