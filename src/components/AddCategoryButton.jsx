import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddCategoryButton = ({ onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}categories/add`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Category added successfully");
      setCategoryName("");
      setError("");
      setShowModal(false);
      onSuccess?.(); // refresh categories
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const Modal = (
    <div className="pl-0 md:pl-65 fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setError("");
            }}
            className={`w-full border p-2 rounded-md focus:outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 rounded bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add"}
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
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
          bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700"
      >
        <Plus size={16} />
        Categories
      </button>

      {showModal && ReactDOM.createPortal(Modal, document.body)}
    </>
  );
};

export default AddCategoryButton;
