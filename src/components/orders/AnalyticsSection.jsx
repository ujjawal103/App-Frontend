// import React from "react";

// const AnalyticsSection = ({ analytics, statusFilter, onFilter }) => {
//   return (
//     <>
//       {/* Analytics Section */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
//         {[
//           { label: "Total Orders", key: "all", color: "blue", value: analytics.totalOrders },
//           { label: "Pending", key: "pending", color: "yellow", value: analytics.pending },
//           { label: "Confirmed", key: "confirmed", color: "purple", value: analytics.confirmed },
//           { label: "Completed", key: "completed", color: "green", value: analytics.completed },
//           { label: "Cancelled", key: "cancelled", color: "red", value: analytics.cancelled },
//         ].map(({ label, key, color, value }) => (
//           <div
//             key={key}
//             onClick={() => onFilter(key === "all" ? "" : key)}
//             className={`cursor-pointer p-3 rounded-lg shadow transition bg-${color}-100 hover:bg-${color}-200 ${
//               statusFilter === key || (key === "all" && statusFilter === "")
//                 ? `ring-2 ring-${color}-200`
//                 : ""
//             }`}
//           >
//             <p className="text-gray-600 text-lg">{label}</p>
//             <p className={`font-semibold text-${color}-600 text-sm`}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Total Revenue */}
//       <div className="bg-indigo-200 p-4 rounded-lg shadow mb-5 w-full text-center">
//         <p className="text-gray-600 text-lg">Total Revenue</p>
//         <p className="font-semibold text-indigo-600 text-lg">
//           ₹{analytics.totalRevenue.toFixed(2)}
//         </p>
//       </div>
//     </>
//   );
// };

// export default AnalyticsSection;



import React from "react";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  IndianRupee, 
  BarChart3 
} from "lucide-react";

const AnalyticsSection = ({ analytics, statusFilter, onFilter }) => {
  const stats = [
    { label: "All", key: "all", color: "blue", value: analytics.totalOrders, icon: ShoppingBag, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    { label: "Pending", key: "pending", color: "amber", value: analytics.pending, icon: Clock, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    { label: "Confirmed", key: "confirmed", color: "purple", value: analytics.confirmed, icon: BarChart3, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    { label: "Completed", key: "completed", color: "green", value: analytics.completed, icon: CheckCircle2, bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    { label: "Cancelled", key: "cancelled", color: "red", value: analytics.cancelled, icon: XCircle, bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  ];

  return (
    <div className="px-1 w-full max-w-full overflow-hidden">
      {/* 🚀 REVENUE CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-500 p-4 sm:p-6 rounded-2xl shadow-lg shadow-pink-100 mb-2 sm:mb-2 flex items-center justify-between border border-pink-400">
        <div className="relative z-10 text-white">
          <p className="text-pink-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-90">Total Revenue</p>
          <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1">
            <span className="text-2xl sm:text-4xl font-black">₹{analytics.totalRevenue.toLocaleString()}</span>
            {/* <span className="text-pink-200 text-xs sm:text-sm font-medium">.00</span> */}
          </div>
        </div>
        <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-md border border-white/30 shrink-0">
          <IndianRupee size={24} className="text-white sm:w-7 sm:h-7" />
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* 📊 GRID SECTION */}
      <div className="flex overflow-x-auto pb-4 pt-1 px-1 gap-2 no-scrollbar sm:grid sm:grid-cols-5 lg:grid-cols-5 sm:gap-4 sm:overflow-x-visible">
        {stats.map((item) => {
          const isActive = statusFilter === item.key || (item.key === "all" && statusFilter === "");
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => onFilter(item.key === "all" ? "" : item.key)}
              className={`
                /* Mobile: Flex-Row | Desktop: Flex-Col */
                flex flex-row sm:flex-col items-center sm:items-start shrink-0 
                
                /* Sizing & Borders */
                min-w-fit sm:w-full px-3 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer
                border-2 /* Solid 2px border for visibility */
                
                ${isActive 
                  ? `${item.bg} ${item.border} ring-1 ring-pink-500 shadow-md sm:scale-[1.03]` 
                  : "bg-white border-gray-100 hover:border-pink-200"
                }
              `}
            >
              {/* Icon Container - Fixed shrinking issue with 'shrink-0' */}
              <div className={`${item.bg} p-2 rounded-lg mr-3 sm:mr-0 sm:mb-3 shrink-0 flex items-center justify-center`}>
                <Icon size={16} className={`${item.text} sm:w-[20px] sm:h-[20px]`} />
              </div>
              
              <div className="flex flex-col min-w-0">
                <p className={`text-[9px] sm:text-[11px] font-extrabold uppercase tracking-tight leading-none ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                  {item.label}
                </p>
                <p className="text-sm sm:text-xl font-black text-gray-900 mt-0.5 sm:mt-1 truncate">
                  {item.value}
                </p>
              </div>

              {/* Decorative Dot for active state on Desktop */}
              {isActive && (
                <div className="hidden sm:block absolute top-3 right-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsSection;
