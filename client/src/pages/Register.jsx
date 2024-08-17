import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";
import NewsBar from "../components/NewsBar";
import SideBar from "../components/SideBar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [newsReady, setNewsReady] = useState(false);
  const handleRegister = async (email, password) => {
    try {
      const response = await PostFinder.post("/register", {
        email,
        password,
        name,
      });
      if (response) {
        console.log("Register successfully logged in!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Register failed:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRegister(email, password, name);
  };

  return (
    <div className="flex flex-row min-h-screen dark-bg-color-screen">
      <SideBar />
      <div className="flex flex-1 items-center justify-center">
        {!newsReady ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-white">Loading NewsBar...</div>
          </div>
        ) : (
          <div className="max-w-sm w-full bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Register</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-300"
              >
                Register
              </button>
            </form>
          </div>
        )}
      </div>
      <NewsBar setReady={setNewsReady}></NewsBar>
    </div>
  );
};

export default Register;
