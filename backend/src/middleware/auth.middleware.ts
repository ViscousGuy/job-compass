import { Request, Response, NextFunction } from "express";

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
      // Implementation will go here
      // This is a placeholder - actual implementation will verify JWT tokens
      req.user = { id: "123", role: "user" };
      next();
    } catch (error) {
      res.status(401).json({
        status: "fail",
        message: "Not authorized, no token",
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
