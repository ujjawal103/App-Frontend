import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";
import LoadingSkeleton from "../components/orders/LoadingSkeleton";
import WalletHeader from "../components/wallet/WalletHeader";
import WalletTabs from "../components/wallet/WalletTabs";
import PendingSettlements from "../components/wallet/PendingSettlements";
import SettlementHistory from "../components/wallet/SettlementHistory";

const StoreWallet = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}wallets/walletsummary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(data.totalPendingAmount || 0);
      setPending(data.settlements || []);
    } catch (error) {
        console.error("Wallet Fetch Error:", error.response?.data || error.message);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}wallets/history?page=1&limit=15`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(data.settlements || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
    if (activeTab === "pending") fetchWallet();
  }, [activeTab]);

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      <WalletHeader balance={balance} />
      <WalletTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <LoadingSkeleton />
      ) : activeTab === "pending" ? (
        <PendingSettlements settlements={pending} />
      ) : (
        <SettlementHistory settlements={history} />
      )}

      <FooterNavStore />
    </div>
  );
};

export default StoreWallet;
