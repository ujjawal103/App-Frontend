import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeftRight, Loader2 } from "lucide-react";

const InventoryActionsRow = ({ itemId, variant, onRefresh }) => {
  const [addQty, setAddQty] = useState("");
  const [reduceQty, setReduceQty] = useState("");
  const [threshold, setThreshold] = useState("");

  const [adding, setAdding] = useState(false);
  const [reducing, setReducing] = useState(false);
  const [updatingThreshold, setUpdatingThreshold] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  /* ================= ADD STOCK ================= */
  const handleAddStock = async () => {
    const qty = Number(addQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      setAdding(true);

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
    } finally {
      setAdding(false);
    }
  };

  /* ================= REDUCE STOCK ================= */
  const handleReduceStock = async () => {
    const qty = Number(reduceQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      setReducing(true);

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
    } finally {
      setReducing(false);
    }
  };

  /* ================= UPDATE THRESHOLD ================= */
  const handleUpdateThreshold = async () => {
    const value = Number(threshold);
    if (!Number.isInteger(value) || value < 0) {
      return toast.error("Invalid threshold value");
    }

    try {
      setUpdatingThreshold(true);

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
    } finally {
      setUpdatingThreshold(false);
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
            disabled={adding}
          />
          <button
            onClick={handleAddStock}
            disabled={adding}
            className="bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-60"
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : "Add"}
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
            disabled={reducing}
          />
          <button
            onClick={handleReduceStock}
            disabled={reducing}
            className="bg-rose-600 text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-60"
          >
            {reducing ? <Loader2 size={14} className="animate-spin" /> : "Reduce"}
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
          className="flex-1 border rounded py-1 pl-2"
          disabled={updatingThreshold}
          required
        />
        <button
          onClick={handleUpdateThreshold}
          disabled={updatingThreshold}
          className="bg-pink-600 text-white px-5 py-1 rounded whitespace-nowrap flex items-center gap-1 disabled:opacity-60"
        >
          {updatingThreshold ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Set Low stock Alert"
          )}
        </button>
      </div>
    </div>
  );
};

export default InventoryActionsRow;
