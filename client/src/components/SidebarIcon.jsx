import React from "react";

const SidebarIcon = ({ icon, label }) => {
  return (
    <div className="flex items-center space-x-4 p-2 text-white dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-base text-white dark:text-white">{label}</span>
    </div>
  );
};

export default SidebarIcon;
