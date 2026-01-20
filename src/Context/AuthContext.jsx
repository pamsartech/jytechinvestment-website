// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // <- new

  // Restore auth state on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsAuthenticated(true);
    setIsAuthLoading(false); // <- done loading
  }, []);

  const login = (token = "true") => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
