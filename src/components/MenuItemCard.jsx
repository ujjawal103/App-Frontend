import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MenuItemCard = ({ item, addToCart, updateQuantity, cart }) => {
  const [expanded, setExpanded] = useState(false);

  // First available variant shown by default
  const firstVariant = item.variants.find((v) => v.available);
  const availableVariants = item.variants.filter((variant) => variant.available);

  const getCartQuantity = (variantName) => {
    const c = cart.find(
      (i) => i.itemId === item._id && i.variant === variantName
    );
    return c?.quantity || 0;
  };

  const handleCardClick = (e) => {
    // Prevent toggle if clicking inside a button or its children
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm p-3 mb-3 transition-all duration-300 ${
        !item.available ? "grayscale opacity-70" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Not Available Label */}
      {!item.available && (
        <span className="absolute top-[-4px] left-[-2px] bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded">
          Not Available
        </span>
      )}

      <div className="flex items-center justify-between">
        {/* Image */}
        <img
          src={item.image}
          alt={item.itemName}
          className="w-16 h-16 rounded-lg object-cover"
        />

        {/* Details */}
        <div className="flex-1 ml-3 mr-2 max-w-[calc(100%-4rem)]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm overflow-hidden w-[50vw]">
              {item.itemName}
            </h3>

            {/* Variant Arrow or Label */}
            {availableVariants.length > 1 ? (
              <button
                className="text-gray-600 cursor-pointer"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            ) : (
              <span className="text-xs text-gray-500 font-medium">
                {availableVariants[0]?.name}
              </span>
            )}
          </div>

          {/* Price + Controls for first variant */}
          {firstVariant && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-semibold">
                ₹{firstVariant.price}{" "}
                {availableVariants.length > 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({firstVariant.name})
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2 pointer-cursor">
                {!getCartQuantity(firstVariant.name) ? (
                  <button
                    onClick={() => addToCart(item, firstVariant)}
                    disabled={!firstVariant.available}
                    className={`px-3 py-1 rounded text-sm cursor-pointer ${
                      firstVariant.available
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    + Add
                  </button>
                ) : (
                  <div className="flex items-center border rounded-md px-2 py-1 bg-gray-50">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, firstVariant.name, -1)
                      }
                      className="px-2 text-lg font-semibold text-blue-600 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm font-medium">
                      {getCartQuantity(firstVariant.name)}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, firstVariant.name, +1)
                      }
                      className="px-2 text-lg font-semibold text-blue-600 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Variants */}
      {expanded && availableVariants.length > 1 && (
        <div className="mt-3 pl-[4.5rem] space-y-2 border-t pt-2">
          {availableVariants.slice(1).map((variant, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center pr-2 ${
                !variant.available ? "opacity-60 grayscale" : ""
              }`}
            >
              <span className="text-sm font-medium">
                {variant.name} - ₹{variant.price}
              </span>

              <div className="flex items-center gap-2">
                {!getCartQuantity(variant.name) ? (
                  <button
                    onClick={() => addToCart(item, variant)}
                    disabled={!variant.available}
                    className={`px-3 py-1 rounded text-sm cursor-pointer ${
                      variant.available
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    + Add
                  </button>
                ) : (
                  <div className="flex items-center border rounded-md px-2 py-1 bg-gray-50">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, variant.name, -1)
                      }
                      className="px-2 text-lg font-semibold text-blue-600 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm font-medium">
                      {getCartQuantity(variant.name)}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, variant.name, +1)
                      }
                      className="px-2 text-lg font-semibold text-blue-600 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;
