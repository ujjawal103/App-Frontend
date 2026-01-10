import React from 'react'
import PricingCard from '../components/PricingCard'
import FooterNavStore from '../components/FooterNavStore'
import { useState , useEffect } from "react";
import MobileTopHeader from "../components/MobileTopHeader";
import LeftMenuDrawer from "../components/LeftMenuDrawer";
import axios from "axios";

const PricingPage = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");
  
  const fetchTodayOrders = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
  
      const { data } = await axios.get(
        `${BASE_URL}orders/store-orders/date?date=${today}`,
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
  
      const orders = data.orders || [];
  
      const revenue = orders.reduce(
        (sum, o) =>
          ["confirmed", "completed"].includes(o.status)
            ? sum + (o.totalAmount || 0)
            : sum,
        0
      );
  
      setTodayRevenue(revenue);
    } catch (err) {
      console.log("Failed to fetch today's orders");
    }
  };
  
  
  useEffect(() => {
    fetchTodayOrders();
  }, []);
  return (
    <>

    <div className="min-h-screen bg-brand-light md:pl-60 md:pt-0 p-0 md:p-0 mb-20 md:mb-0">
      <PricingCard gridsize={true} />
    </div>
    <FooterNavStore />
    <MobileTopHeader
          revenue={todayRevenue}
          onMenuClick={() => setIsLeftDrawerOpen(true)}
    />
    <LeftMenuDrawer
          isOpen={isLeftDrawerOpen}
          onClose={() => setIsLeftDrawerOpen(false)}
        />
    </>
  )
}

export default PricingPage
