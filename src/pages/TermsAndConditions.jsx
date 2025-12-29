import React from "react";
import { Link, useNavigate } from "react-router-dom";



const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-5 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 mb-8">
          Last updated on  <span className="font-medium">December 05, 2025</span>
        </p>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using TapResto, you agree to be bound by these Terms & Conditions.
            If you do not agree, you must not use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            2. Account Responsibility
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials
            and all activities performed under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            3. Restaurant Order Guidelines
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Restaurants must complete all accepted orders.</li>
            <li>
              Menu item availability (available / not available) must always be kept up to date.
            </li>
            <li>
              Any issue caused due to incorrect menu information will be the responsibility of
              the restaurant.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            4. Pricing Transparency
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              The price calculated at the time of order placement is final.
            </li>
            <li>
              Restaurants are not allowed to change prices after order confirmation.
            </li>
            <li>
              TapResto does not control or influence individual restaurant pricing decisions.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            5. Subscription & Platform Fees
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto provides its services on a subscription basis. Subscription pricing and
            features may change with prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            6. Use of Data for Promotion
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            By using TapResto, you grant permission to use aggregated and non-personal store
            performance data for marketing and promotional purposes.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>QR-based order volumes</li>
            <li>Top-selling items by region</li>
            <li>Monthly activity statistics</li>
          </ul>
          <p className="text-gray-700 mt-3">
            No sensitive business, customer, or financial data will be disclosed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            7. Platform Usage Restrictions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Users must not attempt to misuse, disrupt, or gain unauthorized access to the
            TapResto platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto shall not be responsible for business losses, revenue loss, or operational
            issues caused by restaurants or external factors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            9. Termination
          </h2>
          <p className="text-gray-700 leading-relaxed">
            TapResto reserves the right to suspend or terminate access for violations of these
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            10. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms & Conditions are governed by the laws of India.
          </p>
        </section>



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
            to="/privacy-policy"
           className="inline-flex items-center justify-center gap-2 text-pink-600 font-medium hover:underline"
          >
            Next
            <span className="text-lg">→</span>
            <span className="text-sm">(Privacy Policy)</span>
          </Link>
        </div>



      </div>



      

      
    </div>
  );
};

export default TermsAndConditions;
