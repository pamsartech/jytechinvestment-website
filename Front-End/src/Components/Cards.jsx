import {
  FaCalculator,
  FaChartLine,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

const FEATURES = [
  {
    icon: FaCalculator,
    title: "Calculs précis",
    description:
      "Algorithmes financiers professionnels pour des résultats fiables",
  },
  {
    icon: FaChartLine,
    title: "Rentabilité optimisée ",
    description:
      "Analysez et optimisez votre marge sur chaque opération",
  },
  {
    icon: FaShieldAlt,
    title: "TVA maîtrisée",
    description:
      "Gestion complète des régimes de TVA immobilière",
  },
  {
    icon: FaClock,
    title: "Temps réel",
    description: "Résultats instantanés à la saisie",
  },
];

export default function Cards() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-[#053B33]">
                  <Icon size={20} />
                </div>

                {/* Title */}
                <h3 className="text-lg heading font-semibold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
