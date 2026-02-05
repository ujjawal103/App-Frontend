// FooterNavStore.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaChair,
  FaClipboardList,
  FaTable,
  FaWallet,
  FaFileInvoiceDollar ,
  FaClock,
  FaChartLine,
  FaChartBar,
  FaPlusCircle,
  FaUser,
  FaQuestionCircle,
  FaHeadset,
  FaShieldAlt,
  FaUndoAlt,
  FaFileContract,
  FaTags,
  FaBoxOpen    
} from "react-icons/fa";
import axios from "axios";
import Loading from "./Loading";
import toast from "react-hot-toast";
import AccountDrawerStore from "./AccountDrawerStore";
import { Capacitor } from "@capacitor/core";
import { getStoreProfile, saveStoreProfile , deleteStoreProfile } from "../offline/storeProfileDB";

export default function FooterNavStore() {
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
      `${import.meta.env.VITE_BASE_URL}stores/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // ⭐ Online success
    setProfileFetched(response.data?.store);
    setDrawerOpen(true);

    // ⭐ Save to offline DB
    await saveStoreProfile(response.data?.store);

  } catch (error) {

    // ⭐ Token expired → force logout
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      await deleteStoreProfile();

      setProfileFetched(null);
      setDrawerOpen(false);
      setMessage("");
      setLoading(false);

      toast.error("Session expired. Please login again.");
      navigate("/store-login");
      return;
    }

    // ⭐ Offline fallback
    if (Capacitor.isNativePlatform()) {
      const cached = await getStoreProfile();
      console.log("Cached profile:", cached);

      if (cached) {
        setProfileFetched(cached);
        setDrawerOpen(true);
        setMessage("");
        setLoading(false);
        return;
      }
    }

    // ⭐ No offline data → error
    setProfileFetched(null);
    setDrawerOpen(false);
    toast.error("Unable to fetch profile!");

  }

  setLoading(false);
  setMessage("");
};


  const isActive = (path) => location.pathname === path;

  return (
    <>
      {loading && <Loading message={message} />}

      <div className="fixed bottom-0 left-0 w-full md:top-0 md:left-0 md:h-full md:w-60 md:border-t shadow-md flex md:flex-col justify-between items-center py-2 z-50 bg-white md:bg-gray-900">
        {/* {logo image only for md and avove } */}
          <div className="hidden md:flex md:w-60 w-full justify-start md:gap-2 px-4 mb-1">
              <img
                src="/tapResto.png"
                alt="Logo"
                className="h-20 w-auto object-contain"
              />
          </div>

        <div className="flex md:flex-col items-center justify-between w-[80vw] md:w-full overflow-y-auto overflow-x-hidden thin-scrollbar">



          

          {/* Home */}
                   <div
                     className={`md:w-60 cursor-pointer ${
                       isActive("/store-home") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/store-home"
                       className={`flex flex-col items-center text-black md:text-white ${
                       isActive("/store-home") ? "text-pink-700 border-t" : "sm:hover:pink-600"
                     }  w-auto md:flex-row md:items-center md:gap-2 p-4`}
                     >
                       <FaHome size={22} />
                       <span className="text-xs md:text-sm">Home</span>
                     </Link>
                   </div>



                   
         
                   {/* Menu Items */}
                   <div
                     className={`md:w-60 cursor-pointer ${
                       isActive("/items") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/items"
                       className={`flex flex-col items-center text-black md:text-white ${
                       isActive("/items") ? "text-pink-700 border-t" : "sm:hover:pink-600"
                     }  w-auto md:flex-row md:items-center md:gap-2 p-4`}
                     >
                       <FaUtensils size={22} />
                       <span className="text-xs md:text-sm">Items</span>
                     </Link>
                   </div>
         
                   {/* Tables */}
                   <div
                     className={`md:w-60 cursor-pointer ${
                       isActive("/table-management")
                         ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/table-management"
                        className={`flex flex-col items-center text-black md:text-white ${
                       isActive("/table-management") ? "text-pink-700 border-t" : "sm:hover:pink-600"
                     }  w-auto md:flex-row md:items-center md:gap-2 p-4`}
                     >
                       <FaChair size={22} />
                       <span className="text-xs md:text-sm">Tables</span>
                     </Link>
                   </div>
         
         
         
                   {/* Create Order */}
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/store-menu") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/store-menu"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/store-menu") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaPlusCircle size={22} />
                       <span className="text-sm">Create Order</span>
                     </Link>
                   </div>
         
         
         
                   {/* Today Orders */}
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/today-orders") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/today-orders"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/today-orders") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaClipboardList size={22} />
                       <span className="text-sm">Today Orders</span>
                     </Link>
                   </div>
         
         
         
         
                   {/* Orders */}
                   <div
                     className={`md:w-60 cursor-pointer ${
                       isActive("/store-orders") ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/store-orders"
                        className={`flex flex-col items-center text-black md:text-white ${
                       isActive("/store-orders") ? "text-pink-700 border-t" : "sm:hover:pink-600"
                     }  w-auto md:flex-row md:items-center md:gap-2 p-4`}
                     >
                       <FaClock size={22} />
                       <span className="text-xs md:text-sm">Orders</span>
                     </Link>
                   </div>





         
                   {/* Pending Orders */}
                   {/* <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/store-bookings") ? "bg-gray-800" : "hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/store-bookings"
                       className="flex items-center gap-2 text-white w-full p-4"
                     >
                       <FaCalendarCheck size={22} />
                       <span className="text-sm">Pending Orders</span>
                     </Link>
                   </div> */}
         
         
                   {/* Table Orders */}
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/table-analytics")
                         ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/table-analytics"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/table-analytics") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaTable size={22} />
                       <span className="text-sm">Table Orders</span>
                     </Link>
                   </div>
         
                   
         
                   
         
                   {/* Daily Analytics */}
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/daily-analytics")
                         ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/daily-analytics"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/daily-analytics") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaChartBar size={22} />
                       <span className="text-sm">Daily Analytics</span>
                     </Link>
                   </div>
         
                   {/* Monthly Analytics */}
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/monthly-analytics")
                         ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/monthly-analytics"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/monthly-analytics") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaChartLine size={22} />
                       <span className="text-sm">Monthly Analytics</span>
                     </Link>
                   </div>

          {/* Inventry */}
          <div
            className={`hidden md:w-60 md:flex cursor-pointer ${
              isActive("/inventry-management")
                ? "md:bg-gray-800" : "md:hover:bg-gray-800"
            }`}
          >
            <Link
              to="/inventry-management"
              className={`flex items-center gap-2 text-black md:text-white ${
                isActive("/inventry-management") ? "border-t" : ""
              } w-full p-4`}
            >
              <FaBoxOpen size={22} />
              <span className="text-sm">Inventries / Stock</span>
            </Link>
          </div>


            {/* QR Settlements */}
                  <div
                    className={`hidden md:w-60 md:flex cursor-pointer ${
                      isActive("/store-settlement")
                        ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                    }`}
                  >
                    <Link
                      to="/store-settlement"
                      className={`flex items-center gap-2 text-black md:text-white ${
                        isActive("/store-settlement") ? "border-t" : ""
                      } w-full p-4`}
                    >
                      <FaWallet size={22} />
                      <span className="text-sm">QR Settlement's</span>
                    </Link>
                  </div>                   
         
         
                   <div
                     className={`hidden md:w-60 md:flex cursor-pointer ${
                       isActive("/gst-charges")
                         ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                     }`}
                   >
                     <Link
                       to="/gst-charges"
                       className={`flex items-center gap-2 text-black md:text-white ${
                         isActive("/gst-charges") ? "border-t" : ""
                       } w-full p-4`}
                     >
                       <FaFileInvoiceDollar size={22} />
                       <span className="text-sm">GST & Charges</span>
                     </Link>
                   </div>

                  {/* pricing */}
                  <div
                    className={`hidden md:w-60 md:flex cursor-pointer ${
                      isActive("/pricing")
                        ? "md:bg-gray-800" : "md:hover:bg-gray-800"
                    }`}
                  >
                    <Link
                      to="/pricing"
                      className={`flex items-center gap-2 text-black md:text-white ${
                        isActive("/pricing") ? "border-t" : ""
                      } w-full p-4`}
                    >
                      <FaTags  size={22} />
                      <span className="text-sm">Pricing</span>
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
        {(profileFetched || drawerOpen) && (
          <AccountDrawerStore
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            store={profileFetched}
          />
        )}
      </div>
    </>
  );
}
