export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "employer" | "jobseeker";
  company?: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "jobseeker" | "employer";
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string> | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "jobseeker" | "employer";
  company?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
