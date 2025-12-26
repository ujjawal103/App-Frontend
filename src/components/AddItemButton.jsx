import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Plus } from "lucide-react";

const AddItemButton = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemData, setItemData] = useState({
    itemName: "",
    description: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!itemData.itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!itemData.price) newErrors.price = "Price is required.";
    else if (parseFloat(itemData.price) <= 0)
      newErrors.price = "Price must be greater than zero.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onAdd(itemData);
    setItemData({ itemName: "", description: "", price: "" });
    setShowModal(false);
  };

  const Modal = (
    <div className="pl-0 md:pl-65 fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          {/* Item Name */}
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
              <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Description"
              value={itemData.description}
              onChange={(e) =>
                setItemData({ ...itemData, description: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
            ></textarea>
          </div>

          {/* Price */}
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
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Buttons */}
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
              className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
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
        onClick={() => setShowModal(true)}
        className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
      >
        <Plus size={18} /> Add Item
      </button>

      {/* Global modal using Portal to stay above everything */}
      {showModal && ReactDOM.createPortal(Modal, document.body)}
    </>
  );
};

export default AddItemButton;
