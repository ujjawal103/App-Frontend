import React from "react";
import { MapPinOff } from "lucide-react";

const StoreCards = ({ stores, handleCardClick }) => {
if (!stores || stores.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center space-y-3">
      {/* Icon with purple background */}
      <div className="bg-purple-100 text-purple-600 p-6 rounded-full mb-4 animate-pulse">
        <MapPinOff className="w-12 h-12 animate-[ping_1.5s_ease-in-out_infinite]" />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-700">
        No salons found
      </h2>

      {/* Subtext */}
      <p className="text-gray-500 text-sm max-w-xs">
        Looks like there are no salons available in your location.
      </p>
    </div>
  );
}

  return (
    <div className="px-4 flex-1 pb-20 space-y-4">
      {stores.map((store) => (
        <div
          key={store._id}
          onClick={() => handleCardClick(store)}
          className="border-2 border-black flex bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer min-h-[150px]"
        >
          {/* Left Side - Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <h3 className="font-semibold text-gray-800 text-lg">
              {store.storeName}
            </h3>
            <p>Regular Price : ₹70 only</p>
            <p className="truncate text-gray-500 mt-2 w-40 sm:w-60 lg:w-80 text-sm">
              {store.storeDetails.address}
            </p>

            {store.distance && store.duration && (
              <p className="text-gray-400 text-sm">
                {store.distance} , {store.duration}
              </p>
            )}
          </div>

          {/* Right Side - Photo */}
          <div className="w-32 h-[150px] flex justify-center items-center p-1">
            <img
              src={store.storeDetails.photo}
              alt={store.storeName}
              className="w-full h-full object-cover position-center rounded-xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreCards;
