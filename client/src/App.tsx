import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { checkAuthStatus } from "./store/thunks/authThunks";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { isLoading, user } = useAppSelector((state) => state.auth);

  // Check auth status when app loads
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Show loading state while checking auth
  if (
    isLoading &&
    !window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/register")
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

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
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
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
    </div>
  );
}

export default App;
