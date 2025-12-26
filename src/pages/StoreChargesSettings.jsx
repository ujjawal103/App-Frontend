import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2, Percent, ReceiptIndianRupee, Building2 } from "lucide-react";
import { StoreDataContext } from "../context/StoreContext";
import FooterNavStore from "../components/FooterNavStore";

const StoreChargesSettings = () => {
  const { store, setStore } = useContext(StoreDataContext);
  const [settings, setSettings] = useState({
    gstApplicable: false,
    gstRate: 0,
    restaurantChargeApplicable: false,
    restaurantCharge: 0,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (store?.gstSettings) {
      setSettings({
        gstApplicable: store.gstSettings.gstApplicable || false,
        gstRate: store.gstSettings.gstRate
          ? store.gstSettings.gstRate * 100
          : 0,
        restaurantChargeApplicable:
          store.gstSettings.restaurantChargeApplicable || false,
        restaurantCharge: store.gstSettings.restaurantCharge || 0,
      });
    }
  }, [store]);

  const updateCharges = async (updatedFields) => {
    try {
      const res = await axios.put(
        `${BASE_URL}stores/gst-settings`,
        {
          ...settings,
          ...updatedFields,
          gstRate:
            (updatedFields.gstRate ?? settings.gstRate) / 100,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Settings updated!");
      setErrors({});
      setStore((prev) => ({
        ...prev,
        gstSettings: res.data.gstSettings,
      }));
      setSettings((prev) => ({
        ...prev,
        ...updatedFields,
      }));
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(
          (e) => (fieldErrors[e.path] = e.msg)
        );
        setErrors(fieldErrors);
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }
    }
  };

  const handleToggle = async (field) => {
    const updated = !settings[field];
    setSettings((prev) => ({ ...prev, [field]: updated }));
    await updateCharges({ [field]: updated });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateCharges(settings);
    setSaving(false);
  };

  return (
    <div className="w-full md:pl-65 p-4 bg-gray-100 min-h-screen [@media(max-height:656px)]:mb-22">
      <div className="max-w-5xl mx-auto mt-0 md:mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-800">
          <Building2 className="text-blue-600" /> Store Charges Settings
        </h2>

        {/* GST CARD */}
        <div
          className={`p-6 rounded-2xl border shadow-md mb-6 transition-all duration-300 ${
            !settings.gstApplicable
              ? "grayscale bg-gray-100 border-gray-300"
              : "bg-white border-green-300"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Percent className="text-green-600" /> GST Settings
            </h3>

            {/* Toggle */}
            <button
              onClick={() => handleToggle("gstApplicable")}
              className={`relative w-16 h-8 rounded-full transition-all ${
                settings.gstApplicable ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                  settings.gstApplicable ? "translate-x-8" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>

          {!settings.gstApplicable ? (
            <div className="text-sm text-gray-700 font-medium mt-2">
              <span className="text-red-500 font-semibold uppercase mr-2">
                Not Applicable
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                {settings.gstRate}% GST (Stored)
              </span>
            </div>
          ) : (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                GST Rate (%)
              </label>
              <div className="relative mt-2 w-40">
                <input
                  type="number"
                  name="gstRate"
                  value={settings.gstRate}
                  onChange={handleChange}
                  className="w-full pr-8 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  placeholder="e.g. 18"
                  min="0"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-medium">
                  %
                </span>
              </div>
              {errors.gstRate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gstRate}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RESTAURANT CHARGE CARD */}
        <div
          className={`p-6 rounded-2xl border shadow-md transition-all duration-300 ${
            !settings.restaurantChargeApplicable
              ? "grayscale bg-gray-100 border-gray-300"
              : "bg-white border-blue-300"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <ReceiptIndianRupee className="text-blue-600" /> Restaurant Charge
            </h3>

            {/* Toggle */}
            <button
              onClick={() => handleToggle("restaurantChargeApplicable")}
              className={`relative w-16 h-8 rounded-full transition-all ${
                settings.restaurantChargeApplicable
                  ? "bg-blue-500"
                  : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all ${
                  settings.restaurantChargeApplicable
                    ? "translate-x-8"
                    : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>

          {!settings.restaurantChargeApplicable ? (
            <div className="text-sm text-gray-700 font-medium mt-2">
              <span className="text-red-500 font-semibold uppercase mr-2">
                Not Applicable
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">
                ₹{settings.restaurantCharge} (Stored)
              </span>
            </div>
          ) : (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Restaurant Charge (₹)
              </label>
              <div className="relative mt-2 w-40">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  name="restaurantCharge"
                  value={settings.restaurantCharge}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="e.g. 50"
                  min="0"
                />
              </div>

              {errors.restaurantCharge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantCharge}
                </p>
              )}
            </div>
          )}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Saving...
            </>
          ) : (
            "💾 Save Changes"
          )}
        </button>
      </div>
      <FooterNavStore />
    </div>
  );
};

export default StoreChargesSettings;
