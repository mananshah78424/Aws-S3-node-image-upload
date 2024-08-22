import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./helpers/protectedRoute"; // Adjust the import path as needed
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Notification from "./pages/Notification";
import ProfilePage from "./pages/Profile";
import Register from "./pages/Register";

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
          <Route path="/profile" element={<ProfilePage></ProfilePage>}></Route>
          <Route
            path="/notifications"
            element={<Notification></Notification>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
