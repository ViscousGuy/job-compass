import { z } from "zod";

export const applicationValidator = {
  createApplication: z.object({
    jobId: z.string().min(1, "Job ID is required"),
    // No need to validate files here as they'll be handled by multer
  }),
  updateApplicationStatus: z.object({
    status: z.enum(["pending", "reviewed", "rejected", "accepted"], {
      errorMap: () => ({ message: "Invalid status value" }),
    }),
  }),
};

export type CreateApplicationInput = z.infer<typeof applicationValidator.createApplication>;
export type UpdateApplicationStatusInput = z.infer<typeof applicationValidator.updateApplicationStatus>;