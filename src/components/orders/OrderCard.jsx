import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import OrderBillModal from "./OrderBillModal.jsx";

const OrderCard = ({ order, onUpdateStatus, onCancel, tableNumber = null }) => {
  const [loadingAction, setLoadingAction] = useState("");
  const [showBill, setShowBill] = useState(false); // 👈 controls modal

  // --- Action Handlers ---
  const handleStatusUpdate = async (id, status, e) => {
    e.stopPropagation(); // prevent opening the bill modal
    setLoadingAction(status);
    await onUpdateStatus(id, status);
    setLoadingAction("");
  };

  const handleCancel = async (id, e) => {
    e.stopPropagation(); // prevent modal open
    setLoadingAction("cancel");
    await onCancel(id);
    setLoadingAction("");
  };

  // --- Open bill only when clicking card body, not buttons ---
  const handleCardClick = (e) => {
    // if the click originated inside a button, ignore
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    setShowBill(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow p-3 flex flex-col cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">
            Table #{order.tableId?.tableNumber || tableNumber || "N/A"}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "confirmed"
                ? "bg-blue-100 text-blue-700"
                : order.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-gray-600 mt-1 text-xs">👤 {order.username || "Guest"}</p>
        <p className="text-gray-500 text-xs">
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-sm">₹{order.totalAmount}</p>
          <div className="flex gap-2">
            {order.status === "pending" && (
              <>
                <button
                  onClick={(e) => handleStatusUpdate(order._id, "confirmed", e)}
                  disabled={loadingAction === "confirmed"}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded text-white 
                    ${
                      loadingAction === "confirmed"
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                  {loadingAction === "confirmed" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>

                <button
                  onClick={(e) => handleCancel(order._id, e)}
                  disabled={loadingAction === "cancel"}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded text-white 
                    ${
                      loadingAction === "cancel"
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {loadingAction === "cancel" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </button>
              </>
            )}

            {order.status === "confirmed" && (
              <button
                onClick={(e) => handleStatusUpdate(order._id, "completed", e)}
                disabled={loadingAction === "completed"}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded text-white 
                  ${
                    loadingAction === "completed"
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {loadingAction === "completed" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Mark as complete"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bill Modal */}
      {showBill && (
        <OrderBillModal
          orderId={order._id}
          onClose={() => setShowBill(false)}
        />
      )}
    </>
  );
};

export default OrderCard;
