import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheck, FaTimes, FaEuroSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../Components/PublicNavbar";
import PublicFooter from "../Components/PublicFooter";

export default function PublicSubscription() {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const freePlan = plans.find((p) => p.type === "basic");
  const plusPlan = plans.find((p) => p.type === "premium");

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAuthError = (err, fallbackMessage) => {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("authToken");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return true;
    }

    toast.error(
      err?.response?.data?.message || fallbackMessage || "Something went wrong",
    );

    return false;
  };

  const fetchPlans = async () => {
  try {
    setPlansLoading(true);

    const res = await axios.get(
      "https://api.emibocquillon.fr/api/admin/get-all"
    );

    const activePlans = res.data.filter((p) => p.isActive);
    setPlans(activePlans);
  } catch (err) {
    console.error(err);

    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      "Session expired. Please log in again.";

    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
    });

    // Redirect on auth failure
    if (status === 401 || status === 403) {
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  } finally {
    setPlansLoading(false);
  }
};


  useEffect(() => {
   
    fetchPlans();
  }, []);

  const getPlanPrice = (plan) => {
    const duration = billing === "yearly" ? 12 : 1;
    return plan.prices.find((p) => p.durationMonths === duration);
  };

  // stripe api
const handlePlusCheckout = () => {
  setLoading(true);

  toast.info("Veuillez vous connecter d'abord.", {
    position: "bottom-right",
    autoClose: 2000,
  });

  setTimeout(() => {
    navigate("/login", { replace: true });
    setLoading(false);
  }, 2000);
};


  //  const handlePlusCheckout = async () => {
  //   try {
  //     setLoading(true);

  //     const euroAmount = billing === "yearly" ? 150 : 15;

  //     const response = await axios.post(
  //       "https://jytec-investment-api.onrender.com/api/stripe/checkout-payment",
  //       {
  //         code: "NEW50",
  //         name: billing === "yearly" ? "Yearly Plan" : "Monthly Plan",
  //         amount: euroAmount
  //       },
  //       authConfig
  //     );

  //     if (response.data && response.data.url) {
  //       window.location.href = response.data.url;
  //     } else {
  //       throw new Error("Stripe checkout URL not found");
  //     }
  //   } catch (err) {
  //     console.error("Stripe checkout error:", err);
  //     alert("Unable to start payment. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="w-full bg-white">
        <PublicNavbar />
      {/* Header */}
      <div className="bg-[#063c35] py-10 md:py-15 text-white text-center">
        <div className="flex items-center justify-center gap-3 text-lg font-semibold">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <FaEuroSign />
          </span>
          <h1 className=" text-2xl heading md:text-4xl">Tarifs </h1>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h1 className="text-2xl md:text-4xl md:w-1/2 mx-auto font-bold">
          Des fonctionnalités puissantes pour{" "}
          <span className=" bg-linear-to-l from-[#34941F] to-[#066757] bg-clip-text text-transparent">
            des créateurs exceptionnels
          </span>
        </h1>
        <p className="text-gray-800 mt-4">Choisissez l’offre adaptée à vos besoins</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={`text-sm ${
              billing === "monthly" ? "font-semibold" : "text-gray-400"
            }`}
          >
            Paiement mensuel 
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
            Paiement annuel 

          </span>
          <span className="text-green-600 text-sm ml-2">Économisez 25 %</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        {plansLoading ? (
          <p className="text-center text-gray-500">Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ================= FREE PLAN CARD ================= */}
            {freePlan && (
              <div className="rounded-2xl border p-6 flex flex-col bg-white shadow-md">
                <h3 className="font-semibold text-lg">{freePlan.name}</h3>

                <p className="text-sm mt-1 text-gray-500">
                  {freePlan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">€0</span>
                    <span className="text-sm text-gray-500">/ À vie</span>
                  </div>
                </div>

                {/* CTA */}
                {/* <button
                  disabled
                  className="mt-6 py-2 rounded-md text-sm font-medium border border-gray-400 text-gray-400 cursor-not-allowed"
                >
                  Current Plan
                </button> */}

                {/* Features */}
                <ul className="mt-6 space-y-3 text-sm">
                  {freePlan.features.map((feature, i) => (
                    <li key={i} className="flex gap-2">
                      <FaCheck className="mt-1 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ================= PLUS PLAN CARD ================= */}
            {plusPlan &&
              (() => {
                const priceObj = getPlanPrice(plusPlan);
                const isYearly = billing === "yearly";

                return (
                  <div className="rounded-2xl border p-6 flex flex-col bg-[#063c35] text-white shadow-xl scale-105">
                    <h3 className="font-semibold text-lg">{plusPlan.name}</h3>

                    <p className="text-sm mt-1 text-white/80">
                      {plusPlan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-6">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold">
                          €{priceObj?.price ?? 0}
                        </span>
                        <span className="text-sm text-white/70">
                          / {isYearly ? "Year" : "Month"}
                        </span>
                      </div>

                      {/* Show discount if actualPrice exists */}
                      {isYearly && priceObj?.actualPrice && (
                        <div className="text-sm mt-1 text-white/60">
                          <span className="line-through mr-2">
                            €{priceObj.actualPrice}
                          </span>
                          <span className="text-green-400">
                            Vous économisez €{priceObj.actualPrice - priceObj.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      disabled={loading}
                      onClick={handlePlusCheckout}
                      className="mt-6 py-2 rounded-md text-sm font-medium bg-white text-[#063c35] transition disabled:opacity-60"
                    >
                      {loading ? "Redirecting..." : "Passer à l’offre Plus"}
                    </button>

                    {/* Features */}
                    <ul className="mt-6 space-y-3 text-sm">
                      {plusPlan.features.map((feature, i) => (
                        <li key={i} className="flex gap-2">
                          <FaCheck className="mt-1 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
          </div>
        )}
      </div>

      <PublicFooter />
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
