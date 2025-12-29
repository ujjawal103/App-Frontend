import React from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: "Step 1",
    title: "Sign Up & Store Registration",
    desc: "Create your account and connect with the TapResto admin to complete your store registration."
  },
  {
    step: "Step 2",
    title: "Login to Your Store",
    desc: "Login using your registered email address and password to access your store dashboard."
  },
  {
    step: "Step 3",
    title: "Upload Restaurant Details",
    desc: "Add all required restaurant details such as banner image, photos, address, and basic information."
  },
  {
    step: "Step 4",
    title: "Download Android App",
    desc: "From the website footer, download the TapResto Android app for easy navigation and management."
  },
  {
    step: "Step 5",
    title: "Add Tables & Generate QR",
    desc: "Go to the Table Management page and click on “Add Table” to create tables and generate QR codes."
  },
  {
    step: "Step 6",
    title: "Add Menu Items",
    desc: "Add all food items category-wise and upload required images for each item."
  },
  {
    step: "Step 7",
    title: "Print & Place QR Codes",
    desc: "Print the generated QR codes and place them on restaurant tables for QR-based ordering."
  },
  {
    step: "Step 8",
    title: "Create Orders from Counter",
    desc: "Use the Create Order page to place orders directly from the counter."
  },
  {
    step: "Step 9",
    title: "Print Orders & Track Everything",
    desc: "From the Orders page, print orders and manage them digitally."
  }
];

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-5 px-4 pb-20 md:pb-5">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 md:p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          Help Center
        </h1>
        <p className="text-gray-500 mb-10">
          Follow these simple steps to start managing your restaurant digitally with TapResto.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="border border-pink-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <span className="inline-block text-sm font-semibold text-white bg-pink-600 px-3 py-1 rounded-full mb-4">
                {item.step}
              </span>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Final Message */}
        <div className="mt-12 bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">
            🎉 You’re All Set!
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Congratulations! You will now receive all your restaurant activities digitally,
            get real-time notifications for new orders, and enjoy free analytics to grow your business.
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
            onClick={() => navigate("/support")}
            className="inline-flex items-center justify-center gap-2 text-pink-600 font-medium hover:underline"
          >
            Need More Help?
            <span className="text-lg">→</span>
            <span className="text-sm">(Support)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;
