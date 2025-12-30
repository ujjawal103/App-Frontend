import React from "react";
import { Link, useNavigate } from "react-router-dom";

const RefundAndCancellationPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          Refund & Cancellation Policy
        </h1>
        <p className="text-gray-500 mb-8">
          Last updated on <span className="font-medium">December 05, 2025</span>
        </p>

        {/* Intro */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            This Refund & Cancellation Policy explains how cancellations and refunds
            are handled for both restaurants and users on the TapResto platform.
            By using TapResto, you agree to the terms mentioned below.
          </p>
        </section>

        {/* Restaurant Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            1. Policy for Restaurants
          </h2>

          <ul className="list-disc pl-5 text-gray-700 space-y-3">
            <li>
              Restaurants may cancel their TapResto subscription at any time.
            </li>
            <li>
              Cancellation will stop future renewals but <strong>no refund</strong> will
              be provided for the current active subscription period.
            </li>
            <li>
              Restaurants will continue to have access to TapResto features until
              the end of their current billing cycle.
            </li>
            <li>
              TapResto does not provide partial refunds or credits for unused
              subscription time.
            </li>
          </ul>
        </section>

        {/* User Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            2. Policy for Users (Customers)
          </h2>

          <ul className="list-disc pl-5 text-gray-700 space-y-3">
            <li>
              Order cancellation is <strong>not managed</strong> by the TapResto platform.
            </li>
            <li>
              Users may request cancellation or refund only at the restaurant counter.
            </li>
            <li>
              Refunds are applicable <strong>only if the restaurant agrees </strong>
              to cancel the order.
            </li>
            <li>
              TapResto does not process or guarantee any refunds for user orders.
            </li>
            <li>
              In case of disputes, TapResto will not be responsible for resolution
              between the user and the restaurant.
            </li>
          </ul>
        </section>

        {/* Important Note */}
        <section className="mb-8 bg-pink-50 border border-pink-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Important Notice
          </h3>
          <p className="text-gray-700">
            TapResto acts only as a technology platform for order management.
            All order fulfillment, cancellations, and refunds are the sole
            responsibility of the restaurant.
          </p>
        </section>

        {/* Final Clause */}
        <section>
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            3. Policy Updates
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto reserves the right to update or modify this Refund & Cancellation
            Policy at any time. Continued use of the platform constitutes acceptance
            of the updated policy.
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
            to="/help"
            className="inline-flex items-center justify-center gap-2 text-pink-600 font-medium hover:underline"
          >
            Next
            <span className="text-lg">→</span>
            <span className="text-sm">(Help Center)</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RefundAndCancellationPolicy;
