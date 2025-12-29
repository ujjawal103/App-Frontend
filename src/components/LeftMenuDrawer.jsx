import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const LeftMenuDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          isOpen ? "bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
      />

      {/* LEFT Drawer */}
      <div
        ref={drawerRef}
        className={` md:hidden fixed top-0 left-0 h-full w-2/3 sm:w-1/2 bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-pink-600">Menu</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-3 text-sm">
          <Link to="/terms-and-conditions" onClick={onClose} className="block">
            📄 Terms & Conditions
          </Link>
          <Link to="/privacy-policy" onClick={onClose} className="block">
            🔒 Privacy Policy
          </Link>
          <Link to="/cancellation-refund-policy" onClick={onClose} className="block">
            💳 Refund & Cancellation
          </Link>
          <Link to="/help" onClick={onClose} className="block">
            ❓ Help Center
          </Link>
          <Link to="/support" onClick={onClose} className="block">
            🛠 Support
          </Link>
        </div>
      </div>
    </>
  );
};

export default LeftMenuDrawer;
