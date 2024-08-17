import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./helpers/protectedRoute"; // Adjust the import path as needed
import NewPost from "./pages/NewPost";

function App() {
  return (
    <div className="min-h-screen dark-bg-color-screen mainapp">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register></Register>} />
          <Route path="/" element={<Home />} />
          <Route
            path="/newPost"
            element={<ProtectedRoute element={<NewPost />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
