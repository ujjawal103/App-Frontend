import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FooterNavStore from "../components/FooterNavStore";
import { StoreDataContext } from "../context/StoreContext";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { store } = React.useContext(StoreDataContext);

  return (
    <div
      className={`${
        store && store.storeName ? "w-full md:pl-65 mb-20 md:mb-0 p-4" : ""
      } min-h-screen flex flex-col justify-center items-center bg-pink-50 text-center px-4`}
    >

      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex flex-col items-center"
      >
        <Sparkles
          className="text-brand-pink w-28 h-28 mb-4"
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold text-brand-pink mb-2"
      >
        Hurrah! 🎉
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-700 text-sm md:text-base mb-6 max-w-md"
      >
        You have successfully subscribed to{" "}
        <strong>Tap Resto</strong>.
        <br />
        Your premium features are now unlocked 🚀
      </motion.p>

      {/* Extra Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-xs md:text-sm text-gray-500 mb-8 max-w-md"
      >
        Start managing orders, menus, billing, and analytics seamlessly — all
        from one dashboard.
      </motion.p>

      {/* CTA */}
      <motion.button
        onClick={() => navigate("/store-home")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="px-7 py-3 bg-brand-pink text-white font-bold rounded-full shadow-md hover:opacity-90"
      >
        Go to Dashboard
      </motion.button>

      {store && store.storeName && <FooterNavStore />}
    </div>
  );
};

export default SubscriptionSuccess;
