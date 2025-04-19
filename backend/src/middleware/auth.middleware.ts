import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import User from "../models/user.model.js";
// Extended Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = {
  // Middleware to protect routes
  protect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;
      
      // Get token from cookie or authorization header
      if (req.cookies.token) {
        token = req.cookies.token;
      } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      // Check if token exists
      if (!token) {
        return res.status(401).json({
          status: 'fail',
          message: 'Not authorized, no token',
        });
      }
  
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        id: string;
        role: string;
      };
  
      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token no longer exists',
        });
      }
  
      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token',
        });
      }
      
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: 'fail',
          message: 'Token expired',
        });
      }
      
      res.status(401).json({
        status: 'fail',
        message: 'Not authorized',
      });
    }
  },
  // Middleware to restrict access based on user role
  restrictTo: (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "fail",
          message: "Not authorized, insufficient permissions",
        });
      }
      next();
    };
  },
};
