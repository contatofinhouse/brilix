import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen text-text-primary">
      <Helmet>
        <title>Termos de Uso | AI Image Stylist</title>
        <meta
          name="description"
          content="Termos completos de uso da plataforma AI Image Stylist — direitos, responsabilidades e regras de uso."
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-6 py-12 leading-relaxed max-w-4xl">

        <h1 className="text-4xl font-bold mb-6">Termos de Uso</h1>

        <p className="text-text-secondary mb-6">
          Estes Termos regulam o uso da plataforma <strong>AI Image Stylist</strong>,
          operada sob o CNPJ <strong>60.806.192/0001-50</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">1. Uso da Plataforma</h2>
        <p className="mb-4">
          O usuário pode enviar fotos e gerar imagens aprimoradas via IA, desde que não
          viole leis, direitos de terceiros ou utilize conteúdo ilegal ou ofensivo.
        </p>

        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Proibido uso difamatório, ilegal ou prejudicial</li>
          <li>Proibido enviar fotos de terceiros sem permissão</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">2. Propriedade Intelectual</h2>
        <p className="mb-6">
          A plataforma, código, marca, design e interface pertencem à AI Image Stylist.
          As imagens geradas e enviadas pertencem ao usuário.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">3. Responsabilidades do Usuário</h2>
        <p className="mb-6">O usuário garante que possui os direitos sobre as fotos enviadas.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">4. Pagamentos</h2>
        <p className="mb-6">
          Recursos premium exigem pagamento via Stripe. Após o pagamento, o usuário terá
          licença de uso completa das imagens geradas.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">5. Privacidade das Imagens</h2>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Não usamos fotos para treinar IA</li>
          <li>Não compartilhamos fotos com terceiros</li>
          <li>As imagens são processadas apenas sob demanda</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">6. Modificações</h2>
        <p className="mb-6">Estes termos podem ser atualizados periodicamente.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">7. Contato</h2>
        <p className="mb-6">
          Dúvidas? Fale com:
          <a href="mailto:contatofinhouse@gmail.com" className="text-brand-primary underline ml-1">
            contatofinhouse@gmail.com
          </a>
        </p>

        <p className="text-sm text-text-secondary mt-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
