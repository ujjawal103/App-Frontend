import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminStoreCard from "../../components/admin/AdminStoreCard";
import FooterNavAdmin from "../../components/FooterNavAdmin";
import Loading from "../../components/Loading";

const AdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}admin/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(data.stores || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <>
      {loading && <Loading message="Fetching stores..." width="full" />}

      <div className="w-full md:pl-65 mb-20 md:mb-0 p-4 bg-gray-50 min-h-screen text-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">🏪 Stores Dashboard</h1>
            <p className="text-xs text-gray-500">
              Manage all registered stores
            </p>
          </div>

          <button
            onClick={fetchStores}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* BODY */}
        {!loading && stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-lg font-medium">No stores available</p>
            <p className="text-sm mt-1">
              Stores will appear here once they register on Tap Resto.
            </p>
          </div>
        ) : (
          <div
            className="
              grid gap-4
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {stores.map((store) => (
              <AdminStoreCard
                key={store._id}
                store={store}
                onClick={() =>
                  navigate(`/admin/stores/${store._id}`)
                }
              />
            ))}
          </div>
        )}

        <FooterNavAdmin />
      </div>
    </>
  );
};

export default AdminDashboard;
