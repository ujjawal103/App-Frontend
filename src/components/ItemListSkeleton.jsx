import React from "react";

const ItemListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="rounded-lg shadow-md p-4 bg-white animate-pulse"
        >
          <div className="w-full h-40 bg-gray-300 rounded-md mb-3"></div>

          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>

          <div className="h-24 bg-gray-200 rounded mb-3"></div>

          <div className="flex justify-between mt-4">
            <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemListSkeleton;
