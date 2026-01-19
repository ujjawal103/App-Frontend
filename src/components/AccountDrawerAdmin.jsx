import React, { useRef, useEffect, useState } from "react";
import { User, Mail, Shield, LogOut, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AccountDrawerAdmin({ isOpen, onClose }) {
  const drawerRef = useRef();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  /* ---------------- FETCH ADMIN PROFILE ---------------- */
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}admin/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmin(data.admin);
    } catch (err) {
      toast.error("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchAdminProfile();
  }, [isOpen]);

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    navigate("/admin-logout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "bg-black/40" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-gray-900 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-2/3 sm:w-1/2 lg:w-1/3 flex flex-col`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Admin Account
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-pink-500 transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 flex-1 overflow-y-auto text-sm space-y-5">
          {loading || !admin ? (
            <p className="text-gray-400">Loading admin details...</p>
          ) : (
            <>
              {/* AVATAR */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
                  {admin.fullName.firstName[0].toUpperCase()}
                </div>
                <p className="mt-3 text-white font-semibold text-lg">
                  {admin.fullName.firstName} {admin.fullName.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {admin.role.toUpperCase()}
                </p>
              </div>

              {/* INFO */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="text-blue-400 w-5 h-5" />
                  <p className="text-white">
                    {admin.fullName.firstName} {admin.fullName.lastName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-pink-600 w-5 h-5" />
                  <p className="text-white">{admin.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="text-purple-400 w-5 h-5" />
                  <p className="text-white">
                    Role: {admin.role}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-yellow-400 w-5 h-5" />
                  <p className="text-white">
                    Joined on{" "}
                    {new Date(admin.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
              bg-red-600 text-white font-semibold shadow-md
              hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
