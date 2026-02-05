const SettlementAnalyticsSection = ({ settlement }) => {
  if (!settlement) return null;

  const isPaid = settlement.status === "PAID";

  const whatsappSupportNumber = "919628316081"; // 🔁 replace with TapResto support number
  const whatsappMessage = encodeURIComponent(
    `Hi Tap Resto Support, I have a query regarding my settlement for ${new Date(
      settlement.date
    ).toLocaleDateString("en-IN")}.`
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* STATUS */}
        <div
          className={`p-4 rounded-xl shadow-sm ${
            isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <p className="text-xs font-medium uppercase">Status</p>
          <p className="text-xl font-semibold mt-1">
            {settlement.status}
          </p>
        </div>

        {/* AMOUNT PAYABLE / RECEIVED */}
        <div className="p-4 rounded-xl shadow-sm bg-emerald-100 text-emerald-700">
          <p className="text-xs font-medium uppercase">
            {isPaid ? "Received" : "You Will Receive"}
          </p>
          <p className="text-xl font-semibold mt-1">
            ₹{settlement.amountPayableToStore.toFixed(2)}
          </p>
        </div>

        {/* ORDERS COUNT */}
        <div className="p-4 rounded-xl shadow-sm bg-blue-100 text-blue-700">
          <p className="text-xs font-medium uppercase">Orders</p>
          <p className="text-xl font-semibold mt-1">
            {settlement.orderIds.length}
          </p>
        </div>

        {/* TOTAL COLLECTED */}
        <div className="p-4 rounded-xl shadow-sm bg-purple-100 text-purple-700">
          <p className="text-xs font-medium uppercase">Total Collected</p>
          <p className="text-xl font-semibold mt-1">
            ₹{settlement.totalCollected.toFixed(2)}
          </p>
        </div>
      </div>

      {/* INFO + SUPPORT */}
      <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-xs text-pink-500 italic">
          * A {settlement?.platformFeePercent}% commission was applied as platform fee for this settlement.
        </p>

        

        <a
          href={`https://wa.me/${whatsappSupportNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-green-500 bg-pink-100 rounded-md hover:bg-pink-200 transition"
        >
          💬 Contact WhatsApp Support
        </a>
      </div>
    </>
  );
};

export default SettlementAnalyticsSection;
