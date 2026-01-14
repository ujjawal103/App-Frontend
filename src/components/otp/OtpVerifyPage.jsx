import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OtpVerifyPage = ({ email, tempData, flow, onSuccess }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- OTP INPUT ---------------- */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter full OTP");
      return;
    }

    try {
      setLoading(true);

      // 🔐 FORGOT PASSWORD FLOW
      if (flow === "RESET_PASSWORD") {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}stores/verify-reset-otp`,
          {
            email,
            otp: enteredOtp
          }
        );

        toast.success("OTP verified");
        navigate("/reset-password", {
          state: {
            email,
            otp: enteredOtp
          }
        });
      }

      // 🏪 SIGNUP FLOW
      else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}stores/verify-signup-otp`,
          {
            email,
            otp: enteredOtp,
            tempData
          }
        );

        toast.success("Email verified successfully");
        onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
      setOtp(new Array(6).fill(""));
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    if (loading || !canResend) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}stores/resend-otp`,
        {
          email,
          type: flow === "RESET_PASSWORD"
            ? "RESET_PASSWORD"
            : "VERIFY_EMAIL"
        }
      );

      toast.success("OTP resent successfully");
      setTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
      inputsRef.current[0]?.focus();

    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen w-full flex items-center justify-center md:justify-between bg-white">

      {/* LEFT BANNER */}
      <div className="hidden md:flex md:items-center md:justify-center md:w-full md:h-screen">
        <img
          src="/authBanner.png"
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 max-w-md p-5 bg-white min-h-screen flex flex-col justify-between">

        <div>
          <img src="/logo.png" className="w-16 mb-4 rounded-xl" />

          <h2 className="text-2xl font-semibold mb-1">
            Verify your email
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            Enter the 6-digit OTP sent to <b>{email}</b>
          </p>

          {/* OTP BOXES */}
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="w-12 h-12 border rounded-lg text-center text-lg font-semibold
                           focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            ))}
          </div>

          {/* RESEND */}
          <p className="text-sm text-right text-gray-500 mb-4">
            {canResend ? (
              <>
                <small>Also check spam folder if you didn't see email.</small><br />
                <button
                  onClick={resendOtp}
                  disabled={loading || !canResend}
                  className={`text-pink-600 font-semibold hover:underline ml-2
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Resend OTP
                </button>
              </>
            ) : (
              <>Please enter or Resend OTP in <b>{timer}s</b></>
            )}
          </p>
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full py-2 bg-pink-600 text-white rounded-lg
                     font-semibold hover:bg-pink-700 transition"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
