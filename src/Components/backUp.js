import { useMemo, useState } from "react";
import { FaHome, FaReceipt, FaPlus, FaTrash, FaBuilding } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";

import { AiOutlineBank } from "react-icons/ai";

/* ===========================
   MAIN COMPONENT
   =========================== */

export default function AnalyseOperation() {
  /* ===========================
     1. PURCHASE
     =========================== */
  const [purchase, setPurchase] = useState({
    faiPrice: "",
    agencyFees: "",
  });

  /* ===========================
     2. ACQUISITION COST
     =========================== */
  const [acquisition, setAcquisition] = useState({
    notaryFees: "",
    percentage: "",
  });

  /* ===========================
     3. LOTS
     =========================== */
  const [lots, setLots] = useState([
    createLot(1),
    createLot(2),
    createLot(3),
    createLot(4),
  ]);

  function createLot(id) {
    return {
      id,
      resale: "",
      area: "",
      price: "",
      vat: "Exempt",
      balance: "",
    };
  }

  const addLot = () => {
    setLots((prev) => [...prev, createLot(Date.now())]);
  };

  const updateLot = (id, field, value) => {
    setLots((prev) =>
      prev.map((lot) => (lot.id === id ? { ...lot, [field]: value } : lot))
    );
  };

  const removeLot = (id) => {
    setLots((prev) => prev.filter((lot) => lot.id !== id));
  };

  const totalResale = useMemo(
    () => lots.reduce((sum, lot) => sum + Number(lot.resale || 0), 0),
    [lots]
  );

  /* ===========================
     4. EXPENSES
     =========================== */
  const [expenses, setExpenses] = useState([
    { id: 1, nature: "", price: "", vatRate: "" },
    { id: 2, nature: "", price: "", vatRate: "" },
    { id: 3, nature: "", price: "", vatRate: "" },
    { id: 4, nature: "", price: "", vatRate: "" },
  ]);

  const updateExpense = (id, field, value) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpenseCost = useMemo(() => {
    return expenses.reduce((sum, e) => {
      const price = Number(e.price || 0);
      const vat = (price * Number(e.vatRate || 0)) / 100;
      return sum + price + vat;
    }, 0);
  }, [expenses]);

  /* ===========================
     5. FINANCING
     =========================== */
  const [financing, setFinancing] = useState({
    contribution: "",
    borrowingRate: "",
    duration: "",
    applicationFee: "",
    commitmentCommission: "",
    mortgageRate: "",
    mortgageFees: "",
  });

  const updateFinancing = (field, value) => {
    setFinancing((prev) => ({ ...prev, [field]: value }));
  };

  const totalFinancing = useMemo(() => {
    return (
      Number(financing.applicationFee || 0) +
      Number(financing.commitmentCommission || 0) +
      Number(financing.mortgageFees || 0)
    );
  }, [financing]);

  // submit logic
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      purchase,
      acquisition,
      lots,
      expenses,
      financing,
      totals: {
        totalResale,
        totalExpenseCost,
        totalFinancing,
      },
    };

    console.log("FORM PAYLOAD 👉", payload);

    // Example API call (axios / fetch)
    // axios.post("/api/analysis", payload)
    //   .then(res => ...)
    //   .catch(err => ...)
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-12">
      {/* PAGE HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl heading font-semibold text-gray-900">
          Analyse your operation
        </h1>
        <p className="text-xl text-gray-500 mt-3 max-w-xl mx-auto">
          Fill the information about your real estate project to obtain a detail
          analysis of its profitability
        </p>
      </div>

      {/* PURCHASE */}
      <Section>
        <SectionTitle icon={<FaHome size={16} />}>Purchase</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              FAI price (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={purchase.faiPrice}
              onChange={(v) => setPurchase({ ...purchase, faiPrice: v })}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Agency fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={purchase.agencyFees}
              onChange={(v) => setPurchase({ ...purchase, agencyFees: v })}
            />
          </label>
        </div>
      </Section>

      {/* ACQUISITION COST */}
      <Section>
        <SectionTitle icon={<FaReceipt size={16} />}>
          Acquisition cost
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Notary fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={acquisition.notaryFees}
              onChange={(v) =>
                setAcquisition({ ...acquisition, notaryFees: v })
              }
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Percentage (%)
            </span>
            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={acquisition.percentage}
              onChange={(v) =>
                setAcquisition({ ...acquisition, percentage: v })
              }
            />
          </label>

          {/* <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Percentage (%)
            </span>
            <Input
              numeric
              placeholder="5"
              value={acquisition.percentage}
              onChange={(v) =>
                setAcquisition({ ...acquisition, percentage: v })
              }
            />
          </label> */}

          {/* <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Percentage (%)
            </span>
            <Input
              type="number"
              placeholder="250,000"
              value={acquisition.percentage}
              onChange={(v) =>
                setAcquisition({ ...acquisition, percentage: v })
              }
            />
          </label> */}
        </div>
      </Section>

      {/* LOTS */}
      <Section>
        <div className="flex items-center justify-between mb-7">
          <SectionTitle icon={<FaBuilding size={16} />}>Lots</SectionTitle>

          <button
            type="button"
            onClick={addLot}
            className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-md font-medium"
          >
            <FaPlus size={10} /> Add a batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600">
            <thead>
              <tr className="text-left text-sm ">
                <th className="px-7 py-2">N</th>
                <th className="px-4">Resale price</th>
                <th className="px-4">Area (m²)</th>
                <th className="px-4">Price / m²</th>
                <th className="px-4">VAT</th>
                <th className="px-1">Balance (%)</th>
                <th />
              </tr>
            </thead>

            <tbody className="">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {lot.id}
                    </span>
                  </td>

                  <td className="px-4">
                    <Cell
                      numeric
                      placeholder="250,000"
                      value={lot.resale}
                      onChange={(v) => updateLot(lot.id, "resale", v)}
                    />
                  </td>

                  <td className="px-4">
                    <Cell
                      numeric
                      placeholder="250,000"
                      value={lot.area}
                      onChange={(v) => updateLot(lot.id, "area", v)}
                    />
                  </td>

                  <td className="px-4">
                    <Cell
                      numeric
                      placeholder="81"
                      value={lot.price}
                      onChange={(v) => updateLot(lot.id, "price", v)}
                    />
                  </td>

                  <td className="px-4">
                    <select
                      value={lot.vat}
                      onChange={(e) => updateLot(lot.id, "vat", e.target.value)}
                      className="w-full bg-gray-100 rounded-lg px-3 py-2 text-xs"
                    >
                      <option>Exempt</option>
                      <option>20%</option>
                    </select>
                  </td>

                  <td>
                    <Cell
                      numeric
                      placeholder="250,000"
                      value={lot.balance}
                      onChange={(v) => updateLot(lot.id, "balance", v)}
                    />
                  </td>

                  <td className="px-4 text-right">
                    <button
                      type="button"
                      onClick={() => removeLot(lot.id)}
                      className="text-red-500"
                    >
                      <FaTrash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TotalBar label="Total resale" value={`${totalResale} €`} />
      </Section>

      {/* EXPENSES */}
      <Section>
        {/* HEADER + ACTION */}
        <div className="flex items-center justify-between mb-7">
          <SectionTitle icon={<FaReceipt size={16} />}>
            <h1 className="text-xl heading">Expenses</h1>
          </SectionTitle>

          <button
            type="button"
            onClick={() =>
              setExpenses((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  nature: "",
                  price: "",
                  vatRate: "",
                },
              ])
            }
            className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-md font-medium"
          >
            <FaPlus size={10} /> Add an expense
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600">
            <thead>
              <tr className="text-left text-sm">
                <th className="pb-3 font-medium">Nature</th>
                <th className="font-medium">Price excl. tax (€)</th>
                <th className="font-medium">VAT rate (%)</th>
                <th className="font-medium">VAT (€)</th>
                <th className="font-medium">Price incl. VAT (€)</th>
                <th />
              </tr>
            </thead>

            <tbody className="">
              {expenses.map((e) => {
                const price = Number(e.price || 0);
                const vat = (price * Number(e.vatRate || 0)) / 100;
                const total = price + vat;

                return (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 text-left text-sm transition"
                  >
                    <td className="px-1 pr-6 py-4">
                      <Cell
                        type="text"
                        placeholder="Renovation"
                        value={e.nature}
                        onChange={(v) => updateExpense(e.id, "nature", v)}
                      />
                    </td>

                    <td className="px-1 pr-6 py-4">
                      <Cell
                        numeric
                        placeholder="250,000"
                        value={e.price}
                        onChange={(v) => updateExpense(e.id, "price", v)}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <Cell
                        numeric
                        placeholder="20"
                        value={e.vatRate}
                        onChange={(v) => updateExpense(e.id, "vatRate", v)}
                      />
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {vat}
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {total}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeExpense(e.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between rounded-xl mt-5 bg-gray-100 px-6 py-4">
          <span className="text-sm font-medium text-gray-600">
            Total cost of expense
          </span>

          <span className="text-xl font-semibold text-gray-900">
            {totalExpenseCost} €
          </span>
        </div>
      </Section>

      {/* FINANCING */}
      <Section>
        <SectionTitle icon={<AiOutlineBank size={18} />}>
          Financing
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Contribution (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.contribution}
              onChange={(v) => updateFinancing("contribution", v)}
            />
          </label>

          {/* <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Borrowing rate (%)
            </span>
            <Input
              numeric
              placeholder="3.5"
              value={financing.borrowingRate}
              onChange={(v) => updateFinancing("borrowingRate", v)}
            />
          </label> */}

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Borrowing rate (%)
            </span>

            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="5"
              value={financing.borrowingRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("borrowingRate", "");
                  return;
                }

                const value = Number(v);

                if (!isNaN(value) && value >= 0 && value <= 100) {
                  updateFinancing("borrowingRate", value);
                }
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Duration (months)
            </span>
            <Input
              numeric
              placeholder="120"
              value={financing.duration}
              onChange={(v) => updateFinancing("duration", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Application fee (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.applicationFee}
              onChange={(v) => updateFinancing("applicationFee", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Commitment commission (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.commitmentCommission}
              onChange={(v) => updateFinancing("commitmentCommission", v)}
            />
          </label>

          {/* <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Mortgage rate (%)
            </span>
           
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="5"
              value={financing.mortgageRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("mortgageRate", "");
                  return;
                }

                const value = Number(v);

                if (!isNaN(value) && value >= 0 && value <= 100) {
                  updateFinancing("mortgageRate", value);
                }
              }}
            />
          </label> */}

          {/* <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Mortgage fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.mortgageFees}
              onChange={(v) => updateFinancing("mortgageFees", v)}
            />
          </label> */}
        </div>

        <TotalBar label="Total financing" value={`${totalFinancing} €`} />
      </Section>

      {/* buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" className="px-5 py-2 rounded-xl border text-lg">
          <FaXmark className="inline-block" /> Discard
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#00332B] text-white text-lg"
        >
          <LuFileText className="inline-block" /> Save
        </button>
      </div>
    </form>
  );
}

/* ===========================
   PRIMITIVES
   =========================== */

function Section({ children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm px-6 py-7 mb-8">
      {children}
    </section>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-xl heading">{children}</h2>
    </div>
  );
}

// function Input({ label, value, onChange, placeholder }) {
//   return (
//     <div>
//       <label className="text-xs text-gray-500">{label}</label>
//       <input
//         value={value}
//         placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
//       />
//     </div>
//   );
// }

function Input({
  label,
  value,
  onChange,
  placeholder,
  numeric = false,
  min,
  max,
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    // Allow empty value
    if (val === "") {
      onChange("");
      return;
    }

    if (numeric) {
      // Allow only numbers and decimals
      if (!/^\d*\.?\d*$/.test(val)) return;

      const num = Number(val);

      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
    }

    onChange(val);
  };

  return (
    <div>
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <input
        value={value}
        placeholder={placeholder}
        inputMode={numeric ? "decimal" : "text"}
        onChange={handleChange}
        className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
      />
    </div>
  );
}

// function Cell({ value, onChange, placeholder }) {
//   return (
//     <input
//       value={value}
//       placeholder={placeholder}
//       onChange={(e) => onChange(e.target.value)}
//       className="bg-gray-100 rounded-lg px-3 py-2 w-full text-xs"
//     />
//   );
// }

function Cell({ value, onChange, placeholder, numeric = false, min, max }) {
  const handleChange = (e) => {
    let val = e.target.value;

    // allow empty
    if (val === "") {
      onChange("");
      return;
    }

    if (numeric) {
      // allow digits + decimal only
      if (!/^\d*\.?\d*$/.test(val)) return;

      const num = Number(val);

      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
    }

    onChange(val);
  };

  return (
    <input
      value={value}
      placeholder={placeholder}
      inputMode={numeric ? "decimal" : "text"}
      onChange={handleChange}
      className="bg-gray-100 rounded-lg px-3 py-2 w-full text-xs outline-none"
    />
  );
}

// function Cell({ value, onChange, placeholder, numeric = true }) {
//   const handleChange = (e) => {
//     const val = e.target.value;

//     if (val === "") {
//       onChange("");
//       return;
//     }

//     if (!/^\d*\.?\d*$/.test(val)) return;

//     onChange(val);
//   };

//   return (
//     <input
//       value={value}
//       placeholder={placeholder}
//       inputMode="decimal"
//       onChange={handleChange}
//       className="bg-gray-100 rounded-lg px-3 py-2 w-full text-xs"
//     />
//   );
// }

function TotalBar({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 mt-5 px-6 py-4 rounded-xl">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-xl font-semibold text-gray-900">{value}</span>
    </div>
  );
}


// this is updated analyse operation 

import { useMemo, useState } from "react";
import { FaHome, FaReceipt, FaPlus, FaTrash, FaBuilding, FaRegTrashAlt} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";
import { AiOutlineBank } from "react-icons/ai";


/* ===========================
   MAIN COMPONENT
   =========================== */

export default function AnalyseOperation() {
  /* ===========================
     1. PURCHASE
     =========================== */
  const [purchase, setPurchase] = useState({
    faiPrice: "",
    agencyFees: "",
  });

  const totalPurchase = useMemo(() => {
    return Number(purchase.faiPrice || 0) + Number(purchase.agencyFees || 0);
  }, [purchase]);

  /* ===========================
     2. ACQUISITION COST
     =========================== */
  const [acquisition, setAcquisition] = useState({
    notaryFees: "",
    percentage: "",
  });

  const acquisitionPercentageAmount = useMemo(() => {
    return (
      (Number(purchase.faiPrice || 0) * Number(acquisition.percentage || 0)) /
      100
    );
  }, [purchase.faiPrice, acquisition.percentage]);

  const totalAcquisitionCost = useMemo(() => {
    return Number(acquisition.notaryFees || 0) + acquisitionPercentageAmount;
  }, [acquisition.notaryFees, acquisitionPercentageAmount]);

  const applicationFeeAuto = useMemo(() => {
    return (
      Number(purchase.faiPrice || 0) +
      Number(purchase.agencyFees || 0) +
      Number(acquisition.notaryFees || 0)
    );
  }, [purchase.faiPrice, purchase.agencyFees, acquisition.notaryFees]);

  /* ===========================
     3. LOTS
     =========================== */
  function createLot(id) {
    return {
      id,
      name: "",
      resale: "",
      area: "",
      price: "",
      vat: "Exempt",
      balance: "",
    };
  }

  const [lots, setLots] = useState([
    createLot(1),
    createLot(2),
    // createLot(3),
    // createLot(4),
  ]);

  const addLot = () => {
    setLots((prev) => [...prev, createLot(Date.now())]);
  };

  const updateLot = (id, field, value) => {
    setLots((prev) =>
      prev.map((lot) => (lot.id === id ? { ...lot, [field]: value } : lot))
    );
  };

  const removeLot = (id) => {
    setLots((prev) => prev.filter((lot) => lot.id !== id));
  };

  const totalResale = useMemo(() => {
    return lots.reduce((sum, lot) => sum + Number(lot.resale || 0), 0);
  }, [lots]);

  const lotsWithTotals = useMemo(() => {
    return lots.map((lot) => {
      const resale = Number(lot.resale || 0);
      const area = Number(lot.area || 0);

      const pricePerM2 = area > 0 ? Number((resale / area).toFixed(2)) : "";

      const vatRate = lot.vat === "20%" ? 20 : 0;
      const vatAmount = (resale * vatRate) / 100;

      return {
        ...lot,
        pricePerM2,
        vatAmount,
        totalWithVat: resale + vatAmount,
      };
    });
  }, [lots]);
 
  /* ===========================
     4. EXPENSES (UNCHANGED)
     =========================== */
  const [expenses, setExpenses] = useState([
    { id: 1, nature: "", price: "", vatRate: "" },
    { id: 2, nature: "", price: "", vatRate: "" },
    // { id: 3, nature: "", price: "", vatRate: "" },
    // { id: 4, nature: "", price: "", vatRate: "" },
  ]);

  const updateExpense = (id, field, value) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpenseCost = useMemo(() => {
    return expenses.reduce((sum, e) => {
      const price = Number(e.price || 0);
      const vat = (price * Number(e.vatRate || 0)) / 100;
      return sum + price + vat;
    }, 0);
  }, [expenses]);

  /* ===========================
     5. FINANCING
     =========================== */
  const [financing, setFinancing] = useState({
    contribution: "",
    borrowingRate: "",
    duration: "",
    applicationFee: "",
    commitmentCommission: "",
    mortgageFees: "",
  });

  const updateFinancing = (field, value) => {
    setFinancing((prev) => ({ ...prev, [field]: value }));
  };

  const totalProjectCost = useMemo(() => {
    return totalPurchase + totalAcquisitionCost + totalExpenseCost;
  }, [totalPurchase, totalAcquisitionCost, totalExpenseCost]);

  const borrowedAmount = useMemo(() => {
    return Math.max(totalProjectCost - Number(financing.contribution || 0), 0);
  }, [totalProjectCost, financing.contribution]);

  const financingInterest = useMemo(() => {
    const rate = Number(financing.borrowingRate || 0) / 100;
    const months = Number(financing.duration || 0);

    return (borrowedAmount * rate * months) / 12;
  }, [borrowedAmount, financing.borrowingRate, financing.duration]);

  const totalFinancing = useMemo(() => {
    return (
      applicationFeeAuto +
      Number(financing.commitmentCommission || 0) +
      Number(financing.mortgageFees || 0) +
      financingInterest
    );
  }, [
    applicationFeeAuto,
    financing.commitmentCommission,
    financing.mortgageFees,
    financingInterest,
  ]);

  /* ===========================
     SUBMIT
     =========================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      purchase,
      acquisition,
      lots: lotsWithTotals,
      expenses,
      financing,
      totals: {
        totalPurchase,
        totalAcquisitionCost,
        totalResale,
        totalExpenseCost,
        borrowedAmount,
        financingInterest,
        totalFinancing,
      },
    };

    console.log("FORM PAYLOAD 👉", payload);
  };

  /* ===========================
     UI (UNCHANGED)
     =========================== */

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-12">
      {/* PAGE HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl heading font-semibold text-gray-900">
          Analyse your operation
        </h1>
        <p className="text-xl text-gray-500 mt-3 max-w-xl mx-auto">
          Fill the information about your real estate project to obtain a detail
          analysis of its profitability
        </p>
      </div>

      {/* PURCHASE */}
      <Section>
        <SectionTitle icon={<FaHome size={16} />}>Purchase</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              FAI price (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={purchase.faiPrice}
              onChange={(v) => setPurchase({ ...purchase, faiPrice: v })}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Agency fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={purchase.agencyFees}
              onChange={(v) => setPurchase({ ...purchase, agencyFees: v })}
            />
          </label>
        </div>
      </Section>

      {/* ACQUISITION COST */}
      <Section>
        <SectionTitle icon={<FaReceipt size={16} />}>
          Acquisition cost
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Notary fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={acquisition.notaryFees}
              onChange={(v) =>
                setAcquisition({ ...acquisition, notaryFees: v })
              }
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Percentage (%)
            </span>
            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={acquisition.percentage}
              onChange={(v) =>
                setAcquisition({ ...acquisition, percentage: v })
              }
            />
          </label>

          {/* <label>
               <span className="text-gray-400 text-sm  font-semibold">
                 Percentage (%)
               </span>
               <Input
                 numeric
                 placeholder="5"
                 value={acquisition.percentage}
                 onChange={(v) =>
                   setAcquisition({ ...acquisition, percentage: v })
                 }
               />
             </label> */}

          {/* <label>
               <span className="text-gray-400 text-sm  font-semibold">
                 Percentage (%)
               </span>
               <Input
                 type="number"
                 placeholder="250,000"
                 value={acquisition.percentage}
                 onChange={(v) =>
                   setAcquisition({ ...acquisition, percentage: v })
                 }
               />
             </label> */}
        </div>
      </Section>

      {/* LOTS */}
      <Section>
        <div className="flex items-center justify-between mb-7">
          <SectionTitle icon={<FaBuilding size={16} />}>Lots</SectionTitle>

          <button
            type="button"
            onClick={addLot}
            className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-md font-medium"
          >
            <FaPlus size={10} /> Add a batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600">
            <thead>
              <tr className="text-left text-sm ">
                <th className="px-7 py-2">N</th>
                <th className="px-4">Lot name</th>
                <th className="px-4">Resale price</th>
                <th className="px-4">Area (m²)</th>
                <th className="px-4">Price / m²</th>
                <th className="px-4">VAT</th>
                <th className="px-1">Balance (%)</th>
                <th />
              </tr>
            </thead>

            <tbody >
              {lotsWithTotals.map((lot) => (
                <tr key={lot.id} className="hover:bg-gray-50">
                  {/* N (ID badge) */}
                  <td className="px-4 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {lot.id}
                    </span>
                  </td>

                  {/* Lot name (TEXT INPUT) */}
                  <td className="px-4 py-4">
                    <Cell
                      type="text"
                      placeholder="Lot name"
                      value={lot.name}
                      onChange={(v) => updateLot(lot.id, "name", v)}
                      
                    />
                  </td>

                  {/* Resale price */}
                  <td className="px-4">
                    <Cell
                      numeric
                      placeholder="250000"
                      value={lot.resale}
                      onChange={(v) => updateLot(lot.id, "resale", v)}
                    />
                  </td>

                  {/* Area */}
                  <td className="px-4">
                    <Cell
                      numeric
                      placeholder="80"
                      value={lot.area}
                      onChange={(v) => updateLot(lot.id, "area", v)}
                    />
                  </td>

                  {/* AUTO Price / m² */}
                  <td className="px-4 font-semibold text-gray-900">
                    {lot.pricePerM2 || "-"}
                  </td>

                  {/* VAT */}
                  <td className="px-4">
                    <select
                      value={lot.vat}
                      onChange={(e) => updateLot(lot.id, "vat", e.target.value)}
                      className="w-full bg-gray-100 rounded-lg px-3 py-2 text-xs"
                    >
                      <option>VAT Exempt  </option>
                      <option>Full VAT </option>
                      <option>VAT on Margin </option>
                    </select>
                  </td>

                  {/* Balance */}
                  <td>
                    <Cell
                      numeric
                      placeholder="5"
                      value={lot.balance}
                      onChange={(v) => updateLot(lot.id, "balance", v)}
                    />
                  </td>

                  {/* Delete */}
                  <td className="px-4 text-right">
                    <button
                      type="button"
                      onClick={() => removeLot(lot.id)}
                      className="text-red-500"
                    >
                     
                      <FaRegTrashAlt size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TotalBar label="Total resale" value={`${totalResale} €`} />
      </Section>

      {/* EXPENSES */}
      <Section>
        {/* HEADER + ACTION */}
        <div className="flex items-center justify-between mb-7">
          <SectionTitle icon={<FaReceipt size={16} />}>
            <h1 className="text-xl heading">Expenses</h1>
          </SectionTitle>

          <button
            type="button"
            onClick={() =>
              setExpenses((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  nature: "",
                  price: "",
                  vatRate: "",
                },
              ])
            }
            className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-md font-medium"
          >
            <FaPlus size={10} /> Add an expense
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600">
            <thead>
              <tr className="text-left text-sm">
                <th className="pb-3 font-medium">Nature</th>
                <th className="font-medium">Price excl. tax (€)</th>
                <th className="font-medium">VAT rate (%)</th>
                <th className="font-medium">VAT (€)</th>
                <th className="font-medium">Price incl. VAT (€)</th>
                <th />
              </tr>
            </thead>

            <tbody className="">
              {expenses.map((e) => {
                const price = Number(e.price || 0);
                const vat = (price * Number(e.vatRate || 0)) / 100;
                const total = price + vat;

                return (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 text-left text-sm transition"
                  >
                    <td className="px-1 pr-6 py-4">
                      <Cell
                        type="text"
                        placeholder="Renovation"
                        value={e.nature}
                        onChange={(v) => updateExpense(e.id, "nature", v)}
                      />
                    </td>

                    <td className="px-1 pr-6 py-4">
                      <Cell
                        numeric
                        placeholder="250,000"
                        value={e.price}
                        onChange={(v) => updateExpense(e.id, "price", v)}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <Cell
                        numeric
                        placeholder="20"
                        value={e.vatRate}
                        onChange={(v) => updateExpense(e.id, "vatRate", v)}
                      />
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {vat}
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      {total}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeExpense(e.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        
                        <FaRegTrashAlt size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between rounded-xl mt-5 bg-gray-100 px-6 py-4">
          <span className="text-sm font-medium text-gray-600">
            Total cost of expense
          </span>

          <span className="text-xl font-semibold text-gray-900">
            {totalExpenseCost} €
          </span>
        </div>
      </Section>

      {/* FINANCING */}
      <Section>
        <SectionTitle icon={<AiOutlineBank size={18} />}>
          Financing
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Contribution (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.contribution}
              onChange={(v) => updateFinancing("contribution", v)}
            />
          </label>

          {/* <label>
               <span className="text-gray-400 text-sm  font-semibold">
                 Borrowing rate (%)
               </span>
               <Input
                 numeric
                 placeholder="3.5"
                 value={financing.borrowingRate}
                 onChange={(v) => updateFinancing("borrowingRate", v)}
               />
             </label> */}

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Borrowing rate (%)
            </span>

            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="5"
              value={financing.borrowingRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("borrowingRate", "");
                  return;
                }

                const value = Number(v);

                if (!isNaN(value) && value >= 0 && value <= 100) {
                  updateFinancing("borrowingRate", value);
                }
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Duration (months)
            </span>
            <Input
              numeric
              placeholder="120"
              value={financing.duration}
              onChange={(v) => updateFinancing("duration", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Application fee (€)
            </span>
            <Input
              numeric
              value={applicationFeeAuto}
              placeholder="Auto-calculated"
              readOnly
            />

            {/* <Input
                 numeric
                 placeholder="250,000"
                 value={financing.applicationFee}
                 onChange={(v) => updateFinancing("applicationFee", v)}
               /> */}
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Commitment commission (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.commitmentCommission}
              onChange={(v) => updateFinancing("commitmentCommission", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Mortgage rate (%)
            </span>

            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="5"
              value={financing.mortgageRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("mortgageRate", "");
                  return;
                }

                const value = Number(v);

                if (!isNaN(value) && value >= 0 && value <= 100) {
                  updateFinancing("mortgageRate", value);
                }
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Mortgage fees (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.mortgageFees}
              onChange={(v) => updateFinancing("mortgageFees", v)}
            />
          </label>
        </div>

        <TotalBar label="Total financing" value={`${totalFinancing} €`} />
      </Section>

      {/* buttons */}
      <div className="flex justify-between gap-3 mt-6">
        <button type="button" className="px-4 py-2 rounded-xl border text-lg">
          <FaXmark className="inline-block mr-2" /> Discard
        </button>

        <button
          type="button"
          className="px-4 py-2 rounded-xl border border-[#00332B] text-[#00332B] text-lg font-semibold"
        >
          <LuFileText className="inline-block mr-2" /> Save as Draft
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#00332B] text-white text-lg"
        >
          <LuFileText className="inline-block mr-2" /> Submit Form
        </button>
      </div>
    </form>
  );
}

/* ===========================
   PRIMITIVES (UNCHANGED)
   =========================== */

function Section({ children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm px-6 py-7 mb-8">
      {children}
    </section>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-xl heading">{children}</h2>
    </div>
  );
}

function Input({ value, onChange, placeholder, numeric = false, min, max }) {
  const handleChange = (e) => {
    let val = e.target.value;

    if (val === "") {
      onChange("");
      return;
    }

    if (numeric) {
      if (!/^\d*\.?\d*$/.test(val)) return;
      const num = Number(val);
      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
    }

    onChange(val);
  };

  return (
    <input
      value={value}
      placeholder={placeholder}
      inputMode={numeric ? "decimal" : "text"}
      onChange={handleChange}
      className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none"
    />
  );
}

function Cell({ value, onChange, placeholder, numeric = false, min, max }) {
  const handleChange = (e) => {
    let val = e.target.value;

    if (val === "") {
      onChange("");
      return;
    }

    if (numeric) {
      if (!/^\d*\.?\d*$/.test(val)) return;
      const num = Number(val);
      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
    }

    onChange(val);
  };

  return (
    <input
      value={value}
      placeholder={placeholder}
      inputMode={numeric ? "decimal" : "text"}
      onChange={handleChange}
      className="bg-gray-100 rounded-lg px-3 py-3 w-full text-sm outline-none"
    />
  );
}

function TotalBar({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 mt-5 px-6 py-4 rounded-xl">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-xl font-semibold text-gray-900">{value}</span>
    </div>
  );
}
