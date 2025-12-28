import React, { useContext, useState } from "react";
import axios from "axios";

import { QrCode } from "lucide-react";
import { toast } from "react-hot-toast";
import { StoreDataContext } from "../../context/StoreContext";

const QrToggleCard = () => {
  const { store, updateStore } = useContext(StoreDataContext);
  const [loading, setLoading] = useState(false);
  console.log("QR Ordering Enabled:", store);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const handleToggle = async () => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${BASE_URL}stores/settings/qr-ordering`,
        { enabled: !store.qrOrderingEnabled },
        {
          headers: {
            Authorization: `Bearer ${storeToken}`,
          },
        }
      );

      updateStore({
        ...store,
        qrOrderingEnabled: data.qrOrderingEnabled,
      });

      toast.success(
        `QR ordering ${data.qrOrderingEnabled ? "enabled" : "disabled"}`
      );
    } catch (err) {
      toast.error("Failed to update QR ordering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:min-w-[500px] border-2 border-pink-600 bg-yellow-300 rounded-xl shadow-sm p-4 mt-6 md:p-6 md:px-20 text-white">
      <div className="grid grid-cols-3 md:grid-cols-3 items-center gap-4">

        {/* LEFT: IMAGE / ICON */}
        <div className="flex justify-center md:justify-start">
          <div className="w-14 h-14 rounded-lg bg-pink-50 flex items-center justify-center">
            <QrCode className="w-7 h-7 text-pink-600" />
          </div>
        </div>

        {/* MIDDLE: MESSAGE */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-gray-800">
            QR Ordering
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {store.qrOrderingEnabled
              ? "Customers can place orders via QR"
              : "QR ordering is currently disabled"}
          </p>
        </div>

        {/* RIGHT: TOGGLE */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
              store.qrOrderingEnabled ? "bg-pink-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                store.qrOrderingEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
};

export default QrToggleCard;
