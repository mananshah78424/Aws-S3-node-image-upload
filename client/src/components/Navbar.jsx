import { HomeIcon, SearchIcon, UploadIcon } from "@heroicons/react/outline";
import React from "react";
import SidebarIcon from "./SidebarIcon";
const Navbar = () => {
  return (
    <div className="w-64 h-screen  shadow-lg border-r border-gray-300 dark:border-gray-700 ">
      <div className="flex flex-col items-start p-4 mt-8">
        <div className="mb-8">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-proxima">
            S3PicFlow
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
      </div>
    </div>
  );
};

export default Navbar;
