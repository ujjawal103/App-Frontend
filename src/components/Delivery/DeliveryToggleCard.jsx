import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const DeliveryToggleCard = ({ initialStatus, deliveryQr, setDeliveryQr }) => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [enabled, setEnabled] = useState(initialStatus);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [loadingQrPay, setLoadingQrPay] = useState(false);

  const qrActive = deliveryQr?.isActive ?? false;
  const qrPayFirst = deliveryQr?.qrPayFirstEnabled ?? false;

  /* ===============================
     SYNC DELIVERY WITH QR STATUS
  =============================== */

  useEffect(() => {
  setEnabled(initialStatus);
}, [initialStatus]);

useEffect(() => {

  const syncDeliveryWithQR = async () => {

    // Only run when QR becomes OFF and delivery is still ON
    if (!qrActive && enabled) {
      try {

        setLoadingDelivery(true);

        await axios.patch(
          `${API}delivery/update-delivery-status`,
          { deliveryEnabled: false },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setEnabled(false);

        toast.success("Delivery disabled because QR is inactive");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed to sync delivery with QR"
        );

      } finally {
        setLoadingDelivery(false);
      }
    }

    // When QR becomes ON → restore backend value
    if (qrActive) {
      setEnabled(initialStatus);
    }

  };

  syncDeliveryWithQR();

}, [qrActive]);

  /* ===============================
     TOGGLE DELIVERY
  =============================== */

  const toggleDelivery = async () => {

    try {

      setLoadingDelivery(true);

      const newValue = !enabled;
      const res = await axios.patch(
        `${API}delivery/update-delivery-status`,
        { deliveryEnabled: newValue },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newStatus = res.data.deliveryEnabled;
      setEnabled(newStatus);

      toast.success(
        res.data.deliveryEnabled
          ? "Delivery enabled"
          : "Delivery disabled"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update delivery status"
      );

    } finally {

      setLoadingDelivery(false);

    }
  };

  /* ===============================
     TOGGLE QR PAY FIRST
  =============================== */

  const toggleQrPayFirst = async () => {

    try {

      setLoadingQrPay(true);

      const res = await axios.patch(
        `${API}delivery/update-qr-enabled`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newStatus = res.data.qrPayFirstEnabled;

      setDeliveryQr(prev => ({
        ...prev,
        qrPayFirstEnabled: newStatus
      }));

      toast.success(
        newStatus
          ? "QR Pay First enabled"
          : "QR Pay First disabled"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update QR Pay First"
      );

    } finally {

      setLoadingQrPay(false);

    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">

      {/* ===============================
          DELIVERY TOGGLE
      =============================== */}

      <div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Delivery Availability
        </h2>

        <div className={`flex flex-col md:flex-row items-center justify-between ${enabled ? "bg-green-100" : "bg-red-100"} px-4 py-2 rounded-lg`}>

          <p className="text-gray-600">
            Accept Online Orders via Delivery QR
          </p>

          <div className={`flex items-center gap-2 border px-4 py-2 rounded-lg ${enabled ? "border-green-600" : "border-red-400"}`}>

            <span className={`text-xs font-semibold ${enabled ? "text-green-600" : "text-gray-500"}`}>
              {enabled ? "ENABLED" : "DISABLED"}
            </span>

            <button
              onClick={toggleDelivery}
              disabled={loadingDelivery || !qrActive}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-green-600" : "bg-gray-300"}`}
            >

              <motion.div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: enabled ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />

            </button>

          </div>

        </div>

        {!qrActive && (
          <p className="text-xs text-red-500 mt-3">
            Delivery disabled because Delivery QR is inactive
          </p>
        )}

      </div>

      {/* ===============================
          QR PAY FIRST SWITCH
      =============================== */}

      <div className="border-t pt-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          QR Pay First
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Customers must pay online before placing order via QR.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">

          <div className="text-sm text-gray-600 space-y-1">
            <p>• Payment is collected by Tap-Resto</p>
            <p>• Amount returned in settlement cycle</p>
            <p>• 3% platform fee is deducted</p>
          </div>

          <div className={`flex items-center gap-2 border px-4 py-2 rounded-lg ${qrPayFirst ? "border-green-600" : "border-gray-300"}`}>

            <span className={`text-xs font-semibold ${qrPayFirst ? "text-green-600" : "text-gray-500"}`}>
              {qrPayFirst ? "ENABLED" : "DISABLED"}
            </span>

            <button
              onClick={toggleQrPayFirst}
              disabled={loadingQrPay || !qrActive}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${qrPayFirst ? "bg-green-600" : "bg-gray-300"}`}
            >

              <motion.div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: qrPayFirst ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DeliveryToggleCard;