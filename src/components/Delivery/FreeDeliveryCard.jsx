import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FreeDeliveryCard = ({ settings }) => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [insideKm, setInsideKm] = useState(0);
  const [aboveAmount, setAboveAmount] = useState(0);

  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setInsideKm(settings.freeDeliveryInsideKm || 0);
      setAboveAmount(settings.freeDeliveryAboveOrderAmount || 0);
    }
  }, [settings]);

  const updateInsideKm = async () => {
    try {

      setLoading(true);

      await axios.patch(
        `${API}delivery/update-free-delivery-inside-km`,
        { freeDeliveryInsideKm: insideKm },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Updated successfully");
      setEditing(null);

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed");

    } finally {
      setLoading(false);
    }
  };

  const updateAboveAmount = async () => {

    try {

      setLoading(true);

      await axios.patch(
        `${API}delivery/update-free-delivery-above-order-amount`,
        { freeDeliveryAboveOrderAmount: aboveAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Updated successfully");
      setEditing(null);

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed");

    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setInsideKm(settings.freeDeliveryInsideKm);
    setAboveAmount(settings.freeDeliveryAboveOrderAmount);
  };

  return (
    <div className="bg-white shadow-sm border rounded-xl p-6">

      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Free Delivery Rules
      </h2>

      <div className="space-y-5">

        {/* FREE DELIVERY INSIDE KM */}

        <div className="flex items-end justify-between border-b pb-4">

          <div>

            <p className="text-sm text-gray-500">
              Free Delivery Inside KM
            </p>

            <AnimatePresence mode="wait">

              {editing === "km" ? (

                <motion.input
                  key="input"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  type="number"
                  value={insideKm}
                  onChange={(e) => setInsideKm(Number(e.target.value))}
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
                  {insideKm} km
                </motion.p>

              )}

            </AnimatePresence>

          </div>

          <div className="flex items-end gap-2">

            <AnimatePresence mode="wait">

              {editing === "km" ? (

                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-end gap-2"
                >

                  <button
                    onClick={updateInsideKm}
                    disabled={loading}
                    className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 h-8 rounded-md"
                  >
                    <Check size={14} />
                    {loading ? "..." : "Save"}
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs px-3 h-8 rounded-md"
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
                  onClick={() => setEditing("km")}
                  className="flex items-center gap-1 text-pink-600 text-sm"
                >
                  <Pencil size={14} />
                  Edit
                </motion.button>

              )}

            </AnimatePresence>

          </div>

        </div>

        {/* FREE DELIVERY ABOVE ORDER */}

        <div className="flex items-end justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Free Delivery Above Order Amount
            </p>

            <AnimatePresence mode="wait">

              {editing === "amount" ? (

                <motion.input
                  key="input"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  type="number"
                  value={aboveAmount}
                  onChange={(e) =>
                    setAboveAmount(Number(e.target.value))
                  }
                  className="border rounded-md px-2 text-sm w-28 h-8 mt-1"
                />

              ) : (

                <motion.p
                  key="value"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm"
                >
                  ₹{aboveAmount}
                </motion.p>

              )}

            </AnimatePresence>

          </div>

          <div className="flex items-end gap-2">

            <AnimatePresence mode="wait">

              {editing === "amount" ? (

                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-end gap-2"
                >

                  <button
                    onClick={updateAboveAmount}
                    disabled={loading}
                    className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 h-8 rounded-md"
                  >
                    <Check size={14} />
                    {loading ? "..." : "Save"}
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs px-3 h-8 rounded-md"
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
                  onClick={() => setEditing("amount")}
                  className="flex items-center gap-1 text-pink-600 text-sm"
                >
                  <Pencil size={14} />
                  Edit
                </motion.button>

              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FreeDeliveryCard;