import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";

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

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}orders/store-orders`, {
        headers: { Authorization: `Bearer ${storeToken}` },
      });

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
    setDuration(`From ${fmt(first)} to ${fmt(last)}`);
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
    fetchAllOrders();
  }, []);

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

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">
      <h2 className="font-semibold text-lg mb-1">📦 Store Orders History</h2>
      {duration && <p className="text-gray-500 text-xs mb-4 italic">{duration}</p>}

      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
      />

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4 gap-2">
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
      </div>

      <hr className="my-4" />


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
