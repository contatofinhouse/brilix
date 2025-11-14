import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen text-text-primary">
      <Helmet>
        <title>Política de Privacidade | AI Image Stylist</title>
        <meta
          name="description"
          content="Saiba como a AI Image Stylist protege suas fotos, dados pessoais e informações conforme a LGPD."
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-6 py-12 leading-relaxed max-w-4xl">

        <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>

        <p className="text-text-secondary mb-6">
          A <strong>AI Image Stylist</strong> foi construída com um princípio central:
          <span className="text-brand-primary font-semibold"> sua imagem e seus dados pertencem exclusivamente a você.</span>  
          Esta Política explica como tratamos dados e imagens conforme a LGPD.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">1. Informações Coletadas</h2>
        <p className="mb-4">
          Coletamos apenas informações essenciais para operação do serviço:
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Nome e e-mail para login e suporte</li>
          <li>Fotos enviadas para processamento</li>
          <li>Dados técnicos (IP, navegador) para segurança</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">2. Uso das Imagens</h2>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Não treinamos IA com suas imagens</li>
          <li>Não compartilhamos, exibimos ou vendemos fotos</li>
          <li>Uso exclusivo para gerar o conteúdo solicitado</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4">3. Armazenamento e Segurança</h2>
        <p className="mb-6">
          Utilizamos servidores seguros, criptografia e políticas rígidas de acesso.  
          O usuário pode excluir imagens a qualquer momento.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">4. Direitos do Usuário</h2>
        <p className="mb-4">Você pode solicitar a qualquer momento:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Exclusão de dados e imagens</li>
          <li>Cópia de todas as informações da conta</li>
          <li>Correção ou atualização de dados</li>
        </ul>

        <p className="mb-6">
          Contato:  
          <a href="mailto:contatofinhouse@gmail.com" className="text-brand-primary underline ml-1">
            contatofinhouse@gmail.com
          </a>
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">5. Atualizações</h2>
        <p>Esta política pode ser atualizada periodicamente.</p>

        <p className="text-sm text-text-secondary mt-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
