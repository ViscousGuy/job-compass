import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../../types";

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  success: false,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    jobActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    jobActionSuccess: (state, action: PayloadAction<Job>) => {
      state.loading = false;
      state.success = true;
      state.jobs.unshift(action.payload); // Add new job to the beginning of the array
    },
    jobActionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetJobState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  jobActionStart,
  jobActionSuccess,
  jobActionFailure,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;
