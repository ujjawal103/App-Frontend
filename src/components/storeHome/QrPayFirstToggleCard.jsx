import React, { useContext, useState } from "react";
import axios from "axios";
import { CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { StoreDataContext } from "../../context/StoreContext";

const QrPayFirstToggleCard = () => {
  const { store, setStore } = useContext(StoreDataContext);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const handleToggle = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${BASE_URL}stores/settings/qr-pay-first`,
        { enabled: !store.qrPayFirstEnabled },
        {
          headers: {
            Authorization: `Bearer ${storeToken}`,
          },
        }
      );

      setStore({
        ...store,
        qrPayFirstEnabled: data.qrPayFirstEnabled,
      });

      toast.success(
        `QR Pay First ${data.qrPayFirstEnabled ? "enabled" : "disabled"}`
      );
    } catch (err) {
      toast.error("Failed to update Pay First setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        w-full md:min-w-[500px] rounded-xl p-5 md:p-6 mt-6
        border-2
        ${
          store.qrPayFirstEnabled
            ? "border-emerald-600 bg-emerald-50"
            : "border-orange-500 bg-orange-50"
        }
      `}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

        {/* LEFT ICON */}
        <div className="flex justify-center md:justify-start">
          <div
            className={`
              w-14 h-14 rounded-xl flex items-center justify-center
              ${
                store.qrPayFirstEnabled
                  ? "bg-emerald-100"
                  : "bg-orange-100"
              }
            `}
          >
            {store.qrPayFirstEnabled ? (
              <CreditCard className="w-7 h-7 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-orange-600" />
            )}
          </div>
        </div>

        {/* MIDDLE CONTENT */}
        <div className="md:col-span-1 text-center md:text-left">
          <h3 className="text-sm font-semibold text-gray-800">
            QR Pay First
          </h3>

          <p className="text-xs text-gray-600 mt-1">
            Customers must pay online before placing order via QR.
          </p>

          <div className="mt-2 text-[11px] text-gray-500 leading-relaxed">
            • Payment is collected by <b>Tap-Resto</b><br />
            • Amount returned in settlement cycle<br />
            • <b>3% platform fee</b> is deducted
          </div>
        </div>

        {/* RIGHT TOGGLE */}
        <div className="flex justify-center md:justify-end items-center">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`
              relative inline-flex h-7 w-14 items-center rounded-full transition
              ${
                store.qrPayFirstEnabled
                  ? "bg-emerald-600"
                  : "bg-gray-400"
              }
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white transition
                ${
                  store.qrPayFirstEnabled
                    ? "translate-x-7"
                    : "translate-x-1"
                }
              `}
            />
          </button>
        </div>
      </div>

      {/* FOOTER WARNING */}
      {store.qrPayFirstEnabled && (
        <p className="mt-4 text-[11px] text-emerald-700 italic">
          ⚠️ Orders will be created <b>only after successful payment</b>.
        </p>
      )}
    </div>
  );
};

export default QrPayFirstToggleCard;
