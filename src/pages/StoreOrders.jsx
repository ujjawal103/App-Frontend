import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../notification/Notification";
import FooterNavStore from "../components/FooterNavStore";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [duration, setDuration] = useState("");
    const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showPicker, setShowPicker] = useState(false);

const [range, setRange] = useState([
  {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    key: "selection",
  },
]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const fetchAllOrders = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
      `${BASE_URL}orders/store-orders/range?from=${from}&to=${to}`,
      { headers: { Authorization: `Bearer ${storeToken}` } }
    );

      const allOrders = data.orders || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      calculateAnalytics(allOrders);
      calculateDuration(allOrders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersList) => {
    const totalOrders = ordersList.length;
    const pending = ordersList.filter((o) => o.status === "pending").length;
    const confirmed = ordersList.filter((o) => o.status === "confirmed").length;
    const completed = ordersList.filter((o) => o.status === "completed").length;
    const cancelled = ordersList.filter((o) => o.status === "cancelled").length;
    const totalRevenue = ordersList
      .filter((o) => ["confirmed", "completed"].includes(o.status))
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    setAnalytics({
      totalOrders,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
    });
  };

  const calculateDuration = (ordersList) => {
    if (ordersList.length === 0) return setDuration("");
    const sorted = [...ordersList].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const first = new Date(sorted[0].createdAt);
    const last = new Date(sorted[sorted.length - 1].createdAt);
    const fmt = (d) =>
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    setDuration(`Available From ${fmt(first)} to ${fmt(last)}`);
  };

  const applyFilters = () => {
    let filtered = [...orders];
    if (statusFilter)
      filtered = filtered.filter((o) => o.status === statusFilter);
    if (dateFilter)
      filtered = filtered.filter(
        (o) => o.createdAt.split("T")[0] === dateFilter
      );
    setFilteredOrders(filtered);
  };

  useEffect(() => {
  const now = new Date();

  const to = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(now);

  const past = new Date();
  past.setDate(past.getDate() - 30);

  const from = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(past);

  setFrom(from);
  setTo(to);

  fetchAllOrders(from, to);
}, []);

  // useEffect(() => {
  //   fetchAllOrders();
  // }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, orders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
      toast.success(`Status updated to '${status}'`);
      fetchAllOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}orders/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
      toast.success("Order cancelled");
      fetchAllOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };


  const markAllAsCompleted = async () => {
  try {
    setLoading(true);

    const ordersToUpdate = filteredOrders.filter(
      (o) =>
        o.status !== "completed" &&
        o.status !== "cancelled"
    );

    for (const order of ordersToUpdate) {
      await axios.put(
        `${BASE_URL}orders/status/${order._id}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
    }

    toast.success("All orders marked as completed");
    fetchAllOrders();
  } catch (err) {
    toast.error("Failed to mark all orders");
  } finally {
    setLoading(false);
  }
};



  const hasPendingOrConfirmed = filteredOrders.some(
  (o) => o.status === "pending" || o.status === "confirmed"
);  

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">
      <div className="flex items-center justify-between gap-2 mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              
              {/* Left Side: Short Heading */}
              <div className="flex items-center gap-2 min-w-0">
                <div className=" xs:block bg-pink-50 p-2 rounded-lg">
                  <span className="text-lg">📦</span>
                </div>
                <h2 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                  Orders
                </h2>
              </div>
      
              {/* Right Side: Compact Date Picker Trigger */}
              <div className="relative">
                <div
                  onClick={() => setShowPicker(!showPicker)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-white hover:border-pink-300 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  
                  <span className="text-[11px] sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {range[0].startDate.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })} 
                    <span className="mx-1 text-gray-400">-</span>
                    {range[0].endDate.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                  </span>
      
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
      
                {/* 📅 Calendar Popover */}
                {showPicker && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)}></div>
                    
                    {/* Added 'right-0' to ensure it doesn't bleed off the left side of mobile screens */}
                    <div className="absolute right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-[90vw] max-w-[350px]">
                      <div className="overflow-x-auto">
                        <DateRange
                          editableDateInputs={true}
                          onChange={(item) => setRange([item.selection])}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          maxDate={new Date()}
                          rangeColors={["#db2777"]}
                        />
                      </div>
      
                      <div className="flex items-center justify-end gap-3 p-3 bg-gray-50 border-t">
                        <button
                          onClick={() => setShowPicker(false)}
                          className="text-xs font-medium text-gray-500 px-3 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowPicker(false);
                            const from = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(range[0].startDate);
                            const to = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(range[0].endDate);
                            fetchAllOrders(from, to);
                          }}
                          className="bg-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
      





      {/* {duration && <p className="text-gray-500 text-xs mb-4 italic">{duration}</p>} */}

      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      {/* Filter Section */}
      {/* <div className="flex justify-between items-center mb-4 gap-2">
        {dateFilter ? (
          <button
            onClick={() => {
              setDateFilter("");
            }}
            className="text-red-500 text-sm md:text-base font-medium underline hover:text-red-600 transition"
          >
            Clear Filter ✖
          </button>
        ) : (
          <p className="text-blue-600 text-md md:text-lg italic">
            Apply filter on following orders
          </p>
        )}

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          onClick={(e) => e.target.showPicker && e.target.showPicker()} // auto open calendar if supported
          max={new Date().toISOString().split("T")[0]} // disable future dates
          className="border p-2 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div> */}

      <hr className="my-4" />

            {(statusFilter === "pending" || statusFilter === "confirmed") && hasPendingOrConfirmed && (
                     <div className="flex justify-end mb-3">
                       { !loading ? (
                         <button
                         onClick={markAllAsCompleted}
                         className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                       >
                         Mark All as Completed
                       </button>
                       ) : (
                       <button
                         disabled
                         className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
                       >
                         <Loader2 className="w-4 h-4 mr-2 inline-block animate-spin" /> Processing...
                       </button>
                       ) }
                     </div>
                   )}


      {loading ? (
        <LoadingSkeleton />
      ) : filteredOrders.length === 0 ? (
        <EmptyStateMessage message="No orders found" />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              setOrders={setOrders}
              onUpdateStatus={updateStatus}
              onCancel={cancelOrder}
            />
          ))}
        </div>
      )}

      <FooterNavStore />
    </div>
  );
};

export default StoreOrders;
