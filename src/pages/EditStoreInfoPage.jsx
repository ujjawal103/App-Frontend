import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StoreDataContext } from "../context/StoreContext"; // ✅ your context
import FooterNavStore from "../components/FooterNavStore";

const EditStoreInfoPage = () => {
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreDataContext); // ✅ use context
  const [form, setForm] = useState({
    storeName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Load existing store info from context
  useEffect(() => {
    if (store) {
      setForm({
        storeName: store.storeName || "",
        email: store.email || "",
        phoneNumber: store.storeDetails?.phoneNumber || "",
        address: store.storeDetails?.address || "",
      });
    }
  }, [store]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
  };

  // ✅ Submit updated info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}stores/update-info`,
        {
          storeName: form.storeName,
          email: form.email,
          storeDetails: {
            phoneNumber: form.phoneNumber,
            address: form.address,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Store information updated successfully!");
      setStore(res.data.store); // ✅ update global store context
      navigate(-1);
    } catch (err) {
      const backendErrors = err.response?.data?.errors || [];
      console.log(backendErrors);
      const msg = err.response?.data?.message;

      if (backendErrors.length > 0) {
        // ✅ Map backend validation errors to fields
        const formattedErrors = {};
        backendErrors.forEach((error) => {
          formattedErrors[error.path] = error.msg;
        });
        setErrors(formattedErrors);
      } else if (msg) {
        toast.error(msg);
      } else {
        toast.error("Failed to update store information");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:pl-65 min-h-screen bg-gray-50 flex flex-col items-center justify-center mb-20 md:mb-0">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md min-h-screen md:min-h-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Edit Store Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 ${
                errors.storeName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.storeName && (
              <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors["storeDetails.phoneNumber"] && (
              <p className="text-xs text-red-500 mt-1">{errors["storeDetails.phoneNumber"]}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors["storeDetails.address"] && (
              <p className="text-xs text-red-500 mt-1">{errors["storeDetails.address"]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-600 text-white py-2.5 rounded-lg font-semibold hover:bg-pink-700 transition ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <FooterNavStore />
    </div>
  );
};

export default EditStoreInfoPage;
