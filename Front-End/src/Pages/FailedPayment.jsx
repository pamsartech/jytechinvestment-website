import React from "react";
import { FaTimesCircle } from "react-icons/fa";

export default function FailedPayment() {
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
        {/* Error icon */}
        <div className="flex justify-center mb-6">
          <FaTimesCircle className="text-red-600" size={64} />
        </div>

        <h2 className="text-3xl font-semibold">
          Payment Failed
        </h2>

        <p className="text-gray-600 mt-2">
          Unfortunately your payment could not be processed.
          Please verify your card details or try again with a different payment method.
        </p>

        {/* Failure details card */}
        <div className="mt-10 border border-gray-400 rounded-2xl shadow-sm p-8 max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">
            Plus Plan – €15 / Month
          </h3>

          <p className="text-sm text-gray-600">
            Your subscription has not been activated yet.
          </p>

          <ul className="text-left mt-6 space-y-2 text-gray-700">
            <li>• Card issuer declined the transaction</li>
            <li>• Insufficient funds</li>
            <li>• Incorrect card information</li>
            <li>• Bank blocked international online payments</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/pricing")}
            className="px-6 py-3 rounded-xl bg-[#07332C] text-white font-medium hover:opacity-90 transition"
          >
            Try Payment Again
          </button>

          <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
