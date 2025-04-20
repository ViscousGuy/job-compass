import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { checkAuthStatus } from "./store/thunks/authThunks";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import ApplicationDetails from "./pages/ApplicationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute
                  element={<Jobs />}
                  allowedRoles={["jobseeker", "employer", "admin"]}
                />
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute
                  element={<JobDetails />}
                  allowedRoles={["jobseeker", "employer", "admin"]}
                />
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute
                  element={<ApplicationDetails />}
                  allowedRoles={["jobseeker", "employer", "admin"]}
                />
              }
            />
            <Route
              path="/employer/dashboard/*"
              element={
                <ProtectedRoute
                  element={<EmployerDashboard />}
                  allowedRoles={["employer", "admin"]}
                />
              }
            />
            <Route
              path="/jobseeker/dashboard/*"
              element={
                <ProtectedRoute
                  element={<JobSeekerDashboard />}
                  allowedRoles={["jobseeker"]}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
