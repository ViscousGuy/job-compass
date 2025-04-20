import { AppDispatch } from "../index";
import { api } from "../../utils/api";
import {
  jobActionStart,
  jobActionSuccess,
  jobActionFailure,
} from "../slices/jobSlice";
import { Job } from "../../types";

export interface CreateJobInput {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  category: string;
}

export const createJob =
  (jobData: CreateJobInput) => async (dispatch: AppDispatch) => {
    try {
      dispatch(jobActionStart());

      const response = await api.post<{
        status: string;
        message: string;
        data: Job;
      }>("/jobs", jobData);

      if (response.data.status === "success" && response.data.data) {
        dispatch(jobActionSuccess(response.data.data));
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create job");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      dispatch(jobActionFailure(errorMessage));
      throw error;
    }
  };
