import axios from "axios";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear any local state if needed
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);
