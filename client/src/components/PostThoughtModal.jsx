import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";

const PostThoughtModal = ({ onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState(""); // State for error message
  const token = sessionStorage.getItem("jwtToken");
  let navigate = useNavigate();

  const handlePostSubmit = async () => {
    console.log("Post submitted:", postContent);
    try {
      const formData = new FormData();

      formData.append("thought", postContent);
      formData.append("mediaType", "text");
      await PostFinder.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setPostContent("");
      onClose();
      navigate("/");
      window.location.reload(); // Consider removing this to prevent unnecessary reloads
    } catch (error) {
      // Check if the error is an AxiosError
      if (error.response) {
        // The request was made and the server responded with a status code
        const errorMessage =
          error.response.data.error || error.response.statusText;
        setError(`${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`${error.message}`);
      }
      console.error("Error details:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
            {error}
          </div>
        )}
        <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
        <textarea
          className="w-full h-40 rounded-lg p-4 resize-none outline-none"
          placeholder="Share your thoughts..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePostSubmit}
            className={`py-2 px-4 rounded-lg text-white ${
              postContent.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!postContent.trim()}
          >
            Post
          </button>
          <button
            onClick={onClose}
            className="ml-2 py-2 px-4 rounded-lg text-gray-700 bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostThoughtModal;
