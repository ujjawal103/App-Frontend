import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";
import FooterNavAdmin from "../../components/FooterNavAdmin";
import AdminSettlementTable from "../../components/settlement/AdminSettlementTable";
import { FaWallet } from "react-icons/fa";

const AdminStoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [settlements, setSettlements] = useState([]);

  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);


  const [loadingStore, setLoadingStore] = useState(false);
  const [loadingSettlements, setLoadingSettlements] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  /* ---------------- STORE ---------------- */

  const fetchStore = async () => {
    try {
      setLoadingStore(true);
      const { data } = await axios.get(
        `${BASE_URL}admin/stores/${storeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStore(data.store);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch store");
    } finally {
      setLoadingStore(false);
    }
  };

  /* ---------------- LAST 7 DAYS SETTLEMENTS ---------------- */

  const getLast7Dates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const fetchLast7Settlements = async () => {
    try {
      setLoadingSettlements(true);
      const dates = getLast7Dates();
      const results = [];

      for (const date of dates) {
        try {
          const { data } = await axios.get(
            `${BASE_URL}settlements/admin/${storeId}?date=${date}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data?.settlement) {
            results.push(data.settlement);
          }
        } catch {
          // no settlement for this date → ignore
        }
      }

      setSettlements(results);
    } finally {
      setLoadingSettlements(false);
    }
  };



  const fetchWallet = async () => {
  try {
    setLoadingWallet(true);

    const { data } = await axios.get(
      `${BASE_URL}wallets/walletsummary/${storeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setWalletBalance(data.totalPendingAmount || 0);
  } catch (error) {
    console.error("Wallet Fetch Error:", error.response?.data || error.message);
    toast.error("Failed to load wallet");
  } finally {
    setLoadingWallet(false);
  }
};


  useEffect(() => {
    fetchStore();
    fetchLast7Settlements();
    fetchWallet();
  }, [storeId]);

  if (loadingStore) {
    return <Loading message="Loading store details..." />;
  }

  if (!store) {
    return (
      <div className="p-6 text-center text-gray-500 h-screen w-full">
        Store not found
      </div>
    );
  }

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
      <div className="flex items-center gap-3">
        <img
          src={store.storeDetails?.photo || "/store.png"}
          className="w-14 h-14 rounded-xl object-cover border"
        />
        <div>
          <h1 className="text-xl font-semibold">{store.storeName}</h1>
          <p className="text-xs text-gray-500">{store.email}</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/admin/settlements/${store._id}`)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700"
        >
          View Settlements
        </button>

        <button
          onClick={() => navigate(`/admin/wallets/${store._id}`)}
          className="bg-black text-yellow-400 px-4 py-2 rounded-md text-sm hover:bg-gray-900"
        >
          <FaWallet className="inline mb-0.5 mr-2" />
          View Due Balance
        </button>
      </div>
    </div>


      {/* INFO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <InfoCard title="Store Status" value={store.status} color={store.status === "open" ? "green" : "red"} />
        <InfoCard title="Subscription" value={`${store.subscription?.plan} (${store.subscription?.status})`} color="emerald" />
        <InfoCard title="QR Ordering" value={store.qrOrderingEnabled ? "Enabled" : "Disabled"} color="blue" />
        <InfoCard title="QR Pay First" value={store.qrPayFirstEnabled ? "Enabled" : "Disabled"} color="indigo" />
        <InfoCard title="GST Applicable" value={store.gstSettings?.gstApplicable ? "Yes" : "No"} color="purple" />
        <InfoCard title="Restaurant Charge" value={store.gstSettings?.restaurantChargeApplicable ? `₹${store.gstSettings.restaurantCharge}` : "Not Applied"} color="indigo" />
        <InfoCard title="Joined On" value={new Date(store.createdAt).toLocaleDateString("en-IN")} color="slate" />
        <InfoCard title="Wallet Balance" value={loadingWallet ? "Loading..." : `₹${walletBalance}`} color="yellow" />
      </div>

      {/* ADDRESS */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-2">📍 Address</h3>
        <p className="text-sm text-gray-600">
          {store.storeDetails?.address || "—"}
        </p>
      </div>

      {/* LAST 7 DAYS SETTLEMENTS */}
      <div className="mt-8">
        {loadingSettlements ? (
          <Loading message="Loading settlements..." />
        ) : (
          <AdminSettlementTable
            settlements={settlements}
            storeId={storeId}
          />
        )}
      </div>

      <FooterNavAdmin />
    </div>
  );
};

export default AdminStoreDetails;



/* ---------------- INFO CARD ---------------- */

const InfoCard = ({ title, value, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    emerald: "bg-emerald-100 text-emerald-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700",
    slate: "bg-slate-100 text-slate-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <div className={`p-4 rounded-xl ${colorMap[color]}`}>
      <p className="text-xs uppercase font-medium">
        {title}
      </p>
      <p className="text-lg font-semibold mt-1 truncate">
        {value}
      </p>
    </div>
  );
};


