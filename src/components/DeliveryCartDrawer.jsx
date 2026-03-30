import React, { useEffect, useState } from "react";
import { toast } from "../notification/Notification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Navigation } from "lucide-react";
import { MapPin, Phone, User, ChevronRight, PlusCircle , ShoppingCart , ShoppingBag, Sparkles , MapPinOff, AlertCircle, ArrowRight } from "lucide-react";

const DeliveryCartDrawer = ({ open, setOpen, cart, setCart, storeId, tableId, store , deliveryMeta , serviceStatus }) => {
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isFreeDeliveryApplicable, setIsFreeDeliveryApplicable] = useState(false);
  const [freeDeliveryReason, setFreeDeliveryReason] = useState("");
  const [isPlaceOrderAvailable, setIsPlaceOrderAvailable] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");
  const savedName = deliveryMeta?.name?.firstName + " " + deliveryMeta?.name?.lastName || "Guest";
  const savedPhone = deliveryMeta?.contactDetails?.phone || "";
  const savedAddress = deliveryMeta?.address || "";
  const navigate = useNavigate();
 



  

  // --- Helper functions ---
  const updateQuantity = (itemId,variantId, variant, delta) => {
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

  

  const addToCart = (itemId, itemName,variantId, variant, price) => {
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

  const getCartQuantity = (itemId,variantId, variant) => {
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
  // ✅ DELIVERY CHARGE
  const actualDeliveryCharge = deliveryMeta?.deliveryCharge || 0;
  const deliveryCharge = isFreeDeliveryApplicable ? 0 : actualDeliveryCharge;
  // 🔥 FINAL TOTAL BEFORE ROUND
  const rawTotal = subTotal + gstAmount + restaurantChargeAmount + deliveryCharge;
  // 🔥 ROUND UP (CEIL)
  const total = Math.floor(rawTotal);




  const handleCheckout = async () => {
  if (cart.length === 0) return toast.error("Cart is empty");
  const whatsappPattern = /^[6-9]\d{9}$/;
  if (!savedPhone.trim() || !whatsappPattern.test(savedPhone.trim())) {
    setValidationError("Please enter a valid 10-digit phone number");
    return;
  }else if (!savedAddress) {
    setValidationError("Please update your address to proceed");
    return;
  }else if (!savedName.trim()) {
    setValidationError("Please enter your name to proceed");
    return;
   }
  else {
    setValidationError("");
  }

  try {
    setLoading(true);

    const billingSummary = {
      subTotal,
      gstApplicable,
      gstRate,
      restaurantChargeApplicable,
      restaurantCharge,
      gstAmount,
      restaurantChargeAmount,
      totalAmount: total,
    };

    const payload = {
      storeId,
      username: savedName || "Guest",
      whatsapp: savedPhone.trim(),
      items: groupedArray,
      billingSummary,
      orderMethod: "qr",
      orderType: "delivery",

      deliveryDetails: {
        latitude: deliveryMeta?.lat,
        longitude: deliveryMeta?.lng,
        address: deliveryMeta?.address,
        distanceKm: deliveryMeta?.distanceKm,
        deliveryCharge: deliveryCharge
      }
    };

    // 🔥 DECISION POINT
    if (store?.deliveryQr?.qrPayFirstEnabled) {
      /* ===========================
         💳 PAY-FIRST FLOW
      =========================== */

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}orders/create-payment-intent`,
        payload
      );

      // 👉 open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: store.storeName,
        description: `Table ${data.tableNumber}`,
        handler: function () {
          toast.success("Payment successful");

            localStorage.setItem(
              "pendingPayment",
              JSON.stringify({
                razorpayOrderId: data.razorpayOrderId, // ✅ SAFE
                whatsapp: whatsapp.trim(),
                storeName: store.storeName,
                storeDetails: store.storeDetails,
                mode: "qr-pay-first",
              })
            );

          setCart([]);
          setOpen(false);
          navigate("/order-success");
        },
        prefill: {
          name: username || "Guest",
          contact: whatsapp || "",
        },
        theme: {
          color: "#ec4899",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } else {
      /* ===========================
         🧾 NORMAL QR ORDER FLOW
      =========================== */

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}orders/create`,
        payload
      );

      toast.success("Order created successfully");
      setCart([]);
      setOpen(false);

      const enrichedOrder = {
        ...data.order,
        storeDetails: {
          storeName: store.storeName,
          storeDetails: store.storeDetails,
        },
      };

      localStorage.setItem("lastOrder", JSON.stringify(enrichedOrder));
      navigate("/order-success");
    }

  } catch (err) {
    console.log("ERROR FULL:", err);
console.log("ERROR DATA:", err.response?.data);

const message = err.response?.data?.message;
toast.error(message || "Checkout failed");
  } finally {
    setLoading(false);
  }
};


  

//checking for free delivery eligibility
useEffect(() => {
  if (!open) return;
  if (!store || !deliveryMeta) return;

  const settings = store?.deliverySettings || {};

  const freeAbove = settings.freeDeliveryAboveOrderAmount || 0;
  const freeInside = settings.freeDeliveryInsideKm || 0;

  let isFree = false;
  let reason = "";

  // ✅ Only if at least one config exists
  if (freeAbove > 0 || freeInside > 0) {

    // ✅ CONDITION 1: Order amount
    if (freeAbove > 0 && subTotal >= freeAbove) {
      isFree = true;
      reason = `Free delivery on orders above ₹${freeAbove}`;
    }

    // ✅ CONDITION 2: Distance
    if (!isFree && freeInside > 0 && deliveryMeta.distanceKm <= freeInside) {
      isFree = true;
      reason = `Free delivery within ${freeInside} km`;
    }
  }

  setIsFreeDeliveryApplicable(isFree);
  setFreeDeliveryReason(reason);

}, [open, store, deliveryMeta, subTotal]);


//checking minimum order amount eligibility and amount required for free delivery
useEffect(() => {
  if (!open || !store) return;

  const settings = store?.deliverySettings || {};

  const minOrder = settings.minimumOrderAmount || 0;
  const freeAbove = settings.freeDeliveryAboveOrderAmount || 0;

  let message = "";
  let canPlace = true;

  if(store.status !== "open") {
    message = "Store is currently closed";
    canPlace = false;
  }

  else if(store?.deliverySettings?.deliveryEnabled === false || store?.deliveryQr?.active === false) {
    message = "DELIVERY IS CLOSED FOR NOW ";
    canPlace = false;
  }

  else if(serviceStatus !== "allowed") {
    canPlace = false;
  }

  /* ===============================
     1️⃣ MINIMUM ORDER CHECK
  =============================== */

  else if (minOrder > 0 && subTotal < minOrder) {
    const remaining = Math.ceil(minOrder - subTotal);
    message = `Add ₹${remaining} more to place order`;
    canPlace = false;
  }

  /* ===============================
     2️⃣ FREE DELIVERY HINT (ONLY IF ABOVE PASSED)
  =============================== */

  else if (freeAbove > 0 && subTotal < freeAbove) {
    const remaining = Math.ceil(freeAbove - subTotal);
    message = `Add ₹${remaining} more to get FREE delivery`;
  }

  setOrderMessage(message);
  setIsPlaceOrderAvailable(canPlace);

}, [open, store, subTotal , serviceStatus]);

useEffect(() => {
  if (!open) return;

  if (!/^[6-9]\d{9}$/.test(savedPhone)) {
    setValidationError("Invalid phone number. Please update address.");
  } else {
    setValidationError("");
  }
}, [open, savedPhone]);

 if (!open) return null;


  // --- UI ---
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 min-h-[100vh] h-full overflow-y-auto z-11">

    <div className="flex items-center justify-between mb-6 pt-1 px-0">
      {/* LEFT SIDE: ICON & TEXT */}
      <div className="flex items-center gap-3">
        <div className="bg-pink-100 p-2.5 rounded-2xl shadow-sm shadow-pink-100">
          <ShoppingBag size={22} className="text-pink-600" />
        </div>

        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">
            Your Cart
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            Review & Checkout
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: PINK THEMED CLOSE BUTTON */}
      <button
        onClick={() => setOpen(false)}
        className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-pink-200"
        aria-label="Close"
      >
        <X size={20} strokeWidth={2.5} /> 
      </button>
    </div>


      {groupedArray.length === 0 ? (
        <p className="text-gray-500 text-sm">No items added</p>
      ) : (
        <>
          {groupedArray.map((group) => (
            <div key={group.itemId} className="mb-3 border-b pb-2 flex flex-col gap-1">
              <p className="font-medium overflow-hidden">{group.itemName}</p>

              {group.variants.map((v, idx) => (
                <div key={idx} className="flex flex-col text-sm text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>
                      {v.type} — ₹{v.price}
                    </span>

                    <div className="flex items-center gap-2">
                      {!getCartQuantity(group.itemId,v.variantId , v.type) ? (
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

                  {/* Per-item total line */}
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

            <div className="flex justify-between text-gray-700 items-center">
              <span>Delivery Charge</span>

              {isFreeDeliveryApplicable ? (
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-400 text-sm">
                    ₹{actualDeliveryCharge.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              ) : (
                <span>₹{actualDeliveryCharge.toFixed(2)}</span>
              )}
            </div>

            {/* 🔥 FREE DELIVERY MESSAGE */}
            {isFreeDeliveryApplicable && (
              <p className="text-xs text-green-600 mt-1 text-right">
                {freeDeliveryReason}
              </p>
            )}

            <div className="flex justify-between mt-2 text-base font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          
            {/* FREE DELIVEY SECTION  */}
            {orderMessage && (
              <div className={`my-2 overflow-hidden rounded-xl border transition-all duration-300 ${
                isPlaceOrderAvailable 
                  ? "bg-green-50 border-green-100 shadow-sm" 
                  : "bg-pink-50 border-pink-100 shadow-md animate-pulse-subtle"
              }`}>
                <div className="flex items-center justify-center gap-2 px-4 py-2.5">
                  {/* Icon with a small background circle for depth */}
                  <div className={`p-1.5 rounded-full ${
                    isPlaceOrderAvailable ? "bg-green-100" : "bg-pink-100"
                  }`}>
                    <ShoppingCart 
                      size={16} 
                      className={isPlaceOrderAvailable ? "text-green-600" : "text-pink-600"} 
                    />
                  </div>

                  <p className={`text-sm font-bold tracking-tight ${
                    isPlaceOrderAvailable ? "text-green-700" : "text-pink-700"
                  }`}>
                    {orderMessage}
                  </p>

                  {!isPlaceOrderAvailable && (
                    <Sparkles size={14} className="text-pink-400 animate-bounce" />
                  )}
                </div>
              </div>
            )}


          

            {/* 🏠 DELIVERY SECTION */}
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Delivery Address
                </h3>
                <button
                  onClick={() => navigate("/select-location", { state: { store, modelOpen: true } })}
                  className="text-pink-600 text-xs font-bold flex items-center gap-1 hover:underline transition-all"
                >
                  {deliveryMeta ? "EDIT" : "SET"}
                  <ChevronRight size={14} />
                </button>
              </div>

              {deliveryMeta ? (
                /* ✅ ACTIVE ADDRESS STATE */
                <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 shadow-sm">
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-600 p-2 rounded-lg mt-0.5">
                      <MapPin size={16} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0 overflow-hidden"> {/* Added overflow-hidden here */}
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800 truncate">{savedName}</p>
                        <span className="shrink-0 text-[10px] bg-pink-200 text-pink-700 px-1.5 py-0.5 rounded font-medium">SAVED</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Phone size={12} className="shrink-0 text-pink-400" />
                        <span className="truncate">{savedPhone}</span>
                      </div>

                      {/* This is the critical fix area */}
                      <div className="mt-2 block w-full"> 
                        <p className="text-xs text-gray-600 leading-relaxed italic break-words line-clamp-2 overflow-hidden">
                          {savedAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                  {
                    deliveryMeta.liveAddress && (
                      <p className="text-xs text-gray-600 leading-relaxed break-words line-clamp-1 overflow-hidden mt-2"> 
                          LANDMARK : <span className="italic">{deliveryMeta.liveAddress}</span>
                  </p>
                    )
                  }
                  {/* 🚫 SERVICEABILITY ERROR */}
                  {serviceStatus !== "allowed" && deliveryMeta && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          {/* Visual Alert Icon */}
                          <div className="bg-red-600 p-2 rounded-xl shrink-0 shadow-md shadow-red-200">
                            <MapPinOff size={18} className="text-white" />
                          </div>

                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-red-700">
                              Location Not Serviceable
                            </h4>
                            <p className="text-[11px] text-red-600/80 leading-snug mt-0.5 font-medium">
                              We're sorry! Our delivery partners don't reach this area yet.
                            </p>
                            
                            {/* Action Button: Encourages them to fix it rather than leaving */}
                            <button 
                              onClick={() => navigate("/select-location", { state: { store, modelOpen: true } })}
                              className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors uppercase tracking-tight"
                            >
                              Change Address
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subtle "Out of reach" helper text below the box */}
                      {/* <p className="text-center text-[10px] text-gray-400 mt-2 italic font-medium">
                        Check nearby locations or try a different saved address
                      </p> */}
                    </div>
                  )}
                </div>
              ) : (
                /* ❌ EMPTY STATE */
                <div 
                  onClick={() => navigate("/select-location", { state: { store, modelOpen: true } })}
                  className="group cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-pink-300 transition-all"
                >
                  <PlusCircle size={24} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                  <p className="text-xs font-medium text-gray-500 mt-2">Delivery details not saved</p>
                  <p className="text-[10px] text-gray-400">Click to add your address</p>
                </div>
              )}

              {/* ⚠️ ERROR MESSAGE */}
              {validationError && (
                <div className="flex items-center gap-1.5 mt-2 ml-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                  <p className="text-[11px] font-medium text-red-600 italic">
                    {validationError}
                  </p>
                </div>
              )}
            </div>

          <div className="mb-20"></div>
          

         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="max-w-screen-md mx-auto w-full"> {/* Optional: Keeps button from being too wide on tablets */}
            <button
              onClick={handleCheckout}
              disabled={loading || !isPlaceOrderAvailable}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg
                ${
                  !isPlaceOrderAvailable || loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
        </>
      )}



      {/* <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-4 text-gray-500 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 transition-colors"
      >
        <X size={20} className="text-gray-600" /> 
      </button> */}
    </div>
  );
};

export default DeliveryCartDrawer;
