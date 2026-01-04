import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "./orders/LoadingSkeleton";
import EmptyStateMessage from "./orders/EmptyStateMessage";
import { Loader2 } from "lucide-react";

const TableOrderAnalytics = ({ table, onClose }) => {
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

  const fetchTableOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}orders/table/${table._id}`, {
        headers: { Authorization: `Bearer ${storeToken}` },
      });

      const allOrders = data.orders || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      calculateAnalytics(allOrders);
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to fetch table orders");
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

  const applyFilters = () => {
    let filtered = [...orders];
    if (statusFilter) filtered = filtered.filter((o) => o.status === statusFilter);
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchTableOrders();
  }, [table]);

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
      fetchTableOrders();
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
      fetchTableOrders();
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
    fetchTableOrders();
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
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 min-h-screen bg-gray-50 text-sm">
      {/* Header */}
      <div className="flex p-0 justify-between items-center mb-4 sticky top-0 bg-gray-50 py-2 z-20">
        <div>
          <h2 className="font-semibold text-lg">
            🍽️ Table {table.tableNumber} Analytics
          </h2>
          <p className="text-gray-500 text-xs italic">
            Showing all orders for this table
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTableOrders}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-all"
          >
            Refresh
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* ✅ Analytics Section with filter control */}
      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
      />

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


      {/* Orders Section */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredOrders.length === 0 ? (
        <EmptyStateMessage message={"No orders found for this filter" } />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              setOrders={setOrders}
              onUpdateStatus={updateStatus}
              onCancel={cancelOrder}
              tableNumber={table.tableNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TableOrderAnalytics;
