import React from "react";

const TableCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-between
    bg-gray-200 shadow animate-pulse
    min-w-[167px] max-w-[160px] md:min-w-[300px] md:max-w-[300px] mb-4 md:ml-2">

      {/* Table Title */}
      <div className="h-5 bg-gray-300 rounded w-24 mb-3"></div>

      {/* QR Placeholder */}
      <div className="w-24 h-24 bg-gray-300 rounded-lg mb-3"></div>

      {/* Divider */}
      <div className="h-1 bg-gray-300 w-full mb-3"></div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>

    </div>
  );
};

export default TableCardSkeleton;
