import React, { useState } from 'react';
import Header from './components/Header';
import HeadshotGenerator from './components/HeadshotGenerator';
import MyCreations from './components/MyCreations';
import TabButton from './components/TabButton';
import { useTranslation } from './contexts/LanguageContext';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import Footer from './components/Footer';
import BeforeAfterGallery from './components/BeforeAfterGallery';

type Tab = 'headshot' | 'mycreations' | 'beforeafter';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('headshot');
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'headshot':
        return <HeadshotGenerator />;
      case 'mycreations':
        return <MyCreations />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden relative bg-base-100">

      {/* HEADER */}
      <div className="relative z-20">
        <Header onDashboardClick={() => setActiveTab('mycreations')} />
      </div>

      {/* MAIN */}
      <main className="relative z-10 container mx-auto px-4 py-10 max-w-6xl">

        {/* TABS */}
        <div className="flex justify-center mb-12 space-x-3 border-b border-white/10 pb-3 overflow-x-auto">

          <button
            onClick={() => setActiveTab('headshot')}
            className={`tab-premium ${activeTab === 'headshot' ? 'bg-brand-primary/40' : ''}`}
          >
            Criar Foto Profissional
          </button>

          <button
            onClick={() => setActiveTab('beforeafter')}
            className={`tab-premium ${activeTab === 'beforeafter' ? 'bg-brand-primary/40' : ''}`}
          >
            Antes & Depois (Resultados Reais)
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full">{renderContent()}</div>

        

        {/* GALERIA */}
        <div className="mt-24">
          <h2 className="text-center text-3xl font-bold mb-6">
            Veja como pessoas reais tiveram transformações incríveis
          </h2>
          <BeforeAfterGallery />
        </div>


        {/* DIFERENCIAIS SUPERIOR */}
        <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10">

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">Qualidade de Estúdio</h3>
            <p className="text-secondary text-sm">
              Nitidez, iluminação suave e realismo profissional.
            </p>
          </div>

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">Entrega em Minutos</h3>
            <p className="text-secondary text-sm">
              Gere sua foto final quase instantaneamente.
            </p>
          </div>

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">Pagamento Único</h3>
            <p className="text-secondary text-sm">
              Sem mensalidade. Você paga uma vez e recebe tudo.
            </p>
          </div>

        </section>

        {/* SEÇÃO DE PREÇO */}
        <section className="mt-24 card-premium text-center py-12">

          <h2 className="text-3xl font-bold mb-4">
            Sua foto profissional — por menos que um café
          </h2>

          <p className="text-5xl font-extrabold text-brand-primary mb-4 drop-shadow-lg">
            R$ 17<span className="text-2xl align-top">,90</span>
          </p>

          <p className="text-secondary max-w-lg mx-auto mb-8">
            A maneira mais rápida e acessível de ter uma foto realmente profissional.
            Ideal para LinkedIn, currículo, entrevistas e perfis corporativos.
          </p>

          <button
            onClick={() => setActiveTab('headshot')}
            className="btn-premium"
          >
            Criar minha foto agora — em 1 minuto
          </button>

        </section>

        {/* SEÇÃO "PERFEITO PARA LINKEDIN" — logo abaixo do preço */}
        <section className="mt-16 mb-20 grid grid-cols-1 sm:grid-cols-3 gap-10">

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">Perfeito Para LinkedIn</h3>
            <p className="text-secondary text-sm">
              Passe credibilidade instantânea com um foto profissional forte.
            </p>
          </div>

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">Tecnologia Avançada</h3>
            <p className="text-secondary text-sm">
              IA ajusta luz, nitidez e realismo automaticamente.
            </p>
          </div>

          <div className="card-premium">
            <h3 className="text-xl font-bold mb-3">99% de Aprovação</h3>
            <p className="text-secondary text-sm">
              A maioria usa como foto oficial em redes e empresas.
            </p>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* MODAL DE LOGIN */}
      {isAuthModalOpen && (
        <div className="relative z-30">
          <AuthModal onClose={closeAuthModal} />
        </div>
      )}

    </div>
  );
};

export default App;
