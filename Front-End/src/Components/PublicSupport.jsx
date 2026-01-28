import {
  FaTicketAlt,
  FaWhatsapp,
  FaCalendarAlt,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaPlay,
} from "react-icons/fa";
import { RiUser3Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import { toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiPhone, FiCalendar } from "react-icons/fi";

export default function PublicSupport() {
  const [videoData, setVideoData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState("");

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    PhoneNumber: "",
    message: "",
  });

  const handleSupportChange = (e) => {
    setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
  };

  const handleSupportSubmit = async () => {
    if (
      !supportForm.name ||
      !supportForm.email ||
      !supportForm.PhoneNumber ||
      !supportForm.message
    ) {
      toast.warning("Veuillez remplir tous les champs");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        "https://api.emibocquillon.fr/api/support/contact",
        supportForm,
      );

      toast.success("Votre message a été envoyé avec succès");

      setSupportForm({
        name: "",
        email: "",
        PhoneNumber: "",
        message: "",
      });

      setOpenSupportModal(false);
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Erreur lors de l’envoi du message. Veuillez réessayer.",
      );
    } finally {
      setSending(false);
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
      <PublicNavbar />
      {/* Top Banner */}
      <div className="bg-[#063F34] text-white py-12 px-4">
         <button
            onClick={() => navigate("/login")}
            className="text-white  border-white px-3 py-2 md:ml-10 rounded-xl"
          >
            <BsArrowLeft size={20} />
          </button>
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

      {/* Cards */}
      {/* <div className="mt-15 flex items-center justify-center   px-4">
        <div className="grid gap-6 md:grid-cols-1">
          <div className="w-80 rounded-3xl bg-white shadow-md border border-gray-200 px-8 py-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6EBEA]">
              <FiMessageCircle className="w-7 h-7 text-emerald-900" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Ouvrir un ticket
            </h3>

            <p className="mb-8 text-sm text-gray-600">
              {" "}
              Nos équipes vous répondent sous 24h maximum
            </p>

            <button className="mt-auto rounded-xl bg-[#00332B] px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 transition-colors">
              Créer un ticket
            </button>
          </div>
        </div>
      </div> */}

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

      {/* contact section CTA */}
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
          <div className="flex items-center mt-6 gap-2">
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
          <button
            onClick={() => setOpenSupportModal(true)}
            className="mt-6 px-8 py-2.5 rounded-full border border-white hover:bg-white hover:text-[#063c35] transition"
          >
            Contacter le support
          </button>
        </div>
      </div>

      {openSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Contacter le support</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nom"
                value={supportForm.name}
                onChange={handleSupportChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={supportForm.email}
                onChange={handleSupportChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              />

              <input
                type="text"
                name="PhoneNumber"
                placeholder="Téléphone"
                value={supportForm.PhoneNumber}
                onChange={handleSupportChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              />

              <textarea
                name="message"
                placeholder="Votre message..."
                value={supportForm.message}
                onChange={handleSupportChange}
                rows={4}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenSupportModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Annuler
              </button>

              <button
                disabled={sending}
                onClick={handleSupportSubmit}
                className="px-5 py-2 rounded-lg bg-[#063c35] text-white hover:bg-[#052f2a] disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
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
