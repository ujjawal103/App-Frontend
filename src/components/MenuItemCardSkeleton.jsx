import React from "react";

const MenuItemCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 mb-3 animate-pulse">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>

        <div className="flex-1 ml-3">
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

          <div className="flex justify-between items-center mt-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCardSkeleton;
