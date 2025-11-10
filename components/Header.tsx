
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          <span className="text-brand-primary">AI</span> {t('header.title')}
        </h1>
      </div>
    </header>
  );
};

export default Header;