import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import SettlementAnalyticsSection from "../components/settlement/SettlementAnalyticsSection";
import OrderCard from "../components/orders/OrderCard";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";



const StoreSettlements = () => {
  const [settlement, setSettlement] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(
    new Date(Date.now() - 86400000).toISOString().split("T")[0]
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const fetchSettlement = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}settlements/store?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSettlement(data.settlement);
      setOrders(data.settlement?.orderIds || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load settlement");
      setSettlement(null);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlement();
  }, [date]);

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* DATE PICKER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">💳 QR Settlements</h2>
        <input
          type="date"
          value={date}
          max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          className="border p-2 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : !settlement ? (
        <EmptyStateMessage message="No settlement available for this date" />
      ) : (
        <>
          <SettlementAnalyticsSection settlement={settlement} />

          <hr className="my-4" />

          <div className="flex md:flex-row justify-between md:items-center mb-4 gap-2">
            <div>
                <h2 className="text-lg font-semibold">Orders</h2>
            </div>

            <div className="flex items-center gap-2">
                <button
                onClick={fetchSettlement}
                className="bg-pink-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-pink-700 transition"
                >
                Refresh
                </button>
            </div>
        </div>


          <div className="space-y-3">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        </>
      )}

      <FooterNavStore />
    </div>
  );
};


export default StoreSettlements