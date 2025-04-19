import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles = [],
}) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If auth is still loading, you might want to show a loading spinner
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not included, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the correct role, render the element
  return <>{element}</>;
};

export default ProtectedRoute;