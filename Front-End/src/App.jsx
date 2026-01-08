import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollTop from "./Pages/ScrollTop";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// Pages
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import Home from "./Pages/Home";
import History from "./Pages/History";
import Support from "./Pages/Support";
import Subscription from "./Pages/Subscription";
import Simulation from "./Pages/Simulation";
import SuccessPayment from "./Pages/SuccessPayment";
import FailedPayment from "./Pages/FailedPayment";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsConditions from "./Pages/TermsConditions";
import EditReport from "./Pages/EditReport";

import { AuthProvider, useAuth } from "./Context/AuthContext";

/* ============================
   Protected Route
   ============================ */

// App.jsx (inside ProtectedRoute)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


/* ============================
   Layout Wrapper
   ============================ */

const ProtectedLayout = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/support" element={<Support />} />
      <Route path="/subscription" element={<Subscription />} />
      {/* <Route path="/simulation" element={<Simulation />} /> */}
      <Route path="/simulation/:projectId" element={<Simulation />} />
       <Route path="/edit-report/:id" element={<EditReport />} />
       <Route path="/privacy-policy" element={<PrivacyPolicy />} />
       <Route path="/terms-conditions" element={<TermsConditions />} />
       <Route path="/success-payment" element={<SuccessPayment />} />
       <Route path="/failed-payment" element={<FailedPayment />} />
    </Routes>
    <Footer />
  </>
);

export default function App() {
  return (
    <>
     <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      
    <Router>
      <AuthProvider>

        <ScrollTop />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* Protected */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}
