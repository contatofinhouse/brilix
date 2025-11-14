import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen text-text-primary">
      <Helmet>
        <title>Contato | AI Image Stylist</title>
        <meta
          name="description"
          content="Entre em contato com a equipe AI Image Stylist para dúvidas, suporte ou parcerias."
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-6 py-12 leading-relaxed max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Fale Conosco</h1>

        <p className="text-text-secondary mb-6">
          Se precisar de ajuda, suporte, dúvidas de pagamento ou quiser propor uma parceria,
          estamos aqui para ajudar.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📩 Suporte e Atendimento</h2>
        <p className="mb-4">Para dúvidas gerais e suporte técnico:</p>

        <a
          href="mailto:contatofinhouse@gmail.com"
          className="text-brand-primary hover:underline text-lg font-medium"
        >
          contatofinhouse@gmail.com
        </a>

        <h2 className="text-2xl font-semibold mt-10 mb-3">🤝 Parcerias</h2>
        <p className="mb-4">
          Empresas, criadores ou influenciadores interessados em parcerias podem enviar proposta para:
        </p>
        <p className="text-brand-primary font-medium">contatofinhouse@gmail.com</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📄 Sobre a Empresa</h2>
        <ul className="list-disc ml-6 text-text-secondary">
          <li>AI Image Stylist</li>
          <li>CNPJ: 60.806.192/0001-50</li>
        </ul>

      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
