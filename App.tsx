// Fix: Corrected the import statement for React and the useState hook.
import React, { useState } from 'react';
import Header from './components/Header';
import HeadshotGenerator from './components/HeadshotGenerator';
import TabButton from './components/TabButton';
import { useTranslation } from './contexts/LanguageContext';
import AuthModal from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';

type Tab = 'headshot';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('headshot');
  const { t } = useTranslation();
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'headshot':
        return <HeadshotGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="text-text-primary min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8 border-b border-base-300">
          <TabButton
            label={t('tabs.headshot')}
            isActive={activeTab === 'headshot'}
            onClick={() => setActiveTab('headshot')}
          />
          <TabButton
            label={t('tabs.food')}
            isActive={false}
            onClick={() => {}}
            disabled={true}
          />
           <TabButton
            label={t('tabs.interior')}
            isActive={false}
            onClick={() => {}}
            disabled={true}
          />
        </div>
        <div>
          {renderContent()}
        </div>
      </main>
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </div>
  );
};

export default App;