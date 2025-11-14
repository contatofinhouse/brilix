import React from "react";

const examples = [
  {
    before: "/samples/before1.jpg",
    after: "/samples/after1.jpg",
    caption: "foto corporativa aprimorado por IA",
  },
  {
    before: "/samples/before2.jpg",
    after: "/samples/after2.jpg",
    caption: "Nitidez e expressão facial otimizadas",
  },
  {
    before: "/samples/before3.jpg",
    after: "/samples/after3.jpg",
    caption: "Fundo profissional e luz balanceada",
  },
];

const BeforeAfterGallery: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Antes e Depois com <span className="text-brand-primary">IA</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Veja como selfies comuns se transformam em fotos profissionais —
          com iluminação aprimorada, fundo elegante e nitidez natural.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
        {examples.map((ex, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex justify-center gap-4 p-4">
              <div className="text-center">
                <img
                  src={ex.before}
                  alt="Antes"
                  className="rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-cover border border-white/10"
                />
                <p className="mt-2 text-sm text-gray-400">Antes</p>
              </div>
              <div className="text-center">
                <img
                  src={ex.after}
                  alt="Depois"
                  className="rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-cover border border-green-400/40"
                />
                <p className="mt-2 text-sm text-green-400 font-semibold">Depois</p>
              </div>
            </div>
            <p className="text-center text-gray-300 text-sm px-4 pb-4">
              {ex.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
    