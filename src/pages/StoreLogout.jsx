import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { removeFcmToken } from "../utils/removeFcm";
import Lottie from "lottie-react";
import LogoutAnim from "../assets/logout.json";
import { deleteStoreItems } from "../offline/storeItemsDB";
import { deleteStoreProfile } from "../offline/storeProfileDB";
import { deleteStoreTables } from "../offline/storeTablesDB";

const StoreLogout = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    // 🟢 Step 1: Remove FCM token from DB
    await removeFcmToken();

    // 🟢 Step 2: Call backend logout API
    axios
      .get(`${import.meta.env.VITE_BASE_URL}stores/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async () => {
        // 🟢 Step 3: Clear everything from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("fcm");
        await deleteStoreTables();
        await deleteStoreItems();
        await deleteStoreProfile();


        toast.success("Logout successful!");
        navigate("/store-login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        // toast.error("Logout failed!");
      });
  };

  // 🔥 Logout component automatically logs out when opened
  React.useEffect(() => {
    handleLogout();
  }, []);

  return(
     <div className="h-screen w-full flex flex-col items-center justify-center bg-white px-4">

      {/* ⭐ Lottie Animation */}
      <Lottie
        animationData={LogoutAnim}
        loop={true}
        className="w-56 mb-4"
      />

      {/* ⭐ Text */}
      <p className="text-xl text-pink-600 font-semibold tracking-wide animate-pulse">
        Logging Out...
      </p>
    </div>
  )
};

export default StoreLogout;
