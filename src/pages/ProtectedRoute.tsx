import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase"; // Adjust the path according to your project

interface ProtectedRouteProps {
  element: React.ReactElement;
  requireAuth?: boolean; // Whether this route requires authentication
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requireAuth = true,
}) => {
  const [user] = useAuthState(auth);

  // If user is authenticated and route does not require auth, redirect to home
  if (user && !requireAuth) return <Navigate to="/" />;

  // If user is not authenticated and route requires auth, redirect to login
  if (!user && requireAuth) return <Navigate to="/login" />;

  // Render the element if authentication status matches route requirement
  return element;
};

export default ProtectedRoute;
