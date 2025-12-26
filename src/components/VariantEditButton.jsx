import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Edit } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "./Loading";

const VariantEditButton = ({ item, variant, onUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(variant.name);
  const [price, setPrice] = useState(variant.price);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", price: "" });
  const token = localStorage.getItem("token");

  const handleEdit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", price: "" });

    // basic validation
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Variant name is required";
    if (!price || isNaN(price)) newErrors.price = "Valid price is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setMessage("Saving changes...");
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/editvariant/${item._id}/${variant._id}`,
        { variantName: name.trim(), price: parseFloat(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant updated");
      setShowModal(false);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update variant");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // Modal JSX
  const Modal = (
    <div className="pl-0 md:pl-65 fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Edit Variant
        </h3>

        <form onSubmit={handleEdit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Variant Name"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) setErrors({ ...errors, price: "" });
              }}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">{errors.price}</p>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading
                  ? "bg-pink-500 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              } transition`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {loading && <Loading message={message} />}

      {/* ✏️ Edit button */}
      <button
        className="text-blue-500 hover:text-blue-700 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <Edit size={18} />
      </button>

      {/* 🪄 Render modal using portal */}
      {showModal && ReactDOM.createPortal(Modal, document.body)}
    </>
  );
};

export default VariantEditButton;
