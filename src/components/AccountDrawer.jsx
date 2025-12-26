import React, { useRef, useEffect } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountDrawer({ isOpen, onClose, user }) {
  const drawerRef = useRef();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-2/3 sm:w-1/2 lg:w-1/3 flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Details */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3">
            <User className="text-blue-500 w-6 h-6" />
            <p className="text-gray-700">
              <span className="font-medium">First Name:</span>{" "}
              {user?.fullName?.firstName || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-purple-500 w-6 h-6" />
            <p className="text-gray-700">
              <span className="font-medium">Last Name:</span>{" "}
              {user?.fullName?.lastName || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-green-500 w-6 h-6" />
            <p className="text-gray-700">
              <span className="font-medium">Email:</span>{" "}
              {user?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
