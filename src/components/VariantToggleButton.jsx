import React, { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VariantToggleButton = ({ item, variant, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const toggleVariant = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/editvariant/available/${item._id}/${variant._id}`,
        { available: !variant.available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Availability updated");
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update variant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={toggleVariant}
      className={`${variant.available ? "text-green-500" : "text-gray-400"} hover:opacity-80 cursor-pointer`}
    >
      {variant.available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
    </button>
  );
};

export default VariantToggleButton;
