import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FIELD_CONFIG = {
  baseDeliveryCharge: {
    label: "Base Delivery Charge",
    api: "delivery/update-base-charge",
    prefix: "₹"
  },
  pricePerKm: {
    label: "Price Per KM",
    api: "delivery/update-price-per-km",
    prefix: "₹",
    suffix: "/km"
  },
  minimumOrderAmount: {
    label: "Minimum Order Amount",
    api: "delivery/update-minimum-order",
    prefix: "₹"
  },
  maxDeliveryDistanceKm: {
    label: "Max Delivery Distance",
    api: "delivery/update-max-delivery-distance",
    suffix: "km"
  }
};

const DeliveryPricingCard = ({ settings }) => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [form, setForm] = useState({
    baseDeliveryCharge: 0,
    pricePerKm: 0,
    minimumOrderAmount: 0,
    maxDeliveryDistanceKm: 0
  });

  const [editing, setEditing] = useState(null);
  const [loadingField, setLoadingField] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const updateField = async (field) => {

    const { api } = FIELD_CONFIG[field];

    try {

      setLoadingField(field);

      await axios.patch(
        `${API}${api}`,
        { [field]: form[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Updated successfully");
      setEditing(null);

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to update");

    } finally {
      setLoadingField(null);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(settings);
  };

  return (
    <div className="bg-white shadow-sm border rounded-xl p-6">

      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Delivery Pricing
      </h2>

      <div className="space-y-5">

        {Object.entries(FIELD_CONFIG).map(([field, config]) => (

          <div
            key={field}
            className="flex items-end justify-between border-b pb-4"
          >

            {/* LEFT SIDE */}
            <div>

              <p className="text-sm text-gray-500">
                {config.label}
              </p>

              <AnimatePresence mode="wait">

                {editing === field ? (

                  <motion.input
                    key="input"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    type="number"
                    value={form[field]}
                    onChange={(e) =>
                      handleChange(field, e.target.value)
                    }
                    className="border rounded-md px-2 text-sm w-24 h-8 mt-1"
                  />

                ) : (

                  <motion.p
                    key="value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium text-sm"
                  >
                    {config.prefix || ""}
                    {form[field]}
                    {config.suffix ? ` ${config.suffix}` : ""}
                  </motion.p>

                )}

              </AnimatePresence>

            </div>

            {/* RIGHT SIDE BUTTONS */}

            <div className="flex items-end gap-2">

              <AnimatePresence mode="wait">

                {editing === field ? (

                  <motion.div
                    key="buttons"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-2"
                  >

                    <button
                      onClick={() => updateField(field)}
                      disabled={loadingField === field}
                      className="flex items-center justify-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 h-8 rounded-md"
                    >
                      <Check size={14} />
                      {loadingField === field ? "..." : "Save"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="flex items-center justify-center gap-1 bg-gray-200 text-gray-700 text-xs px-3 h-8 rounded-md"
                    >
                      <X size={14} />
                      Cancel
                    </button>

                  </motion.div>

                ) : (

                  <motion.button
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditing(field)}
                    className="flex items-center gap-1 text-pink-600 text-sm"
                  >
                    <Pencil size={14} />
                    Edit
                  </motion.button>

                )}

              </AnimatePresence>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DeliveryPricingCard;