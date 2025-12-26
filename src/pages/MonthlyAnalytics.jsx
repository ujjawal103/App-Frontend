import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import AnalyticsSection from "../components/orders/AnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import { Loader2 } from "lucide-react";

const MonthlyAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  // ✅ Fetch Monthly Data
  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}orders/store-orders/month?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );

      const fetchedOrders = data.orders || [];
      setAllOrders(fetchedOrders);
      calculateAnalytics(fetchedOrders);
      computeTopItems(fetchedOrders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch monthly analytics");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate Analytics
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

  // ✅ Compute Top Items
  const computeTopItems = (orders) => {
    const itemOrderCount = {};
    orders.forEach((order) => {
      if (
        Array.isArray(order.items) &&
        ["confirmed", "completed"].includes(order.status)
      ) {
        const uniqueItems = new Set();
        order.items.forEach((item) => {
          const itemId = item.itemId;
          const itemName = item?.itemName || "Unnamed Item";
          if (itemId && !uniqueItems.has(itemId)) {
            uniqueItems.add(itemId);
            if (!itemOrderCount[itemId]) {
              itemOrderCount[itemId] = { itemId, itemName, numberOfOrders: 1 };
            } else {
              itemOrderCount[itemId].numberOfOrders += 1;
            }
          }
        });
      }
    });

    const topItemsArray = Object.values(itemOrderCount)
      .sort((a, b) => b.numberOfOrders - a.numberOfOrders)
      .slice(0, 5);
    setTopItems(topItemsArray);
  };

  // ✅ Apply Filter
  const applyFilters = () => {
    if (!statusFilter) return setFilteredOrders([]);

    let filtered = [...allOrders];
    if (statusFilter === "all") {
      setFilteredOrders(filtered); // show all
    } else {
      filtered = filtered.filter((o) => o.status === statusFilter);
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [month, year]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, allOrders]);

  // ✅ Update & Cancel Order
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
      toast.success(`Status updated to '${status}'`);
      fetchMonthlyData();
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
      fetchMonthlyData();
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
    fetchMonthlyData();
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h2 className="font-semibold text-lg">📅 Monthly Analytics</h2>

        <div className="flex items-center gap-2 px-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-md px-3 cursor-pointer py-1 text-sm"
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
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-xs mb-4 italic">
        Showing analytics for{" "}
        {new Date(year, month - 1).toLocaleString("default", {
          month: "long",
        })}{" "}
        {year}
      </p>

      {/* Analytics Section */}
      <AnalyticsSection
        analytics={analytics}
        statusFilter={statusFilter}
        onFilter={(filter) => {
          // 🧠 if "total orders" clicked → set filter to "all"
          if (filter === "total") setStatusFilter("all");
          else setStatusFilter(filter);
        }}
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


      {/* Conditional Render */}
      {loading ? (
        <LoadingSkeleton />
      ) : !statusFilter ? (
        // 🏆 Default: Leaderboard
        <>
          <h3 className="font-semibold text-md mb-3">🏆 Top Items Leaderboard</h3>
          {topItems.length === 0 ? (
            <EmptyStateMessage message="Top items not available !" />
          ) : (
            <div className="space-y-3">
              {topItems.map((item, index) => {
                const colors = [
                  { bg: "bg-yellow-100", text: "text-yellow-600" },
                  { bg: "bg-gray-200", text: "text-gray-600" },
                  { bg: "bg-orange-100", text: "text-orange-600" },
                  { bg: "bg-blue-100", text: "text-blue-600" },
                  { bg: "bg-green-100", text: "text-green-600" },
                ];
                const color = colors[index] || colors[4];
                return (
                  <div
                    key={item.itemId}
                    className={`flex justify-between items-center ${color.bg} px-4 py-3 rounded-xl shadow-sm border border-gray-100`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 p-5 flex items-center justify-center rounded-full font-bold text-xl bg-white ${color.text}`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 max-w-[50vw] overflow-hidden">
                          {item.itemName}
                        </h4>
                        <p className="text-xs text-gray-500 tracking-wide">
                          Performing item of the month
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        {item.numberOfOrders}
                      </p>
                      <p className="text-xs text-gray-500">orders</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : filteredOrders.length === 0 ? (
          <EmptyStateMessage message={`No ${statusFilter === "all" ? "orders" : statusFilter + " orders"}`} />
      ) : (
        // 🧾 Show Filtered or All Orders
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

export default MonthlyAnalytics;
