import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PublicNavbar from "../Components/PublicNavbar";
import PublicFooter from "../Components/PublicFooter";

export default function PasswordReset() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // -------------------------
  // Validation helpers
  // -------------------------
  const validateEmailStep = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "L'adresse e-mail est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "S'il vous plaît, mettez une adresse email valide.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateResetStep = () => {
    const errors = {};

    if (!otp.trim()) {
      errors.otp = "OTP is required";
    } else if (!/^\d{4,6}$/.test(otp)) {
      errors.otp = "OTP must be 4–6 digits";
    }

    if (!newPassword) {
      errors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter and one number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  // -------------------------
  // Submit handlers
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmailStep()) return;

    try {
      setLoading(true);

      await axios.post(
        "https://api.emibocquillon.fr/api/auth/forgot-password",
        { email }
      );

      toast.success("OTP has been sent to your email");
      setStep("reset");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateResetStep()) return;

    try {
      setLoading(true);

      await axios.post(
        "https://api.emibocquillon.fr/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <div className="bg-[#063c35] py-14 md:py-20 text-center text-white">
        <div className="flex items-center justify-center gap-3 text-xl font-semibold">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <FaUser />
          </span>
          <h1 className="text-2xl md:text-3xl heading">Mot de passe oublié</h1>
        </div>
      </div>

      <div className="flex justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <FaLock className="text-gray-600" />
            </span>
            <h2 className="text-xl font-semibold">Mot de passe oublié</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
                  Email
                </label>
                <div
                  className={`flex items-center bg-gray-100 rounded-lg px-3 ${
                    fieldErrors.email ? "border border-red-400" : ""
                  }`}
                >
                  <FaEnvelope className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className="w-full bg-transparent px-2 py-3 outline-none text-sm"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#063c35] hover:bg-[#108e7d] text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Envoyez OTP"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP */}
              <div>
                <label className="block text-sm font-medium mb-1">OTP</label>
                <input
                  type="text"
                  value={otp}
                  placeholder="Saisissez le code OTP"
                  maxLength={6}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\s/g, ""));
                    clearFieldError("otp");
                  }}
                  className={`w-full bg-gray-100 px-3 py-3 rounded-lg outline-none ${
                    fieldErrors.otp ? "border border-red-400" : ""
                  }`}
                />
                {fieldErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.otp}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  placeholder="Saisissez un nouveau mot de passe"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearFieldError("newPassword");
                  }}
                  className={`w-full bg-gray-100 px-3 py-3 rounded-lg outline-none ${
                    fieldErrors.newPassword ? "border border-red-400" : ""
                  }`}
                />
                {fieldErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.newPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#063c35] hover:bg-[#108e7d] text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
