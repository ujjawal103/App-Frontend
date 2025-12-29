import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";


const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-5 px-4 pb-20 md:pb-5">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          Support
        </h1>
        <p className="text-gray-500 mb-10">
          We’re here to help you with any questions or issues related to TapResto.
        </p>

        {/* Support Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          
          {/* Email Support */}
          <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">
              📧 Email Support
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Reach out to us anytime via email.
            </p>
            <p className="font-medium text-gray-900">
              support@tapresto.com
            </p>
          </div>

          {/* Support Hours */}
          <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">
              ⏰ Support Hours
            </h3>
            <p className="text-gray-700 text-sm">
              Monday – Saturday
            </p>
            <p className="font-medium text-gray-900">
              10:00 AM – 6:00 PM (IST)
            </p>
          </div>

          {/* Response Time */}
          <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">
              ⏱ Response Time
            </h3>
            <p className="text-gray-700 text-sm">
              We usually respond within
            </p>
            <p className="font-medium text-gray-900">
              24 hours
            </p>
          </div>

          {/* Urgent Issues */}
          <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">
              🚨 Urgent Issues
            </h3>
            <p className="text-gray-700 text-sm">
              For critical business issues, mention
            </p>
            <p className="font-medium text-gray-900">
              “URGENT” in the email subject
            </p>
          </div>

          {/* Phone Support */}
            <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-2 flex items-center gap-2">
                <FaPhoneAlt /> Phone Support
            </h3>
            <p className="text-gray-700 text-sm mb-2">
                Call us during support hours.
            </p>
            <p className="font-medium text-gray-900">
               <a href="tel:+917800466039">+91 7800466039</a>
            </p>
            </div>

            {/* Social Media */}
            <div className="border border-pink-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-pink-600 mb-3">
                🌐 Connect With Us
            </h3>

            <div className="flex items-center gap-4">
                <a
                href="https://instagram.com/tapresto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:scale-110 transition"
                >
                <FaInstagram size={22} />
                </a>

                <a
                href="https://linkedin.com/company/tapresto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:scale-110 transition"
                >
                <FaLinkedin size={22} />
                </a>

                <a
                href="https://twitter.com/tapresto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:scale-110 transition"
                >
                <FaXTwitter size={22} />
                </a>
            </div>

            <p className="text-gray-700 text-sm mt-3">
                Follow us for updates, features & announcements.
            </p>
            </div>


        </div>

        {/* Note */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-10">
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Important Note
          </h3>
          <p className="text-gray-700 leading-relaxed">
            TapResto provides technical support for the platform.
            Order disputes, cancellations, and refunds are handled directly
            between the restaurant and the customer.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 text-white bg-pink-600 p-2 px-4 rounded-md font-medium hover:opacity-90"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 text-pink-600 font-medium hover:underline"
          >
            Go to Home
            <span className="text-lg">→</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Support;
