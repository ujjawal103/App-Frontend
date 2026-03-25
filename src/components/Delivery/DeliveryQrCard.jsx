import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { QrCode, Trash2, RefreshCcw, Download } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { StoreDataContext } from "../../context/StoreContext";

const DeliveryQRCard = ({ deliveryQr, setDeliveryQr }) => {

  const { store } = useContext(StoreDataContext);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const isActive = deliveryQr?.isActive ?? false;

  /* ===============================
     GENERATE QR
  =============================== */

  const handleGenerateQR = async () => {

    try {

      setLoadingGenerate(true);

      const res = await axios.post(
        `${API}delivery/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const qr = res.data.deliveryQr;

      setDeliveryQr({
        qrCode: qr.qrCode,
        qrPublicId: qr.qrPublicId,
        isActive: Boolean(qr.active)
      });

      toast.success("Delivery QR generated");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to generate QR"
      );

    } finally {

      setLoadingGenerate(false);

    }
  };

  /* ===============================
     DELETE QR
  =============================== */

  const handleDeleteQR = async () => {

    try {

      setLoadingDelete(true);

      await axios.delete(
        `${API}delivery/delete`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDeliveryQr(null);

      toast.success("Delivery QR deleted");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to delete QR"
      );

    } finally {

      setLoadingDelete(false);

    }
  };

  /* ===============================
     TOGGLE QR ACTIVE
  =============================== */

  const toggleQR = async () => {

    try {

      setLoadingToggle(true);

      await axios.patch(
        `${API}delivery/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDeliveryQr(prev => ({
        ...prev,
        isActive: !prev.isActive
      }));

      toast.success(
        !isActive
          ? "Delivery QR enabled"
          : "Delivery QR disabled"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to update"
      );

    } finally {

      setLoadingToggle(false);

    }
  };

  /* ===============================
     DOWNLOAD QR POSTER
  =============================== */

  const handleDownloadQR = async () => {

    try {

      const element = document.createElement("div");

      element.innerHTML = `
        <div style="
          font-family: 'Poppins', sans-serif;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          width:600px;
          background:#d8cc22ff;
          padding:40px;
          border-radius:16px;
          border:2px solid #ccc;
          text-align:center;
        ">

          <h1 style="font-size:28px;font-weight:700;margin-bottom:10px;">
            🍽️ ${store?.storeName || "Restaurant"}
          </h1>

          <h2 style="font-size:18px;color:#555;margin-bottom:25px;">
            Home Delivery
          </h2>

          <img
            crossOrigin="anonymous"
            src="${deliveryQr.qrCode}"
            style="width:350px;height:350px;margin:20px 0;"
          />

          <p style="
            font-size:20px;
            font-weight:600;
            color:${isActive ? "#de2969ff" : "#888"};
          ">
            ${isActive ? "Scan & Order" : "Currently Disabled"}
          </p>

          <p style="font-size:14px;color:#666;margin-top:20px;">
            Scan the QR to place your delivery order easily
          </p>

        </div>
      `;

      document.body.appendChild(element);

      element.style.position = "absolute";
      element.style.left = "-9999px";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });

      const url = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = url;
      link.download = `Delivery-QR-${store?.storeName || "TapResto"}.png`;
      link.click();

      document.body.removeChild(element);

      toast.success("Delivery QR downloaded!");

    } catch (error) {

      toast.error("Failed to download QR");

    }
  };

  /* =============================== */

  return (
    <div className="bg-white shadow-md rounded-xl p-6">

      <div className="flex items-center gap-2 mb-5">
        <QrCode className="text-pink-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Delivery QR
        </h2>
      </div>

      {!deliveryQr ? (

        <button
          onClick={handleGenerateQR}
          disabled={loadingGenerate}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <QrCode size={18} />
          {loadingGenerate ? "Generating..." : "Generate Delivery QR"}
        </button>

      ) : (

        <div className="flex flex-col items-center gap-5">

          <motion.img
            src={deliveryQr.qrCode}
            alt="Delivery QR"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`w-48 h-48 border rounded-lg shadow-sm ${
              isActive ? "" : "grayscale opacity-60"
            }`}
          />

          <div className="flex flex-wrap items-center justify-center gap-4">

            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={handleGenerateQR}
              disabled={loadingGenerate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <RefreshCcw size={16} />
              Regenerate
            </button>

            <button
              onClick={handleDeleteQR}
              disabled={loadingDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <Trash2 size={16} />
              Delete
            </button>

            {/* SWITCH */}

            <div className={`flex items-center gap-2 border ${
              isActive ? "border-green-600" : "border-red-300"
            } px-4 py-2 rounded-lg`}>

              <span className={`text-xs font-semibold ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}>
                {isActive ? "ENABLED" : "DISABLED"}
              </span>

              <button
                onClick={toggleQR}
                disabled={loadingToggle}
                className={`relative w-12 h-6 rounded-full ${
                  isActive ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                  animate={{ x: isActive ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DeliveryQRCard;