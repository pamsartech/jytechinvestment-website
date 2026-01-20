import { FaCalculator } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative flex py-15 md:py-28 items-center justify-center bg-[#053B33] px-4">
      <div className="mx-auto w-full md:max-w-3xl text-center text-white">
        {/* Heading */}
        <h1 className="text-3xl heading font-semibold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
          Simulateur de rentabilité
          <br />
          immobilière
        </h1>

        {/* Description */}
        <p className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg">
          Analysez précisément la rentabilité de vos opérations de marchand de
          biens. Calculez vos marges, optimisez la TVA et prenez les meilleures
        </p>

        {/* calculation Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => {
              document.getElementById("calculation-section")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="flex items-center gap-3 rounded-xl border border-white/70 px-6 py-3 text-lg font-medium text-white transition hover:bg-white hover:text-[#053B33]"
          >
            <FaCalculator className="text-lg" />
            Démarrer l’analyse 
          </button>
        </div>
      </div>
    </section>
  );
}
