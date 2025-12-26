import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Edit,
  Trash2,
  Image,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import EditItemModal from "./EditItemModel";
import VariantManager from "./VariantManager";
import UploadItemImage from "./UploadItemImage";
import VariantEditButton from "./VariantEditButton";
import VariantDeleteButton from "./VariantDeleteButton";
import VariantToggleButton from "./VariantToggleButton";
import Loading from "./Loading";

const ItemList = ({ items, onRefresh }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVariantManager, setShowVariantManager] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [variantData, setVariantData] = useState({ name: "", price: "" });
  const [confirmDelete, setConfirmDelete] = useState({
  visible: false,
  itemId: null,
  itemName: "",
});
  const [loading , setLoading] = useState(false);
  const [message , setMessage] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Toggle item availability
  const handleToggleAvailability = async (itemId, available) => {
    try {
      setLoading(true);
      setMessage("Working on it...");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/edit/available/${itemId}`,
        { available: !available },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Item marked as ${!available ? "available" : "unavailable"}`);
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
    finally{
      setLoading(false);
      setMessage("");
    }
  };


 // ✅ Delete item with custom popup
const handleDelete = async () => {
  if (!confirmDelete.itemId) return;
  try {
    setLoading(true);
    setMessage("Deleting Item...");
    await axios.delete(`${import.meta.env.VITE_BASE_URL}items/remove/${confirmDelete.itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success(`${confirmDelete.itemName} deleted successfully!`);
    setConfirmDelete({ visible: false, itemId: null, itemName: "" });
    onRefresh();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete item");
  }finally{
    setLoading(false);
    setMessage("");
  }
};


  // ✅ Add Variant
  const handleAddVariant = async () => {
    if (!variantData.name || !variantData.price) {
      toast.error("Please enter both name and price");
      return;
    }
    try {
      setLoading(true);
      setMessage("Adding new variant...");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}items/addvariant/${selectedItem._id}`,
        {
          variantName: variantData.name.trim(),
          price: parseFloat(variantData.price),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Variant added successfully!");
      setShowAddVariant(false);
      setVariantData({ name: "", price: "" });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add variant");
    }finally{
      setLoading(false);
      setMessage("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        No items found. Add some to get started!
      </div>
    );
  }

  return (
    <>
    {loading && <Loading message={message} /> }
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          className={`rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[450px] transition-all duration-300
          ${
            item.available
              ? "bg-orange-50"
              : "bg-gray-100 grayscale opacity-70 scale-[0.97]"
          }`}
        >
          <div className="flex flex-col flex-grow">
            <div className="relative">
              <img
                src={item.image || "/default-item.png"}
                alt={item.itemName}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              {!item.available ? (
                <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                  Unavailable
                </span>
              ) :  (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Available
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 break-words overflow-hidden">{item.itemName}</h3>
              <p className="text-gray-600 text-sm break-words">{item.description}</p>
            </div>

 {/* Variants */}
<div className="mt-3 flex-grow mb-2">
  <div className="flex justify-between items-center mb-1">
    <h4 className="font-medium text-gray-700 text-sm mb-1">Variants:</h4>
    <button
      className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-700 cursor-pointer"
      onClick={() => {
        setSelectedItem(item);
        setShowAddVariant(true);
      }}
    >
      <PlusCircle size={16} /> Add Variant
    </button>
  </div>

  <ul className="text-sm text-gray-900 space-y-0 ml-0 bg-orange-200 rounded-xl">
    {item.variants.length > 0 ? (
      item.variants.map((variant) => (
        <li
          key={variant._id}
          className={`flex justify-between items-center p-3 border-b border-orange-300 last:border-0 rounded-md relative transition-all duration-300 ${
            variant.available
              ? "bg-orange-200"
              : "bg-gray-200 grayscale opacity-70"
          }`}
        >
          <div className="w-5/3 flex items-center justify-between p-2 mr-10 last:border-0 ">
              <span className="font-medium">{variant.name}</span>
              <span className="ml-2 text-gray-700 font-semibold text-start">
                ₹{variant.price}
              </span>
          </div>

          {/* Availability Badge */}
          {
            !variant.available && <span
            className={`absolute top-[-7px] left-[-3px] text-[7px] px-2 py-1 rounded bg-red-600 text-white`}
          >
            Unavailable
          </span>
          }


          {/* Action Buttons */}
          <div className="flex gap-2 items-center ml-auto">
            <VariantEditButton
              item={item}
              variant={variant}
              onUpdated={onRefresh}
            />
            <VariantDeleteButton
              item={item}
              variant={variant}
              onUpdated={onRefresh}
            />
            <VariantToggleButton
              item={item}
              variant={variant}
              onUpdated={onRefresh}
            />
          </div>
        </li>
      ))
    ) : (
      <p className="text-red-700 italic p-2">No variants yet</p>
    )}
  </ul>
</div>

          </div>

          {/* Bottom Bar */}
            <div className="mt-auto pt-3 border-t flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowEditModal(true);
                  }}
                >
                  <Edit size={20} />
                </button>
                {/* <button
                  className="text-green-500 hover:text-green-600 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowVariantManager(true);
                  }}
                >
                  <ToggleRight size={20} />
                </button> */}
                <button
                  className="text-purple-500 hover:text-purple-600 cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowUploadImage(true);
                  }}
                >
                  <Image size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() =>
                    setConfirmDelete({
                      visible: true,
                      itemId: item._id,
                      itemName: item.itemName,
                    })
                  }
                >
                  <Trash2 size={20} />
                </button>

              </div>

              {/* ✅ Better Availability Toggle Button */}
              <button
                onClick={() => handleToggleAvailability(item._id, item.available)}
                className={`transition-all duration-300 rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 font-medium text-white shadow-md 
                  ${
                    item.available
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
              >
                {item.available ? (
                  <>
                    <ToggleRight size={22} /> <span>Available</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={22} /> <span>Unavailable</span>
                  </>
                )}
              </button>
            </div>

        </div>
      ))}
      {confirmDelete.visible && (
          <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Delete Item
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-red-600">
                  {confirmDelete.itemName}
                </span>
                ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    setConfirmDelete({ visible: false, itemId: null, itemName: "" })
                  }
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}


      {/* Modals */}
      {showEditModal && (
        <EditItemModal
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onUpdated={onRefresh}
        />
      )}
      {showVariantManager && (
        <VariantManager
          item={selectedItem}
          onClose={() => setShowVariantManager(false)}
          onUpdated={onRefresh}
        />
      )}
      {showUploadImage && (
        <UploadItemImage
          item={selectedItem}
          onClose={() => setShowUploadImage(false)}
          onUpdated={onRefresh}
        />
      )}
      {showAddVariant && (
        <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Variant for {selectedItem?.itemName}
            </h3>
            <input
              type="text"
              placeholder="Variant Name"
              value={variantData.name}
              onChange={(e) =>
                setVariantData({ ...variantData, name: e.target.value })
              }
              className="w-full border rounded-md p-2 mb-3"
            />
            <input
              type="number"
              placeholder="Price"
              value={variantData.price}
              onChange={(e) =>
                setVariantData({ ...variantData, price: e.target.value })
              }
              className="w-full border rounded-md p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddVariant(false)}
                className="px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVariant}
                className="px-3 py-1 rounded-md bg-pink-500 text-white hover:bg-pink-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ItemList;
