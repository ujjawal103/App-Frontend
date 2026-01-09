import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { StoreDataContext } from "../context/StoreContext";
import { useEffect } from "react";
import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import {Checkout as RazorpayCheckout} from "capacitor-razorpay";







const plans = [
  {
    id: "free",
    title: "Free Demo",
    price: "0",
    duration: "",
    description: "Try before you pay.",
    cta: "Start Free Demo",
    type: "free",
    link: "/store-home",
    features: [
      "QR Menu Access",
      "Limited Items",
      "Order Flow Demo",
      "Dashboard Preview",
      "WhatsApp Support",
    ],
  },
  {
    id: "monthly",
    title: "Monthly Plan",
    price: "249",
    amount: 1,
    duration: "/month",
    description: "Pay monthly. Cancel anytime.",
    cta: "Pay ₹249 / month",
    type: "paid",
    features: [
      "Unlimited QR menus",
      "Unlimited Items",
      "GST Billing",
      "Order Management",
      "Analytics Dashboard",
      "WhatsApp Support",
      "Multi-device Cloud Sync"
    ],
  },
  {
    id: "yearly",
    title: "Yearly Access",
    price: "2,499",
    amount: 2499,
    duration: "/year",
    highlight: true,
    description: "Best value. Save more yearly.",
    cta: "Pay ₹2,499 / year",
    type: "paid",
    features: [
      "Unlimited QR menus",
      "Unlimited Items & Categories",
      "GST Billing & Invoicing",
      "Table & Order Management",
      "Revenue Analytics Dashboard",
      "24/7 WhatsApp Support",
      "Multi-device Cloud Sync",
    ],
  },
];



