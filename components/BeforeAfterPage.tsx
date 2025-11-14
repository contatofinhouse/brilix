import React from "react";


const examples = [
  {
    before: "/samples/before1.jpg",
    after: "/samples/after1.jpg",
    title: "foto Corporativa",
    desc: "Transforme uma selfie simples em uma foto profissional ideal para LinkedIn ou portfólios.",
  },
  {
    before: "/samples/before2.jpg",
    after: "/samples/after2.jpg",
    title: "Foto de Perfil Natural",
    desc: "Melhora de nitidez, luz e expressão mantendo aparência realista e natural.",
  },
  {
    before: "/samples/before3.jpg",
    after: "/samples/after3.jpg",
    title: "Fundo Profissional Moderno",
    desc: "Troca automática de fundo para ambientes corporativos, com iluminação equilibrada.",
  },
  {
    before: "/samples/before4.jpg",
    after: "/samples/after4.jpg",
    title: "Estilo de foto com Sorriso Leve",
    desc: "A IA ajusta a expressão facial para transmitir simpatia e confiança.",
  },
];

const BeforeAfterPage: React.FC = () => {
  return (
    <section className="py-10 px-6 text-center">
      <h1 className="text-3xl font-bold mb-3">
        Galeria <span className="text-brand-primary">Antes & Depois</span>
      </h1>
      <p className="text-text-secondary mb-10 max-w-2xl mx-auto">
        Veja comparações reais geradas com o AI Image Stylist. 
        Cada foto foi aprimorado por IA, mantendo traços autênticos e iluminação realista.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
        {examples.map((ex, i) => (
          <div
            key={i}
            className="bg-base-200/30 rounded-2xl p-4 border border-white/10 shadow-md"
          >
           
            <h3 className="text-lg font-semibold mt-4 mb-1">{ex.title}</h3>
            <p className="text-sm text-text-secondary">{ex.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BeforeAfterPage;
