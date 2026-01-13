import React, { useEffect, useState } from "react";
import axios from "axios";
import TopItemCardSkeleton from "./TopItemCardSkeleton";
import EmptyStateMessage from "../orders/EmptyStateMessage";
import TopItemCard from "./TopItemCard";

const MonthlyTopItems = () => {
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  // 🔥 Fetch only current month data
  const fetchTopItems = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${BASE_URL}orders/store-orders/month?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );

      const topTwo = computeTopItems(data.orders || []);
      await attachImages(topTwo);

    } catch (err) {
      console.error("Failed to fetch top items", err);
      setTopItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Compute Top 2 Items (PURE FUNCTION)
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
          const itemName = item.itemName || "Unnamed Item";

          if (itemId && !uniqueItems.has(itemId)) {
            uniqueItems.add(itemId);

            if (!itemOrderCount[itemId]) {
              itemOrderCount[itemId] = {
                itemId,
                itemName,
                orders: 1,
                image: null,
              };
            } else {
              itemOrderCount[itemId].orders += 1;
            }
          }
        });
      }
    });

    return Object.values(itemOrderCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5); // top 5 items
  };

  // 🖼️ Attach Image URL for each item
  const attachImages = async (items) => {
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const { data } = await axios.get(
              `${BASE_URL}orders/item-image/${item.itemId}`,
              { headers: { Authorization: `Bearer ${storeToken}` } }
            );

            return {
              ...item,
              image: data?.imageUrl || null,
            };
          } catch {
            return item; // fallback if image fetch fails
          }
        })
      );

      setTopItems(updatedItems);
    } catch (err) {
      console.error("Failed to attach images", err);
      setTopItems(items);
    }
  };

  useEffect(() => {
    fetchTopItems();
  }, []);

    if (loading) {
  return (
    <div className="px-2 md:px-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        🏆 Top Items This Month
      </h3>

      <div className="flex gap-4 overflow-x-auto no-scrollbar items-stretch">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-[172px] md:w-[237px] h-full shrink-0 flex"
          >
            <TopItemCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

  if (topItems.length === 0) {
    return <EmptyStateMessage message="Top items not available this month" />;
  }

  return (
    <div className="px-2 md:px-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        🏆 Top Items This Month
      </h3>


        <div className="flex gap-4 overflow-x-auto no-scrollbar items-stretch">
        {topItems.map((item, index) => (
          <div
            key={item.itemId}
            className="w-[172px] md:w-[237px] h-full shrink-0 flex"
          >
            <TopItemCard item={item} rank={index + 1} />
          </div>
        ))}
      </div>


    </div>
  );
};

export default MonthlyTopItems;
