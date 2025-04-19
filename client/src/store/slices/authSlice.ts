import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';

const initialState: AuthState = {
  user: null,
  token: null, // We don't need to store token in localStorage anymore
  isLoading: false,
  error: null,
  validationErrors: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.validationErrors = null;
    },
    authSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token; // Store in state but not localStorage
      state.error = null;
      state.validationErrors = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.validationErrors = null;
    },
    validationFailure: (state, action: PayloadAction<Record<string, string>>) => {
      state.isLoading = false;
      state.validationErrors = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
  },
});

export const { 
  authStart, 
  authSuccess, 
  authFailure, 
  validationFailure, 
  logout,
  clearErrors 
} = authSlice.actions;

export default authSlice.reducer;