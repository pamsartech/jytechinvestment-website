import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PublicNavbar from "../Components/PublicNavbar";
import PublicFooter from "../Components/PublicFooter";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // -------------------------
  // Validation helpers
  // -------------------------
  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "L'adresse e-mail est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "S'il vous plaît, mettez une adresse email valide.";
    }

    if (!password) {
      errors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit comporter au moins 6 caractères.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------
  // Submit handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.emibocquillon.fr/api/auth/signin",
        {
          Email: email,
          Password: password,
        },
      );

      const { token } = response.data;
      login(token);

      // ✅ Success toast
      toast.success("Connexion réussie. Bienvenue de retour !");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";

      setError(message);

      // ❌ Failure toast
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      {/* Top Header */}

      <div className="bg-[#063c35] py-10 text-center text-white">
        <div className="flex items-center justify-center gap-3 text-xl font-semibold">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <FaUser />
          </span>
          <h1 className="text-2xl md:text-3xl">Se connecter</h1>
        </div>
        <p className="text-lg text-white/70 mt-1 px-2">
         Connectez-vous pour poursuivre votre analyse de rentabilité.
        </p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <FaLock className="text-gray-600" />
            </span>
            <h2 className="text-xl font-semibold">Se connecter</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-1">
                Email
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="voter12@email.com"
                  className="w-full bg-transparent px-2 py-3 outline-none text-sm"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-1">
                Mot de passe
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••"
                  className="w-full bg-transparent px-2 py-3 outline-none text-sm"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#063c35] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#052f2a] transition disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-account")}
                className="flex-1 bg-gray-100 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Créer un compte
              </button>
            </div>
          </form>

          <p
            onClick={() => navigate("/password-reset")}
            className="text-end text-sm text-gray-600 underline mt-1 cursor-pointer"
          >
            Mot de passe oublié ?
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
