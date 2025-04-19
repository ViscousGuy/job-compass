import Application, { IApplication } from "../models/application.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
import { CreateApplicationInput } from "../validators/application.validator.js";

export const applicationService = {
  createApplication: async (
    applicationData: CreateApplicationInput,
    userId: string,
    resumeUrl: string,
    coverLetterUrl: string
  ): Promise<IApplication> => {
    // Check if job exists
    const job = await Job.findById(applicationData.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      jobId: applicationData.jobId,
      userId,
    });

    if (existingApplication) {
      throw new Error("You have already applied for this job");
    }

    // Create new application
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(applicationData.jobId),
      userId: new mongoose.Types.ObjectId(userId),
      resume: resumeUrl,
      coverLetter: coverLetterUrl,
      appliedDate: new Date(),
      status: "pending",
    });

    return application;
  },

  getAllApplications: async (
    queryParams: {
      page?: string;
      limit?: string;
      jobId?: string;
      userId?: string;
      status?: string;
    },
    currentUserId: string,
    userRole: string
  ): Promise<{
    applications: IApplication[];
    totalApplications: number;
    totalPages: number;
  }> => {
    // Parse pagination parameters
    const page = parseInt(queryParams.page || "1");
    const limit = parseInt(queryParams.limit || "10");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    // If user is a jobseeker, they can only see their own applications
    if (userRole === "jobseeker") {
      filter.userId = new mongoose.Types.ObjectId(currentUserId);
    }
    // If user is an employer, they can only see applications for their jobs
    else if (userRole === "employer") {
      // Get all jobs created by this employer
      const employerJobs = await Job.find({ employerId: currentUserId }).select(
        "_id"
      );
      const jobIds = employerJobs.map((job) => job._id);

      if (jobIds.length === 0) {
        return { applications: [], totalApplications: 0, totalPages: 0 };
      }

      filter.jobId = { $in: jobIds };
    }

    // Add jobId filter if provided
    if (queryParams.jobId) {
      filter.jobId = new mongoose.Types.ObjectId(queryParams.jobId);
    }

    // Add userId filter if provided (for admins)
    if (queryParams.userId && userRole === "admin") {
      filter.userId = new mongoose.Types.ObjectId(queryParams.userId);
    }

    // Add status filter if provided
    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    // Count total applications matching the filter
    const totalApplications = await Application.countDocuments(filter);

    // Get applications with pagination
    const applications = await Application.find(filter)
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("jobId", "title company")
      .populate("userId", "name email");

    // Calculate total pages
    const totalPages = Math.ceil(totalApplications / limit);

    return { applications, totalApplications, totalPages };
  },

  getApplicationById: async (
    applicationId: string,
    currentUserId: string,
    userRole: string
  ): Promise<IApplication | null> => {
    // Find application by ID
    const application = await Application.findById(applicationId)
      .populate("jobId", "title company employerId")
      .populate("userId", "name email");

    // Check if application exists
    if (!application) {
      return null;
    }

    // Check if user is authorized to view this application
    if (
      userRole === "jobseeker" &&
      application.userId._id.toString() != currentUserId
    ) {
      throw new Error("Not authorized to view this application");
    } else if (userRole === "employer") {
      const job = await Job.findById(application.jobId);
      if (!job || job.employerId.toString() !== currentUserId) {
        throw new Error("Not authorized to view this application");
      }
    }

    return application;
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: string,
    currentUserId: string,
    userRole: string
  ): Promise<IApplication | null> => {
    // Find application
    const application = await Application.findById(applicationId).populate(
      "jobId"
    );

    // Check if application exists
    if (!application) {
      return null;
    }

    // Check if user is authorized to update this application
    if (userRole === "employer") {
      const job = await Job.findById(application.jobId);
      if (!job || job.employerId.toString() != currentUserId) {
        throw new Error("Not authorized to update this application");
      }
    } else if (userRole !== "admin") {
      throw new Error("Not authorized to update application status");
    }

    // Update application status
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    )
      .populate("jobId", "title company")
      .populate("userId", "name email");

    return updatedApplication;
  },

  deleteApplication: async (
    applicationId: string,
    currentUserId: string,
    userRole: string
  ): Promise<boolean> => {
    // Find application
    const application = await Application.findById(applicationId);

    // Check if applpappication exists
    if (!application) {
      return false;
    }

    // Check if user is authorized to delete this application
    if (
      userRole === "jobseeker" &&
      application.userId.toString() != currentUserId
    ) {
      throw new Error("Not authorized to delete this application");
    } else if (userRole === "employer") {
      const job = await Job.findById(application.jobId);
      if (!job || job.employerId.toString() !== currentUserId) {
        throw new Error("Not authorized to delete this application");
      }
    }

    // Delete application
    await Application.findByIdAndDelete(applicationId);

    return true;
  },
};
