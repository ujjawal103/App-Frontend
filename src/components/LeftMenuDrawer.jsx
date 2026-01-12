import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFileContract,
  FaShieldAlt,
  FaUndoAlt,
  FaQuestionCircle,
  FaHeadset,
  FaTags,
  FaPrint
} from "react-icons/fa";

const LeftMenuDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const linkClass =
    "flex items-center gap-4 p-3 rounded-lg text-gray-800 font-medium hover:bg-pink-50 transition";

  const iconClass = "text-pink-600 text-xl";

  return (
    <>
      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          isOpen ? "bg-black/10 bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
      />

      {/* LEFT Drawer */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-0 left-0 h-full w-2/3 sm:w-1/2 bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center mt-1">
          <h2 className="text-lg font-semibold text-pink-600">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-pink-600"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-2 text-sm">
          <Link
            to="/pricing"
            onClick={onClose}
            className={linkClass}
          >
            <FaTags className={iconClass} />
            Pricing
          </Link>


          <Link
            to="/terms-and-conditions"
            onClick={onClose}
            className={linkClass}
          >
            <FaFileContract className={iconClass} />
            Terms & Conditions
          </Link>

          <Link
            to="/privacy-policy"
            onClick={onClose}
            className={linkClass}
          >
            <FaShieldAlt className={iconClass} />
            Privacy Policy
          </Link>

          <Link
            to="/cancellation-refund-policy"
            onClick={onClose}
            className={linkClass}
          >
            <FaUndoAlt className={iconClass} />
            Refund & Cancellation
          </Link>

          <Link
            to="/help"
            onClick={onClose}
            className={linkClass}
          >
            <FaQuestionCircle className={iconClass} />
            Help Center
          </Link>

          <Link
            to="/support"
            onClick={onClose}
            className={linkClass}
          >
            <FaHeadset className={iconClass} />
            Support
          </Link>


          <Link
            to="/printer-settings"
            onClick={onClose}
            className={linkClass}
          >
            <FaPrint className={iconClass} />
            Printer Settings
          </Link>
        </div>
      </div>
    </>
  );
};

export default LeftMenuDrawer;
