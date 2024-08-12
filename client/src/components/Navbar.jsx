// Navbar.jsx
import {
  HomeIcon,
  MenuIcon,
  SearchIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import SidebarIcon from "./SidebarIcon";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:w-64 lg:h-screen lg:shadow-lg lg:border-r lg:border-gray-300 lg:dark:border-gray-700">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center p-4">
        <button onClick={toggleMenu} aria-label="Menu">
          <MenuIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Mobile Menu Items */}
      <div
        className={`lg:flex lg:flex-col lg:items-start lg:p-4 lg:mt-8 ${
          isOpen ? "flex" : "hidden"
        } lg:block flex-row items-center lg:flex-row lg:space-y-4 lg:space-y-0 lg:space-x-4`}
      >
        <div className="lg:mb-8">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-proxima italic ml-6">
            InstaS3Sync
          </span>
        </div>
        <SidebarIcon
          icon={
            <SearchIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          }
          label="Search"
        />
        <a href="/">
          <SidebarIcon
            icon={
              <HomeIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            }
            label="Explore"
          />
        </a>
        <a href="/newPost" className="flex items-center">
          <SidebarIcon
            icon={
              <UploadIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            }
            label="Upload"
          />
        </a>
        <div className="instructions text-white p-4 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ul className="list-none space-y-2 font-normal">
            <li>
              Upload an image, and the image will be uploaded to AWS S3 bucket.
            </li>
            <li>
              Simply click on upload on the sidebar towards the left side.
            </li>
            <li>
              You can also like and comment on pics, that would update in
              real-time.
            </li>
            <li>Check out the real-time news-feed on the right side!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
