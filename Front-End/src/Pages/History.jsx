import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import { FiFileText, FiTrash2, FiClock, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";

const HistorySkeleton = () => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-white p-2 sm:p-5 shadow-sm">
    {/* Left */}
    <div className="flex items-start gap-4">
      <Skeleton
        variant="rectangular"
        width={48}
        height={48}
        sx={{ borderRadius: 2 }}
      />

      <div className="space-y-2">
        <Skeleton variant="text" width={220} height={24} />
        <Skeleton variant="text" width={300} />
        <Skeleton variant="text" width={180} />
      </div>
    </div>

    {/* Right Actions */}
    <div className="flex gap-3">
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton
        variant="rectangular"
        width={110}
        height={36}
        sx={{ borderRadius: 1 }}
      />
      <Skeleton
        variant="rectangular"
        width={90}
        height={36}
        sx={{ borderRadius: 1 }}
      />
    </div>
  </div>
);

export default function History() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // track per-row loader
  const [downloadingId, setDownloadingId] = useState(null);

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const formatDateFR = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};


const formatEuroFR = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "—";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};


  // ---------- FETCH ----------
  const fetchSimulations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "https://api.emibocquillon.fr/api/project/getall",
        authConfig,
      );

      const projects = res.data.projects || res.data;

      const mapped = projects.map((project) => ({
        id: project._id,
        title: project.name,
        // date: new Date(project.createdAt).toLocaleString(),
        date: formatDateFR(project.createdAt),


        // SAFELY read type from API (Draft / Purchase)
        status: project?.type === "purchase" ? "purchase" : "draft",

        tva: project?.expenses?.reduce((sum, e) => {
          const vat = ((e.priceExclTax || 0) * (e.vatRate || 0)) / 100;
          return sum + vat;
        }, 0),

        margin: project?.lots?.reduce((sum, lot) => {
          return sum + (lot.resalePrice || 0);
        }, 0) ,
      }));

      setSimulations(mapped);
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || "Votre session a expiré. Veuillez vous reconnecter..";

      setError(message);
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Redirect to login on auth failure
      if (status === 401 || status === 403) {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">
            Êtes-vous sûr de vouloir supprimer ce rapport ?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>

            <button
              onClick={() => {
                closeToast();
                handleDelete(id);
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Confirmer
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await axios.post(
        `https://api.emibocquillon.fr/api/project/soft-delete/${id}`,
        {},
        authConfig,
      );

      setSimulations((prev) => prev.filter((p) => p.id !== id));

      toast.success("Rapport supprimé avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Delete failed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ---------- ACTION HANDLERS ----------
  // const handleOpen = (id) => console.log("open", id);

  // ---------- DOWNLOAD WITH LOADER + TOAST ----------
  const handleDownload = async (id, status) => {
    if (status === "draft") {
      toast.info("Draft projects cannot be downloaded");
      return;
    }

    try {
      setDownloadingId(id);

      toast.info("Génération de rapports…");

      const res = await axios.get(
        `https://api.emibocquillon.fr/api/project/generate-report/${id}`,
        {
          responseType: "blob",
          ...authConfig,
        },
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      let filename = `project-${id}-report.pdf`;
      const disposition = res.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Rapport téléchargé avec succès.");
    } catch (err) {
      console.error(err);
      toast.error("Le téléchargement du rapport a échoué.");
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  // ---------- CLIENT-SIDE PAGINATION ----------
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = simulations.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(simulations.length / itemsPerPage);

  const goToPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPage = (p) => setCurrentPage(p);

  const statusStyles = {
    draft: "bg-blue-200 text-blue-700",
    purchase: "bg-green-200 text-green-700",
  };

  const statusLabels = {
    draft: "Brouillon",
    purchase: "Terminé ",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#063F34] px-6 py-10 md:py-20">
        <div className="w-full md:w-1/2 mx-auto px-4 md:px-44 flex gap-4">
          <div className="h-15 w-15 flex items-center justify-center rounded-full bg-white/10 text-white">
            <FiClock size={25} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold text-white">
              Historique
            </h1>
            <p className="text-sm md:text-md text-white/70">
              Retrouvez toutes vos simulations enregistrées
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-5">
        {/* {loading && <p>Loading...</p>} */}
        {loading &&
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <HistorySkeleton key={i} />
          ))}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && simulations.length === 0 && (
          <p className="text-gray-500 text-center text-2xl mt-32 ">Aucun rapport de simulation n'a été trouvé.</p>
        )}

        {currentItems.map((item) => (
          <div
            key={item.id}
            className="transition-opacity duration-300 opacity-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-white p-2 sm:p-5 shadow-sm"
          >
            {/* Left */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#E7F2EF] flex items-center justify-center text-[#063F34]">
                <FiFileText size={20} />
              </div>

              <div>
                <div className="">
                  <h3 className="font-bold text-gray-900 mr-5 text-base inline-block sm:text-lg">
                    {item.title}
                  </h3>

                  {/* draft or purchase tag */}
                  {/* Draft / Purchase tag */}
                  <span
                    className={`px-3 py-1 rounded-2xl text-xs font-medium ${
                      statusStyles[item.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {statusLabels[item.status] || "Draft"}
                  </span>
                </div>

                <p className="mt-1 mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  {/* <FiCalendar size={14} /> */}
                  ID du rapport: {item.id}
                </p>

                <p className="my-1 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <FiCalendar size={14} />
                  {item.date}
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  TVA: <span className="text-black mr-2">{formatEuroFR(item.tva)}</span>
                  Margin: <span className="text-black">{formatEuroFR(item.margin)}</span>
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-end gap-3 mt-2 md:mt-0">
              {/* DOWNLOAD */}

              <button
                onClick={() => handleDownload(item.id, item.status)}
                disabled={downloadingId === item.id || item.status === "draft"}
                title={
                  item.status === "draft"
                    ? "Download disabled for Draft projects"
                    : "Download report"
                }
                className={`flex items-center ${
                  downloadingId === item.id || item.status === "draft"
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110 transition"
                }`}
              >
                {item.status === "draft" ? (
                  <MdOutlineFileDownload className="inline-block opacity-80 text-lg md:text-2xl" />
                ) : downloadingId === item.id ? (
                  <span className="text-sm">Downloading…</span>
                ) : (
                  <MdOutlineFileDownload className="inline-block text-lg md:text-2xl" />
                )}
              </button>

              {/* REPORT */}

              <button
                onClick={() => navigate(`/simulation/${item.id}`)}
                disabled={item.status === "draft"}
                title={
                  item.status === "draft"
                    ? "Simulation is disabled for Draft projects"
                    : "View simulation report"
                }
                className={`px-3 py-2 text-xs sm:text-sm border rounded-xl transition ${
                  item.status === "draft"
                    ? "border-gray-600 text-gray-600 cursor-not-allowed opacity-50"
                    : "border-green-900 text-green-900 hover:bg-green-50"
                }`}
              >
                Rapport de simulation
              </button>

              {/* OPEN */}
              <button
                onClick={() => navigate(`/edit-report/${item.id}`)}
                className="rounded-lg bg-[#063F34] px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#052F28] transition"
              >
                {item.status === "draft" ? "Modifier" : "Modifier "}
              </button>

              {/* DELETE */}
              <button
                onClick={() => confirmDelete(item.id)}
                disabled={deletingId === item.id}
                className={`text-red-500 transition ${
                  deletingId === item.id
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-red-600"
                }`}
              >
                {deletingId === item.id ? (
                  <span className="text-xs">Suppression…</span>
                ) : (
                  <FiTrash2 className="text-sm md:text-lg" />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {simulations.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm sm:text-base ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#063F34] text-white"
              }`}
            >
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 rounded text-sm sm:text-base ${
                  p === currentPage
                    ? "bg-[#063F34] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm sm:text-base ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#063F34] text-white"
              }`}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
