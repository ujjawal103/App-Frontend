import React, { useEffect, useState, useRef } from "react";
import { Loader2, X, Printer } from "lucide-react";
import axios from "axios";
import ShareInvoiceButton from "./ShareInvoiceButton";
import { motion, AnimatePresence } from "framer-motion";
import CollectWhatsappInline from "./CollectWhatsappInline";
import { Capacitor } from "@capacitor/core";
import { PosPrinter } from "../../plugins/posPrinter";
import toast from "react-hot-toast";


const isAndroid = Capacitor.getPlatform() === "android";

async function ensureBluetoothPermission() {
  if (!isAndroid) return true;

  try {
    await navigator.permissions.query({ name: "bluetooth" });
    return true;
  } catch {
    return true; // Capacitor handles native permission internally
  }
}




const OrderBillModal = ({ orderId, setOrders, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const printRef = useRef(null);


// function generateBillText(order) {
//   const LINE_WIDTH = 32;

//   const formatLine = (left, right) => {
//     const rightStr = right.toString();
//     const spaceCount = LINE_WIDTH - left.length - rightStr.length;
//     const spaces = " ".repeat(spaceCount > 0 ? spaceCount : 1);
//     return left + spaces + rightStr + "\n";
//   };

//   let text = "";

//   text += order.storeId.storeName + "\n";
//   text += "--------------------------------\n";
//   text += order.storeId.storeDetails.address + "\n";
//   text += "Phone: " + order.storeId.storeDetails.phoneNumber + "\n";
//   text += "--------------------------------\n";

//   text += "Order ID: " + order._id + "\n";
//   text += "Table: " + (order.tableId?.tableNumber || "N/A") + "\n";
//   text += "--------------------------------\n";

//   order.items.forEach(item => {
//     text += item.itemName + "\n";

//     item.variants.forEach(v => {
//       const price = "Rs " + v.total.toFixed(2);
//       const name = `  ${v.type} x ${v.quantity}`;
//       text += formatLine(name, price);
//     });
//   });

//   text += "--------------------------------\n";

//   text += formatLine("Subtotal", "Rs " + order.subTotal.toFixed(2));

//   if (order.gstApplicable) {
//     text += formatLine(
//       `GST (${order.gstRate * 100}%)`,
//       "Rs " + order.gstAmount.toFixed(2)
//     );
//   }

//   if (order.restaurantChargeApplicable) {
//     text += formatLine(
//       "Service Charge",
//       "Rs " + order.restaurantChargeAmount.toFixed(2)
//     );
//   }

//   text += "--------------------------------\n";
//   text += formatLine("TOTAL", "Rs " + order.totalAmount.toFixed(2));
//   text += "--------------------------------\n";

//   text += "Thank you for visiting\n\n";

//   return text;
// }

function generateBillText(order) {
  const LINE_WIDTH = 32;

  const formatLine = (left, right) => {
    const rightStr = right.toString();
    const spaceCount = LINE_WIDTH - left.length - rightStr.length;
    const spaces = " ".repeat(spaceCount > 0 ? spaceCount : 1);
    return left + spaces + rightStr + "\n";
  };

  const centerText = (text, width = LINE_WIDTH) => {
    if (!text) return "\n";
    const spaces = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(spaces) + text + "\n";
  };

  let text = "";

  // 🔥 HEADER (CENTERED)
  text += centerText(order.storeId?.storeName.toUpperCase());
  text += "--------------------------------\n";
  text += centerText(order.storeId?.storeDetails?.address);
  text += centerText("Phone: " + order.storeId?.storeDetails?.phoneNumber);
  text += "--------------------------------\n";

  // 🔥 ORDER INFO
  text += "Id: " + order?._id + "\n";

  if (order.orderType === "delivery") {
    text += "Type: QR Delivery\n";
  } else {
    text += "Table: " + (order.tableId?.tableNumber || "N/A") + "\n";
  }
  text += "Customer: " + (order.username || "Guest") + "\n";
  text += "Date: " + new Date(order.createdAt).toLocaleString() + "\n";
  text += "Payment: " + (order.paymentMethod || "N/A") + "\n";

  text += "--------------------------------\n";

  // 🔥 ITEMS
  order.items.forEach(item => {
    text += item.itemName + "\n";

    item.variants.forEach(v => {
      const price = "Rs " + v.total.toFixed(2);
      const name = `  ${v.type} x ${v.quantity}`;
      text += formatLine(name, price);
    });
  });

  text += "--------------------------------\n";

  // 🔥 BILLING
  text += formatLine("Subtotal", "Rs " + order.subTotal.toFixed(2));

  if (order.gstApplicable) {
    text += formatLine(
      `GST (${order.gstRate * 100}%)`,
      "Rs " + order.gstAmount.toFixed(2)
    );
  }

  if (order.restaurantChargeApplicable) {
    text += formatLine(
      "Service Charge",
      "Rs " + order.restaurantChargeAmount.toFixed(2)
    );
  }

  // ✅ DELIVERY CHARGE
  if (order.orderType === "delivery") {
    text += formatLine(
      "Delivery",
      "Rs " + (order.deliveryDetails?.deliveryCharge || 0).toFixed(2)
    );
  }

  text += "--------------------------------\n";

  // 🔥 TOTAL
  text += formatLine("TOTAL", "Rs " + order.totalAmount.toFixed(2));
  text += "--------------------------------\n";

  // ✅ DELIVERY ADDRESS
  if (order.orderType === "delivery" && order.deliveryDetails?.address) {
    text += centerText("DELIVERY ADDRESS");
    text += centerText(order.deliveryDetails.address);
    text += "--------------------------------\n";
  }

  // 🔥 FOOTER (CENTERED)
  text += centerText("Thank you for visiting");
  text += "\n\n";

  return text;
}

// function generateKOTText(order) {
//   let text = "";

//   text += "KITCHEN ORDER TICKET\n";
//   text += "--------------------------------\n";

//   text += order.storeId.storeName + "\n";
//   text += "--------------------------------\n";

//   text += "Order: " + order._id + "\n";
//   text += "Table: " + (order.tableId?.tableNumber || "N/A") + "\n";
//   text += "--------------------------------\n";

//   order.items.forEach(item => {
//     text += item.itemName + "\n";

//     item.variants.forEach(v => {
//       text += `  ${v.type} x ${v.quantity}\n`;
//     });
//   });

//   text += "--------------------------------\n";
//   text += new Date(order.createdAt).toLocaleString() + "\n";

//   text += "\n\n\n";

//   return text;
// }

function generateKOTText(order) {
  const LINE_WIDTH = 32;

  const centerText = (text, width = LINE_WIDTH) => {
    if (!text) return "\n";
    const spaces = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(spaces) + text + "\n";
  };

  let text = "";

  // 🔥 HEADER (CENTERED)
  text += centerText("KITCHEN ORDER TICKET");
  text += "--------------------------------\n";

  text += centerText(order.storeId.storeName);
  text += "--------------------------------\n";

  // 🔥 ORDER INFO
  text += "Order: " + order._id + "\n";

  if (order.orderType === "delivery") {
    text += "Type: QR Delivery\n";
  } else {
    text += "Table: " + (order.tableId?.tableNumber || "N/A") + "\n";
  }

  text += "--------------------------------\n";

  // 🔥 ITEMS
  order.items.forEach(item => {
    text += item.itemName + "\n";

    item.variants.forEach(v => {
      text += `  ${v.type} x ${v.quantity}\n`;
    });
  });

  text += "--------------------------------\n";

  // 🔥 FOOTER DATE (CENTERED)
  text += centerText(new Date(order.createdAt).toLocaleString());

  text += "\n\n\n";

  return text;
}


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


const handlePrint = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      toast.error("Printing available only in app");
      return;
    }

    const savedPrinter = localStorage.getItem("selectedPrinter");

    if (!savedPrinter) {
      toast.error("No printer selected. Please select a printer first.");
      return;
    }

    const printer = JSON.parse(savedPrinter);

    toast.loading("Printing bill...");

    const billText = generateBillText(order);

    await PosPrinter.printText({
      address: printer.address,   // 🔥 MOST IMPORTANT
      text: billText,
    });

    toast.dismiss();
    toast.success(`Printed on ${printer.name}`);
  } catch (err) {
    toast.dismiss();

    const msg = err?.message || "";

    if (msg.toLowerCase().includes("disabled")) {
      toast("Please turn on Bluetooth", { icon: "🔵" });
      await PosPrinter.openBluetoothSettings();
      return;
    }

    toast.error("Printing failed");
  }
};  

