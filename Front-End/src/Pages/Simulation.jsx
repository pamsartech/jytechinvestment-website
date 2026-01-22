import {
  FaChartLine,
  FaFileAlt,
  FaPercent,
  FaCalculator,
  FaUniversity,
  FaReceipt,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { LuFileText } from "react-icons/lu";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { Skeleton } from "@mui/material";

/* -------------------- DATA -------------------- */

const COLORS = ["#062f2a", "#0c5c4d", "#00a884", "#4fe3c1"];

/* -------------------- LABEL RENDERER FOR PIE -------------------- */

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}) => {
  if (value < 0.5) return null; // hide 0% visually

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#062f2a"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={500}
    >
      {name} {Math.round(percent * 100)}%
    </text>
  );
};

/* shared card styles */
const baseCard =
  "flex flex-col justify-between rounded-[18px] border border-gray-100 bg-white px-4 py-4 md:px-6 md:py-10 shadow-sm/10";

const iconBase =
  "w-10 h-10 flex items-center justify-center rounded-xl mb-4 text-sm";

/* helpers */
const formatCurrency = (v, decimals = 2) => {
  if (v === undefined || v === null || isNaN(v)) return "—";

  const formatted = Number(v)
    .toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .replace(/,/g, " "); // replace commas with spaces

  return `${formatted} €`;
};

const formatPercent = (v, decimals = 0) => {
  if (v === undefined || v === null || isNaN(v)) return "—";

  const formatted = Number(v)
    .toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
    .replace(/,/g, " "); // replace commas with spaces

  return `${formatted}%`;
};


const MetricCardSkeleton = () => (
  <div className="flex flex-col justify-between rounded-[18px] border border-gray-100 bg-white px-4 py-4 md:px-6 md:py-10 shadow-sm/10">
    <Skeleton
      variant="rectangular"
      width={40}
      height={40}
      sx={{ borderRadius: 2, marginBottom: 2 }}
    />

    <Skeleton variant="text" width={140} />
    <Skeleton variant="text" width={110} height={28} />
  </div>
);

const HeaderSkeleton = () => (
  <div className="bg-[#063F34] px-6 py-10 md:py-20">
    <div className="w-full justify-center mx-auto px-4 md:px-44 flex gap-4">
      <Skeleton
        variant="circular"
        width={48}
        height={48}
        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
      />

      <div className="flex flex-col gap-2">
        <Skeleton
          variant="text"
          width={260}
          height={36}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Skeleton
          variant="text"
          width={180}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
      </div>
    </div>
  </div>
);


const ChartSkeleton = () => (
  <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
    <Skeleton variant="text" width={220} height={28} />

    <div className="mt-4 flex justify-center">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={280}
        sx={{ borderRadius: 2 }}
      />
    </div>
  </div>
);


