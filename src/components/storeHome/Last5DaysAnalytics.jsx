import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import LoadingSkeleton from "../orders/LoadingSkeleton";
import DayAnalyticsCard from "./DayAnalyticsCard";

const Last5DaysAnalytics = () => {
  const [daysData, setDaysData] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  // 📆 Generate last 5 dates (oldest → today)
  const getLast5Dates = () => {
    const dates = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(new Date(d));
    }
    return dates;
  };

  // 🔥 Fetch orders for each date
  const fetchLast5DaysData = async () => {
    try {
      setLoading(true);
      const dates = getLast5Dates();

      const results = await Promise.all(
        dates.map(async (date) => {
          const formattedDate = date.toISOString().split("T")[0];

          try {
            const { data } = await axios.get(
              `${BASE_URL}orders/store-orders/date?date=${formattedDate}`,
              { headers: { Authorization: `Bearer ${storeToken}` } }
            );

            const orders = data.orders || [];
            const totalOrders = orders.length;

            const totalRevenue = orders.reduce(
              (sum, o) =>
                ["confirmed", "completed"].includes(o.status)
                  ? sum + (o.totalAmount || 0)
                  : sum,
              0
            );

            return {
              date,
              totalOrders,
              totalRevenue,
            };
          } catch {
            return {
              date,
              totalOrders: 0,
              totalRevenue: 0,
            };
          }
        })
      );

      setDaysData(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLast5DaysData();
  }, []);

  useEffect(() => {
  if (!scrollRef.current) return;

  // only auto-scroll on small screens
  if (window.innerWidth < 768) {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: "smooth",
    });
  }
}, [daysData]);


  if (loading) return <LoadingSkeleton />;

  return (
    <div className="px-2 md:px-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        📊 Last 5 Days Performance
      </h3>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-7 overflow-x-auto no-scrollbar "
      >
        {daysData.map((day, index) => (
          <DayAnalyticsCard key={index} data={day} />
        ))}
      </div>
    </div>
  );
};

export default Last5DaysAnalytics;