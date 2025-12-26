import React from "react";

const AnalyticsSection = ({ analytics, statusFilter, onFilter }) => {
  return (
    <>
      {/* Analytics Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {[
          { label: "Total Orders", key: "all", color: "blue", value: analytics.totalOrders },
          { label: "Pending", key: "pending", color: "yellow", value: analytics.pending },
          { label: "Confirmed", key: "confirmed", color: "purple", value: analytics.confirmed },
          { label: "Completed", key: "completed", color: "green", value: analytics.completed },
          { label: "Cancelled", key: "cancelled", color: "red", value: analytics.cancelled },
        ].map(({ label, key, color, value }) => (
          <div
            key={key}
            onClick={() => onFilter(key === "all" ? "" : key)}
            className={`cursor-pointer p-3 rounded-lg shadow transition bg-${color}-100 hover:bg-${color}-200 ${
              statusFilter === key || (key === "all" && statusFilter === "")
                ? `ring-2 ring-${color}-200`
                : ""
            }`}
          >
            <p className="text-gray-600 text-lg">{label}</p>
            <p className={`font-semibold text-${color}-600 text-sm`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Total Revenue */}
      <div className="bg-indigo-200 p-4 rounded-lg shadow mb-5 w-full text-center">
        <p className="text-gray-600 text-lg">Total Revenue</p>
        <p className="font-semibold text-indigo-600 text-lg">
          ₹{analytics.totalRevenue.toFixed(2)}
        </p>
      </div>
    </>
  );
};

export default AnalyticsSection;
