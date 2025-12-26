import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import ItemList from "../components/ItemList";
import AddItemButton from "../components/AddItemButton";
import FooterNavStore from "../components/FooterNavStore";
import Loading from "../components/Loading";
import { Capacitor } from "@capacitor/core";
import { getStoreItems } from "../offline/storeItemsDB";
import { saveStoreItems } from "../offline/storeItemsDB";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [count, setCount] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ Fetch all store items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}items/store-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const itemsList = res.data.items || [];

    // ⭐ Online → update UI + save offline
      setItems(itemsList);
      setFilteredItems(itemsList);
      setCount(res.data.count || 0);

      await saveStoreItems(itemsList);
    } catch (error) {
      if (Capacitor.isNativePlatform()) {
      
            const cached = await getStoreItems();
      
            if (cached) {
      
              setItems(cached);
              setCount(cached.length);
              setFilteredItems(cached);
      
              return;
            }
          }
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new item
  const handleAddItem = async (newItem) => {
    try {
      setLoading(true);
      setMessage("Adding new item...");
      await axios.post(`${import.meta.env.VITE_BASE_URL}items/add`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item added successfully!");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // ✅ Live Search
  useEffect(() => {
    if (!searchItem.trim()) {
      setFilteredItems(items);
      return;
    }
    const filtered = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchItem, items]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      {loading && <Loading message={message} />}

      <div className=" min-h-screen bg-gray-100 md:pl-64 md:pt-8 p-4 mb-20 md:mb-0">
        {/* ✅ Fixed Header */}
        <div className="fixed flex justify-between items-center bg-pink-600 w-full top-0 left-0 md:pl-64 p-4 z-10 shadow-md">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            Your Menu Items
          </h1>
          <AddItemButton onAdd={handleAddItem} />
        </div>

        <div className="mt-20"></div>

        {/* ✅ Analytics + Search Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-pink-600">Menu Analytics</h2>
            <p className="text-gray-600 text-sm">
              Total Items:{" "}
              <span className="font-bold text-pink-600 text-lg">{count}</span>
            </p>
          </div>

          <div className="relative w-full sm:w-48 md:w-56">
            <Search className="absolute left-3 top-2.5 text-pink-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Item..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>

        {/* ✅ Item List */}
        <ItemList items={filteredItems} onRefresh={fetchItems} />
      </div>

      <FooterNavStore />
    </>
  );
};

export default ItemManagement;
