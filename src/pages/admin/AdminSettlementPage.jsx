import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminSettlementAnalytics from "../../components/settlement/AdminSettlementAnalytics";
import AdminOrderCardExtra from "../../components/settlement/AdminOrderCardExtra";
import LoadingSkeleton from "../../components/orders/LoadingSkeleton";
import EmptyStateMessage from "../../components/orders/EmptyStateMessage";
import FooterNavAdmin from "../../components/FooterNavAdmin";
import MarkSettlementPaidModal from "../../components/settlement/MarkSettlementPaidModal";


const AdminSettlementPage = () => {
  const { storeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);


  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const adminToken = localStorage.getItem("token");

  // 📅 date from query OR default yesterday
  const date =
    searchParams.get("date") ||
    new Date(Date.now() - 86400000).toISOString().split("T")[0];

  /* ---------------- FETCH SETTLEMENT ---------------- */
  const fetchSettlement = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${BASE_URL}settlements/admin/${storeId}?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setSettlement(data.settlement || null);
    } catch (err) {
      setSettlement(null);
      console.log(err.response);
      toast.error(
        err.response?.data?.message || "Failed to fetch settlement"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async ({ utr, remarks }) => {
  try {
    setMarkingPaid(true);

    await axios.post(
      `${BASE_URL}settlements/admin/mark-paid/${settlement._id}`,
      { utr, remarks },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    toast.success("Settlement marked as PAID");
    setShowMarkPaidModal(false);
    fetchSettlement(); // refresh data
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to mark settlement as paid"
    );
  } finally {
    setMarkingPaid(false);
  }
};


  useEffect(() => {
    fetchSettlement();
  }, [storeId, date]);

  /* ---------------- DATE CHANGE ---------------- */
  const handleDateChange = (e) => {
    setSearchParams({ date: e.target.value });
  };

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            Settlement Details
          </h1>
          <p className="text-xs text-gray-500">
            Store ID: {storeId}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <input
            type="date"
            value={date}
            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
            onChange={handleDateChange}
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            className="border px-2 py-1 rounded-md text-sm"
          />

          <button
            onClick={fetchSettlement}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>
      <hr className="my-6" />

      {/* BODY */}
      {loading ? (
        <LoadingSkeleton />
      ) : !settlement ? (
        <EmptyStateMessage message="No settlement found for this date" />
      ) : (
        <>
          {/* ANALYTICS */}
          <AdminSettlementAnalytics settlement={settlement} />
          {settlement.status === "PENDING" && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowMarkPaidModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition"
              >
                Mark as Paid
              </button>
            </div>
          )}


          <hr className="my-6" />

          {/* ORDERS */}
          <h2 className="font-semibold text-lg mb-3">
            Orders in this Settlement
          </h2>

          <div className="space-y-3">
            {settlement.orderIds.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm p-3"
              >
                <AdminOrderCardExtra order={order} />
              </div>
            ))}
          </div>
        </>
      )}



      {showMarkPaidModal && (
        <MarkSettlementPaidModal
          loading={markingPaid}
          onClose={() => setShowMarkPaidModal(false)}
          onSubmit={handleMarkAsPaid}
        />
      )}


      <FooterNavAdmin />
    </div>
  );
};

export default AdminSettlementPage;