export default function Simulation() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchSimulation = async () => {
      try {
        const res = await axios.get(
          `https://api.emibocquillon.fr/api/project/get/${projectId}`,
          authConfig,
        );

        if (!res.data?.result) {
          throw new Error("Simulation result missing");
        }

        setData(res.data.result);
        setProjectName(res.data.projectName || "");
        setCreatedAt(res.data.createdAt || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load simulation data");
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [projectId]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";

    const date = new Date(isoString);

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDownloadReport = async () => {
    if (!projectId) {
      toast.warning("Project ID is missing");
      return;
    }

    try {
      setDownloading(true);

      const res = await axios.get(
        `https://api.emibocquillon.fr/api/project/generate-report/${projectId}`,
        {
          responseType: "blob",
          ...authConfig,
        },
      );

      // Create a downloadable file
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `simulation-report-${projectId}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Rapport téléchargé avec succès.");
    } catch (err) {
      console.error("Download failed:", err);

      toast.error(
        err?.response?.data?.message ||
          "Le téléchargement du rapport a échoué. Veuillez réessayer..",
      );
    } finally {
      setDownloading(false);
    }
  };

  // graph data

  // pie chart
  const costChartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Coût d’acquisition",
        value: Number(data.applicationCost || 0),
      },
      {
        name: "Dépenses",
        value: Number(data.totalExpenses || 0),
      },
      {
        name: "Financement",
        value: Number(data.totalFinancing || 0),
      },
      {
        name: "TVA",
        value: Number(data.totalVAT || 0),
      },
    ].filter((item) => item.value > 0);
  }, [data]);

  // bar graph
  const marginChartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "TVA sur marge",
        value: Number(data.vatonMargin || 0),
        color: "#00a884",
      },
      {
        name: "TVA intégrale",
        value: Number(data.fullVat || 0),
        color: "#062f2a",
      },
      {
        name: "TVA déductible",
        value: Number(data.recoverableVAT || 0),
        color: "#27ecc1",
      },
    ];
  }, [data]);

  const displayMarginChartData = marginChartData.map((item) => ({
    ...item,
    value: Math.abs(item.value),
  }));

  // if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (loading)
  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <HeaderSkeleton />

      <main className="px-4 md:px-6 pt-10 pb-16">
        {/* Project Name + Button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6 px-4 md:px-0 md:mx-14">
          <Skeleton variant="rectangular" width={300} height={52} />
          <Skeleton variant="rectangular" width={220} height={48} />
        </div>

        {/* Metric Cards */}
        <div className="md:mx-16 mt-10 md:mt-20">
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </section>
        </div>

        {/* Financing Cards */}
        <div className="md:mx-16">
          <Skeleton variant="text" width={200} height={32} />
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </section>
        </div>

        {/* Synthesis Cards */}
        <div className="md:mx-16 mt-10 md:mt-20">
          <Skeleton variant="text" width={180} height={32} />
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </section>
        </div>

        {/* Charts */}
        <div className="w-full px-2 sm:px-4 md:px-6 py-6 md:py-10 mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </main>
    </div>
  );

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      {/* Header */}

      <div className="bg-[#063F34] px-6 py-10 md:py-20">
        <button
          onClick={() => navigate("/history")}
          className="text-white  border-white px-3 py-2 md:ml-10 rounded-xl"
        >
          <BsArrowLeft size={20} />
        </button>
        <div className="w-full  justify-center mx-auto px-4 md:px-44 flex  gap-4">
          <div className="h-13 w-13 md:h-15 md:w-15 flex items-center justify-center rounded-full bg-white/10 text-white">
            {/* <FiClock size={30} /> */}
            <LuFileText size={25} />
          </div>
          <div>
            <h1 className="text-2xl heading md:text-4xl font-semibold text-white">
              Rapport de simulation
            </h1>
            <p className="text-sm md:text-lg text-white/70">
              {formatDateTime(createdAt)}
            </p>
          </div>
        </div>
      </div>

      <main className="transition-opacity duration-300 opacity-100 px-4 md:px-6 pt-10 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6 px-4 md:px-0 md:mx-14">
          {/* Project Name */}
          <label className="flex w-full flex-col md:max-w-md">
            <span className="text-2xl font-semibold pb-2 mx-3 mt-2 ">
              Nom du projet
            </span>

            <input
              type="text"
              value={projectName}
              readOnly
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none"
            />
          </label>

          {/* Download Button */}
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="w-full md:w-auto"
          >
            <span
              className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition
        ${
          downloading
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
            >
              {downloading ? "Télécharger..." : "Télécharger le rapport "}
              <MdOutlineFileDownload className="text-lg md:text-2xl opacity-80" />
            </span>
          </button>
        </div>

        <div className="md:mx-16 mt-10 md:mt-20">
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
            {/* Total expenses */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Dépenses totales
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalExpenses)}
                </p>
              </div>
            </div>

            {/* Total VAT */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  TVA totale
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalVAT)}
                </p>
              </div>
            </div>

            {/* total resale */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Total revente
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalResale)}
                </p>
              </div>
            </div>

            {/* application Cost */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Coût d’acquisition
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.applicationCost)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Financing Cards  */}
        <div className="md:mx-16">
          <h1 className="text-2xl font-semibold pb-2 mx-3 mt-2">Financement </h1>
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
            {/* Total financing */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaUniversity />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Coût total du financement
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalFinancing)}
                </p>
              </div>
            </div>

            {/* contribution */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Apport personnel
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.contribution)}
                </p>
              </div>
            </div>

            {/* contribution percentage */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Pourcentage d’apport 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatPercent(data.contributionPercentage)}
                </p>
              </div>
            </div>

            {/* loan amount */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Montant du prêt
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.loanAmount)}
                </p>
              </div>
            </div>

            {/* total interest */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Intérêts totaux 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalInterest)}
                </p>
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
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.commission)}
                </p>
              </div>
            </div>

            {/* montage amount */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Frais de montage
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.montageAmount)}
                </p>
              </div>
            </div>

            {/* application fees */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Frais de dossier
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.applicationFee)}
                </p>
              </div>
            </div>

            {/* total finance cost per month */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Coût mensuel du financement 

                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalfinacecostpermonth)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* synthesis cards */}
        <div className="md:mx-16 mt-10 md:mt-20">
          <h1 className="text-2xl pb-2 mx-2 font-semibold">Synthèse</h1>
          <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mb-10">
            {/* total cost */}

            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaChartLine />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Coût total 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalCost)}
                </p>
              </div>
            </div>

            {/* total project cost */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaFileAlt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Coût total du projet 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalProjectCost)}
                </p>
              </div>
            </div>

            {/* Net Margin (active) */}
            <div className={`${baseCard} bg-[#e8f3ef] border-[#c9e1d8]`}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaChartLine />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Marge nette de TVA
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.marginNetVat)}
                </p>
              </div>
            </div>

            {/* turn over */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Chiffre d’affaires 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.turnOver)}
                </p>
              </div>
            </div>

            {/* margin */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Marge
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.margin)}
                </p>
              </div>
            </div>

            {/* full vat */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  TVA intégrale 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.fullVat)}
                </p>
              </div>
            </div>

            {/* vaton margin */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  TVA sur marge
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.vatonMargin)}
                </p>
              </div>
            </div>

            {/* recoverable vat */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  TVA déductible 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.recoverableVAT)}
                </p>
              </div>
            </div>

            {/* totalvat */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  TVA totale
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.totalVat)}
                </p>
              </div>
            </div>

            {/* lot's total revenue */}
            <div className={baseCard}>
              <div>
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                  <FaReceipt />
                </div>
                <p className="text-[11px] font-medium tracking-[0.04em] uppercase text-gray-500">
                  Chiffre d’affaires des lots 
                </p>
                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatCurrency(data.lotsTotalRevenue)}
                </p>
              </div>
            </div>

            {/* Profitability (dark) */}
            <div
              className={`flex flex-col justify-between rounded-[18px] px-6 py-5 transition ${
                Number(data.profitabilityPercent) <= 20
                  ? "bg-red-600 text-white"
                  : "bg-[#0f3d34] text-white"
              }`}
            >
              <div>
                <div
                  className={`${
                    Number(data.profitabilityPercent) <= 20
                      ? "bg-white/20 text-white"
                      : "bg-white/20 text-emerald-100"
                  } ${iconBase}`}
                >
                  <FaPercent />
                </div>

                <p
                  className={`text-[11px] font-medium tracking-[0.04em] uppercase ${
                    Number(data.profitabilityPercent) <= 20
                      ? "text-white"
                      : "text-emerald-100"
                  }`}
                >
                  Rentabilité
                </p>

                <p className="mt-2 text-lg md:text-2xl font-semibold">
                  {formatPercent(data.profitabilityPercent)}
                </p>

                <p
                  className={`mt-1 text-[11px] ${
                    Number(data.profitabilityPercent) <= 20
                      ? "text-white"
                      : "text-emerald-100"
                  }`}
                >
                  On Total Cost
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Graphical analysis */}
        <div className="w-full px-2 sm:px-4 md:px-6 py-6 md:py-10 mt-12 md:mt-20">
          <h2 className="mb-4 md:mb-6 text-xl sm:text-2xl font-semibold">
            Analyse graphique 
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* -------------------- PIE / DONUT -------------------- */}
            <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="mb-3 sm:mb-6 text-base sm:text-lg font-semibold">
                Répartition des coûts 
              </h3>

              {/* Responsive Height Wrapper */}
              <div className="flex items-center justify-center">
                <div className="w-full h-55 sm:h-70 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costChartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        labelLine={true}
                        label={renderCustomLabel} // hide on mobile for clarity
                      >
                        {costChartData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                {costChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* -------------------- BAR CHART -------------------- */}
            <div className="rounded-2xl bg-white p-3 sm:p-6 shadow-sm">
              <h3 className="mb-3 sm:mb-6 text-base sm:text-lg font-semibold">
                Analyse de la TVA 
              </h3>

              {/* Responsive Height Wrapper */}
              <div className="w-full h-60 sm:h-75 md:h-85">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayMarginChartData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 30 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />

                    <YAxis
                      type="number"
                      domain={[0, "auto"]}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `${Number(value).toLocaleString()} €`
                      }
                    />

                    <Bar dataKey="value" barSize={50} radius={[10, 10, 0, 0]}>
                      {displayMarginChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#062f2a]" />
                  TVA intégrale
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#00a884]" />
                  TVA sur marge
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#27ecc1]" />
                  TVA déductible
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
