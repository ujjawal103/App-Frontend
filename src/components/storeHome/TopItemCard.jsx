import React from "react";
import {useNavigate} from "react-router-dom"


const TopItemCard = ({ item, rank }) => {
  const navigate = useNavigate();
  return (
    <div className="relative h-full w-full bg-yellow-50 border-2 border-pink-600 rounded-xl shadow overflow-hidden flex flex-col"
    onClick={() => navigate(`/monthly-analytics`)}
    >

      {/* IMAGE */}
      <div className="h-28 md:h-50 w-full bg-gray-100 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.itemName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* NAME + ORDERS */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <span className="text-sm font-bold text-gray-600 line-clamp-2 break-words">
          {item.itemName}
        </span>

        <div className="w-14 h-14 p-4 rounded-full bg-pink-600 text-white flex flex-col items-center justify-center text-sm font-bold shrink-0">
          {item.orders}
          <p className="text-[0.5rem]">Orders</p>
        </div>
      </div>

      {/* RANK */}
      <div className="mt-auto flex items-center justify-center py-1 border-t">
        <div
          className={`w-14 h-14 flex items-center justify-center text-2xl font-extrabold ${
            rank === 1 ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          {rank}
        </div>
      </div>
    </div>
  );
};

export default TopItemCard;