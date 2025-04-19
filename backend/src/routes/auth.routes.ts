import express from "express";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    User registration
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    User login
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post("/logout", authController.logout);

export default router;
