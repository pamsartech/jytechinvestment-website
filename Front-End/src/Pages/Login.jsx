import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
        "https://jytec-investment-api.onrender.com/api/auth/signin",
        {
          Email: email,
          Password: password,
        },
        {
          // headers: {
          //   "Content-Type": "application/json",
          // },
          withCredentials: true 
        }
      );
        console.log(response);
      const { token } = response.data;
      login(token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <div className="bg-[#063c35] py-10 text-center text-white">
        <div className="flex items-center justify-center gap-3 text-xl font-semibold">
          <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <FaUser />
          </span>
          <h1 className="text-2xl md:text-3xl">Login</h1>
        </div>
        <p className="text-lg text-white/70 mt-1">
          Log in to continue your profitability analysis
        </p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <FaLock className="text-gray-600" />
            </span>
            <h2 className="text-xl font-semibold">Login</h2>
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
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 font-medium mb-1">
                Password
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
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-account")}
                className="flex-1 bg-gray-100 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
