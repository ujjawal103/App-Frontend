import React from "react";

const MobileTopHeader = ({
  onMenuClick,
  revenue = 0,
  logo = "/tapResto.png",
  rightLabel = "Today",
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-14 bg-white border-b-2 border-pink-600 shadow-sm flex items-center justify-between px-4 z-40 md:hidden">
      
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-xl">
          ☰
        </button>
        <img src={logo} alt="Logo" className="h-8" />
      </div>

      {/* Right: Revenue */}
      <div className="text-right">
        <p className="text-xs text-gray-500">{rightLabel}</p>
        <p className="text-sm font-semibold text-green-800">
          ₹ {Number(revenue).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MobileTopHeader;
