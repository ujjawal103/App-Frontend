// FooterNavAdmin.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaQuestionCircle,
  FaHeadset,
  FaShieldAlt,
  FaUndoAlt,
  FaFileContract,    
} from "react-icons/fa";
import axios from "axios";
import Loading from "./Loading";
import toast from "react-hot-toast";
import AccountDrawerAdmin from "./AccountDrawerAdmin";

export default function FooterNavAdmin() {
  const location = useLocation();
  const [profileFetched, setProfileFetched] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleProfile = async () => {
    setLoading(true);
    setMessage("Fetching profile...");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setMessage("");
        setProfileFetched(response.data);
        setDrawerOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setMessage("");
      setProfileFetched(null);
      setDrawerOpen(false);
      toast.error("Something went wrong!");
    }
  };

  const isActive = (path) => location.pathname === path;

 return (
    <>
      {loading && <Loading message={message} />}

      <div className="fixed bottom-0 left-0 w-full md:top-0 md:left-0 md:h-full md:w-60 md:border-t shadow-md flex md:flex-col justify-between items-center py-2 z-50 bg-white md:bg-gray-900">
        {/* {logo image only for md and avove } */}
          <div>
            <div className="hidden md:flex md:w-60 w-full justify-start md:gap-2 px-4 mb-1">
              <img
                src="/tapResto.png"
                alt="Logo"
                className="h-20 w-auto object-contain"
              />
          </div>
        <div className="flex md:flex-col items-center justify-between w-[80vw] md:w-full overflow-y-auto overflow-x-hidden thin-scrollbar">
          





          {/* Dashboard */}
          <div
            className={`md:w-60 cursor-pointer ${
              isActive("/admin-dashboard") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/admin-dashboard"
              className={`flex flex-col items-center text-black md:text-white ${
              isActive("/admin-dashboard") ? "text-pink-700 border-t" : "sm:hover:pink-600"
            }  w-auto md:flex-row md:items-center md:gap-2 p-4`}
            >
              <FaHome size={22} />
              <span className="text-xs md:text-sm">Dashboard</span>
            </Link>
          </div>

          


           {/* help */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/help")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/help"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/help") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaQuestionCircle size={22} />
              <span className="text-sm">Help</span>
            </Link>
          </div>    

          {/* Support */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/support")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/support"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/support") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaHeadset size={22} />
              <span className="text-sm">Support</span>
            </Link>
          </div>


          {/* Privacy Policy */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/privacy-policy")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/privacy-policy"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaShieldAlt size={22} />
              <span className="text-sm">Privacy Policy</span>
            </Link>
          </div>

          {/* Terms and Conditions */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/terms-and-conditions")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/terms-and-conditions"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/terms-and-conditions") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaFileContract size={22} />
              <span className="text-sm">Terms & Conditions</span>
            </Link>
          </div>


          {/* cancellation and refund policy */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/cancellation-refund-policy")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/cancellation-refund-policy"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/cancellation-refund-policy") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaUndoAlt size={22} />
              <span className="text-sm">Cancellation & Refund Policy</span>
            </Link>
          </div>



          


          
        </div>
          </div>



        {/* Account */}
        <div
                  className={`md:w-60 p-4 cursor-pointer ${
                    drawerOpen ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                  }`}
                  onClick={handleProfile}
                >
                  <button className={`flex flex-col items-center text-black md:text-white ${
                      drawerOpen ? "text-pink-700" : "sm:hover:pink-600"
                    }  w-auto md:flex-row md:items-center md:gap-2`}>
                    <FaUser size={22} />
                    <span className="text-xs md:text-sm">Account</span>
                  </button>
                </div>

        {/* Drawer */}
        {profileFetched?.admin && (
          <AccountDrawerAdmin
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            store={profileFetched.store}
          />
        )}
      </div>
    </>
  );


}
