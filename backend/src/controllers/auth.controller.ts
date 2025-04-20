import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { authValidator } from "../validators/auth.validator.js";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = authValidator.register.parse(req.body);

      // Register user
      const { user, token } = await authService.register(validatedData);

      // Set JWT as cookie
      res.cookie("token", token, {
        expires: new Date(
          Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "90") *
              24 *
              60 *
              60 *
              1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Send response
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          message: "Validation error",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      if (
        error instanceof Error &&
        error.message === "User with this email already exists"
      ) {
        return res.status(409).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = authValidator.login.parse(req.body);

      // Login user
      const { user, token } = await authService.login(validatedData);

      // Set JWT as cookie
      res.cookie("token", token, {
        expires: new Date(
          Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "90") *
              24 *
              60 *
              60 *
              1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Send response
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          message: "Validation error",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      if (
        error instanceof Error &&
        (error.message === "Invalid credentials" ||
          error.message === "User not found")
      ) {
        return res.status(401).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear JWT cookie
      res.cookie("token", "", {
        expires: new Date(Date.now() - 10000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // Send response
      res.status(200).json({
        status: "success",
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  getCurrentUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // User is already available from the protect middleware
      const user = req.user;

      // Generate a fresh token
      // @ts-ignore
      const token = jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      // Send response
      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
