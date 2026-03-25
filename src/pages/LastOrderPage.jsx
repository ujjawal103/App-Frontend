import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LastOrderPage = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const pending = JSON.parse(localStorage.getItem("pendingPayment"));
  if (!pending?.razorpayOrderId) return;

  const fetchOrder = async () => {
    try {
      console.log("Fetching order for Razorpay Order ID:", pending.razorpayOrderId);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}orders/by-razorpay-order/${pending.razorpayOrderId}`,
      );

      console.log("Fetched order data:", data);
      const enrichedOrder = {
        ...data.order,
        storeDetails: {
          storeName: pending.storeName,
          storeDetails: pending.storeDetails,
        },
      };

      localStorage.setItem("lastOrder", JSON.stringify(enrichedOrder));
      localStorage.removeItem("pendingPayment");

    } catch {
    }
  };

  fetchOrder();
}, []);

  useEffect(() => {
    const stored = localStorage.getItem("lastOrder");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600 mb-4">No last order found</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center p-4 pb-28">
      <div className="bg-white rounded-lg shadow-lg w-[320px] max-h-[90vh] overflow-y-auto p-4">

        {/* Store Info */}
        <div className="w-full flex items-center justify-center">
          <img
            src={order.storeDetails?.storeDetails?.photo || "/store.png"}
            alt="Store Logo"
            className="rounded-full w-40 h-40 object-cover"
          />
        </div>

        <div className="text-center mt-2">
          <h2 className="font-semibold text-lg break-words">
            {order.storeDetails?.storeName}
          </h2>
          <p className="text-xs break-words">
            {order?.storeDetails?.storeDetails?.address}
          </p>
          <p className="text-xs break-words">
            📞 {order?.storeDetails?.storeDetails?.phoneNumber}
          </p>
        </div>

        <div className="border-b border-dashed border-gray-300 my-2" />

        <p className="text-xs break-words">
          <strong>Order ID:</strong> {order._id} <br />
          {/* <strong>Table:</strong> {order.tableId?.tableNumber || "N/A"} <br /> */}
          {
            (order.orderType === "dine-in" && order.tableId?.tableNumber) ? (
              <>
                <strong>Table:</strong> {order.tableId?.tableNumber || "N/A"}
              </>
            ) : (
              <>
                <strong>Order Type:</strong> {order.orderType === "delivery" ? "QR Delivery" : "Takeaway"}
              </>
            )
          }
          
          <br />
          <strong>Customer:</strong> {order.username || "Guest"} <br />
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <strong className="text-xs">Payment Method:</strong> <span className="text-xs">{order.paymentMethod || "N/A"}</span>

        <div className="border-b border-dashed border-gray-300 my-2" />

        {/* Items */}
        <table className="w-full text-xs table-fixed break-words">
          <tbody>
            {order.items.map((item) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td colSpan="2" className="font-semibold break-words">
                    {item.itemName}
                  </td>
                </tr>
                {item.variants.map((v) => (
                  <tr key={v._id}>
                    <td className="break-words">
                      {v.type} × {v.quantity}
                    </td>
                    <td className="text-right break-words">
                      ₹{v.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="border-b border-dashed border-gray-300 my-2" />

        {/* Totals */}
        <table className="w-full text-xs">
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="text-right">
                ₹{order.subTotal.toFixed(2)}
              </td>
            </tr>

            {order.gstApplicable && (
              <tr>
                <td>GST</td>
                <td className="text-right">
                  ₹{order.gstAmount.toFixed(2)}
                </td>
              </tr>
            )}

            {order.restaurantChargeApplicable && (
              <tr>
                <td>Restaurant Charge</td>
                <td className="text-right">
                  ₹{order.restaurantChargeAmount.toFixed(2)}
                </td>
              </tr>
            )}
            {order.orderType === "delivery" && (
              <tr>
                <td>Delivery Charge</td>
                <td className="text-right right">
                  ₹{order.deliveryDetails?.deliveryCharge?.toFixed(2) || "0.00"}
                </td>
              </tr>
            )}

            <tr className="font-semibold">
              <td>Total</td>
              <td className="text-right">
                ₹{order.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {order.orderType === "delivery" && order.deliveryDetails?.address && (
          <>
            <div className="line my-2 border-b border-dashed border-gray-300"></div>

            <p className="text-xs text-center break-words">
              <strong>Delivery Address</strong><br />
              {order.deliveryDetails.address}
            </p>
          </>
        )}

        <div className="border-b border-dashed border-gray-300 my-2" />

        <p className="text-[10px] text-center text-gray-500">
          ⚠ No cash refunds. Please check your order before payment.
          <br />
          Thank you for visiting us! 😊
        </p>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t p-3">
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-800 text-white py-3 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default LastOrderPage;
