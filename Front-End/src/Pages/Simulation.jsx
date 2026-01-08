import {  FaChartLine,  FaFileAlt,  FaPercent,  FaCalculator,  FaUniversity,  FaReceipt,} from "react-icons/fa";
import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  ResponsiveContainer,} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LuFileText } from "react-icons/lu";

const chartData = [
  { x: 1, gross: -20, net: -10 },  { x: 2, gross: 30, net: 10 }, { x: 3, gross: -40, net: 20 },
  { x: 4, gross: 25, net: 45 }, { x: 5, gross: 60, net: 30 }, { x: 6, gross: 20, net: 0 },
];

/* shared card styles */
const baseCard =
  "flex flex-col justify-between rounded-[18px] border border-gray-100 bg-white px-4 py-4 md:px-6 md:py-10 shadow-sm/10";

const iconBase =
  "w-10 h-10 flex items-center justify-center rounded-xl mb-4 text-sm";

  /* helpers */
  const formatCurrency = (v, decimals = 0) => {
  if (v === undefined || v === null || isNaN(v)) return "—";

  return (
    Number(v).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }) + "€"
  );
};


const formatPercent = (v, decimals = 0) => {
  if (v === undefined || v === null || isNaN(v)) return "—";

  return (
    Number(v).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }) + "%"
  );
};

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
        { withCredentials: true }
      );

      if (!res.data?.result) {
        throw new Error("Simulation result missing");
      }

      setData(res.data.result);
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

      <main className="px-4 md:px-15 pt-10 pb-16">
        {/* Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mb-10">
          {/* total cost */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaChartLine />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total Cost
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalCost)}</p>
            </div>
          </div>

          {/* total project cost */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaFileAlt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total Project Cost
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalProjectCost)}</p>
            </div>
          </div>

          {/* Net Margin (active) */}
          <div className={`${baseCard} bg-[#e8f3ef] border-[#c9e1d8]`}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaChartLine />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Margin Net Vat
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.marginNetVat)}</p>
            </div>
          </div>

          {/* Profitability (dark) */}
          <div className="flex flex-col justify-between rounded-[18px] bg-[#0f3d34] px-6 py-5 text-white">
  <div>
    <div className={`${iconBase} bg-white/20 text-emerald-100`}>
      <FaPercent />
    </div>

    <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-emerald-100">
      Profitability
    </p>

    <p
      className={`mt-2 text-lg md:text-2xl font-semibold ${
        Number(data.profitabilityPercent) <= 20
          ? "text-red-600"
          : "text-white"
      }`}
    >
      {formatPercent(data.profitabilityPercent)}
    </p>

    <p className="mt-1 text-[11px] text-emerald-100">On Total Cost</p>
  </div>
</div>

          {/* <div className="flex flex-col justify-between rounded-[18px] bg-[#0f3d34] px-6 py-5 text-white">
            <div>
              <div className={`${iconBase} bg-white/20 text-emerald-100`}>
                <FaPercent />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-emerald-100">
                Profitability
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatPercent(data.profitabilityPercent)}</p>
              <p className="mt-1 text-[11px] text-emerald-100">On Total Cost</p>
            </div>
          </div> */}

          {/* Application cost */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaCalculator />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Application cost
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.applicationCost)}</p>
            </div>
          </div>

          {/* Total expenses */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total expenses
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalExpenses)}</p>
            </div>
          </div>

          {/* Total financing */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaUniversity />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total financing
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalFinancing)}</p>
            </div>
          </div>

          {/* Total VAT */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total VAT
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalVAT)}</p>
            </div>
          </div>

          {/* contribution */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Contribution
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.contribution)}</p>
            </div>
          </div>

          {/* contribution percentage */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Contribution Percentage
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatPercent(data.contributionPercentage)}</p>
            </div>
          </div>

          {/* loan amount */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Loan Amount
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.loanAmount)}</p>
            </div>
          </div>

          {/* total interest */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total Interest
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalInterest)}</p>
            </div>
          </div>

          {/* commission */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Commission
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.commission)}</p>
            </div>
          </div>

          {/* montage amount */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Montage Amount
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.montageAmount)}</p>
            </div>
          </div>

          {/* application fees */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Application Fees
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.applicationFee)}</p>
            </div>
          </div>

          {/* total finance cost per month */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total Finance Cost Per Month
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalfinacecostpermonth)}</p>
            </div>
          </div>

          {/* total resale */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Total Resale
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalResale)}</p>
            </div>
          </div>

          {/* turn over */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Turn Over
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.turnOver)}</p>
            </div>
          </div>

          {/* margin */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Margin
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.margin)}</p>
            </div>
          </div>

          {/* full vat */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Full Vat
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.fullVat)}</p>
            </div>
          </div>

          {/* vaton margin */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Vaton Margin
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.vatonMargin)}</p>
            </div>
          </div>

          {/* recoverable vat */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                recoverable Vat
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.recoverableVAT)}</p>
            </div>
          </div>

          {/* totalvat */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                TotalVat
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.totalVat)}</p>
            </div>
          </div>

          {/* lot's total revenue */}
          <div className={baseCard}>
            <div>
              <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                <FaReceipt />
              </div>
              <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                Lot's Total Revenue
              </p>
              <p className="mt-2 text-lg md:text-2xl font-semibold">{formatCurrency(data.lotsTotalRevenue)}</p>
            </div>
          </div>
        </section>

        {/* Graphical analysis */}
        <section className="pt-10">
          <h2 className="text-lg md:text-2xl font-bold text-black heading  mb-2">
            Graphical analysis
          </h2>

          <div className="inline-block bg-white rounded-[18px] border border-gray-100 px-2 md:px-6 mt-4 pt-5 pb-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-400">
              Margins before/after VAT
            </p>

            <p className="mt-1 text-lg md:text-2xl font-semibold">5.987,34 €</p>
            <p className="text-xs font-semibold text-gray-500 mt-2 mb-4">
              Secondary text
            </p>

            <div className="h-44 w-80 md:w-96">
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