const handleKOTPrint = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      toast.error("Printing available only in app");
      return;
    }

    const savedPrinter = localStorage.getItem("selectedPrinter");

    if (!savedPrinter) {
      toast.error("No printer selected.");
      return;
    }

    const printer = JSON.parse(savedPrinter);

    toast.loading("Printing KOT...");

    const kotText = generateKOTText(order);

    await PosPrinter.printText({
      address: printer.address,
      text: kotText,
    });

    toast.dismiss();
    toast.success("KOT Printed");

  } catch (err) {
    toast.dismiss();
    toast.error("KOT printing failed");
  }
};

// const handlePrint = async () => {
//   try {
//     if (!Capacitor.isNativePlatform()) {
//       toast.error("Printing available only in app");
//       return;
//     }

//     toast.dismiss();
//     toast.loading("Checking printer...");

//     const printer = await PosPrinter.checkPrinter();

//     toast.dismiss();
//     toast.loading("Printing...");

//     const billText = generateBillText(order);

//     await PosPrinter.printText({ text: billText });

//     toast.dismiss();
//     toast.success(`Printed on ${printer.name || "your printer"}`);
//   } catch (err) {
//     toast.dismiss();

//     const msg = err?.message || "";

//     if (msg.toLowerCase().includes("disabled")) {
//       toast("Please turn on Bluetooth", { icon: "🔵" });
//       await PosPrinter.openBluetoothSettings();
//       return;
//     }

//     toast.error(msg || "No printer connected");
//   }
// };









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
          {
            (order.tableId || order.orderType === "dine-in") ? (
              <>
                <strong>Table:</strong> {order.tableId?.tableNumber || "N/A"}
              </>
            ) : (
              <>
                <strong>Order Type:</strong> {order.orderType === "delivery" ? "QR Delivery" : "Takeaway"}
              </>
            )
          } <br />
          <strong>Customer:</strong> {order.username || "Guest"} <br />
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <strong className="text-xs">Payment Method:</strong> <span className="text-xs">{order.paymentMethod || "N/A"}</span>
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
            {order.orderType === "delivery" && (
              <tr>
                <td>Delivery Charge</td>
                <td className="text-right right">
                  ₹{order.deliveryDetails?.deliveryCharge?.toFixed(2) || "0.00"}
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

        {order.orderType === "delivery" && order.deliveryDetails?.address && (
          <>
            <div className="line my-2 border-b border-dashed border-gray-300"></div>

            <p className="text-xs text-center break-words">
              <strong>Delivery Address</strong><br />
              {order.deliveryDetails.address}
            </p>
          </>
        )}

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
    <div className="mt-4 flex justify-center gap-2 flex-nowrap">

      <button
        onClick={handleKOTPrint}
        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        <Printer size={14} />
        Print KOT
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
      >
        <Printer size={14} />
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
