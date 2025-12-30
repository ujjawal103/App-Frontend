import React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import AddCategoryButton from "./AddCategoryButton";
import { useState } from "react";
import DeleteCategoryConfirmModal from "./DeleteCategoryConfirmModal";



const CategoryFilterBar = ({
  categories = [],
  activeCategory,
  onSelect,
  onDelete,
  onAddCategory,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);


  return (
    <div className="mb-2 ml-1">
      {/* 👉 SINGLE SCROLLABLE ROW */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">

        {/* ➕ ADD CATEGORY */}
        <AddCategoryButton onSuccess={onAddCategory} />


        {/* ALL */}
        <button
          onClick={() => onSelect("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border
            ${
              activeCategory === "all"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          All
        </button>

        {/* DYNAMIC CATEGORIES */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat._id;

          return (
            <div
              key={cat._id}
              onClick={() => onSelect(cat._id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-pink-600 cursor-pointer
                ${
                  isActive
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-yellow-50 text-gray-700 border-gray-300"
                }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {cat.name}
              </span>

              {/* ICON LOGIC */}
              {isActive ? (
                /* ❌ CLEAR FILTER */
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect("all");
                  }}
                  className="rounded-full p-1 hover:bg-pink-700"
                  title="Clear filter"
                >
                  <X size={14} />
                </button>
              ) : (
                /* 🗑️ DELETE CATEGORY */
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setShowDeleteModal(true);
                  }}
                  className="rounded-full p-1 text-red-500 hover:text-red-600 hover:bg-gray-300"
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>

              )}
            </div>
          );
        })}
      </div>


      <DeleteCategoryConfirmModal
        isOpen={showDeleteModal}
        categoryName={selectedCategory?.name}
        loading={deleting}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={async () => {
          setDeleting(true);
          await onDelete(selectedCategory._id);
          setDeleting(false);
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
      />

    </div>
  );
};

export default CategoryFilterBar;
