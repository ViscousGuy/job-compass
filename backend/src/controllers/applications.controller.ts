import { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service.js";
import { applicationValidator } from "../validators/application.validator.js";
import { ZodError } from "zod";
import mongoose from "mongoose";

export const applicationsController = {
  getAllApplications: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract query parameters
      const { page, limit, jobId, userId, status } = req.query;

      // Get applications with pagination and filters
      const { applications, totalApplications, totalPages } =
        await applicationService.getAllApplications(
          {
            page: page as string,
            limit: limit as string,
            jobId: jobId as string,
            userId: userId as string,
            status: status as string,
          },
          req.user._id,
          req.user.role
        );

      // Send response
      res.status(200).json({
        status: "success",
        message: "Applications retrieved successfully",
        results: applications.length,
        pagination: {
          totalApplications,
          totalPages,
          currentPage: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 10,
        },
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  },

  getApplicationById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      // Validate application ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid application ID format",
        });
      }

      // Get application by ID
      const application = await applicationService.getApplicationById(
        id,
        req.user._id,
        req.user.role
      );

      // Check if application exists
      if (!application) {
        return res.status(404).json({
          status: "fail",
          message: "Application not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Application retrieved successfully",
        data: application,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Not authorized to view this application"
      ) {
        return res.status(403).json({
          status: "fail",
          message: error.message,
        });
      }
      next(error);
    }
  },

  createApplication: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate request body
      const validatedData = applicationValidator.createApplication.parse(
        req.body
      );

      // Check if user is a jobseeker
      if (req.user.role !== "jobseeker") {
        return res.status(403).json({
          status: "fail",
          message: "Only jobseekers can apply for jobs",
        });
      }

      // Check if files were uploaded
      if (!req.files) {
        return res.status(400).json({
          status: "fail",
          message: "Resume and cover letter files are required",
        });
      }
      // Get file URLs from multer/cloudinary
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const resumeFiles = files.resume;
      const coverLetterFiles = files.coverLetter;
      if (
        !resumeFiles ||
        resumeFiles.length === 0 ||
        !coverLetterFiles ||
        coverLetterFiles.length === 0
      ) {
        return res.status(400).json({
          status: "fail",
          message: "Both resume and cover letter files are required",
        });
      }

      const resumeFile = resumeFiles[0];
      const coverLetterFile = coverLetterFiles[0];

      // Create application
      const application = await applicationService.createApplication(
        validatedData,
        req.user._id,
        resumeFile.path, // Cloudinary URL
        coverLetterFile.path // Cloudinary URL
      );

      // Send response
      res.status(201).json({
        status: "success",
        message: "Application submitted successfully",
        data: application,
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

      if (error instanceof Error && error.message === "Job not found") {
        return res.status(404).json({
          status: "fail",
          message: error.message,
        });
      }

      if (
        error instanceof Error &&
        error.message === "You have already applied for this job"
      ) {
        return res.status(409).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },
  updateApplicationStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      // Validate application ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid application ID format",
        });
      }

      // Validate request body
      const validatedData = applicationValidator.updateApplicationStatus.parse(
        req.body
      );

      // Update application status
      const updatedApplication =
        await applicationService.updateApplicationStatus(
          id,
          validatedData.status,
          req.user._id,
          req.user.role
        );

      // Check if application exists
      if (!updatedApplication) {
        return res.status(404).json({
          status: "fail",
          message: "Application not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Application status updated successfully",
        data: updatedApplication,
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
        error.message === "Not authorized to update this application"
      ) {
        return res.status(403).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },

  deleteApplication: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      // Validate application ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid application ID format",
        });
      }

      // Delete application
      const result = await applicationService.deleteApplication(
        id,
        req.user._id,
        req.user.role
      );

      // Check if application exists
      if (!result) {
        return res.status(404).json({
          status: "fail",
          message: "Application not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Application deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Not authorized to delete this application"
      ) {
        return res.status(403).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },
  getUserApplicationJobIds: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          status: "fail",
          message: "You must be logged in to view your applications",
        });
      }

      const jobIds = await applicationService.getUserAppliedJobIds(userId);

      return res.status(200).json({
        status: "success",
        data: jobIds,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch applied jobs",
      });
    }
  },
};
