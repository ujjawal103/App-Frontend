import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditItemModal = ({ item, onClose, onUpdated }) => {
  const [itemName, setItemName] = useState(item?.itemName || "");
  const [description, setDescription] = useState(item?.description || "");
  const [categoryId, setCategoryId] = useState(item?.categoryId?._id || "");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const token = localStorage.getItem("token");


   useEffect(() => {
    setCategoryId(item?.categoryId?._id || "");
  }, [item]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    let newErrors = {};
    if (!itemName.trim()) newErrors.itemName = "Item name is required";
    if (!categoryId) newErrors.categoryId = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/edit/${item._id}`,
        {
          itemName: itemName.trim(),
          description: description.trim(),
          newCategoryId : categoryId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Item updated");
      onUpdated();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setServerError(data?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-11/12 max-w-md p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">
          Edit Item
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full mt-1 p-2 border rounded-md text-sm ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Loading..." : `${item?.categoryId?.name}`}
              </option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-xs text-red-600 mt-1">
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* ITEM NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className={`w-full mt-1 p-2 border rounded-md text-sm ${
                errors.itemName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.itemName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.itemName}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>

          {serverError && (
            <div className="text-sm text-red-600">{serverError}</div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-sm"
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
