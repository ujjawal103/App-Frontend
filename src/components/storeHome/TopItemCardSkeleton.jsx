import React from "react";

const TopItemCardSkeleton = () => {
  return (
    <div className="relative h-full w-full bg-yellow-50 border-2 border-pink-200 rounded-xl shadow overflow-hidden flex flex-col animate-pulse">

      {/* IMAGE SKELETON */}
      <div className="h-28 md:h-50 w-full bg-gray-200" />

      {/* NAME + ORDERS */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        {/* Item name */}
        <div className="space-y-2 w-[60%]">
          <div className="h-3 bg-gray-300 rounded" />
          <div className="h-3 bg-gray-300 rounded w-4/5" />
        </div>

        {/* Orders circle */}
        <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0" />
      </div>

      {/* RANK */}
      <div className="mt-auto flex items-center justify-center py-2 border-t">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
      </div>
    </div>
  );
};

export default TopItemCardSkeleton;
