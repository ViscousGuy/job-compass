// import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../utils/api";
import { RegisterInput, LoginInput, AuthResponse } from "../../types";
import {
  authStart,
  authSuccess,
  authFailure,
  validationFailure,
  logout,
} from "../slices/authSlice";
import { AppDispatch } from "../index";
import { setCurrentUser } from "../slices/userSlice";

export const register =
  (userData: RegisterInput) => async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());

      const response = await api.post<AuthResponse>("/auth/register", userData);

      if (response.data.status === "success" && response.data.data) {
        dispatch(
          authSuccess({
            user: response.data.data.user,
            token: response.data.data.token,
          })
        );
        dispatch(setCurrentUser(response.data.data.user));
        return response.data;
      } else {
        throw new Error("Registration failed");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors: Record<string, string> = {};
          error.response.data.errors.forEach(
            (err: { field: string; message: string }) => {
              validationErrors[err.field] = err.message;
            }
          );
          dispatch(validationFailure(validationErrors));
        } else {
          // Handle general error
          dispatch(
            authFailure(error.response.data.message || "Registration failed")
          );
        }
      } else {
        dispatch(authFailure(error.message || "Registration failed"));
      }
      throw error;
    }
  };

export const login =
  (userData: LoginInput) => async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());

      const response = await api.post<AuthResponse>("/auth/login", userData);

      if (response.data.status === "success" && response.data.data) {
        dispatch(
          authSuccess({
            user: response.data.data.user,
            token: response.data.data.token,
          })
        );
        // Also update the userSlice
        dispatch(setCurrentUser(response.data.data.user));

        return response.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors: Record<string, string> = {};
          error.response.data.errors.forEach(
            (err: { field: string; message: string }) => {
              validationErrors[err.field] = err.message;
            }
          );
          dispatch(validationFailure(validationErrors));
        } else {
          // Handle general error
          dispatch(authFailure(error.response.data.message || "Login failed"));
        }
      } else {
        dispatch(authFailure(error.message || "Login failed"));
      }
      throw error;
    }
  };
export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    // Call the logout endpoint to clear the cookie on the server
    await api.post("/auth/logout");

    // Update the Redux state
    dispatch(logout());
    dispatch(setCurrentUser(null));

    // Redirect to home page or login page
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    // Still logout on the client side even if server request fails
    dispatch(logout());
    dispatch(setCurrentUser(null));
    window.location.href = "/";
  }
};
export const checkAuthStatus = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(authStart());

    // Since we're using cookies, we don't need to send the token in the header
    // The cookie will be automatically sent with the request
    const response = await api.get<AuthResponse>("/auth/me");

    if (response.data.status === "success" && response.data.data) {
      dispatch(
        authSuccess({
          user: response.data.data.user,
          token: response.data.data.token,
        })
      );
      dispatch(setCurrentUser(response.data.data.user));
      return response.data;
    } else {
      dispatch(authFailure("Authentication failed"));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        dispatch(authFailure("Session expired. Please login again."));
      } else if (error.response.data?.message) {
        dispatch(authFailure(error.response.data.message));
      } else {
        dispatch(authFailure("Authentication failed"));
      }
    } else {
      dispatch(authFailure("Network error. Please try again."));
    }
  }
};
