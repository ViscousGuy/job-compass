import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "../../types";

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
    },
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.loading = false;
    },
  },
});

export const {
  applicationActionStart,
  applicationActionSuccess,
  applicationActionFailure,
  resetApplicationState,
  setApplications,
} = applicationSlice.actions;

export default applicationSlice.reducer;