const PricingCard = ({ gridsize }) => {
     const {store , setStore} = useContext(StoreDataContext);
     const [remainingTime, setRemainingTime] = React.useState(null);
     const isNativeApp = Capacitor.isNativePlatform();

     const navigate = useNavigate(); 
     const token = localStorage.getItem("token");
     const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getRemainingTime = (expiresAt) => {
      if (!expiresAt) return null;

      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;

      if (diff <= 0) return null;

      const totalHours = Math.floor(diff / (1000 * 60 * 60));

      const years = Math.floor(totalHours / (24 * 365));
      const months = Math.floor((totalHours % (24 * 365)) / (24 * 30));
      const days = Math.floor((totalHours % (24 * 30)) / 24);
      const hours = totalHours % 24;

      return { years, months, days, hours };
    };

    useEffect(() => {
      if (!store?.subscription?.expiresAt) return;

      const updateTimer = () => {
        setRemainingTime(getRemainingTime(store.subscription.expiresAt));
      };

      updateTimer(); // initial
      const interval = setInterval(updateTimer, 60*60 * 1000); // update every hour

      return () => clearInterval(interval);
    }, [store?.subscription?.expiresAt]);

     useEffect(() => {
        if (store && store._id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
     }, [store]);



      // const openPayment = async (plan) => {
      //   try {
      //     const { data: order } = await axios.post(
      //       `${import.meta.env.VITE_BASE_URL}subscriptions/create-order`,
      //       {
      //         planId: plan.id,
      //         amount: plan.amount,
      //       }
      //       , {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     );

      //     const options = {
      //       key: import.meta.env.VITE_RAZORPAY_KEY,
      //       amount: order.amount,
      //       currency: "INR",
      //       name: "Tap Resto",
      //       description: `${plan.title} Subscription`,
      //       order_id: order.id,

      //       handler: async function (response) {
      //           try {
      //             const {data} = await axios.post(
      //               `${import.meta.env.VITE_BASE_URL}subscriptions/confirm`,
      //               {
      //                 planId: plan.id,
      //                 razorpay_order_id: response.razorpay_order_id,
      //                 razorpay_payment_id: response.razorpay_payment_id,
      //                 razorpay_signature: response.razorpay_signature,
      //               },
      //               {                      
      //                 headers: {
      //                   Authorization: `Bearer ${token}`,
      //                 },
      //               }
      //             );

      //             setStore((prev) => ({
      //               ...prev,
      //               subscription: data.subscription,
      //             }));

      //             navigate("/subscription-confirmed");
      //           } catch (err) {
      //             console.error(err);
      //             toast.error("Payment verification failed");
      //           }
      //       },


      //       theme: {
      //         color: "#e60076",
      //       },
      //     };

      //     new window.Razorpay(options).open();
      //   } catch (err) {
      //     console.log(err);
      //     toast.error("Failed to initiate payment. Please try again.");
      //     if (err.response && err.response.status === 401) {
      //       navigate("/store-login");
      //       toast.dismiss();
      //       toast.error("Please log in to continue.");
      //     }
      //   }
      // };


const openPayment = async (plan) => {
      try {
        // 1️⃣ Create order from backend
        const { data: order } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}subscriptions/create-order`,
          {
            planId: plan.id,
            amount: plan.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 2️⃣ Open Razorpay Native Checkout
        await RazorpayCheckout.open({
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: order.amount,
          currency: "INR",
          name: "Tap Resto",
          description: `${plan.title} Subscription`,
          order_id: order.id,

          prefill: {
            email: store?.email || "",
            contact: store?.phone || "",
          },

          notes: {
            storeId: store?._id,
            planId: plan.id,
          },

          theme: {
            color: "#e60076",
          },
        });

        // 3️⃣ UI success only
        toast.success("Payment successful 🎉");
        navigate("/subscription-confirmed");

      } catch (err) {
        console.error(err);

        toast.error("Failed to initiate payment. Please try again.");

        if (err.response?.status === 401) {
            toast.dismiss();
            toast.error("Please log in to continue.");
            navigate("/store-login");
        }

        if (err?.message?.includes("cancelled")) {
          toast("Payment cancelled");
          return;
        }
      }
};



  return (
    <section id="pricing" className="py-10 md:py-20 bg-brand-light px-4">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-brand-dark mb-3">
          Simple, Transparent Pricing
        </h2>
        {isLoggedIn ? (
          <div className="max-w-2xl mx-auto space-y-3 rounded-xl border border-pink-600 bg-white p-4 shadow-sm">
            {/* Current Plan */}
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                Current Plan:
                <span className="ml-2 inline-flex items-center rounded-full bg-brand-pink/10 px-3 py-1 text-sm font-bold capitalize text-brand-pink">
                  {store.subscription?.plan || "Free Demo"}
                </span>
              </p>

              {/* Status Badge */}
              {remainingTime ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  Expired
                </span>
              )}
            </div>

            {/* Expiry Info */}
            {remainingTime ? (
              <div className="text-sm text-gray-600">
                Expires in{" "}
                <span className="font-semibold text-gray-900">
                  {remainingTime.years > 0 && `${remainingTime.years}y `}
                  {remainingTime.months > 0 && `${remainingTime.months}m `}
                  {remainingTime.days}d {remainingTime.hours}h
                </span>
              </div>
            ) : (
              <div className="text-sm font-semibold text-red-600">
                Your subscription has expired. Please renew to continue.
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Choose what fits your business</p>
        )}
        

      </div>

      {/* Horizontal scroll container */}
      <div
        className={`
            flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide
            max-w-6xl mx-auto

            ${gridsize
              ? "md:grid md:grid-cols-1 lg:grid lg:grid-cols-2 md:overflow-visible lg:overflow-visible"
              : "lg:grid lg:grid-cols-3 lg:overflow-visible"
            }
          `}

      >
        {plans
        .filter(plan => {
          if (plan.id === "free" && isLoggedIn) return false;
          return true;
        })
        .map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`
              snap-center
              min-w-[100%] sm:min-w-[380px] lg:min-w-0
              h-[620px]
              bg-white rounded-3xl border-2
              ${plan.highlight ? "border-brand-yellow" : "border-gray-200"}
              flex flex-col
            `}
          >
            {/* Header */}
            <div className={`${plan.highlight ? "bg-brand-yellow" : "bg-gray-100"} p-8 text-center rounded-t-3xl `}>
              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <div className="flex justify-center items-end gap-1">
                <span className="text-3xl font-bold">₹</span>
                <span className="text-6xl font-black">{plan.price}</span>
                <span className="text-lg font-semibold text-gray-600">
                  {plan.duration}
                </span>
              </div>
              <p className="mt-3 font-medium text-gray-700">
                {plan.description}
              </p>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col flex-1">
              <ul className="space-y-3 text-gray-700 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <span className="text-green-500">✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA pinned at bottom */}
              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (plan.type === "free") {
                      window.open(plan.link, "_blank");
                    } else {
                      openPayment(plan);
                    }
                  }}
                  className={`
                    block w-full py-4 rounded-xl text-center font-black text-lg
                    ${plan.highlight
                      ? "bg-brand-pink text-white"
                      : "bg-brand-dark text-white"}
                  `}
                >
                  {plan.cta}
                </motion.button>

              </div>
            </div>
          </motion.div>
        ))}
        
      </div>
      {remainingTime && (
          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 text-center max-w-2xl mx-auto mt-6">
            💡 If you subscribe again now, your new plan will be{" "}
            <strong>added to the existing subscription</strong>.  
            <span className="font-semibold"> Get subscribed in advance — just tap it.</span>
          </div>
        )}
    </section>
  );
};

export default PricingCard;