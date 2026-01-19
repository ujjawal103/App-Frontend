import React, { useRef, useEffect, useState } from "react";
import {
  User,
  Mail,
  LogOut,
  Phone,
  MapPin,
  PlusCircle,
  ClipboardList,
  Table,
  ChartBar,
  ChartLine,
  Edit,
  Receipt ,
  Wallet
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import EditStorePhotoModal from "../components/EditStorePhotoModel.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { StoreDataContext } from "../context/StoreContext.jsx";


export default function AccountDrawerStore({ isOpen, onClose }) {
  const drawerRef = useRef();
  const navigate = useNavigate();

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const {store , setStore} = useContext(StoreDataContext);
  const [storePhoto, setStorePhoto] = useState(store?.storeDetails?.photo);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const token = localStorage.getItem("token");


       useEffect(() => {
    setStorePhoto(store?.storeDetails?.photo);
  }, [store?.storeDetails?.photo]);

  useEffect(() => {
    console.log("store : ", store);
  }, [store]);

      const toggleStoreStatus = async () => {
      if (updatingStatus) return;

      const newStatus = store.status === "open" ? "closed" : "open";

      try {
        setUpdatingStatus(true);

        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}stores/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(res.data.message);

          setStore((prev) => ({
             ...prev,
             status: res.data.store.status,
             }));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update status");
      } finally {
        setUpdatingStatus(false);
      }
    };

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
    navigate("/store-logout");
  };

  const handleDeletePhoto = () => {
    // confirmation and delete logic
    console.log("Delete store photo clicked");
  };

  const handleEditPhoto = () => setShowPhotoModal(true);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? " bg-opacity-40" : "bg-opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-2/3 sm:w-1/2 lg:w-1/3 flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white">
          <h2 className="text-xl font-semibold text-white">Store Account</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-pink-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Store Info */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-sm">
          {/* Store Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={
                  store?.storeDetails?.photo ||
                  "/default-store-photo.png"
                }
                alt="Store"
                className="rounded-full border-4 border-pink-500 object-cover w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
              />

              {/* Edit & Delete Buttons */}
              <div className="flex justify-center gap-4 mt-3">
                <button
                  onClick={handleEditPhoto}
                  className="p-2 text-blue-600 rounded-full hover:bg-blue-200 transition flex gap-2 items-center"
                  title="Edit Photo"
                >
                  <Edit className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="">Edit Photo</span>
                </button>
                {/* <button
                  onClick={handleDeletePhoto}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                  title="Delete Photo"
                >
                  <Trash2 className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </button> */}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <User className="text-blue-500 w-5 h-5" />
              <p className="text-white">{store?.storeName || "N/A"}</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-green-500 w-5 h-5" />
              <p className="text-white">{store?.email || "N/A"}</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-purple-500 w-5 h-5" />
              <p className="text-white">
                {store?.storeDetails?.phoneNumber || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-pink-500 w-5 h-5" />
              <p className="text-white">{store?.storeDetails?.address || "N/A"}</p>
            </div>
          </div>




          {/* 🔴 STORE STATUS TOGGLE */}
          <div className={`mt-4 mb-2 flex items-center justify-between bg-gray-800 border ${store?.status === "open" ? "border-green-500" : "border-red-500"} rounded-lg px-4 py-3`}>

            {/* LEFT: STATUS TEXT */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Store Status</span>
              <span
                className={`font-semibold ${
                  store?.status === "open" ? "text-green-400" : "text-red-400"
                }`}
              >
                {store?.status === "open" ? "OPEN" : "CLOSED"}
              </span>
            </div>

            {/* RIGHT: SWITCH */}
            <button
              onClick={toggleStoreStatus}
              disabled={updatingStatus}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300
                ${store?.status === "open" ? "bg-green-600" : "bg-gray-500"}
                ${updatingStatus ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
                  transform transition-transform duration-300
                  ${store?.status === "open" ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>







          {/* Edit Store Info Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                onClose();
                navigate("/edit-store-info");
              }}
              className="w-full px-5 py-2.5 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Store Details
            </button>
          </div>


          {/* 🚀 Quick Navigation (Mobile Only) */}
          <div className="md:hidden border-t pt-5 border-white">
            <h3 className="font-semibold text-lg text-green-500 mb-3">
              Quick Navigation
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/store-menu"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <PlusCircle className="text-blue-500 w-5 h-5" />
                Create Order
              </Link>

              <Link
                to="/today-orders"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <ClipboardList className="text-green-500 w-5 h-5" />
                Today Orders
              </Link>

              <Link
                to="/table-analytics"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <Table className="text-indigo-500 w-5 h-5" />
                Table Orders
              </Link>

              <Link
                to="/daily-analytics"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <ChartBar className="text-purple-500 w-5 h-5" />
                Daily Analytics
              </Link>

              <Link
                to="/monthly-analytics"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <ChartLine className="text-pink-500 w-5 h-5" />
                Monthly Analytics
              </Link>


              <Link
                to="/store-settlement"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <Wallet  className="text-green-500 w-5 h-5" />
                QR Settlement's
              </Link>

              <Link
                to="/gst-charges"
                onClick={onClose}
                className="flex items-center gap-3 text-white hover:bg-gray-800 hover:text-white p-2 rounded-md transition-all"
              >
                <Receipt  className="text-yellow-400 w-5 h-5" />
                GST & Charges
              </Link>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-500 text-white font-semibold shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* ✅ Photo Modal */}
        {showPhotoModal && (
          <EditStorePhotoModal
            store={store}
            onClose={() => setShowPhotoModal(false)}
            onUpdated={(newUrl) => setStorePhoto(newUrl)}
          />
        )}
      </div>
    </>
  );
}
