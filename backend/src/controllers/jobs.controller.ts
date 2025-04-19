import { Request, Response, NextFunction } from "express";
import { jobService } from "../services/job.service.js";
import { jobValidator } from "../validators/job.validator.js";
import { ZodError } from "zod";
import mongoose from "mongoose";

export const jobsController = {
  getAllJobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract query parameters
      const { page, limit, category, location, type, search } = req.query;

      // Get jobs with pagination and filters
      const { jobs, totalJobs, totalPages } = await jobService.getAllJobs({
        page: page as string,
        limit: limit as string,
        category: category as string,
        location: location as string,
        type: type as string,
        search: search as string,
      });

      // Send response
      res.status(200).json({
        status: "success",
        message: "Jobs retrieved successfully",
        results: jobs.length,
        pagination: {
          totalJobs,
          totalPages,
          currentPage: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 10,
        },
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  },

  getJobById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid job ID format",
        });
      }

      // Get job by ID
      const job = await jobService.getJobById(id);

      // Check if job exists
      if (!job) {
        return res.status(404).json({
          status: "fail",
          message: "Job not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Job retrieved successfully",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  },

  createJob: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = jobValidator.createJob.parse(req.body);

      // Check if user is an employer
      if (req.user.role !== "employer" && req.user.role !== "admin") {
        return res.status(403).json({
          status: "fail",
          message: "Only employers can create job listings",
        });
      }

      // Create job
      const job = await jobService.createJob(validatedData, req.user._id);

      // Send response
      res.status(201).json({
        status: "success",
        message: "Job created successfully",
        data: job,
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
      next(error);
    }
  },

  updateJob: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid job ID format",
        });
      }

      // Validate request body
      const validatedData = jobValidator.updateJob.parse(req.body);

      // Update job
      const updatedJob = await jobService.updateJob(
        id,
        validatedData,
        req.user._id,
        req.user.role
      );

      // Check if job exists
      if (!updatedJob) {
        return res.status(404).json({
          status: "fail",
          message: "Job not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Job updated successfully",
        data: updatedJob,
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
        error.message === "Not authorized to update this job"
      ) {
        return res.status(403).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },
  deleteJob: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Validate job ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid job ID format",
        });
      }

      // Delete job
      const result = await jobService.deleteJob(
        id,
        req.user._id,
        req.user.role
      );

      // Check if job exists
      if (!result) {
        return res.status(404).json({
          status: "fail",
          message: "Job not found",
        });
      }

      // Send response
      res.status(200).json({
        status: "success",
        message: "Job deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Not authorized to delete this job"
      ) {
        return res.status(403).json({
          status: "fail",
          message: error.message,
        });
      }

      next(error);
    }
  },
};
