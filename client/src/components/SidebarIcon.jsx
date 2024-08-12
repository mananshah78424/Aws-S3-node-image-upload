import React from "react";

const SidebarIcon = ({ icon, label }) => {
  return (
    <div className="flex items-center space-x-2 p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default SidebarIcon;
