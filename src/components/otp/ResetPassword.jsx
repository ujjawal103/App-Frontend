import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔐 redirect if opened directly
  useEffect(() => {
    if (!state) {
      navigate("/store-login");
    }
  }, [state, navigate]);

  if (!state) return null;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}stores/reset-password`,
        {
          email: state.email,
          otp: state.otp,
          newPassword: password
        }
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Password reset successful");
      navigate("/store-home");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:justify-between bg-white">

      {/* LEFT BANNER */}
      <div className="hidden md:flex md:items-center md:justify-center md:w-full md:h-screen">
        <img src="/authBanner.png" className="w-full h-full object-cover" />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 max-w-md p-5 bg-white min-h-screen flex flex-col justify-between">
        <form  className="w-full max-w-md">

          <img src="/logo.png" className="w-16 mb-4 rounded-xl" />

          <h2 className="text-2xl font-semibold mb-4">
            Set New Password
          </h2>

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-2 border rounded pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full p-2 border rounded pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          

        </form>
        <button
            disabled={loading}
            onClick={submitHandler}
            className="w-full py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            {loading ? "Saving..." : "Save & Login"}
          </button>
      </div>
    </div>
  );
};

export default ResetPassword;
