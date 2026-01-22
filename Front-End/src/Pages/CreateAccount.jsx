import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PublicNavbar from "../Components/PublicNavbar";
import PublicFooter from "../Components/PublicFooter";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    inviteCode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    // First Name
    if (!form.firstName.trim()) {
      newErrors.firstName = "Prénom est requis";
    } else if (form.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    }

    // Last Name
    if (!form.lastName.trim()) {
      newErrors.lastName = "Nom de famille est requis";
    } else if (form.lastName.trim().length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters";
    }

    // Phone
    if (!form.phone.trim()) {
      newErrors.phone = "Numéro de téléphone est requis";
    } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Mot de passe est requis";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(form.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        FirstName: form.firstName.trim(),
        LastName: form.lastName.trim(),
        PhoneNumber: form.phone.trim(),
        Email: form.email.trim(),
        Password: form.password,
      };

      // Send invite code only if provided
      if (form.inviteCode.trim()) {
        payload.referralCode = form.inviteCode.trim();
      }

      const res = await axios.post(
        "https://api.emibocquillon.fr/api/auth/signup",
        payload,
        { headers: { "Content-Type": "application/json" } },
      );

      // ✅ SUCCESS TOAST (API-driven)
      toast.success(res.data?.message || "Account created successfully");

      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create account. Please try again.";

      // ❌ ERROR TOAST
      toast.error(message);

      // keep inline error if you still want it
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      {/* Header */}
      <div className="bg-[#063c35] py-10 text-center text-white">
        <div className="flex items-center justify-center gap-3 text-xl font-semibold">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <FaUser />
          </span>
          <h1 className="text-2xl md:text-4xl">Créer un compte</h1>
        </div>
        <p className="text-lg text-white/70 mt-1">
          Créez un compte pour poursuivre votre analyse de rentabilité.
        </p>
      </div>

      {/* Form */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mt-14">
          {apiError && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <Field
                label="Prénom"
                icon={<FaUser />}
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="John"
              />

              {/* Last Name */}
              <Field
                label="Nom de famille"
                icon={<FaUser />}
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Doe"
              />

              {/* Phone */}
              <Field
                label="Téléphone"
                icon={<FaPhone />}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+91 9876543210"
              />

              {/* Email */}
              <Field
                label="Email"
                icon={<FaEnvelope />}
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="user@email.com"
              />

              {/* Password */}
              <Field
                label="Mot de passe"
                icon={<FaLock />}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
              />

              {/* Invite Code (OPTIONAL) */}
              <Field
                label="Code d'invitation (facultatif)"
                icon={<FaLock />}
                name="inviteCode"
                value={form.inviteCode}
                onChange={handleChange}
                error={errors.inviteCode}
                placeholder="Enter invite code"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex-1 bg-gray-100 py-3 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Se connecter
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#063c35] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#052f2a] disabled:opacity-60"
              >
                {loading ? "Création..." : "Créer un compte"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

/* ============================
   Reusable Field Component
============================ */
function Field({ label, icon, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div
        className={`flex items-center rounded-lg px-3 border ${
          error ? "border-red-500 bg-red-50" : "border-transparent bg-gray-100"
        }`}
      >
        <span className="text-gray-400">{icon}</span>
        <input
          {...props}
          className="w-full bg-transparent px-2 py-3 outline-none text-sm"
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
