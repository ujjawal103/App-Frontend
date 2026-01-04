import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import { Loader2 } from "lucide-react";

const TodayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
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

  // ✅ Fetch only today’s orders
  const fetchTodayOrders = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const { data } = await axios.get(
        `${BASE_URL}orders/store-orders/date?date=${today}`,
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );

      const allOrders = data.orders || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      calculateAnalytics(allOrders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch today's orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate today’s analytics
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
    fetchTodayOrders();
  }, []);

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
      fetchTodayOrders();
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
      fetchTodayOrders();
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
    fetchTodayOrders();
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
      

      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      

      <hr className="my-4" />

      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div>
                <h2 className="font-semibold text-lg">📅 Today’s Orders</h2>
                <p className="text-gray-500 text-xs italic mb-2">
                Showing all orders placed today ({new Date().toLocaleDateString("en-IN")})
                </p>
            </div>

            <button
                onClick={fetchTodayOrders}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-all"
            >
                Refresh
            </button>
       </div>


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
        <EmptyStateMessage message="No orders found for today" />
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

export default TodayOrders;
