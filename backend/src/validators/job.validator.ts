import { z } from "zod";

export const jobValidator = {
  createJob: z.object({
    title: z.string().min(1, "Job title is required").trim(),
    company: z.string().min(1, "Company name is required").trim(),
    location: z.string().min(1, "Job location is required").trim(),
    type: z.string().min(1, "Job type is required").trim(),
    salary: z.string().min(1, "Salary information is required").trim(),
    description: z.string().min(1, "Job description is required"),
    requirements: z
      .array(z.string())
      .min(1, "At least one requirement is required"),
    category: z.string().min(1, "Job category is required").trim(),
  }),
  updateJob: z.object({
    title: z.string().min(1, "Job title is required").trim().optional(),
    company: z.string().min(1, "Company name is required").trim().optional(),
    location: z.string().min(1, "Job location is required").trim().optional(),
    type: z.string().min(1, "Job type is required").trim().optional(),
    salary: z
      .string()
      .min(1, "Salary information is required")
      .trim()
      .optional(),
    description: z.string().min(1, "Job description is required").optional(),
    requirements: z
      .array(z.string())
      .min(1, "At least one requirement is required")
      .optional(),
    category: z.string().min(1, "Job category is required").trim().optional(),
  }),
};

export type CreateJobInput = z.infer<typeof jobValidator.createJob>;
export type UpdateJobInput = z.infer<typeof jobValidator.updateJob>;
