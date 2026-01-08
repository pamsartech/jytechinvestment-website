import { useMemo, useState } from "react";
import {
  FaHome,
  FaReceipt,
  FaPlus,
  FaTrash,
  FaBuilding,
  FaRegTrashAlt,
} from "react-icons/fa";
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

  const [lots, setLots] = useState([createLot(1), createLot(2)]);

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
    downPayment: "",
    downPaymentRate: "",
    loanInterestRate: "",
    loanInterest: "",
    duration: "",
    applicationFee: "",
    commissionRate: "",
    commitmentFees: "",
    mortgageFees: "",
  });

  const updateFinancing = (field, value) => {
    setFinancing((prev) => ({ ...prev, [field]: value }));
  };

  const totalProjectCost = useMemo(() => {
    return totalPurchase + totalAcquisitionCost + totalExpenseCost;
  }, [totalPurchase, totalAcquisitionCost, totalExpenseCost]);

  const borrowedAmount = useMemo(() => {
    return Math.max(totalProjectCost - Number(financing.downPayment || 0), 0);
  }, [totalProjectCost, financing.downPayment]);

  const downPaymentInterest = useMemo(() => {
    const rate = Number(financing.downPaymentRate || 0) / 100;
    const months = Number(financing.duration || 0);

    return (borrowedAmount * rate * months) / 12;
  }, [borrowedAmount, financing.downPaymentRate, financing.duration]);

  const financingInterest = useMemo(() => {
    const rate = Number(financing.loanInterestRate || 0) / 100;
    const months = Number(financing.duration || 0);

    return (borrowedAmount * rate * months) / 12;
  }, [borrowedAmount, financing.loanInterestRate, financing.duration]);

  const commissionInterest = useMemo(() => {
    const rate = Number(financing.commissionRate || 0) / 100;
    const months = Number(financing.duration || 0);

    return (borrowedAmount * rate * months) / 12;
  }, [borrowedAmount, financing.commissionRate, financing.duration]);

  // this is loan interest calculation
  const loanInterestAuto = useMemo(() => {
    const acquisitionCost = Number(totalAcquisitionCost || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPayment || 0);
    const rate = Number(financing.loanInterestRate || 0); // %
    const months = Number(financing.duration || 0); // months

    const baseAmount = acquisitionCost + expenses - downPayment;

    if (baseAmount <= 0 || rate === 0 || months === 0) return 0;

    return ((baseAmount * rate * months) / (100 * 12)).toFixed(2);
  }, [
    totalAcquisitionCost,
    totalExpenseCost,
    financing.downPayment,
    financing.loanInterestRate,
    financing.duration,
  ]);

  // this is commission fees calculation
  const commitmentFeesAuto = useMemo(() => {
    const acquisitionCost = Number(totalAcquisitionCost || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPayment || 0);
    const commissionRate = Number(financing.commissionRate || 0); // %

    const baseAmount = acquisitionCost + expenses - downPayment;

    if (baseAmount <= 0 || commissionRate === 0) return 0;

    return ((baseAmount * commissionRate) / 100).toFixed(2);
  }, [
    totalAcquisitionCost,
    totalExpenseCost,
    financing.downPayment,
    financing.commissionRate,
  ]);

  // this is mortgage fees calculation
  const mortgageFeesAuto = useMemo(() => {
    const acquisitionCost = Number(totalAcquisitionCost || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPayment || 0);
    const mortgageRate = Number(financing.mortgageRate || 0); // %

    const baseAmount = acquisitionCost + expenses - downPayment;

    if (baseAmount <= 0 || mortgageRate === 0) return 0;

    return ((baseAmount * mortgageRate) / 100).toFixed(2);
  }, [
    totalAcquisitionCost,
    totalExpenseCost,
    financing.downPayment,
    financing.mortgageRate,
  ]);

  const totalFinancing = useMemo(() => {
    return (
      Number(applicationFeeAuto || 0) +
      Number(loanInterestAuto || 0) +
      Number(commitmentFeesAuto || 0) +
      Number(mortgageFeesAuto || 0)
    ).toFixed(2);
  }, [
    applicationFeeAuto,
    loanInterestAuto,
    commitmentFeesAuto,
    mortgageFeesAuto,
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
                {/* <th className="px-7 py-2">N</th> */}
                <th className="px-4">Lot name</th>
                <th className="px-4">Resale price</th>
                <th className="px-4">Area (m²)</th>
                <th className="px-4">Price / m²</th>
                <th className="px-4">VAT</th>
                <th className="px-1">Balance (%)</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {lotsWithTotals.map((lot) => (
                <tr key={lot.id} className="hover:bg-gray-50">
                  {/* N (ID badge) */}
                  {/* <td className="px-4 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {lot.id}
                    </span>
                  </td> */}

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
                      <option>VAT Exempt </option>
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
                        onChange={(v) => {
                          if (v === "") {
                            updateExpense(e.id, "vatRate", "");
                            return;
                          }

                          // normalize comma → dot
                          let value = v.replace(",", ".");

                          // limit to one decimal place
                          if (value.includes(".")) {
                            const [intPart, decPart] = value.split(".");
                            value = intPart + "." + decPart.slice(0, 1);
                          }

                          const num = Number(value);

                          // allow intermediate state like "3."
                          if (isNaN(num)) {
                            updateExpense(e.id, "vatRate", value);
                            return;
                          }

                          // enforce 0–100 range
                          if (num < 0 || num > 100) return;

                          updateExpense(e.id, "vatRate", value);
                        }}
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
              Application fee (€)
            </span>
            <Input
              numeric
              value={applicationFeeAuto}
              placeholder="Auto-calculated"
              readOnly
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Down Payment (€)
            </span>
            <Input
              numeric
              placeholder="250,000"
              value={financing.downPayment}
              onChange={(v) => updateFinancing("downPayment", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Down Payment Rate (%)
            </span>

            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={financing.downPaymentRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("downPaymentRate", "");
                  return;
                }

                // normalize comma -> dot
                let value = v.replace(",", ".");

                // limit to one decimal place
                if (value.includes(".")) {
                  const [intPart, decPart] = value.split(".");
                  value = intPart + "." + decPart.slice(0, 1);
                }

                const num = Number(value);

                // allow transient states like "3."
                if (isNaN(num)) {
                  updateFinancing("downPaymentRate", value);
                  return;
                }

                // enforce 0–100
                if (num < 0 || num > 100) return;

                updateFinancing("downPaymentRate", value);
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Loan Interest Rate (%)
            </span>

            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={financing.loanInterestRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("loanInterestRate", "");
                  return;
                }

                // normalize comma to dot
                let value = v.replace(",", ".");

                // limit to one decimal place
                if (value.includes(".")) {
                  const [intPart, decPart] = value.split(".");
                  value = intPart + "." + decPart.slice(0, 1);
                }

                const num = Number(value);

                // allow temporary states like "3."
                if (isNaN(num)) {
                  updateFinancing("loanInterestRate", value);
                  return;
                }

                // enforce 0–100 range
                if (num < 0 || num > 100) return;

                updateFinancing("loanInterestRate", value);
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Loan Duration (months)
            </span>
            <Input
              numeric
              placeholder="12"
              value={financing.duration}
              onChange={(v) => updateFinancing("duration", v)}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Loan Interest (€)
            </span>
            <Input
              numeric
              value={loanInterestAuto}
              placeholder="Auto-calculated"
              readOnly
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Commission Rate (%)
            </span>

            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={financing.commissionRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("commissionRate", "");
                  return;
                }

                // normalize comma to dot
                let value = v.replace(",", ".");

                // limit to one decimal place (typing-friendly)
                if (value.includes(".")) {
                  const [intPart, decPart] = value.split(".");
                  value = intPart + "." + decPart.slice(0, 1);
                }

                const num = Number(value);

                // allow intermediate states like "3."
                if (isNaN(num)) {
                  updateFinancing("commissionRate", value);
                  return;
                }

                // range 0–100
                if (num < 0 || num > 100) return;

                updateFinancing("commissionRate", value);
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Commitment Fees (€)
            </span>
            <Input
              numeric
              value={commitmentFeesAuto}
              placeholder="Auto-calculated"
              readOnly
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm  font-semibold">
              Mortgage rate (%)
            </span>

            <Input
              numeric
              min={0}
              max={100}
              placeholder="5"
              value={financing.mortgageRate}
              onChange={(v) => {
                if (v === "") {
                  updateFinancing("mortgageRate", "");
                  return;
                }

                // allow typing "." and numbers
                let value = v.replace(",", ".");

                // trim to one decimal place if needed
                if (value.includes(".")) {
                  const [intPart, decPart] = value.split(".");
                  value = intPart + "." + decPart.slice(0, 1);
                }

                const num = Number(value);

                // still allow unfinished input like "3."
                if (isNaN(num)) {
                  updateFinancing("mortgageRate", value);
                  return;
                }

                // enforce range
                if (num < 0 || num > 100) return;

                updateFinancing("mortgageRate", value);
              }}
            />
          </label>

          <label>
            <span className="text-gray-400 text-sm font-semibold">
              Mortgage Fees (€)
            </span>
            <Input
              numeric
              value={mortgageFeesAuto}
              placeholder="Auto-calculated"
              readOnly
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
      // allow comma as decimal separator
      val = val.replace(",", ".");

      // allow: "12" "12." "12.3" ".5"
      const decimalPattern = /^(\d+(\.\d*)?|\.\d*)$/;
      if (!decimalPattern.test(val)) return;

      // only validate min/max when value is a real number
      if (!isNaN(Number(val))) {
        const num = Number(val);

        if (min !== undefined && num < min) return;
        if (max !== undefined && num > max) return;
      }

      onChange(val);
      return;
    }

    onChange(val);
  };

  return (
    <input
      className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode={numeric ? "decimal" : "text"}
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
      val = val.replace(",", ".");

      // same permissive decimal pattern
      const decimalPattern = /^(\d+(\.\d*)?|\.\d*)$/;
      if (!decimalPattern.test(val)) return;

      if (!isNaN(Number(val))) {
        const num = Number(val);

        if (min !== undefined && num < min) return;
        if (max !== undefined && num > max) return;
      }

      onChange(val);
      return;
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







// simulation backup code 
import { FaChartLine, FaFileAlt, FaPercent, FaCalculator, FaUniversity, FaReceipt,} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";
import { LuFileText } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const chartData = [
  { x: 1, gross: -20, net: -10 },
  { x: 2, gross: 30, net: 10 },
  { x: 3, gross: -40, net: 20 },
  { x: 4, gross: 25, net: 45 },
  { x: 5, gross: 60, net: 30 },
  { x: 6, gross: 20, net: 0 },
];

/* helpers */
const formatCurrency = (v) =>
  v !== undefined && v !== null ? `${Number(v).toLocaleString()}€` : "—";

const formatPercent = (v) =>
  v !== undefined && v !== null ? `${Number(v).toFixed(2)}%` : "—";

/* shared card styles */
const baseCard =
  "flex flex-col justify-between rounded-[18px] border border-gray-100 bg-white px-6 py-10 shadow-sm/10";

const iconBase =
  "w-10 h-10 flex items-center justify-center rounded-xl mb-4 text-sm";

export default function Simulation() {

     const { projectId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchSimulation = async () => {
      try {
        const res = await axios.get(
          `https://jytec-investment-api.onrender.com/api/project/get/${projectId}`,
          {withCredentials: true}
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load simulation data");
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [projectId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      {/* Header */}
   
      <div className="bg-[#063F34] px-6 py-10 md:py-20">
        <div className="w-full md:w-1/2 mx-auto px-4 md:px-44 flex  gap-4">
          <div className="h-15  w-15 flex items-center justify-center rounded-full bg-white/10 text-white">
            {/* <FiClock size={30} /> */}
            <LuFileText size={25} />
          </div>
          <div>
            <h1 className="text-3xl heading md:text-4xl font-semibold text-white">
              Simulation report
            </h1>
            <p className="text-sm md:text-lg text-white/70">
              December 17, 2025 at 7:25 PM
            </p>
          </div>
        </div>
      </div>

      <main className="px-6 md:px-15 pt-10 pb-16">
        {/* Cards */}
       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">

          <div className={baseCard}><FaChartLine className={iconBase} />
            <p>Total Cost</p><p className="text-2xl">{formatCurrency(data.totalCost)}</p>
          </div>

          <div className={baseCard}><FaFileAlt className={iconBase} />
            <p>Total Project Cost</p><p className="text-2xl">{formatCurrency(data.totalProjectCost)}</p>
          </div>

          <div className={`${baseCard} bg-[#e8f3ef]`}>
            <FaChartLine className={iconBase} />
            <p>Margin Net VAT</p><p className="text-2xl">{formatCurrency(data.marginNetVat)}</p>
          </div>

          <div className="rounded-[18px] bg-[#0f3d34] px-6 py-5 text-white">
            <FaPercent className={iconBase} />
            <p>Profitability</p><p className="text-2xl">{formatPercent(data.profitabilityPercent)}</p>
          </div>

          <div className={baseCard}><FaCalculator className={iconBase} />
            <p>Application Cost</p><p className="text-2xl">{formatCurrency(data.applicationCost)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Total Expenses</p><p className="text-2xl">{formatCurrency(data.totalExpenses)}</p>
          </div>

          <div className={baseCard}><FaUniversity className={iconBase} />
            <p>Total Financing</p><p className="text-2xl">{formatCurrency(data.totalFinancing)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Total VAT</p><p className="text-2xl">{formatCurrency(data.totalVAT)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Contribution</p><p className="text-2xl">{formatCurrency(data.contribution)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Contribution %</p><p className="text-2xl">{formatPercent(data.contributionPercentage)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Loan Amount</p><p className="text-2xl">{formatCurrency(data.loanAmount)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Total Interest</p><p className="text-2xl">{formatCurrency(data.totalInterest)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Commission</p><p className="text-2xl">{formatCurrency(data.commission)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Montage Amount</p><p className="text-2xl">{formatCurrency(data.montageAmount)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Application Fees</p><p className="text-2xl">{formatCurrency(data.applicationFee)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Finance Cost / Month</p><p className="text-2xl">{formatCurrency(data.totalfinacecostpermonth)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Total Resale</p><p className="text-2xl">{formatCurrency(data.totalResale)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Turn Over</p><p className="text-2xl">{formatCurrency(data.turnOver)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Margin</p><p className="text-2xl">{formatCurrency(data.margin)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Full VAT</p><p className="text-2xl">{formatCurrency(data.fullVat)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>VAT on Margin</p><p className="text-2xl">{formatCurrency(data.vatonMargin)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Recoverable VAT</p><p className="text-2xl">{formatCurrency(data.recoverableVAT)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>TotalVat</p><p className="text-2xl">{formatCurrency(data.totalVat)}</p>
          </div>

          <div className={baseCard}><FaReceipt className={iconBase} />
            <p>Lot’s Total Revenue</p><p className="text-2xl">{formatCurrency(data.lotsTotalRevenue)}</p>
          </div>

        </section>

        {/* Graphical analysis */}
        <section className="pt-10">
          <h2 className="text-2xl font-bold text-black heading  mb-2">
            Graphical analysis
          </h2>

          <div className="inline-block bg-white rounded-[18px] border border-gray-100 px-2 md:px-6 mt-4 pt-5 pb-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-400">
              Margins before/after VAT
            </p>

            <p className="mt-1 text-2xl font-semibold">5.987,34 €</p>
            <p className="text-xs font-semibold text-gray-500 mt-2 mb-4">
              Secondary text
            </p>

            <div className="h-44 w-72 md:w-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="gross"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#ec4899"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4  flex justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-5 h-2 bg-blue-400 " />
                Gross Margin
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-2 bg-pink-400 " />
                Net margin
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

