import React, { useEffect, useState, useRef } from "react";
import { Loader2, X, Printer } from "lucide-react";
import axios from "axios";
import ShareInvoiceButton from "./ShareInvoiceButton";
import { motion, AnimatePresence } from "framer-motion";
import CollectWhatsappInline from "./CollectWhatsappInline";


const OrderBillModal = ({ orderId, setOrders, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);


  const markShared=(orderId) =>{
    setOrder(prev => ({ ...prev, isShared: true }));
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId ? { ...o, isShared: true } : o
      )
    );
  }

  const handlePrint = () => {
  const printContents = printRef.current.innerHTML;
  const win = window.open("", "", "width=400,height=600");

  // ✅ Add full URL for image if relative path
  const absolutePhotoUrl = order.storeId.storeDetails.photo.startsWith("http")
    ? order.storeId.storeDetails.photo
    : `${window.location.origin}${order.storeId.storeDetails.photo}`;

  // Inject HTML & Styles
  win.document.write(`
  <html>
    <head>
      <style>
        * {
          box-sizing: border-box;
          word-wrap: break-word;
        }
        body {
          font-family: 'Courier New', monospace;
          padding: 10px;
          margin: 0;
        }
        .bill-container {
          width: 250px;
          margin: auto;
          text-align: center;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        img {
          display: block;
          margin: 0 auto 8px auto;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        .line {
          border-bottom: 1px dashed #ccc;
          margin: 6px 0;
        }
        table {
          width: 100%;
          font-size: 12px;
          border-collapse: collapse;
          table-layout: fixed; /* ✅ ensures no column stretches */
        }
        td {
          padding: 3px 0;
          vertical-align: top;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .right {
          text-align: right !important;
        }
        strong {
          word-break: break-word;
        }
      </style>
    </head>
    <body>
      <div class="bill-container">
        ${printContents}
      </div>
    </body>
  </html>
`);


  win.document.close();

  // ✅ Wait for the image to load before printing
  win.onload = () => {
    win.focus();
    win.print();

    // ✅ Optional: Trigger automatic PDF download with proper filename
    win.document.title = `Order_${order._id}.pdf`;
  };
};


  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-200">
        <div className="bg-white p-6 rounded-lg flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5 text-green-600" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
  <div className="w-full md:pl-65 mb-20 md:mb-0 fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
    <div className="bg-white rounded-lg shadow-lg w-[320px] max-h-[84vh] md:max-h-[90vh] overflow-y-auto p-4 relative overflow-y-auto overflow-x-hidden thin-scrollbar">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        <X size={20} />
      </button>

      {/* Printable Section */}
      <div ref={printRef} className="bill-container">
        {/* Store Info */}
        <div className="w-full flex items-center justify-center">
          <img
            src={order.storeId.storeDetails.photo || "/store.png"}
            alt="Store Logo"
            className="rounded-full w-40 h-40  text-center object-cover"
          />
        </div>

        <div className="text-center">
          <h2 className="font-semibold text-lg break-words">
            {order.storeId.storeName}
          </h2>
          <p className="text-xs break-words">{order.storeId.storeDetails.address}</p>
          <p className="text-xs break-words">
            📞 {order.storeId.storeDetails.phoneNumber}
          </p>
        </div>

        <div className="line my-2 border-b border-dashed border-gray-300"></div>
        <p className="text-xs break-words">
          <strong>Order ID:</strong> {order._id} <br />
          <strong>Table:</strong> {order.tableId?.tableNumber || "N/A"} <br />
          <strong>Customer:</strong> {order.username || "Guest"} <br />
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <div className="line my-2 border-b border-dashed border-gray-300"></div>

        {/* Items List */}
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
                    <td className="text-right break-words right">
                      ₹{v.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="line my-2 border-b border-dashed border-gray-300"></div>

        <table className="w-full text-xs table-fixed break-words">
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="text-right right">₹{order.subTotal.toFixed(2)}</td>
            </tr>
            {order.gstApplicable && (
              <tr>
                <td>GST ({(order.gstRate * 100).toFixed(0)}%)</td>
                <td className="text-right right">₹{order.gstAmount.toFixed(2)}</td>
              </tr>
            )}
            {order.restaurantChargeApplicable && (
              <tr>
                <td>Restaurant Charge</td>
                <td className="text-right right">
                  ₹{order.restaurantChargeAmount.toFixed(2)}
                </td>
              </tr>
            )}
            <tr>
              <td className="font-semibold"><strong>Total</strong></td>
              <td className="text-right font-semibold right">
                <strong>₹{order.totalAmount.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="line my-2 border-b border-dashed border-gray-300"></div>
        <p className="text-[10px] text-center text-gray-500 break-words">
          ⚠ No cash refunds. Please check your order before payment.
          <br /> Thank you for visiting us! 😊
        </p>
      </div>

    <AnimatePresence>
      {showWhatsappInput && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -5 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <CollectWhatsappInline
            orderId={order._id}
            onSaved={(number) => {
              setOrder(prev => ({ ...prev, whatsapp: number }));
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


      {/* Buttons */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          <Printer size={16} />
          Print Bill
        </button>
        <ShareInvoiceButton
          orderId={order._id}
          text={order.isShared ? "Re-share" : "Share"}
          currOrder={order}
          onWhatsappMissing={() => setShowWhatsappInput(true)}
          markShared={markShared}
        />
      </div>
    </div>
  </div>
);

};

export default OrderBillModal;
