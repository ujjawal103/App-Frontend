import React from "react";

const DayAnalyticsCardSkeleton = () => {
  return (
    <div className="relative min-w-[170px] md:min-w-[220px] rounded-xl border-2 border-pink-300 shadow overflow-hidden bg-pink-100 animate-pulse">

      {/* Decorative shape placeholder */}
      <div className="absolute -top-1 -left-2 w-30 h-30 bg-pink-300 rounded-b-[50%] z-10" />

      {/* TOP ROW */}
      <div className="relative z-20 flex items-center justify-between px-3 py-3">

        {/* Orders circle */}
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
          <div className="w-8 h-4 bg-gray-400 rounded" />
        </div>

        {/* Date placeholder */}
        <div className="flex flex-col gap-2 mr-2">
          <div className="w-10 h-4 bg-gray-300 rounded" />
          <div className="w-8 h-3 bg-gray-300 rounded" />
          <div className="w-12 h-3 bg-gray-300 rounded" />
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="border-t border-pink-300 px-3 py-3 bg-yellow-50 text-center">
        <div className="h-5 w-24 bg-gray-300 rounded mx-auto" />
      </div>
    </div>
  );
};

export default DayAnalyticsCardSkeleton;
