// EmptyStateMessage.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaBoxOpen } from "react-icons/fa"; // Empty state icon

export default function EmptyStateMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-transparent">
      
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full shadow-lg"
      >
        <FaBoxOpen className="text-5xl text-amber-400" />
      </motion.div>

      {/* Animated Message */}
      <motion.h2
        className="text-2xl md:text-4xl font-extrabold text-gray-200 mt-6 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {message}
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="text-gray-400 text-sm md:text-base mt-3 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Stay tuned — fresh orders might pop up soon ✨
      </motion.p>

      {/* Decorative pulse animation */}
      <motion.div
        className="mt-8 w-6 h-6 bg-amber-400 rounded-full shadow-md"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </div>
  );
}
