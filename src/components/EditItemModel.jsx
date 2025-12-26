import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditItemModal = ({ item, onClose, onUpdated }) => {
  const [itemName, setItemName] = useState(item?.itemName || "");
  const [description, setDescription] = useState(item?.description || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ itemName: "", description: "" });
  const [serverError, setServerError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ itemName: "", description: "" });
    setServerError("");

    // basic validation
    let newErrors = {};
    if (!itemName.trim()) newErrors.itemName = "Item name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/edit/${item._id}`,
        { itemName: itemName.trim(), description: description.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Item updated");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("EditItemModal Error:", err);
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors) && data.errors.length) {
        setServerError(data.errors[0].msg || JSON.stringify(data.errors));
      } else if (data?.message) {
        setServerError(data.message);
      } else {
        setServerError("Failed to update item");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-11/12 max-w-md p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-pink-600">Edit Item</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                if (errors.itemName) setErrors({ ...errors, itemName: "" });
              }}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
              placeholder="e.g. Chili Potato"
            />
            {errors.itemName && (
              <p className="text-xs text-red-600 mt-1">{errors.itemName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          {serverError && (
            <div className="text-sm text-red-600">{serverError}</div>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white text-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
