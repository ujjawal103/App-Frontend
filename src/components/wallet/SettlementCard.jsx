const SettlementCard = ({ settlement }) => {
  const isPaid = settlement.status === "PAID";

  // 📅 Settlement business date
  const settlementDateIST = settlement.duration?.start
    ? new Date(settlement.duration.start).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // 🕒 Paid date (IST)
  const paidOnIST =
    isPaid && settlement.paidOn
      ? new Date(settlement.paidOn).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <div
      className={`rounded-xl p-4 bg-white border transition-shadow hover:shadow-md
        ${isPaid ? "border-green-200" : "border-orange-200"}`}
    >
      {/* 🔝 HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Settlement
          </p>
          <p className="text-xs text-gray-500">
            For {settlementDateIST}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-base font-bold ${
              isPaid ? "text-green-600" : "text-orange-500"
            }`}
          >
            ₹{settlement.amountPayableToStore}
          </p>

          <span
            className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full
              ${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
          >
            {isPaid ? "PAID" : "PENDING"}
          </span>
        </div>
      </div>

      {/* ✅ PAID DETAILS — SINGLE FLEX ROW */}
      {isPaid && (settlement.utr || settlement.remarks || paidOnIST) && (
        <div className="mt-3 flex flex-wrap items-start justify-between gap-y-2 text-xs">

          {/* LEFT SIDE — UTR + REMARKS */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {settlement.utr && (
              <div className="min-w-[120px]">
                <p className="text-gray-500">UTR</p>
                <p className="font-medium text-gray-800 break-all">
                  {settlement.utr}
                </p>
              </div>
            )}

            {settlement.remarks && (
              <div className="min-w-[140px]">
                <p className="text-gray-500">Remarks</p>
                <p className="font-medium text-gray-800">
                  {settlement.remarks}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — PAID ON */}
          {paidOnIST && (
            <div className="text-right ml-auto">
              <p className="text-gray-500">Paid On</p>
              <p className="font-medium text-gray-800 whitespace-nowrap">
                {paidOnIST}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettlementCard;
