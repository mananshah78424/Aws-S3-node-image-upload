import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./userContext"; // Adjust the path as needed

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useUser(); // Get user information and loading state from context

  if (loading) {
    // While user data is being fetched, show a loading spinner or placeholder
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  return user ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
