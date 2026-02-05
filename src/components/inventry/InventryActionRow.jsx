import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeftRight } from "lucide-react";

const InventoryActionsRow = ({ itemId, variant, onRefresh }) => {
  const [addQty, setAddQty] = useState("");
  const [reduceQty, setReduceQty] = useState("");
  const [threshold, setThreshold] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  /* ================= ADD STOCK ================= */
  const handleAddStock = async () => {
    const qty = Number(addQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      await axios.patch(
        `${BASE_URL}inventries/add/${itemId}/${variant._id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Stock added");
      setAddQty("");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add stock");
    }
  };

  /* ================= REDUCE STOCK ================= */
  const handleReduceStock = async () => {
    const qty = Number(reduceQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      await axios.patch(
        `${BASE_URL}inventries/reduce/${itemId}/${variant._id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Stock reduced");
      setReduceQty("");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reduce stock");
    }
  };

  /* ================= UPDATE THRESHOLD ================= */
  const handleUpdateThreshold = async () => {
    const value = Number(threshold);
    if (!Number.isInteger(value) || value < 0) {
      return toast.error("Invalid threshold value");
    }

    try {
      await axios.patch(
        `${BASE_URL}inventries/threshold/${itemId}/${variant._id}`,
        { lowThreshold: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Threshold updated");
      setThreshold("");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update threshold");
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs mt-2">

      {/* 🔹 ROW 1 — ADD ↔️ REDUCE */}
      <div className="flex items-center justify-between gap-2">

        {/* ➕ ADD */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            placeholder="+ Qty"
            value={addQty}
            onChange={(e) => setAddQty(e.target.value)}
            className="border rounded px-2 py-1 w-20"
          />
          <button
            onClick={handleAddStock}
            className="bg-emerald-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>

        {/* ↔️ SEPARATOR ICON */}
        <ArrowLeftRight size={16} className="text-gray-400 shrink-0" />

        {/* ➖ REDUCE */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            placeholder="- Qty"
            value={reduceQty}
            onChange={(e) => setReduceQty(e.target.value)}
            className="border rounded px-2 py-1 w-20"
          />
          <button
            onClick={handleReduceStock}
            className="bg-rose-600 text-white px-2 py-1 rounded"
          >
            Reduce
          </button>
        </div>
      </div>

      {/* 🔹 ROW 2 — FULL WIDTH THRESHOLD */}
      <div className="flex gap-1 w-full">
        <input
          type="number"
          min="0"
          placeholder="Low stock threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="flex-1 border rounded py-1 pl-1"
        />
        <button
          onClick={handleUpdateThreshold}
          className="bg-pink-600 text-white px-5  py-1 rounded whitespace-nowrap"
        >
          Set low Stock Alert
        </button>
      </div>
    </div>
  );
};

export default InventoryActionsRow;
