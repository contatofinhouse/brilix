import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

const GuidePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen text-text-primary">
      <Helmet>
        <title>Guia: Como escolher um Headshot Generator | AI Image Stylist</title>
        <meta
          name="description"
          content="Aprenda a escolher o melhor gerador de fotos profissionais com IA e entenda por que o AI Image Stylist se destaca."
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-6 py-12 leading-relaxed max-w-4xl">

        <h1 className="text-4xl font-bold mb-6">
          Como Escolher o Melhor Headshot Generator em 2025
        </h1>

        <p className="text-text-secondary mb-6">
          No meio de tantas ferramentas de IA, como saber qual realmente entrega uma foto profissional,
          natural e moderna? Este guia explica tudo.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          1. O que Importa ao Selecionar um Headshot Generator
        </h2>

        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Fidelidade facial</li>
          <li>Iluminação e nitidez</li>
          <li>Estilos realistas</li>
          <li>Privacidade e respeito aos dados</li>
          <li>Velocidade e consistência</li>
          <li>Preço justo</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          2. Por que o AI Image Stylist é Diferente
        </h2>

        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Alta fidelidade facial (sem distorção)</li>
          <li>Fotos modernas e profissionais</li>
          <li>Entrega em minutos</li>
          <li>Privacidade total — sem uso para treinar IA</li>
          <li>Estilos exclusivos (Corporate, Tech, Jurídico, Financeiro…)</li>
          <li>Pagamento único — sem mensalidade</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          3. Como Usar o AI Image Stylist
        </h2>

        <ol className="list-decimal ml-6 space-y-2 mb-6">
          <li>Envie uma foto simples</li>
          <li>Escolha o estilo preferido</li>
          <li>Gere sua foto</li>
          <li>Faça ajustes opcionais</li>
          <li>Baixe em alta qualidade</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-10 mb-4">4. Conclusão</h2>

        <p className="mb-6">
          Um bom headshot generator deve entregar confiança, naturalidade e qualidade real.
          O <strong>AI Image Stylist</strong> foi projetado exatamente para isso.
        </p>

        <a
          href="/"
          className="inline-block bg-brand-primary hover:bg-brand-secondary px-8 py-3 rounded-xl text-white font-semibold shadow-glow transition duration-300"
        >
          Criar Minha Foto Agora
        </a>

        <p className="text-sm text-text-secondary mt-10">
          Atualizado em {new Date().toLocaleDateString("pt-BR")}
        </p>

      </main>

      <Footer />
    </div>
  );
};

export default GuidePage;
