import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../../types";
import {
  fetchApplicationById,
  updateApplicationStatus,
} from "../thunks/applicationThunks";

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  success: false,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    applicationActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    applicationActionSuccess: (state, action: PayloadAction<Application>) => {
      state.loading = false;
      state.success = true;
      state.currentApplication = action.payload;
      state.applications.unshift(action.payload);
    },
    applicationActionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetApplicationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentApplication = null;
    },
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.loading = false;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.data;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.payload as any).message
          : "Failed to fetch application";
      })

      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload.data;

        // Also update the application in the applications array
        const index = state.applications.findIndex(
          (app) => app._id === action.payload.data._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload.data;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.payload as any).message
          : "Failed to update application status";
      });
  },
});

export const {
  applicationActionStart,
  applicationActionSuccess,
  applicationActionFailure,
  resetApplicationState,
  setApplications,
  clearCurrentApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;
