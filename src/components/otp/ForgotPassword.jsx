import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email required");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}stores/forgot-password`,
        { email }
      );

      toast.success("OTP sent to email");

      // 👉 reuse OTP page
      navigate("/verify-otp", {
        state: {
            email,
            flow: "RESET_PASSWORD"
        }
        });


    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors[0]?.msg || "Something went wrong");
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

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 max-w-md p-5 bg-white min-h-screen flex flex-col justify-between">
        <form className="w-full max-w-md">
          <img src="/logo.png" className="w-16 mb-4 rounded-xl" />

          <h2 className="text-2xl font-semibold mb-2">
            Forgot Password
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            Enter your registered email to receive OTP
          </p>

          <input
            type="email"
            required
            placeholder="store@example.com"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          
        </form>
        <button
            disabled={loading}
            onClick={submitHandler}
            className="w-full py-2 bg-pink-600 text-white rounded-lg font-semibold"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
