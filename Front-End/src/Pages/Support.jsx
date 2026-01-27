import { FaEnvelope } from "react-icons/fa";
import { RiUser3Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiMessageCircle, FiPhone, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";

export default function SupportPage() {
  const [videoData, setVideoData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState("");

  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState("");

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const createTicket = async () => {
  if (ticketLoading || ticketSuccess) return; // stop resending

  try {
    setTicketLoading(true);
    setTicketError("");
    setTicketSuccess("");

    const res = await axios.post(
      "https://api.emibocquillon.fr/api/support/ticket",
      {},
      authConfig
    );

    if (res.data?.success) {
      setTicketSuccess("Ticket créé avec succès !");
      toast.success("Ticket créé avec succès !");
    } else {
      setTicketError("Impossible de créer le ticket.");
      toast.error("Impossible de créer le ticket.");
    }
  } catch (err) {
    console.error("Create ticket failed:", err);

    const message =
      err.response?.data?.message || "Erreur lors de la création du ticket.";

    setTicketError(message);
    toast.error(message);
  } finally {
    setTicketLoading(false);
  }
};


  useEffect(() => {
    const fetchVideoGuide = async () => {
      try {
        setVideoLoading(true);

        const res = await axios.get(
          "https://api.emibocquillon.fr/api/content/get",
        );

        if (res.data?.success) {
          setVideoData({
            title:
              res.data.content?.TutorialMangment?.VideoTittle || "Video Guide",
            description:
              res.data.content?.TutorialMangment?.VideoDescription || "",
            videoUrl: res.data.videoDetails?.streamUrl
              ? `https://api.emibocquillon.fr${res.data.videoDetails.streamUrl}`
              : "",
          });
        } else {
          setVideoError("Video guide not available");
        }
      } catch (err) {
        console.error("Failed to load video guide", err);
        setVideoError("Unable to load video guide");
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideoGuide();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Top Banner */}
      <div className="bg-[#063F34] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex items-center py-4 md:py-10 px-4 md:px-40 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <RiUser3Line className="text-xl sm:text-2xl" />
            </div>

            {/* Text Content */}
            <div>
              <h1 className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl heading font-semibold leading-tight">
                Notre support est disponible 7j/7
              </h1>
              <p className="text-lg sm:text-base md:text-lg text-white/80 mt-1">
                Vous avez une question, un problème technique ou une demande
                d'information ? Notre équipe d'experts est là pour vous aider.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*book a ticket Card */}
      <div className="mt-15 flex items-center justify-center   px-4">
        <div className="grid gap-6 md:grid-cols-1">
          <div className="w-80 rounded-3xl bg-white shadow-md border border-gray-200 px-8 py-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6EBEA]">
              <FiMessageCircle className="w-7 h-7 text-emerald-900" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Ouvrir un ticket
            </h3>

            <p className="mb-8 text-sm text-gray-600">
              Nos équipes vous répondent sous 24h maximum
            </p>

            <button
              onClick={createTicket}
              disabled={ticketLoading}
              className={`mt-auto rounded-xl px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors ${
                ticketLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#00332B] hover:bg-emerald-800"
              }`}
            >
              {ticketLoading ? "Création..." : "Créer un ticket"}
            </button>
          </div>
        </div>
      </div>

      {/* Video Guide */}
      <div className="max-w-3xl mx-auto  mt-20">
        <h2 className="text-center text-xl font-semibold mb-8">
          Comment utiliser le simulateur de fiscalité immobilière
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="max-w-3xl mx-auto  mt-5">
            <h2 className="text-center text-xl font-semibold mb-8">
              {videoData?.title || "How to Use the Mortgage Tax Calculator"}
            </h2>

            <div className="bg-white rounded-2xl  p-3">
              {videoLoading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Loading video guide...
                </div>
              ) : videoError ? (
                <div className="h-64 flex items-center justify-center text-red-500">
                  {videoError}
                </div>
              ) : videoData?.videoUrl ? (
                <video
                  controls
                  className="w-full h-64 rounded-xl bg-black"
                  src={videoData.videoUrl}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Video not available
                </div>
              )}

              {videoData?.description && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  {videoData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto px-4 mt-20 mb-20">
        <div className="bg-[#063c35] rounded-2xl px-8 py-10 text-white flex flex-col items-center text-center">
          <h3 className="text-2xl font-semibold">
            Vous n’avez pas trouvé votre réponse{" "}
          </h3>
          <p className="text-xl text-white/80 mt-1">
            Notre équipe support est à votre disposition
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-6 mt-6 text-md">
            <div className="flex items-center gap-2">
              <FaEnvelope /> contact@jytecmdb.net
            </div>
          </div> */}

            <div className="flex mt-6 items-center gap-2">
            <FaEnvelope />
            <a
              href="mailto:contact@jytecmdb.net"
              className="underline hover:text-emerald-200 transition"
            >
              contact@jytecmdb.net
            </a>
          </div>

          {/* <button className="mt-6 px-8 py-2.5 rounded-full border border-white hover:bg-white hover:text-[#063c35] transition">
            Contacter le support
          </button> */}
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, desc, action }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg px-6 py-8 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-[#063c35] text-xl mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{desc}</p>
      <button className="px-6 py-2 rounded-full bg-[#063c35] text-white hover:bg-[#052f2a] transition">
        {action}
      </button>
    </div>
  );
}
