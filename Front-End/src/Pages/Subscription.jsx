import { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheck, FaTimes, FaEuroSign } from "react-icons/fa";

export default function Subscription() {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);

 const handlePlusCheckout = async () => {
  try {
    setLoading(true);

    // monthly = 15, yearly = 150 (no *100, backend handles conversion)
    const euroAmount = billing === "yearly" ? 150 : 15;

    const response = await axios.post(
      "https://jytec-investment-api.onrender.com/api/stripe/checkout-payment",
      {
        code: "NEW50",
        name: billing === "yearly" ? "Yearly Plan" : "Monthly Plan",
        amount: euroAmount
      },
      { withCredentials: true }
    );

    if (response.data && response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error("Stripe checkout URL not found");
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    alert("Unable to start payment. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="bg-[#063c35] py-10 md:py-15 text-white text-center">
        <div className="flex items-center justify-center gap-3 text-lg font-semibold">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <FaEuroSign />
          </span>
          <h1 className=" text-2xl heading md:text-4xl"> Pricing</h1>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h1 className="text-2xl md:text-4xl md:w-1/3 mx-auto font-bold">
          Powerful features for{" "}
          <span className=" bg-linear-to-l from-[#34941F] to-[#066757] bg-clip-text text-transparent">
            powerful creators
          </span>
        </h1>
        <p className="text-gray-800 mt-4">Choose a plan that’s right for you</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={`text-sm ${
              billing === "monthly" ? "font-semibold" : "text-gray-400"
            }`}
          >
            Pay Monthly
          </span>
          <button
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
            className="relative w-12 h-6 bg-gray-300 rounded-full"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                billing === "yearly" ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              billing === "yearly" ? "font-semibold" : "text-gray-400"
            }`}
          >
            Pay Yearly
          </span>
          <span className="text-green-600 text-sm ml-2">Save 25%</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Card */}
          <div className="rounded-2xl border p-6 bg-white shadow-md flex flex-col">
            <h3 className="font-semibold text-lg">Free</h3>
            <p className="text-sm mt-1 text-gray-500">
              Get started with basic profitability insights
            </p>

            <div className="mt-6">
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">€0</span>
                <span className="text-sm text-gray-500">/ Month</span>
              </div>
            </div>

            <button className="mt-6 py-2 rounded-md border border-[#063c35] text-[#063c35] text-sm font-medium hover:bg-[#063c35] hover:text-white transition">
              Get Started Now
            </button>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-500" />
                Run up to 4 simulations
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-500" />
                Generate 4 profitability reports
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-500" />
                Download 4 PDF reports
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-500" />
                Real-time calculations
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-500" />
                Core metrics & profitability
              </li>

              <li className="flex gap-2 text-gray-400">
                <FaTimes className="mt-1" />
                No graphical analysis
              </li>
              <li className="flex gap-2 text-gray-400">
                <FaTimes className="mt-1" />
                No VAT optimization
              </li>
              <li className="flex gap-2 text-gray-400">
                <FaTimes className="mt-1" />
                Limited history
              </li>
              <li className="flex gap-2 text-gray-400">
                <FaTimes className="mt-1" />
                Standard support
              </li>
            </ul>
          </div>

          {/* Plus Card */}
          <div className="rounded-2xl border p-6 bg-[#063c35] text-white shadow-xl scale-105 flex flex-col">
            <h3 className="font-semibold text-lg">Plus</h3>
            <p className="text-sm mt-1 text-white/80">
              Deeper analysis for confident decisions
              <br />
              Best for active investors
            </p>

            <div className="mt-6">
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">
                  €{billing === "yearly" ? 150 : 15}
                </span>
                <span className="text-sm text-white/70">
                  / {billing === "yearly" ? "Year" : "Month"}
                </span>
              </div>

              {billing === "yearly" && (
                <div className="text-sm mt-1 text-white/60">
                  <span className="line-through mr-2">€180</span>
                  <span className="text-green-400">Save €30</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePlusCheckout}
              disabled={loading}
              className="mt-6 py-2 rounded-md bg-white text-[#063c35] text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Get Started Now"}
            </button>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Everything in Free
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Unlimited simulations
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Unlimited reports & downloads
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Full simulation history
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Graphical analysis
              </li>
              <li className="flex gap-2">
                <FaCheck className="mt-1 text-green-400" />
                Advanced VAT optimization
              </li>

              <li className="flex gap-2 text-gray-400">
                <FaTimes className="mt-1" />
                No expert consultation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plan({
  title,
  price,
  billing,
  desc,
  features,
  disabled = [],
  featured,
}) {
  const isYearly = billing === "yearly";

  const displayPrice =
    typeof price === "object"
      ? isYearly
        ? price.yearlyDiscount
        : price.monthly
      : price;

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        featured
          ? "bg-[#063c35] text-white scale-105 shadow-xl"
          : "bg-white shadow-md"
      }`}
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p
        className={`text-sm mt-1 ${
          featured ? "text-white/80" : "text-gray-500"
        }`}
      >
        {desc}
      </p>

      <div className="mt-6">
        {/* main price row */}
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">€{displayPrice}</span>
          <span
            className={`text-sm ${
              featured ? "text-white/70" : "text-gray-500"
            }`}
          >
            / {isYearly ? "Year" : "Month"}
          </span>
        </div>

        {/* show original yearly price only when yearly + discount is present */}
        {typeof price === "object" && isYearly && price.yearlyOriginal && (
          <div
            className={`text-sm mt-1 ${
              featured ? "text-white/60" : "text-gray-500"
            }`}
          >
            <span className="line-through mr-2">€{price.yearlyOriginal}</span>
            <span className="text-green-400">
              You save €{price.yearlyOriginal - price.yearlyDiscount}
            </span>
          </div>
        )}
      </div>

      <button
        className={`mt-6 py-2 rounded-md border text-sm font-medium transition ${
          featured
            ? "bg-white text-[#063c35]"
            : "border-[#063c35] text-[#063c35] hover:bg-[#063c35] hover:text-white"
        }`}
      >
        Get Started Now
      </button>

      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <FaCheck className="mt-1 text-green-500" /> {f}
          </li>
        ))}
        {disabled.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-400">
            <FaTimes className="mt-1" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
