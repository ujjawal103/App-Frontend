// import React , {createContext, useContext , useState} from 'react'



// export const StoreDataContext = createContext();

// const StoreContext = ({children}) => {

//     const [store, setStore] = useState({});
//     const [ isLoading , setIsLoading] = useState(false);
//     const [error, setError] = useState(null);


//     const updateStore = (storeData) => {
//         setStore(storeData);
//     }

//     const value = {
//       store,
//       setStore,
//       updateStore,
//       isLoading,
//       setIsLoading,
//       error,
//       setError
//     };

//   return (
//     <StoreDataContext.Provider value={value}>
//       {children}
//     </StoreDataContext.Provider>
//   )
// }

// export default StoreContext

















import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import {
  getStoreProfile,
  saveStoreProfile,
  deleteStoreProfile
} from "../offline/storeProfileDB";
import { deleteStoreItems } from "../offline/storeItemsDB";
import { deleteStoreTables } from "../offline/storeTablesDB";

export const StoreDataContext = createContext();

const StoreContext = ({ children }) => {
  const [store, setStore] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    async function initStore() {
      try {
        // 🔹 1. Load from offline DB first (instant UI)
        if (Capacitor.isNativePlatform()) {
          const cachedStore = await getStoreProfile();
          if (cachedStore) {
            setStore(cachedStore);
            setIsLoading(false);
          }
        }

        // 🔹 2. Verify online silently
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}stores/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setStore(data.store);

        if (Capacitor.isNativePlatform()) {
          await saveStoreProfile(data.store);
        }

      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired → force logout
          localStorage.removeItem("token");

          await deleteStoreProfile();
          await deleteStoreItems();
          await deleteStoreTables();

          setStore({});
        }
      } finally {
        setIsLoading(false);
      }
    }

    initStore();
  }, []);

  const value = {
    store,
    setStore,
    isLoading,
    setIsLoading,
    error,
    setError
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};

export default StoreContext;
