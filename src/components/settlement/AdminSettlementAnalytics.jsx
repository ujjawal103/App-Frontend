const AdminSettlementAnalytics = ({ settlement }) => {
  if (!settlement) return null;

  const isPaid = settlement.status === "PAID";

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {/* STATUS */}
        <div className={`p-4 rounded-xl shadow-sm
          ${isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          <p className="text-xs uppercase font-medium">Status</p>
          <p className="text-lg font-semibold mt-1">{settlement.status}</p>
        </div>

        {/* TOTAL COLLECTED */}
        <div className="p-4 rounded-xl shadow-sm bg-blue-100 text-blue-700">
          <p className="text-xs uppercase font-medium">Total Collected</p>
          <p className="text-lg font-semibold mt-1">
            ₹{settlement.totalCollected.toFixed(2)}
          </p>
        </div>

        {/* PLATFORM FEE */}
        <div className="p-4 rounded-xl shadow-sm bg-red-100 text-red-700">
          <p className="text-xs uppercase font-medium">
            Platform Fee ({settlement.platformFeePercent}%)
          </p>
          <p className="text-lg font-semibold mt-1">
            ₹{settlement.platformFeeAmount.toFixed(2)}
          </p>
        </div>

        {/* PAYABLE */}
        <div className="p-4 rounded-xl shadow-sm bg-emerald-100 text-emerald-700">
          <p className="text-xs uppercase font-medium">Payable to Store</p>
          <p className="text-lg font-semibold mt-1">
            ₹{settlement.amountPayableToStore.toFixed(2)}
          </p>
        </div>

        {/* PAID ON */}
        <div className="p-4 rounded-xl shadow-sm bg-purple-100 text-purple-700">
          <p className="text-xs uppercase font-medium">Paid On</p>
          <p className="text-sm font-semibold mt-1">
            {settlement.paidOn
              ? new Date(settlement.paidOn).toLocaleString("en-IN")
              : "—"}
          </p>
        </div>

        {/* UTR */}
        <div className="p-4 rounded-xl shadow-sm bg-gray-100 text-gray-700">
          <p className="text-xs uppercase font-medium">UTR</p>
          <p className="text-sm font-semibold mt-1 break-all">
            {settlement.utr || "—"}
          </p>
        </div>

      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-500 mt-3 italic">
        * Platform commission of {settlement.platformFeePercent}% is deducted from total collection.
      </p>

      {/* REMARKS */}
      {settlement.remarks && (
        <div className="mt-3 p-3 bg-gray-50 border rounded-lg text-sm">
          <span className="font-medium">Remarks:</span> {settlement.remarks}
        </div>
      )}
    </>
  );
};

export default AdminSettlementAnalytics;
