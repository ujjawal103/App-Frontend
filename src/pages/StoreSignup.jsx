import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { StoreDataContext } from "../context/StoreContext";

const StoreSignup = () => {
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [gstApplicable, setGstApplicable] = useState(false);
  const [gstRate, setGstRate] = useState("");
  const [restaurantChargeApplicable, setRestaurantChargeApplicable] = useState(false);
  const [restaurantCharge, setRestaurantCharge] = useState("");

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { setStore } = useContext(StoreDataContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const submitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("Sending OTP...");
  setError("");
  setValidationErrors({});

  try {
    if (!gstApplicable) {
        setGstRate("");
      }
    if (!restaurantChargeApplicable) {
        setRestaurantCharge("");
      }


    const storeData = {
      storeName,
      email,
      password,
      storeDetails: { address, phoneNumber },
      gstSettings: {
        gstApplicable,
        gstRate: parseFloat(gstRate),
        restaurantChargeApplicable,
        restaurantCharge: parseFloat(restaurantCharge),
      },
    };

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}stores/register`,
      storeData
    );

    navigate("/verify-otp", {
      state: {
        email,
        tempData: storeData,
        flow: "VERIFY_EMAIL"
      }
    });



  } catch (error) {
      console.error("❌ Error in registerStore:", error);
      console.log("❌ Error Response Data:", error.response?.data?.errors);

      // ✅ Handle backend validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const formattedErrors = {};

        validationErrors.forEach((err) => {
          formattedErrors[err.path] = err.msg;
        });

        setValidationErrors(formattedErrors);
        toast.error("Please correct the highlighted fields!");
      } else {
        setError(
          error.response?.data?.message ||
            "Some error occurred during registration."
        );
      }
  } finally {
    setLoading(false);
    setMessage("");
  }
};




  return (
    <>
      {/* {loading && <Loading message={message} width="full" />} */}
      <div className="min-h-screen w-full flex items-center justify-center md:justify-between bg-white">
        <div className="hidden md:flex md:items-center md:justify-center md:w-full md:h-screen">
          <img src="/authBanner.png" alt="banner" className="object-cover w-full h-full"/>
        </div>
        <div className="w-full max-w-md  p-5 rounded-lg bg-white min-h-screen">
          <form onSubmit={submitHandler} className="flex flex-col text-sm">
            <div className="flex justify-start mb-3">
              <img className="w-16 rounded-2xl" src="/logo.png" alt="Logo" />
            </div>

            <h3 className="text-lg font-semibold mb-1">Store Name</h3>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-1 text-sm"
              type="text"
              placeholder="Enter store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
            {validationErrors.storeName && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.storeName}</p>
            )}

            <h3 className="text-lg font-semibold mb-1">Email</h3>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-1 text-sm"
              type="email"
              placeholder="store@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.email}</p>
            )}

            <h3 className="text-lg font-semibold mb-1">Password</h3>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mb-1">{validationErrors.password}</p>
            )}

            <h3 className="text-lg font-semibold mb-1">Store Details</h3>
            <div className="md:flex gap-2">
              <input
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded mb-1 text-sm"
                type="number"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <input
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded mb-1 text-sm"
                type="text"
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {validationErrors["storeDetails.phoneNumber"] && (
              <p className="text-red-500 text-xs mb-1">
                {validationErrors["storeDetails.phoneNumber"]}
              </p>
              )}
            {validationErrors["storeDetails.address"] && (
              <p className="text-red-500 text-xs mb-1">
                {validationErrors["storeDetails.address"]}
              </p>
            )}


            {/* <h3 className="text-lg font-semibold mb-1">GST & Charges</h3>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={gstApplicable}
                onChange={() => setGstApplicable(!gstApplicable)}
                className="mr-2"
              />
              <label>GST Applicable</label>
            </div>
            {gstApplicable && (
              <input
                className="w-full p-2 border border-gray-300 rounded mb-1 text-sm"
                type="number"
                placeholder="GST Rate (e.g. 0.18)"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                required
              />
            )}

            {validationErrors["gstSettings.gstRate"] && (
              <p className="text-red-500 text-xs mb-1">
                {validationErrors["gstSettings.gstRate"]}
              </p>
            )}

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={restaurantChargeApplicable}
                onChange={() =>
                  setRestaurantChargeApplicable(!restaurantChargeApplicable)
                }
                className="mr-2"
              />
              <label>Restaurant Charge Applicable</label>
            </div>

            {restaurantChargeApplicable && (
              <input
                className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
                type="number"
                placeholder="Restaurant Charge (₹)"
                value={restaurantCharge}
                onChange={(e) => setRestaurantCharge(e.target.value)}
                required
              />
            )}

            {validationErrors["gstSettings.restaurantCharge"] && (
              <p className="text-red-500 text-xs mb-1">
                {validationErrors["gstSettings.restaurantCharge"]}
              </p>
            )} */}

            {error && <p className="text-red-500 mb-2 text-xs">{error}</p>}

            <button className="w-full py-2 rounded bg-pink-600 text-white text-base font-semibold hover:bg-pink-700 transition mt-5">
              {loading ? "Submitting..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-3">
            Already have a store?{" "}
            <Link to={"/store-login"} className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

    </>
  );
};

export default StoreSignup;

