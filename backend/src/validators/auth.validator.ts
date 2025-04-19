import { z } from "zod";

export const authValidator = {
  register: z
    .object({
      name: z.string().min(1, "Name is required").trim(),
      email: z.string().email("Invalid email address").toLowerCase().trim(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(1, "Confirm password is required"),
      role: z.enum(["employer", "jobseeker"]).default("jobseeker"),
      company: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((data) => !(data.role === "employer" && !data.company), {
      message: "Company name is required for employers",
      path: ["company"],
    }),
  login: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
  }),
};

export type RegisterInput = z.infer<typeof authValidator.register>;
