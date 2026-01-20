import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AnalyseOperationContext = createContext(null);

export function AnalyseOperationProvider({ children }) {
  const [submitting, setSubmitting] = useState(false);

  const submitAnalyseOperation = async (payload) => {
    setSubmitting(true);

    try {
      const res = await axios.post(
        "https://jytec-investment-api.onrender.com/api/project/save",
        payload,
        { withCredentials: true }
      );

      toast.success("Operation analysis submitted successfully");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      toast.error(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnalyseOperationContext.Provider
      value={{ submitting, submitAnalyseOperation }}
    >
      {children}
    </AnalyseOperationContext.Provider>
  );
}

export const useAnalyseOperation = () => useContext(AnalyseOperationContext);
