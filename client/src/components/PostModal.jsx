import React, { useState } from "react";
import ReactDOM from "react-dom";

const PostModal = ({ onClose }) => {
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    // Logic for submitting the post
    console.log("Post submitted:", postContent);
    // Close the modal and reset the input after submission
    setPostContent("");
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
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
            className={`artdeco-button artdeco-button--2 artdeco-button--primary py-2 px-4 rounded-lg text-white ${
              postContent.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!postContent.trim()}
          >
            <span className="artdeco-button__text">Post</span>
          </button>
          <button
            onClick={onClose}
            className="artdeco-button artdeco-button--2 artdeco-button--secondary ml-2 py-2 px-4 rounded-lg text-gray-700 bg-gray-300 hover:bg-gray-400"
          >
            <span className="artdeco-button__text">Cancel</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostModal;
