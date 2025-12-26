const DayAnalyticsCard = ({ data }) => {
  const { date, totalOrders, totalRevenue } = data;

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
  const year = date.getFullYear();

  return (
    <div className="relative min-w-[170px] md:min-w-[220px] rounded-xl border-2 border-pink-600 shadow overflow-hidden bg-purple-900 bg-[#fc03e8]">

      {/* YELLOW DECORATIVE CIRCLE (middle layer) */}
      {/* <div className="absolute -top-1 right-1 w-15 h-25 border-2 border-pink-600 bg-yellow-600 rounded-b-[50%] z-10"></div> */}
      <div className="absolute -top-1 -left-2 w-30 h-30 border-2 border-yellow-600 bg-pink-600 rounded-b-[50%] z-10"></div>

      {/* TOP ROW */}
      <div className="relative z-20 flex items-center justify-between px-3 py-3 ">
        
        {/* LEFT: ORDERS CIRCLE */}
        <div className="w-20 h-20 rounded-full border-0 border-pink-600 bg-yellow-200 flex flex-col items-center justify-center text-pink-600 bg-white">
          <span className="text-xl font-bold leading-none">
            {totalOrders}
          </span>
          <span className="text-[10px] text-gray-500">
            orders
          </span>
        </div>

        {/* RIGHT: DATE */}
        <div className="flex flex-col justify-center mr-2 text-white text-left">
          <p className="text-2xl font-bold leading-none">
            {day}
          </p>
          <span className=" text-xs font-semibold">
            {month}
          </span>
          <p className="text-xs">
            {year}
          </p>
        </div>
      </div>

      {/* BOTTOM ROW (BEHIND yellow) */}
      <div className="border-t border-pink-600 border-white px-3 py-3 text-center relative bg-yellow-50">
        <p className="text-lg font-bold text-green-600">
          ₹{totalRevenue.toFixed(2)}
        </p>
      </div>

    </div>
  );
};

export default DayAnalyticsCard;
