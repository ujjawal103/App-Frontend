import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          <div className="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>

          <div className="flex justify-end mt-4 space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
