import React from "react";
import { CheckCircle, Package, Bike, CookingPot, MapPin, Phone, CreditCard, ShoppingBag } from "lucide-react";

const steps = [
  { label: "Placed", key: "placed", icon: Package },
  { label: "Preparing", key: "preparing", icon: CookingPot },
  { label: "On the way", key: "out-for-delivery", icon: Bike },
  { label: "Delivered", key: "delivered", icon: CheckCircle },
];

const TrackedOrderCard = ({ order }) => {
  const currentIndex = steps.findIndex((s) => s.key === order.status);
  const isPaid = order.paymentMethod.toLowerCase() === "razorpay";
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const isOutForDelivery = order.status === "out-for-delivery";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-md mx-auto font-sans">
      
      {/* 🏪 Store Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-pink-50 p-2 rounded-xl">
            <ShoppingBag className="text-pink-600" size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{order.store.name}</h3>
            <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <Phone size={10} className="text-pink-600" /> {order.store.phone}
            </p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-tight ${
          isPaid ? "bg-green-100 text-green-700 border border-green-200" : "bg-pink-100 text-pink-700 border border-pink-200"
        }`}>
          {isPaid ? "● PAID" : "● TO PAY"}
        </div>
      </div>

      {/* 🔥 Progress Bar */}
      {/* 🔥 Status Section */}
{isCancelled ? (
  <div className="mb-8 text-center">
    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
      <p className="text-red-600 font-black text-lg">
        Order has been cancelled
      </p>
      <p className="text-xs text-gray-500 mt-2 font-medium">
        If you did not cancel it, please call the store immediately.
      </p>
    </div>
  </div>
) : (
  <>
    {/* Progress Bar */}
    <div className="relative mb-6 px-2">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
              {index !== 0 && (
                <div className={`absolute top-4 right-[50%] w-full h-[3px] -z-10 ${isActive ? "bg-pink-600" : "bg-gray-100"}`} />
              )}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive ? "bg-pink-600 text-white border-pink-600 shadow-lg" : "bg-white text-gray-300 border-gray-100"
                }`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <p className={`text-[10px] mt-2 font-bold ${isActive ? "text-pink-600" : "text-gray-400"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>

    {/* 📝 Cancel Note */}
    <div className="mb-8 text-center">
      {(!isDelivered && !isOutForDelivery) ? (
        <p className="text-xs text-gray-500 font-medium">
          To cancel your order, please call the store directly.
        </p>
      ) : (
        <p className="text-xs text-gray-500 font-medium">
          Orders cannot be cancelled once they have been prepared.
        </p>
      )}
    </div>
  </>
)}

      {/* 📦 Items Section - Redesigned for Clarity */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</h4>
          <span className="text-[10px] text-gray-400 font-medium">#{order.orderId.slice(-6).toUpperCase()}</span>
        </div>
        
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-2xl border border-gray-50 bg-gray-50/50">
              {/* Image Container */}
              <div className="relative h-16 w-16 flex-shrink-0">
                <img 
                  src={item.itemImage} 
                  alt={item.itemName} 
                  className="h-full w-full object-cover rounded-xl shadow-sm border border-white"
                />
              </div>

              {/* Text Details */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-bold text-gray-800 capitalize leading-tight break-all line-clamp-2">
                    {item.itemName}
                  </h5>
                </div>
                
                {/* Variant & Quantity Breakdown */}
                <div className="mt-1 space-y-1">
                  {item.variants.map((v, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-100 font-medium break-all line-clamp-1 min-w-0">
                        {v.type}
                      </span>
                      <span className="text-xs font-bold text-pink-600">
                        Qty: {v.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📍 Delivery Details */}
      <div className="bg-pink-50/50 rounded-2xl p-4 mb-6 border border-pink-100/50 flex gap-3">
        <div className="bg-white p-2 rounded-xl h-fit shadow-sm">
          <MapPin size={16} className="text-pink-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-0.5">Deliver to</p>
          <p className="text-xs text-gray-700 font-semibold leading-snug">{order.delivery.address}</p>
        </div>
      </div>

      {/* 🧾 Bill Summary */}
      <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5">
            <CreditCard size={14} className="text-gray-400" />
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
              {order.paymentMethod === "cash" ? "Cash on Delivery" : "Paid via Razorpay"}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Total inclusive of all taxes</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900 tracking-tight">₹{order.totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackedOrderCard;