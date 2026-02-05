import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { savePendingOrder } from "../offline/pendingOrdersDB";

const StoreCartDrawer = ({ open, setOpen, cart, setCart, storeId, store, tables }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const navigate = useNavigate();

  if (!open) return null;

  // --- Quantity Functions ---
  const updateQuantity = (itemId, variantId, variant, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((i) =>
          i.itemId === itemId && i.variant === variant && i.variantId === variantId
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const addToCart = (itemId, itemName, variantId, variant, price) => {
    setCart((prevCart) => {
      const exists = prevCart.find(
        (i) => i.itemId === itemId && i.variant === variant && i.variantId === variantId
      );
      if (exists) {
        return prevCart.map((i) =>
          i.itemId === itemId && i.variant === variant && i.variantId === variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prevCart, { itemId, itemName,variantId, variant, price, quantity: 1 }];
      }
    });
  };

  const getCartQuantity = (itemId, variantId, variant) => {
    const c = cart.find((i) => i.itemId === itemId && i.variant === variant && i.variantId === variantId);
    return c?.quantity || 0;
  };


  // --- Group items with totals ---
const groupedItems = cart.reduce((acc, curr) => {
  if (!acc[curr.itemId]) {
    acc[curr.itemId] = {
      itemId: curr.itemId,
      itemName: curr.itemName,
      variants: [],
      totalItemPrice: 0
    };
  }

  const variantTotal = curr.quantity * curr.price;

  acc[curr.itemId].variants.push({
    type: curr.variant,
    variantId: curr.variantId,
    quantity: curr.quantity,
    price: curr.price,
    total: variantTotal,
  });

  acc[curr.itemId].totalItemPrice += variantTotal;

  return acc;
}, {});

const groupedArray = Object.values(groupedItems);


  // --- Billing ---
  const subTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gstApplicable = store?.gstSettings?.gstApplicable;
  const gstRate = store?.gstSettings?.gstRate || 0;
  const restaurantChargeApplicable = store?.gstSettings?.restaurantChargeApplicable;
  const restaurantCharge = store?.gstSettings?.restaurantCharge || 0;
  const gstAmount = gstApplicable ? subTotal * gstRate : 0;
  const restaurantChargeAmount = restaurantChargeApplicable ? restaurantCharge : 0;
  const total = subTotal + gstAmount + restaurantChargeAmount;


const handleCheckout = async () => {
  if (cart.length === 0) return toast.error("Cart is empty");
  if (!selectedTable) return toast.error("Select a table first");
  if (whatsapp) {
        const num = Number(whatsapp);

        if (
          !/^\d{10}$/.test(whatsapp) ||   // not exactly 10 digits
          num < 6000000000 ||              // starts below 6
          num > 9999999999                 // more than 10 digits range
        ) {
          setWhatsappError("please enter a valid whatsapp");
          return;
        }
  }


  setLoading(true);

  const billingSummary = {
    subTotal,
    gstApplicable,
    gstRate,
    restaurantChargeApplicable,
    restaurantCharge,
    gstAmount,
    restaurantChargeAmount,
    totalAmount: total
  };

  const orderPayload = {
    _localId: Date.now(),
    storeId,
    tableId: selectedTable,
    username: username.trim() || "Guest",
    whatsapp: whatsapp.trim(),
    items: groupedArray,
    billingSummary,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  try {
    // 🔵 Online mode
    await axios.post(`${import.meta.env.VITE_BASE_URL}orders/create`, {
      storeId,
      tableId: selectedTable,
      username: username.trim() || "Guest",
      whatsapp: whatsapp.trim(),
      items: groupedArray,
      billingSummary,
      orderMethod: "counter"
    });

    toast.success("Order created successfully");
    navigate("/order-success");
    setCart([]);
    setOpen(false);

  } catch (err) {
    const isOffline =
      !navigator.onLine ||
      err.code === "ERR_NETWORK" ||
      !err.response;

    // 🟡 SAVE OFFLINE ONLY IF NETWORK ISSUE
    if (isOffline) {
      try {
        await savePendingOrder(orderPayload);
        toast("Order saved offline. Will sync when online.", { icon: "📡" });

        navigate("/order-success");
        setCart([]);
        setOpen(false);
      } catch (offlineErr) {
        toast.error("Order could not be saved offline. Please retry.");
        console.error("Offline save failed:", offlineErr);
      }
    } else {
      // 🔴 REAL BACKEND ERROR → SHOW MESSAGE
      const message = err.response?.data?.message;
       if (message && message.toLowerCase().includes("valid 10-digit")) {
              setWhatsappError(message);
        } else {
              toast.error(message || "Failed to create order");
        }
    }
  } finally {
    setLoading(false);
  }
};



  // --- UI ---
  return (
    <div className="fixed pb-36 md:pb-0 bottom-0 left-0 right-0 w-full md:pl-65 md:mb-0 p-4 bg-white shadow-2xl p-4 rounded-t-2xl min-h-[100vh] h-full overflow-y-auto z-11">
      <h2 className="font-semibold text-lg mb-3">New Order</h2>

      {/* Table Selection */}
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="w-full mb-3 p-2 border rounded-md text-sm"
      >
        <option value="">Select Table</option>
        {tables.map((t) => (
          <option key={t._id} value={t._id}>
            Table - {t.tableNumber}
          </option>
        ))}
      </select>

      {groupedArray.length === 0 ? (
        <p className="text-gray-500 text-sm">No items added</p>
      ) : (
        <>
          {groupedArray.map((group) => (
            <div
              key={group.itemId}
              className="mb-3 border-b pb-2 flex flex-col gap-1"
            >
              <p className="font-medium text-sm overflow-hidden">
                {group.itemName}
              </p>

              {group.variants.map((v, idx) => (
                <div key={idx} className="flex flex-col text-sm text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>
                      {v.type} — ₹{v.price}
                    </span>

                    <div className="flex items-center gap-2">
                      {!getCartQuantity(group.itemId,v.variantId, v.type) ? (
                        <button
                          onClick={() =>
                            addToCart(group.itemId, group.itemName,v.variantId, v.type, v.price)
                          }
                          className="px-3 py-1 rounded text-sm bg-pink-600 text-white"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center border border-pink-600 rounded-md px-2 py-1 bg-gray-50">
                          <button
                            onClick={() =>
                              updateQuantity(group.itemId,v.variantId, v.type, -1)
                            }
                            className="px-2 text-lg font-semibold text-pink-600"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm font-medium">
                            {getCartQuantity(group.itemId,v.variantId, v.type)}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(group.itemId,v.variantId, v.type, +1)
                            }
                            className="px-2 text-lg font-semibold text-pink-600"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per-item total */}
                  <div className="text-xs text-gray-500 text-right mt-0.5">
                    ₹{(v.price * getCartQuantity(group.itemId,v.variantId, v.type)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Bill Summary */}
          <div className="mt-4 space-y-1 text-sm font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>

            {gstApplicable && (
              <div className="flex justify-between text-gray-700">
                <span>GST ({gstRate * 100}%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
            )}

            {restaurantChargeApplicable && (
              <div className="flex justify-between text-gray-700">
                <span>Restaurant Charge</span>
                <span>₹{restaurantChargeAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mt-2 text-base font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Username Input */}
          <div className="mt-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter customer name (optional)"
              className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400"
            />
          </div>


          {/* WhatsApp Input */}
         <input
            type="tel"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              if (whatsappError) setWhatsappError("");
            }}
            placeholder="Enter WhatsApp number (optional)"
            className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-400 mt-2"
          />
          {whatsappError && (
            <p className="text-xs text-red-600 mt-1">
              {whatsappError}
            </p>
          )}




          <div className="mb-14"></div>

          {/* Place Order Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="fixed md:ml-65 md:mb-0 p-4 bottom-24 md:bottom-2 left-0 ml-[2vw] mr-[2vw] min-w-[96vw] md:min-w-[81vw] bg-pink-600 text-white py-2 rounded-md"
          >
            {loading ? "Placing..." : "Create Order"}
          </button>
        </>
      )}

      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-4 text-gray-500 text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default StoreCartDrawer;
