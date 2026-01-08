import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessPayment() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      {/* <div className="w-full bg-[#07332C] py-4 flex justify-center">
        <h1 className="text-white text-xl font-semibold tracking-wide flex items-center gap-2">
          €
          <span>Pricing</span>
        </h1>
      </div> */}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-600" size={64} />
        </div>

        <h2 className="text-3xl font-semibold">
          Payment Successful
        </h2>

        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your subscription is now active.
        </p>

        {/* Plan card */}
        <div className="mt-10 border border-gray-400 rounded-2xl shadow-sm p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">
            Plus Plan
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Deeper analysis for confident decisions
          </p>

          <div className="text-3xl font-bold">
            €15 <span className="text-base font-normal">/ Month</span>
          </div>

          <ul className="text-left mt-6 space-y-2 text-gray-700">
            <li>✔ Unlimited simulations</li>
            <li>✔ Unlimited reports & downloads</li>
            <li>✔ Full simulation history</li>
            <li>✔ Graphical analysis</li>
            <li>✔ Advanced VAT optimization</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-xl bg-[#07332C] text-white font-medium hover:opacity-90 transition">
            Go to Dashboard
          </button>

          {/* <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition">
            Manage Subscription
          </button> */}
        </div>
      </div>
    </div>
  );
}
