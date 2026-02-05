import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../components/orders/EmptyStateMessage";
import InventoryVariantCard from "../components/inventry/InventryVariantCard";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allTrackingEnabled , setAllTrackingEnabled] = useState();
  const [globalLoading, setGlobalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");


  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  /* ================================
     📦 Fetch Inventory
  ================================= */
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}inventries/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInventory(data.inventory || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch inventory"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  if (!inventory.length) {
    setAllTrackingEnabled(false);
    return;
  }

  const isAllEnabled = inventory.every(item =>
    item.variants.every(variant => variant.trackInventory === true)
  );

  setAllTrackingEnabled(isAllEnabled);
}, [inventory]);


  /* ================================
     🔘 Toggle Inventory Tracking (ALL)
  ================================= */
  const toggleAllTracking = async () => {
    try {
      setGlobalLoading(true);

      await axios.patch(
        `${BASE_URL}inventries/track`,
        { trackInventory: !allTrackingEnabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Inventory tracking ${allTrackingEnabled ? "disabled" : "enabled"} for all`
      );
      fetchInventory();
    } catch (err) {
      toast.error("Failed to toggle inventory tracking");
    } finally {
      setGlobalLoading(false);
    }
  };


  /* ================================
     ⚙️ Variant-level actions handler
  ================================= */
  const handleTrackingForAVariant = async (action, itemId, variantId, value) => {
    try {
      if (action === "toggleTracking") {
        await axios.patch(
          `${BASE_URL}inventries/track/${itemId}/${variantId}`,
          { trackInventory: value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          `Tracking ${value ? "enabled" : "disabled"}`
        );
        fetchInventory();
      }

      // 🔜 other actions (add / reduce / threshold) later
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update inventory"
      );
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);



  const filteredInventory = inventory
  .map(item => {
    const filteredVariants = item.variants.filter(variant => {
      // SEARCH
      const searchMatch =
        item.itemName.toLowerCase().includes(searchTerm) ||
        item.categoryId?.name?.toLowerCase().includes(searchTerm);

      if (!searchMatch) return false;

      // FILTERS
      if (activeFilter === "lowStock") {
        return (
          variant.trackInventory &&
          variant.stock.quantity <= variant.stock.lowThreshold
        );
      }

      if (activeFilter === "trackingOn") {
        return variant.trackInventory;
      }

      if (activeFilter === "trackingOff") {
        return !variant.trackInventory;
      }

      return true; // all
    });

    return filteredVariants.length
      ? { ...item, variants: filteredVariants }
      : null;
  })
  .filter(Boolean);











const FilterButton = ({ label, active, onClick }) => {
  const inactiveBorder =
    label === "Low Stock"
      ? "border-red-700 text-red-700"
      : label === "Enabled Tracking"
      ? "border-green-700 text-green-700"
      : "border-red-700 text-red-700";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border-2 transition
        ${
          active
            ? "bg-pink-600 text-white border-pink-600"
            : `${inactiveBorder} `
        }`}
    >
      <span>{label}</span>

      {/* ❌ Cross icon only when active */}
      {active && (
        <X
          size={14}
          className="text-white opacity-90 hover:opacity-100"
        />
      )}
    </button>
  );
};



  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* ================= HEADER ================= */}
      <div className="mb-4">

        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">📦 Inventory Dashboard</h2>
            <p className="text-gray-500 text-xs italic">
              Manage stock, thresholds & tracking per variant
            </p>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={fetchInventory}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
            >
              Refresh
            </button>

            {/* TOGGLE ALL TRACKING (DESKTOP) */}
            <div
              className={`flex items-center justify-between bg-gray-800 border
                ${allTrackingEnabled ? "border-green-500" : "border-red-500"}
                rounded-lg px-4 py-3 min-w-[240px]`}
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">
                  Inventory Tracking
                </span>
                <span
                  className={`font-semibold text-sm ${
                    allTrackingEnabled
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {allTrackingEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>

              <button
                onClick={toggleAllTracking}
                disabled={globalLoading}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300
                  ${allTrackingEnabled ? "bg-green-600" : "bg-gray-500"}
                  ${globalLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
                    transform transition-transform duration-300
                    ${allTrackingEnabled ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex flex-col gap-3 mt-3">

          <button
            onClick={fetchInventory}
            className="bg-blue-600 text-white py-2 rounded-md text-sm"
          >
            Refresh
          </button>

          {/* TOGGLE ALL TRACKING (MOBILE) */}
          <div
            className={`flex items-center justify-between bg-gray-800 border
              ${allTrackingEnabled ? "border-green-500" : "border-red-500"}
              rounded-lg px-4 py-2`}
          >
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">
                Inventory Tracking
              </span>
              <span
                className={`font-semibold text-sm ${
                  allTrackingEnabled
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {allTrackingEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            <button
              onClick={toggleAllTracking}
              disabled={globalLoading}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300
                ${allTrackingEnabled ? "bg-green-600" : "bg-gray-500"}
                ${globalLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md
                  transform transition-transform duration-300
                  ${allTrackingEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>
      </div>


      <hr className="my-4" />

      {/* ================= FILTER BAR ================= */}
      <div className="mb-4 flex items-center gap-3">

        {/* ALL (fixed) */}
        <button
          onClick={() => {
            setActiveFilter("all");
            setSearchTerm("");
          }}
          className="shrink-0 bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium"
        >
          All
        </button>

        {/* SCROLLABLE AREA */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="min-w-[220px] px-3 py-2 border rounded-full text-sm outline-pink-600 focus:ring-0 focus:ring-pink-500"
          />

          {/* LOW STOCK */}
          <FilterButton
            label="Low Stock"
            active={activeFilter === "lowStock"}
            onClick={() =>
              setActiveFilter(
                activeFilter === "lowStock" ? "all" : "lowStock"
              )
            }
          />

          {/* TRACKING ON */}
          <FilterButton
            label="Enabled Tracking"
            active={activeFilter === "trackingOn"}
            onClick={() =>
              setActiveFilter(
                activeFilter === "trackingOn" ? "all" : "trackingOn"
              )
            }
          />

          {/* TRACKING OFF */}
          <FilterButton
            label="Disabled Tracking"
            active={activeFilter === "trackingOff"}
            onClick={() =>
              setActiveFilter(
                activeFilter === "trackingOff" ? "all" : "trackingOff"
              )
            }
          />
        </div>
      </div>


      {/* ================= CONTENT ================= */}
      {loading ? (
        <LoadingSkeleton />
      ) : inventory.length === 0 ? (
        <EmptyStateMessage message="No inventory items found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {filteredInventory.map((item) =>
            item.variants.map((variant) => (
              <InventoryVariantCard
                key={variant._id}
                item={item}
                variant={variant}
                handleTrackingForAVariant={handleTrackingForAVariant}
                fetchInventory={fetchInventory}
              />
            ))
          )}
        </div>
      )}

      <FooterNavStore />
    </div>
  );
};

export default InventoryDashboard;
