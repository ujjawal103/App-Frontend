import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import { Loader2 } from "lucide-react";

const YourDailyAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  // ✅ Fetch orders for selected date
  const fetchOrdersByDate = async (date) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}orders/store-orders/date?date=${date}`,
        {
          headers: { Authorization: `Bearer ${storeToken}` },
        }
      );

      const allOrders = data.orders || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      calculateAnalytics(allOrders);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch orders for selected date"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate analytics for the selected day
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

  const applyFilters = () => {
    let filtered = [...orders];
    if (statusFilter) filtered = filtered.filter((o) => o.status === statusFilter);
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrdersByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, orders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
      toast.success(`Status updated to '${status}'`);
      fetchOrdersByDate(selectedDate);
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
      fetchOrdersByDate(selectedDate);
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
    fetchOrdersByDate(selectedDate);
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
      <h2 className="font-semibold text-lg mb-1">📊 Your Daily Analytics</h2>

      {/* Date Filter */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <p className="text-blue-600 text-md md:text-lg italic">
          Select a date to view analytics
        </p>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          max={new Date().toISOString().split("T")[0]}
          className="border p-2 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      <hr className="my-4" />

      <h3 className="font-semibold text-lg mb-1">
        📅 Orders on {new Date(selectedDate).toLocaleDateString("en-IN")}
      </h3>

      
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
        <EmptyStateMessage message="No orders found for this date" />
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

export default YourDailyAnalytics;
