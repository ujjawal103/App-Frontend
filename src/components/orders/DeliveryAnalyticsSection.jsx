import React from "react";
import { 
  ShoppingBag, 
  Clock, 
  ChefHat,
  Bike,
  CheckCircle2, 
  XCircle, 
  IndianRupee
} from "lucide-react";

const DeliveryAnalyticsSection = ({ analytics, statusFilter, onFilter }) => {
  const stats = [
    {
      label: "All",
      key: "all",
      value: analytics.totalOrders,
      icon: ShoppingBag,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    {
      label: "Placed",
      key: "placed",
      value: analytics.placed,
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200"
    },
    {
      label: "Preparing",
      key: "preparing",
      value: analytics.preparing,
      icon: ChefHat,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200"
    },
    {
      label: "Out for Delivery",
      key: "out-for-delivery",
      value: analytics.outForDelivery,
      icon: Bike,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200"
    },
    {
      label: "Delivered",
      key: "delivered",
      value: analytics.delivered,
      icon: CheckCircle2,
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200"
    },
    {
      label: "Cancelled",
      key: "cancelled",
      value: analytics.cancelled,
      icon: XCircle,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200"
    },
  ];

  return (
    <div className="px-1 w-full max-w-full overflow-hidden">

      {/* 💰 REVENUE CARD (same as before) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-500 p-4 sm:p-6 rounded-2xl shadow-lg shadow-pink-100 mb-2 flex items-center justify-between border border-pink-400">
        <div className="relative z-10 text-white">
          <p className="text-pink-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Total Revenue
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-4xl font-black">
              ₹{analytics.totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-md border border-white/30">
          <IndianRupee size={24} className="text-white sm:w-7 sm:h-7" />
        </div>

        <div className="absolute -right-6 -bottom-6 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* 📊 STATUS CARDS */}
      <div className="flex overflow-x-auto pb-4 pt-1 px-1 gap-2 no-scrollbar lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-x-visible">
        {stats.map((item) => {
          const isActive = statusFilter === item.key || (item.key === "all" && statusFilter === "");
          const Icon = item.icon;

          return (
            <div
                key={item.key}
                onClick={() => onFilter(item.key === "all" ? "" : item.key)}
                className={`
                    flex flex-row sm:flex-col items-center sm:items-start shrink-0 

                    /* 👇 FIX WIDTH HERE */
                    min-w-[140px] sm:min-w-[160px] lg:min-w-0 lg:w-full

                    px-3 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer
                    border-2
                    
                    ${isActive 
                    ? `${item.bg} ${item.border} ring-1 ring-pink-500 shadow-md sm:scale-[1.03]` 
                    : "bg-white border-gray-100 hover:border-pink-200"
                    }
                `}
            >
              <div className={`${item.bg} p-2 rounded-lg mr-3 sm:mr-0 sm:mb-3 shrink-0 flex items-center justify-center`}>
                <Icon size={16} className={`${item.text} sm:w-[20px] sm:h-[20px]`} />
              </div>

              <div className="flex flex-col min-w-0">
                <p className={`text-[9px] sm:text-[11px] font-extrabold uppercase ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                  {item.label}
                </p>
                <p className="text-sm sm:text-xl font-black text-gray-900 mt-1 truncate">
                  {item.value}
                </p>
              </div>

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

export default DeliveryAnalyticsSection;