import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VariantDeleteButton = ({ item, variant, onUpdated }) => {
  const token = localStorage.getItem("token");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}items/removevariant/${item._id}/${variant._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant removed");
      setConfirmDelete(false);
      onUpdated();
    } catch (err) {
      console.error("RemoveVariant Error:", err);
      toast.error(err.response?.data?.message || "Failed to remove variant");
    } finally {
      setLoading(false);
    }
  };

  const Popup = (
    <div className="pl-0 md:pl-65 fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Remove Variant
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-red-600">
            {variant.variantName}
          </span>{" "}
          ?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            className={`px-4 py-2 rounded-md text-white ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } transition`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="text-red-500 hover:text-red-700 cursor-pointer"
        onClick={() => setConfirmDelete(true)}
      >
        <Trash2 size={18} />
      </button>

      {/* Render modal globally using Portal */}
      {confirmDelete &&
        ReactDOM.createPortal(Popup, document.body)}
    </>
  );
};

export default VariantDeleteButton;
