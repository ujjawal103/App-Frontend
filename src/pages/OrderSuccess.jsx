import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FooterNavStore from "../components/FooterNavStore";
import { StoreDataContext } from "../context/StoreContext";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const {store , setStore} = React.useContext(StoreDataContext);

  return (
    <div className={` ${(store && store.storeName) ? "w-full md:pl-65 mb-20 md:mb-0 p-4" : ""} min-h-screen flex flex-col justify-center items-center bg-green-50 text-center px-4`}>
      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
        className="flex flex-col items-center"
      >
        <CheckCircle className="text-green-600 w-28 h-28 mb-4" strokeWidth={1.5} />
      </motion.div>

      {/* Animated Heading */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-green-700 mb-2"
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-600 text-sm md:text-base mb-8 max-w-md"
      >
        Thank you for your order! Your food will be prepared and served soon. 🍽️
      </motion.p>

      {/* Go Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700"
      >
        Go Back
      </motion.button>

      {(store && store.storeName) && (<FooterNavStore />)}
    </div>
  );
};

export default OrderSuccess;
