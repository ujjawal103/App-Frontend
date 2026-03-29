import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../notification/Notification";
import FooterNavStore from "../components/FooterNavStore";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import DeliveryAnalyticsSection from "../components/orders/DeliveryAnalyticsSection";
import DeliveryOrderCard from "../components/orders/DeliveryOrderCard";

const MonthlyDeliveryAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    placed: 0,
    preparing: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 "" = no filter
  const [statusFilter, setStatusFilter] = useState("");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchMonthlyData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${BASE_URL}orders/store-qr-delivery-orders/month?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );

      const fetchedOrders = data.orders || [];

      setAllOrders(fetchedOrders);
      calculateAnalytics(fetchedOrders);
      setFilteredOrders(fetchedOrders); // default = all

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ANALYTICS ================= */
  const calculateAnalytics = (ordersList) => {
    const totalOrders = ordersList.length;

    const placed = ordersList.filter((o) => o.deliveryStatus === "placed").length;
    const preparing = ordersList.filter((o) => o.deliveryStatus === "preparing").length;
    const outForDelivery = ordersList.filter((o) => o.deliveryStatus === "out-for-delivery").length;
    const delivered = ordersList.filter((o) => o.deliveryStatus === "delivered").length;
    const cancelled = ordersList.filter((o) => o.deliveryStatus === "cancelled").length;

    const totalRevenue = ordersList
      .filter((o) => o.deliveryStatus === "delivered")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    setAnalytics({
      totalOrders,
      placed,
      preparing,
      outForDelivery,
      delivered,
      cancelled,
      totalRevenue,
    });
  };

  /* ================= FILTER ================= */
  const applyFilters = () => {
    if (!statusFilter) {
      // 🔥 no filter → show all
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (o) => o.deliveryStatus === statusFilter
      );
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [month, year]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, allOrders]);

  /* ================= UPDATE ================= */
const updateStatus = async (id, deliveryStatus) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}orders/qr-delivery-status/${id}`,
      { deliveryStatus },
      { headers: { Authorization: `Bearer ${storeToken}` } }
    );

    const updatedOrder = data.order; // 🔥 from backend

    toast.success(data.message || "Status updated");

    setAllOrders(prev => {
      const index = prev.findIndex(o => o._id === id);
      if (index === -1) return prev;

      const newOrders = [...prev];
      newOrders[index] = updatedOrder;

      calculateAnalytics(newOrders);
      return newOrders;
    });

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update status");
    toast.warning("Please refresh to see the latest status");
  }
};

const cancelOrder = async (id) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}orders/cancel-qr-delivery/${id}`,
      {},
      { headers: { Authorization: `Bearer ${storeToken}` } }
    );

    const updatedOrder = data.order; // 🔥 backend truth

    toast.success(data.message || "Order cancelled");

    setAllOrders(prev => {
      const index = prev.findIndex(o => o._id === id);
      if (index === -1) return prev;

      const newOrders = [...prev];
      newOrders[index] = updatedOrder;

      calculateAnalytics(newOrders);
      return newOrders;
    });

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel orders");
  }
};

  /* ================= UI ================= */
  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h2 className="font-semibold text-lg">🚚 Delivery Orders Analytics</h2>

        <div className="flex items-center gap-2 px-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            min="2023"
            max={new Date().getFullYear()}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded-md px-3 py-1 w-24 text-sm"
          />

          <button
            onClick={fetchMonthlyData}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics */}
      <DeliveryAnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={(filter) => {
          // 🔥 "all" → no filter
          setStatusFilter(filter === "all" ? "" : filter);
        }}
      />

      <hr className="my-4" />

      {/* Orders */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredOrders.length === 0 ? (
        <EmptyStateMessage message="No QR Delivery orders found" />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((o) => (
            <DeliveryOrderCard
              key={o._id}
              order={o}
              setOrders={setFilteredOrders}
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

export default MonthlyDeliveryAnalytics;