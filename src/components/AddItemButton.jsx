import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddItemButton = ({ onAdd, fetchCategories }) => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [itemData, setItemData] = useState({
    itemName: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchLocalCategories = async () => {
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

  /* ---------------- OPEN MODAL ---------------- */
  const openModal = () => {
    setShowModal(true);
    fetchLocalCategories();
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors = {};

    if (!itemData.itemName.trim())
      newErrors.itemName = "Item name is required.";

    if (!itemData.categoryId)
      newErrors.categoryId = "Please select a category.";

    if (!itemData.price)
      newErrors.price = "Price is required.";
    else if (parseFloat(itemData.price) <= 0)
      newErrors.price = "Price must be greater than zero.";

    return newErrors;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onAdd(itemData);

    setItemData({
      itemName: "",
      description: "",
      price: "",
      categoryId: "",
    });

    setShowModal(false);
    fetchCategories?.(); // refresh category bar if needed
  };

  /* ---------------- MODAL ---------------- */
  const Modal = (
    <div className="pl-0 md:pl-65 fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add New Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">

          {/* CATEGORY */}
          <div>
            <select
              value={itemData.categoryId}
              onChange={(e) =>
                setItemData({ ...itemData, categoryId: e.target.value })
              }
              className={`w-full border p-2 rounded-md focus:outline-none ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "Select Category"}
              </option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* ITEM NAME */}
          <div>
            <input
              type="text"
              placeholder="Item Name"
              value={itemData.itemName}
              onChange={(e) =>
                setItemData({ ...itemData, itemName: e.target.value })
              }
              className={`w-full border p-2 rounded-md focus:outline-none ${
                errors.itemName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.itemName}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              placeholder="Description"
              value={itemData.description}
              onChange={(e) =>
                setItemData({ ...itemData, description: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
            />
          </div>

          {/* PRICE */}
          <div>
            <input
              type="number"
              placeholder="Price"
              value={itemData.price}
              onChange={(e) =>
                setItemData({ ...itemData, price: e.target.value })
              }
              className={`w-full border p-2 rounded-md focus:outline-none ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1 rounded bg-pink-600 text-white hover:bg-pink-700 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={openModal}
        className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
      >
        <Plus size={18} /> Add Item
      </button>

      {showModal && ReactDOM.createPortal(Modal, document.body)}
    </>
  );
};

export default AddItemButton;
