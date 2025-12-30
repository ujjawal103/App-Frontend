import React from "react";
import { X } from "lucide-react";

const CategoryFilterQRBar = ({
  categories = [],
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="mb-3 mx-1">
      {/* 👉 SINGLE SCROLLABLE ROW */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">

        {/* ALL */}
        <button
          onClick={() => onSelect("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border
            ${
              activeCategory === "all"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-yellow-50 text-gray-700 hover:text-white border-pink-600 hover:bg-pink-600"
            }`}
        >
          All
        </button>

        {/* CATEGORIES */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat._id;

          return (
            <div
              key={cat._id}
              onClick={() =>
                onSelect(isActive ? "all" : cat._id)
              }
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-pink-600 cursor-pointer
                ${
                  isActive
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-yellow-50 text-gray-700 hover:text-white hover:bg-pink-600"
                }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {cat.name}
              </span>

              {/* ❌ CLEAR FILTER (ONLY WHEN ACTIVE) */}
              {isActive && (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilterQRBar;
