import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Clipboard,
  ArrowLeft,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TrackedOrderCard from "../components/trackDeliveryOrder/TrackedOrderCard";

const TrackDeliveryOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ✅ Load last order
  useEffect(() => {
    const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

    if (!lastOrder) {
      setError("You have not placed any delivery order yet");
      return;
    }

    if (lastOrder.orderType !== "delivery") {
      setError("Only Delivery Orders can be tracked");
      return;
    }

    if (lastOrder._id) {
      setOrderId(lastOrder._id);
      trackOrder(lastOrder._id);
    }
  }, []);

  // ✅ Track Order API
  // const trackOrder = async (id) => {
  //   if (!id) return;

  //   try {
  //     setLoading(true);
  //     setError("");
  //     setOrder(null);

  //     const res = await axios.get(`${BASE_URL}orders/track-orders/${id}`);
  //     setOrder(res.data.order);
  //   } catch (err) {
  //     const backendMsg = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message ;
  //     console.log(err.response)
  //     if (backendMsg === "Not a delivery order") {
  //       setError("Only Delivery Orders can be tracked");
  //     } else if (backendMsg === "Order not found") {
  //       setError("Order does not exist");
  //     } else {
  //       setError(backendMsg || "Something went wrong");
  //     }

  //     setOrder(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const trackOrder = async (id) => {
  if (!id) return;

  try {
    setLoading(true);
    setError("");
    setOrder(null);

    const res = await axios.get(`${BASE_URL}orders/track-orders/${id}`);
    setOrder(res.data.order);

  } catch (err) {
    const validationErrors = err?.response?.data?.errors;
    const backendMsg = err?.response?.data?.message;

    // ✅ 1. Handle express-validator errors
    if (validationErrors && Array.isArray(validationErrors)) {
      const combinedMsg = validationErrors.map(e => e.msg).join(", ");
      setError(combinedMsg);
    }

    // ✅ 2. Handle custom backend messages
    else if (backendMsg === "Not a delivery order") {
      setError("Only Delivery Orders can be tracked");
    } 
    else if (backendMsg === "Order not found") {
      setError("Order does not exist");
    } 

    // ✅ 3. Fallback
    else {
      setError(backendMsg || "Something went wrong");
    }

    setOrder(null);
  } finally {
    setLoading(false);
  }
};

  // ✅ Paste handler
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setOrderId(text);
      setError("");
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-600 via-pink-500 to-rose-600 px-4 py-8 pb-32 flex flex-col items-center">

      {/* 🔝 HEADER */}
      <div className="w-full max-w-md mb-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Live Tracking
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight">
          Track <span className="text-pink-200 italic font-serif">Order</span>
        </h1>

        <p className="text-pink-100/70 text-[11px] font-medium uppercase tracking-widest mt-2">
          Enter your unique order reference
        </p>
      </div>

      {/* 🔍 SEARCH BAR */}
      {/* 🔍 SEARCH BAR CONTAINER */}
<div className="w-full top-4 z-40 px-4">
  <div className="flex items-center gap-3 p-2 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
    
    {/* Input Group */}
    <div className="flex-1 relative group">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-600 transition-colors"
        size={20}
      />

      <input
        value={orderId}
        onChange={(e) => {
          setOrderId(e.target.value);
          setError("");
        }}
        placeholder="Enter Order ID..."
        className="w-full bg-transparent pl-10 pr-12 py-2.5 text-gray-800 text-sm font-medium focus:outline-none placeholder:text-gray-400"
      />

      {/* Paste Button - Subtle & Integrated */}
      <button
        onClick={handlePaste}
        title="Paste from clipboard"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-0 text-pink-600 hover:text-pink-700 hover:bg-pink-500 rounded-lg transition-all"
      >
        <Clipboard size={18} />
      </button>
    </div>

    {/* Vertical Divider */}
    {/* <div className="h-8 w-[1px] bg-gray-200" /> */}

    {/* Search Button - High Contrast */}
    <button
      onClick={() => trackOrder(orderId)}
      disabled={loading || !orderId}
      className="bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        "Track"
      )}
    </button>
  </div>
</div>

      {/* 📦 RESULTS */}
      <div className="w-full max-w-md mt-6 space-y-4">

        {/* ❌ ERROR UI */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 flex flex-col items-center text-center"
          >
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertTriangle className="text-red-500" size={28} />
            </div>

            <h2 className="text-lg font-black text-gray-800 mb-1">
              Unable to Track Order
            </h2>

            <p className="text-sm text-gray-500 font-medium">
              {error}
            </p>
          </motion.div>
        )}

        {/* ✅ ORDER CARD */}
        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TrackedOrderCard order={order} />
          </div>
        )}
      </div>

      {/* 🔙 BACK BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-50">
        <button
          onClick={() => navigate(-1)}
          className="max-w-md mx-auto w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl hover:bg-black active:scale-[0.98]"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default TrackDeliveryOrder;
