import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mb-8">
          Last updated on <span className="font-medium">December 05, 2025</span>
        </p>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto respects your privacy and is committed to protecting the information
            you share with us. This Privacy Policy explains how we collect, use, and safeguard
            your data when you use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Store name, owner name, email address, and phone number</li>
            <li>Account login details</li>
            <li>Menu items, orders, and transaction-related information</li>
            <li>Device and usage information such as IP address and browser type</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>To create and manage your TapResto account</li>
            <li>To enable QR-based ordering and store operations</li>
            <li>To improve platform performance and user experience</li>
            <li>To communicate updates, alerts, and support information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            4. Payment Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto does not store sensitive payment details. All payment transactions
            are securely processed through trusted third-party payment service providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            5. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We implement reasonable security measures to protect your data. However, no
            online system can guarantee complete security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            6. Cookies
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto may use cookies to enhance functionality, analyze usage, and improve
            user experience.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            7. Third-Party Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may use third-party tools for analytics, notifications, and payments.
            These services operate under their own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            8. Your Rights
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You may access, update, or request deletion of your account information by
            contacting our support team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            9. Policy Updates
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Continued use of TapResto
            implies acceptance of the updated policy.
          </p>
        </section>

        {/* Navigation */}
       <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
  
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 text-white bg-pink-600 p-2 px-4 rounded-md font-medium hover:opacity-90"
            >
                <span className="text-lg">←</span>
                Back
            </button>

            {/* Next */}
            <Link
                to="/cancellation-refund-policy"
                className="inline-flex items-center justify-center gap-2 text-pink-600 font-medium hover:underline"
            >
                Next
                <span className="text-lg">→</span>
                <span className="text-sm">(Refund & Cancellation)</span>
            </Link>
        </div>


      </div>
    </div>
  );
};

export default PrivacyPolicy;
