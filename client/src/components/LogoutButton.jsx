import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../helpers/userContext"; // Adjust the import path

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Use the useUser hook to access setUser

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("jwtToken");
      console.log("Removed sessionStorage item");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-blue-500 hover:text-blue-700 px-4 py-2"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
