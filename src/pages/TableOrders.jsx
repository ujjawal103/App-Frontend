import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import TableOrderAnalytics from "../components/TableOrderAnalytics";
import FooterNavStore from "../components/FooterNavStore";

const TablesOrders = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const storeToken = localStorage.getItem("token");

  const fetchTables = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}tables`, {
        headers: { Authorization: `Bearer ${storeToken}` },
      });
      setTables(data.tables || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-200 min-h-screen mb-20 md:mb-0 relative">
      <h2 className="font-semibold text-lg mb-3">🍽️ All Tables</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            onClick={() => {
              setSelectedTable(table);
              setShowAnalytics(true);
            }}
            className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer overflow-hidden transition"
          >
            <img
              src="/table.png"
              alt="Table"
              className="w-full h-36 object-cover"
            />
            <div className="p-2 text-center">
              <h3 className="font-semibold text-blue-700">
                Table {table.tableNumber}
              </h3>
              <p className="text-xs text-gray-500 italic">
                Click me to check orders
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Fullscreen popup */}
      {showAnalytics && selectedTable && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <TableOrderAnalytics
            table={selectedTable}
            onClose={() => setShowAnalytics(false)}
          />
        </div>
      )}

      <FooterNavStore />
    </div>
  );
};

export default TablesOrders;
