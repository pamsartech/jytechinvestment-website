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

import { FiMessageCircle, FiPhone, FiCalendar } from "react-icons/fi";

const cards = [
  {
    id: 1,
    icon: <FiMessageCircle className="w-7 h-7 text-emerald-900" />,
    title: "Open a ticket",
    subtitle: "Our teams will respond to you within 24 hours maximum",
    buttonLabel: "Create a ticket",
  },
  {
    id: 2,
    icon: <FiPhone className="w-7 h-7 text-emerald-900" />,
    title: "WhatsApp",
    subtitle: "Chat live with an advisor",
    buttonLabel: "Open WhatsApp",
  },
  {
    id: 3,
    icon: <FiCalendar className="w-7 h-7 text-emerald-900" />,
    title: "Schedule a call",
    subtitle: "Reserve a slot with an expert",
    buttonLabel: "Reserve",
  },
];

export default function SupportPage() {
  return (
    <div className="w-full bg-white">
      {/* Top Banner */}
      <div className="bg-[#063F34] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex items-center py-4 md:py-10 px-4 md:px-40 gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <RiUser3Line size={25} />
            </div>

            {/* Text Content */}
            <div>
              <h1 className="text-4xl heading font-semibold">
                Our support is available 7 days a week
              </h1>
              <p className="text-lg text-white/80 mt-1">
                A question, a technical problem, a request for information? Our
                team of experts is here to support you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
       <div className="mt-15 flex items-center justify-center   px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-80 rounded-3xl bg-white shadow-md border border-gray-200 px-8 py-10 flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6EBEA]">
              {card.icon}
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {card.title}
            </h3>

            <p className="mb-8 text-sm text-gray-600">{card.subtitle}</p>

            <button className="mt-auto rounded-xl bg-[#00332B] px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 transition-colors">
              {card.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
      {/* <div className="max-w-7xl mx-auto px-4 mt-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            icon={<FaTicketAlt />}
            title="Open a ticket"
            desc="Our teams will respond to you within 24 hours maximum"
            action="Create a ticket"
          />
          <Card
            icon={<FaWhatsapp />}
            title="WhatsApp"
            desc="Chat live with an advisor"
            action="Open WhatsApp"
          />
          <Card
            icon={<FaCalendarAlt />}
            title="Schedule a call"
            desc="Reserve a slot with an expert"
            action="Reserve"
          />
        </div>
      </div> */}

      {/* Video Guide */}
      <div className="max-w-3xl mx-auto px-4 mt-20">
        <h2 className="text-center text-xl font-semibold mb-8">
          How to Use the Mortgage Tax Calculator
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="relative h-64 rounded-xl bg-gray-300 flex items-center justify-center">
            <button className="w-16 h-16 bg-[#063c35] rounded-full flex items-center justify-center text-white">
              <FaPlay className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto px-4 mt-20 mb-20">
        <div className="bg-[#063c35] rounded-2xl px-8 py-10 text-white flex flex-col items-center text-center">
          <h3 className="text-2xl font-semibold">Didn't find your answers</h3>
          <p className="text-xl text-white/80 mt-1">
            Our support team is available to help you
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mt-6 text-md">
            <div className="flex items-center gap-2">
              <FaEnvelope /> support@immoerenta.fr
            </div>
            <div className="flex items-center gap-2">
              <FaPhone /> +33 1 00 00 00 00
            </div>
          </div>

          <button className="mt-6 px-8 py-2.5 rounded-full border border-white hover:bg-white hover:text-[#063c35] transition">
            Contact Support
          </button>
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
