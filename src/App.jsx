import Home from './pages/Home'
import React, { useContext ,useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import StoreHome from './pages/StoreHome'
import Start from './pages/Start'
import StoreLogin from './pages/StoreLogin'
import StoreSignup from './pages/StoreSignup'
import StoreProtectedWrapper from './pages/StoreProtectedWrapper'
import NotFound from './pages/NotFound'
import toast, { Toaster } from 'react-hot-toast'
import StoreLogout from './pages/StoreLogout'
import AppLayout from "./components/AppLayout";
import AdminProtectedWrapper from './pages/AdminProtectedWrapper'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'
import AdminLogout from './pages/AdminLogout'
import TableManagement from './pages/TableManagement'
import ItemManagement from './pages/ItemManagement'
import Menu from './pages/Menu'
import StoreMenu from './pages/StoreMenu'
import StoreOrders from './pages/StoreOrders'
import TodayOrders from './pages/TodayOrders'
import YourDailyAnalytics from './pages/YourDailyAnalytics'
import MonthlyAnalytics from './pages/MonthlyAnalytics'
import TablesOrders from './pages/TableOrders'
import StoreChargesSettings from './pages/StoreChargesSettings'
import EditStoreInfoPage from './pages/EditStoreInfoPage'
import {useSocket} from './context/SocketContext'
import { StoreDataContext } from './context/StoreContext'
import OrderSuccess from './pages/OrderSuccess'
import { useNavigate } from "react-router-dom";
import { initializePush } from "./push";
import { scheduleDailyMorningNotification } from "./utils/scheduleNotification";
import { syncPendingOrders } from "./utils/orderSync";
import { StatusBar  } from "@capacitor/status-bar";
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundAndCancellationPolicy from './pages/RefundAndCancellationPolicy'
import HelpCenter from './pages/HelpCenter'
import Support from './pages/Support'







const App = () => {
   const {sendMessage, recieveMessage, socket} = useSocket();
   const {store , setStore} = useContext(StoreDataContext);

   useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setBackgroundColor({ color: "#e60076" }); // default white
    StatusBar.setStyle({ style: "DARK" }); // dark 

  }, []);

  
  useEffect(() => {
    initializePush();
    scheduleDailyMorningNotification();
  }, []);

  useEffect(() => {
    console.log("App mounted, attempting to sync pending orders...");
    syncPendingOrders();
  }, []);

  useEffect(() => {
    window.addEventListener("online", syncPendingOrders);
    return () => window.removeEventListener("online", syncPendingOrders);
  }, []);

  useEffect(() => {
    sendMessage("join", {userType : "store", userId : store._id});
  }, [store]);


useEffect(() => {
  if (!socket) return;

  const handleNewOrder = (data) => {
    console.log("🎉 New order received via socket:", data);
    toast.success("🛎️ New order received!");

    // ✅ Try to play sound
    const audio = new Audio("/sounds/new-order.mp3");
    audio.volume = 0.8;

    audio.play().catch((err) => {
      console.warn("🔇 Audio play blocked or failed:", err);

      // ✅ Fallback: Try vibration (for mobile)
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]); // short double buzz
      }
    });
  };

  recieveMessage("new-order", handleNewOrder);

  // ✅ Cleanup to avoid multiple triggers
  return () => {
    socket.off("new-order", handleNewOrder);
  };
}, [socket]);




const navigate = useNavigate();





  return (
    <div>
      <AppLayout>
      <Routes>...
        <Route path='/' element={<Start />} />
        {/* <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/store-login' element={<StoreLogin />} />
        <Route path='/store-signup' element={<StoreSignup />} />             */}


      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/admin-signup' element={<AdminSignup />} />

       <Route path='/logout' element={
          <AdminProtectedWrapper>
            <AdminLogout />
          </AdminProtectedWrapper>
        } />




         {/* <Route path='/user-bookings' element={
          <UserProtectedWrapper>
            <UserBookingHistory />
          </UserProtectedWrapper>
        } /> */}





          <Route path='/order/:storeId/:tableId' element={
            <Menu/>
          } />

          <Route path='/store-menu' element={
            <StoreProtectedWrapper>
              <StoreMenu />
            </StoreProtectedWrapper>
          } />


          <Route path='/store-orders' element={
            <StoreProtectedWrapper>
              <StoreOrders />
            </StoreProtectedWrapper>
          } />


          <Route path='/today-orders' element={
            <StoreProtectedWrapper>
              <TodayOrders />
            </StoreProtectedWrapper>
          } />

          <Route path='/daily-analytics' element={
            <StoreProtectedWrapper>
              <YourDailyAnalytics />
            </StoreProtectedWrapper>
          } />

          <Route path='/monthly-analytics' element={
            <StoreProtectedWrapper>
              <MonthlyAnalytics />
            </StoreProtectedWrapper>
          } />

          <Route path='/table-analytics' element={
            <StoreProtectedWrapper>
              <TablesOrders />
            </StoreProtectedWrapper>
          } />





          <Route path='/table-management' element={
          <StoreProtectedWrapper>
            <TableManagement />
          </StoreProtectedWrapper>
          } />

          <Route path='/items' element={
            <StoreProtectedWrapper>
              <ItemManagement />
            </StoreProtectedWrapper>
          }/>








        
        <Route path='/store-login' element={<StoreLogin />} />

        <Route path='/store-signup' element={
          <AdminProtectedWrapper>
            <StoreSignup />
          </AdminProtectedWrapper>
        }
        />




        <Route path='/store-home' element={
          <StoreProtectedWrapper>
            <StoreHome />
          </StoreProtectedWrapper>
        }
        />

        


        <Route path='/store-logout' element={
          <StoreProtectedWrapper>
                <StoreLogout />
          </StoreProtectedWrapper>
        } />

        <Route path='/edit-store-info' element={
          <StoreProtectedWrapper>
            <EditStoreInfoPage />
          </StoreProtectedWrapper>
        } />

        <Route path='/gst-charges' element={
          <StoreProtectedWrapper>
            <StoreChargesSettings />
          </StoreProtectedWrapper>
        } />

        <Route path="/order-success" element={<OrderSuccess />} />



        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/cancellation-refund-policy' element={<RefundAndCancellationPolicy />} />
        <Route path='/help' element={<HelpCenter />} />
        <Route path='/support' element={<Support />} />



    
        <Route path="*" element={<NotFound />} />

      </Routes>
      </AppLayout>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App

