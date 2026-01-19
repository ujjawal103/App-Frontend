import { useNavigate } from "react-router-dom";

const AdminSettlementTable = ({ settlements, storeId }) => {
  const navigate = useNavigate();

  if (!settlements.length) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No settlements available in last 7 days
      </p>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm">
      <div className="px-4 py-3 border-b font-semibold">
        📊 Last 7 Days Settlements
      </div>

      <div className="overflow-y-auto max-h-[320px] hide-scrollbar">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-xs text-gray-600">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Orders</th>
              <th className="px-4 py-2 text-right">Collected</th>
              <th className="px-4 py-2 text-right">Payable</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {settlements.map((s) => (
              <tr
                key={s._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  {new Date(s.date).toLocaleDateString("en-IN")}
                </td>

                <td className="px-4 py-2 text-center">
                  {s.orderIds.length}
                </td>

                <td className="px-4 py-2 text-right">
                  ₹{s.totalCollected.toFixed(2)}
                </td>

                <td className="px-4 py-2 text-right">
                  ₹{s.amountPayableToStore.toFixed(2)}
                </td>

                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/settlements/${storeId}?date=${new Date(
                          s.date
                        )
                          .toISOString()
                          .split("T")[0]}`
                      )
                    }
                    className="text-blue-600 hover:underline text-xs font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSettlementTable;
