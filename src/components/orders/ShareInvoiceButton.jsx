import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const ShareInvoiceButton = ({ orderId, text, onWhatsappMissing, currOrder , markShared }) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation(); // 🛑 prevent opening bill modal

    if (!currOrder?.whatsapp) {
      if (onWhatsappMissing) {
        onWhatsappMissing();
      }
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}orders/${orderId}/invoice`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { invoiceUrl, order } = res.data;

      if (!order?.whatsapp) {
        toast.error("WhatsApp number not available for this order");
        return;
      }



      const message = encodeURIComponent(
        `Hello ${order.username || "Guest"}\n\n` +
        `Thank you for dining with *${order.storeId.storeName}* \n\n` +
        `*Your Invoice is Ready*\n` +
        `You can view or download your bill using the link below:\n\n` +
        ` ${invoiceUrl}\n\n` +
        `We hope you enjoyed your experience with us \n` +
        `If you loved the food & service, we’d be happy to serve you again soon \n\n` +
        `— Team ${order.storeId.storeName}`
      );

      const whatsappUrl = `https://wa.me/91${order.whatsapp}?text=${message}`;

      window.open(whatsappUrl, "_blank");

      markShared(orderId);
    } catch (err) {
      console.error("Share invoice error:", err);
      toast.error(err.response?.data?.message || "Failed to share invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className={`text-xs flex items-center gap-1 px-2 py-1.5 rounded 
        ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      title={currOrder?.isShared ? "Invoice already shared" : "Share invoice"}
    >
      {loading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Generating invoice
        </>
      ) : (
        <div className="flex gap-2"><span>{text}</span><FaWhatsapp className="w-4 h-4" /></div>
      )}
    </button>
  );
};

export default ShareInvoiceButton;
