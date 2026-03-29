import React, { useState, useRef, useEffect } from "react";
import { Loader2, MoreVertical, Clock, ChefHat, Bike, CheckCircle2, XCircle } from "lucide-react";
import OrderBillModal from "./OrderBillModal.jsx";
import ShareInvoiceButton from "./ShareInvoiceButton.jsx";
import CollectWhatsappInline from "./CollectWhatsappInline";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  placed: { label: "Mark as Placed", icon: Clock, color: "text-yellow-600" },
  preparing: { label: "Mark as Preparing", icon: ChefHat, color: "text-purple-600" },
  "out-for-delivery": { label: "Mark as Out for Delivery", icon: Bike, color: "text-indigo-600" },
  delivered: { label: "Mark as Delivered", icon: CheckCircle2, color: "text-green-600" },
  cancelled: { label: "Mark as Cancelled", icon: XCircle, color: "text-red-600" }
};

const DeliveryOrderCard = ({ order, setOrders, onUpdateStatus, onCancel }) => {
  const [loadingAction, setLoadingAction] = useState("");
  const [showBill, setShowBill] = useState(false);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  /* 🔥 CLICK OUTSIDE CLOSE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= HANDLERS ================= */

  const handleStatusUpdate = async (status, e) => {
    e.stopPropagation();
    setLoadingAction(status);
    await onUpdateStatus(order._id, status);
    setLoadingAction("");
    setShowMenu(false);
  };

  const handleCancel = async (e) => {
    e.stopPropagation();
    setLoadingAction("cancelled");
    await onCancel(order._id);
    setLoadingAction("");
    setShowMenu(false);
  };

  const handleCardClick = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    setShowBill(true);
  };

  const markShared = (orderId) => {
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, isShared: true } : o
      )
    );
  };

  /* ================= NEXT ACTION ================= */

  const getNextAction = () => {
    switch (order.deliveryStatus) {
      case "placed":
        return { label: "Mark as Preparing", value: "preparing", color: "bg-blue-500" };
      case "preparing":
        return { label: "Out for Delivery", value: "out-for-delivery", color: "bg-indigo-500" };
      case "out-for-delivery":
        return { label: "Mark as Delivered", value: "delivered", color: "bg-green-500" };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  const statusColor = {
    placed: "bg-yellow-100 text-yellow-700",
    preparing: "bg-purple-100 text-purple-700",
    "out-for-delivery": "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow p-3 flex flex-col cursor-pointer hover:bg-gray-50 transition relative"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">QR Delivery Order</h3>

          <div className="flex items-center gap-2">

            {/* STATUS BADGE */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.deliveryStatus]}`}>
              {order.deliveryStatus}
            </span>

            {/* ⋮ MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(prev => !prev);
                }}
              >
                <MoreVertical size={18} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;

                      // ❌ Skip cancelled here (handled separately)
                      if (key === "cancelled") return null;

                      return (
                        <button
                          key={key}
                          onClick={(e) => handleStatusUpdate(key, e)}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
                        >
                          <Icon size={14} className={config.color} />
                          {config.label}
                        </button>
                      );
                    })}

                    {/* CANCEL (only once) */}
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={14} />
                      Cancel Order
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* USER INFO */}
        <p className="text-gray-600 mt-1 text-xs truncate">
          👤 {order.username || "Guest"}
        </p>

        <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
          <FaWhatsapp className="text-green-500" />
          <span className="truncate">{order.whatsapp || "Not provided"}</span>
        </p>

        <p className="text-gray-500 text-xs">
          {new Date(order.createdAt).toLocaleString()}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-sm">₹{order.totalAmount}</p>

          <div className="flex gap-2">

            {/* NEXT FLOW BUTTON */}
            {nextAction && (
              <button
                onClick={(e) => handleStatusUpdate(nextAction.value, e)}
                disabled={loadingAction === nextAction.value}
                className={`text-xs px-2 py-1 rounded text-white ${nextAction.color}`}
              >
                {loadingAction === nextAction.value ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  nextAction.label
                )}
              </button>
            )}

            {/* SHARE */}
            {order.deliveryStatus === "delivered" && (
              <ShareInvoiceButton
                orderId={order._id}
                text={order.isShared ? "Re-share" : "Share"}
                onWhatsappMissing={() => setShowWhatsappInput(true)}
                currOrder={order}
                markShared={markShared}
              />
            )}

          </div>
        </div>

        {/* WHATSAPP INPUT */}
        {!order.whatsapp && (
          <AnimatePresence>
            {showWhatsappInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <CollectWhatsappInline
                  orderId={order._id}
                  onSaved={(number) => {
                    setOrders(prev =>
                      prev.map(o =>
                        o._id === order._id ? { ...o, whatsapp: number } : o
                      )
                    );
                    setShowWhatsappInput(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* BILL MODAL */}
      {showBill && (
        <OrderBillModal
          orderId={order._id}
          setOrders={setOrders}
          onClose={() => setShowBill(false)}
        />
      )}
    </>
  );
};

export default DeliveryOrderCard;