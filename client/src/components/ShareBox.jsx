import React, { useState } from "react";
import PostModal from "./PostModal"; // Import the PostModal component

const ShareBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-md mb-4 sharebox-box p-2">
      <div onClick={openModal} className="cursor-pointer text-gray-700">
        <textarea
          className="w-full bg-transparent resize-none focus:outline-none sharebox-textarea"
          placeholder="What's on your mind?"
          readOnly
        />
      </div>

      {isModalOpen && <PostModal onClose={closeModal} />}
    </div>
  );
};

export default ShareBox;
