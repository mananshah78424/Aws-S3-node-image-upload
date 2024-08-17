import React from "react";

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">
          Please login or create an account to upload images.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
