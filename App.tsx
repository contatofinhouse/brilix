import React, { useState } from 'react';
import Header from './components/Header';
import HeadshotGenerator from './components/HeadshotGenerator';
import MyCreations from './components/MyCreations';
import TabButton from './components/TabButton';
import { useTranslation } from './contexts/LanguageContext';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';

type Tab = 'headshot' | 'mycreations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('headshot');
  const { t } = useTranslation();
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
    <div
      className="
        min-h-screen 
        text-white 
        font-sans 
        relative
        overflow-x-hidden
        bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]
        before:absolute before:inset-0 
        before:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.15),transparent_60%)]
        before:z-0
      "
    >
      {/* HEADER */}
      <div className="relative z-20">
        <Header onDashboardClick={() => setActiveTab('mycreations')} />
      </div>

      {/* MAIN */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div
          className="
            flex 
            justify-center 
            mb-8 
            border-b border-white/10 
            space-x-2 
            overflow-x-auto 
            scrollbar-hide 
            pb-2
          "
        >
          <TabButton
            label={t('tabs.headshot')}
            isActive={activeTab === 'headshot'}
            onClick={() => setActiveTab('headshot')}
            className="
              px-4 py-2 rounded-xl text-sm font-medium 
              bg-white/5 border border-white/10
              text-white hover:bg-white/10 
              transition-all duration-200
              shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]
              hover:shadow-[0_0_10px_rgba(147,197,253,0.3)]
            "
          />

          {/* Hidden tabs (mantidas mas invisíveis ao usuário) */}
          <div className="hidden">
            <TabButton
              label={t('tabs.food')}
              isActive={false}
              onClick={() => {}}
              disabled
            />
            <TabButton
              label={t('tabs.interior')}
              isActive={false}
              onClick={() => {}}
              disabled
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="w-full px-2 sm:px-0">{renderContent()}</div>
      </main>

      {/* MODAL AUTH */}
      {isAuthModalOpen && (
        <div className="relative z-30">
          <AuthModal onClose={closeAuthModal} />
        </div>
      )}
    </div>
  );
};

export default App;
