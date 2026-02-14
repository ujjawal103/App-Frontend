import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SquareLoader from '../components/SquareLoader';
import toast from 'react-hot-toast';
import { StoreDataContext } from '../context/StoreContext';
import { Capacitor } from "@capacitor/core";
import { getStoreProfile, saveStoreProfile , deleteStoreProfile } from "../offline/storeProfileDB";
import { deleteStoreItems } from "../offline/storeItemsDB";
import { deleteStoreTables } from "../offline/storeTablesDB";

// const StoreProtectedWrapper = ({ children }) => {

//   const { store, setStore, isLoading, setIsLoading } = useContext(StoreDataContext);


//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();


// useEffect(() => {
//   if (!token) {
//     setIsLoading(false);
//     navigate("/store-login");
//     return;
//   }

//   async function loadStore() {
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}stores/profile`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // online → save + set
//       setStore(data.store);
//       await saveStoreProfile(data.store);
//       setIsLoading(false);

//     } catch (err) {

//         // ⭐ If token invalid or expired -> FORCE LOGOUT
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");

//           await deleteStoreTables(); 
//           await deleteStoreItems();
//           await deleteStoreProfile(); // remove offline data also
//           setStore({});
//           setIsLoading(false);
//           navigate("/store-login");
//           toast.error("Session expired. Please login again.");
//           return;
//         }

//         // ⭐ For other errors (internet off, server error) -> offline fallback
//         if (Capacitor.isNativePlatform()) {
//           const cached = await getStoreProfile();
//           if (cached) {
//             setStore(cached);
//             setIsLoading(false);
//             return;
//           }
//         }

//         // No offline data available
//         localStorage.removeItem("token");
//         setStore({});
//         setIsLoading(false);
//         navigate("/store-login");
//         toast.error("Login required");
//       }
// }

//   loadStore();
// }, [token, navigate]);


//   if(isLoading){
//     return <SquareLoader />;
//   }

//   return <>{children}</>;
// };







const StoreProtectedWrapper = ({ children }) => {
  const { store, isLoading } = useContext(StoreDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !store?._id) {
      navigate("/store-login");
    }
  }, [isLoading, store, navigate]);

  if (isLoading) {
    return <SquareLoader />;
  }

  return <>{children}</>;
};


export default StoreProtectedWrapper;
