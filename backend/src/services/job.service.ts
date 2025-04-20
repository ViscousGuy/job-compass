import Job, { IJob } from "../models/job.model.js";
import { CreateJobInput } from "../validators/job.validator.js";
import mongoose from "mongoose";

export const jobService = {
  getAllJobs: async (queryParams: {
    page?: string;
    limit?: string;
    category?: string;
    location?: string;
    type?: string;
    search?: string;
    employerId?: string;
  }): Promise<{ jobs: IJob[]; totalJobs: number; totalPages: number }> => {
    // Parse pagination parameters
    const page = parseInt(queryParams.page || "1");
    const limit = parseInt(queryParams.limit || "10");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    // Add category filter if provided
    if (queryParams.category) {
      filter.category = queryParams.category;
    }

    // Add location filter if provided
    if (queryParams.location) {
      filter.location = { $regex: queryParams.location, $options: "i" };
    }

    // Add job type filter if provided
    if (queryParams.type) {
      filter.type = queryParams.type;
    }

    // Add employerId filter if provided
    if (queryParams.employerId) {
      filter.employerId = new mongoose.Types.ObjectId(queryParams.employerId);
    }

    // Add search functionality
    if (queryParams.search) {
      filter.$or = [
        { title: { $regex: queryParams.search, $options: "i" } },
        { company: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    // Count total jobs matching the filter
    const totalJobs = await Job.countDocuments(filter);

    // Get jobs with pagination, sorted by most recent first
    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("employerId", "name company");

    // Calculate total pages
    const totalPages = Math.ceil(totalJobs / limit);

    return { jobs, totalJobs, totalPages };
  },

  createJob: async (
    jobData: CreateJobInput,
    employerId: string
  ): Promise<IJob> => {
    // Create new job
    const job = await Job.create({
      ...jobData,
      employerId: new mongoose.Types.ObjectId(employerId),
      postedDate: new Date(),
    });

    return job;
  },
  getJobById: async (jobId: string): Promise<IJob | null> => {
    // Find job by ID and populate employer details
    const job = await Job.findById(jobId).populate(
      "employerId",
      "name company"
    );
    return job;
  },
  updateJob: async (
    jobId: string,
    jobData: Partial<CreateJobInput>,
    userId: string,
    userRole: string
  ): Promise<IJob | null> => {
    // Find job
    const job = await Job.findById(jobId);

    // Check if job exists
    if (!job) {
      return null;
    }

    // Check if user is the job owner or an admin
    if (job.employerId.toString() != userId) {
      throw new Error("Not authorized to update this job");
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...jobData },
      { new: true, runValidators: true }
    ).populate("employerId", "name company");

    return updatedJob;
  },

  deleteJob: async (
    jobId: string,
    userId: string,
    userRole: string
  ): Promise<boolean> => {
    // Find job
    const job = await Job.findById(jobId);

    // Check if job exists
    if (!job) {
      return false;
    }

    // Check if user is the job owner or an admin
    if (job.employerId.toString() != userId) {
      throw new Error("Not authorized to delete this job");
    }

    // Delete job
    await Job.findByIdAndDelete(jobId);

    return true;
  },
};
