import { AppDispatch } from "../index";
import { api } from "../../utils/api";
import {
  applicationActionStart,
  applicationActionSuccess,
  applicationActionFailure,
  setApplications,
} from "../slices/applicationSlice";
import { Application } from "../../types";

export const createApplication = 
  (formData: FormData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(applicationActionStart());

      const response = await api.post<{
        status: string;
        message: string;
        data: Application;
      }>("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success" && response.data.data) {
        dispatch(applicationActionSuccess(response.data.data));
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to submit application");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      dispatch(applicationActionFailure(errorMessage));
      throw error;
    }
  };

export const fetchUserApplications = 
  () => async (dispatch: AppDispatch) => {
    try {
      dispatch(applicationActionStart());

      const response = await api.get<{
        status: string;
        message: string;
        data: Application[];
      }>("/applications");

      if (response.data.status === "success" && response.data.data) {
        dispatch(setApplications(response.data.data));
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch applications");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      dispatch(applicationActionFailure(errorMessage));
      throw error;
    }
  };