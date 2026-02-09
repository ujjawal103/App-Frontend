import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavAdmin from "../../components/FooterNavAdmin";
import LoadingSkeleton from "../../components/orders/LoadingSkeleton";
import WalletHeader from "../../components/wallet/WalletHeader";
import WalletTabs from "../../components/wallet/WalletTabs";
import PendingSettlements from "../../components/wallet/PendingSettlements";
import SettlementHistory from "../../components/wallet/SettlementHistory";

const AdminStoreWallet = () => {
  const { storeId } = useParams();

  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  /* ---------------- PENDING WALLET ---------------- */

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}wallets/walletsummary/${storeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(data.totalPendingAmount || 0);
      setPending(data.settlements || []);
    } catch (err) {
      console.error("Admin Wallet Error:", err.response?.data || err.message);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HISTORY (PAGINATED) ---------------- */

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}wallets/history/${storeId}?page=1&limit=15`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistory(data.settlements || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchWallet();
  }, [storeId]);

  useEffect(() => {
    if (activeTab === "pending") fetchWallet();
    if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* HEADER */}
      <WalletHeader balance={balance} isAdmin />

      {/* TABS */}
      <WalletTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CONTENT */}
      {loading ? (
        <LoadingSkeleton />
      ) : activeTab === "pending" ? (
        <PendingSettlements settlements={pending} />
      ) : (
        <SettlementHistory settlements={history} />
      )}

      <FooterNavAdmin />
    </div>
  );
};

export default AdminStoreWallet;
