import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InventoryActionsRow from "./InventryActionRow";

const InventoryVariantCard = ({
  item,
  variant,
  handleTrackingForAVariant,
  fetchInventory,
}) => {
  const [showActions, setShowActions] = useState(false);

  const isLowStock =
    variant.trackInventory &&
    variant.stock.quantity <= variant.stock.lowThreshold;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">

      {/* 🔝 Top Row */}
      <div className="flex gap-3 items-center">
        <img
          src={item.image}
          alt={item.itemName}
          className="w-14 h-14 rounded-md object-cover"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-sm">{item.itemName}</h3>
          <p className="text-xs text-gray-500">
            {variant.name} • ₹{variant.price}
          </p>
          <p className="text-xs text-gray-400">
            Category: {item.categoryId?.name || "—"}
          </p>
        </div>

        {/* Availability Badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            variant.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {variant.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* 📊 Stock Info */}
      <div className="grid grid-cols-3 text-xs gap-2 items-center">
        <div>
          <p className="text-gray-500">Stock</p>
          <p className={`font-semibold ${isLowStock ? "text-red-600" : ""}`}>
            {variant.stock.quantity}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Stock Alert</p>
          <p className="font-semibold">{variant.stock.lowThreshold}</p>
        </div>

        {/* 🔘 Track Inventory Toggle */}
        <div>
          <p className="text-gray-500 mb-1">Tracking</p>
          <button
            onClick={() =>
              handleTrackingForAVariant(
                "toggleTracking",
                item._id,
                variant._id,
                !variant.trackInventory
              )
            }
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              ${variant.trackInventory ? "bg-emerald-500" : "bg-gray-300"}
            `}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${variant.trackInventory ? "translate-x-4" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      </div>

      {/* 👇 VIEW / HIDE ACTIONS TOGGLE */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowActions((prev) => !prev)}
          className="text-xs text-pink-600 font-medium hover:underline"
        >
          {showActions ? "Hide actions" : "View actions"}
        </button>
      </div>

      {/* ⚙️ Animated Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <InventoryActionsRow
              itemId={item._id}
              variant={variant}
              onRefresh={fetchInventory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryVariantCard;
