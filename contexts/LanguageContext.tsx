import React, { createContext, useState, useContext, ReactNode } from 'react';

// Import the translation files as JavaScript modules
import enTranslations from '../locales/en.js';
import ptBRTranslations from '../locales/pt-BR.js';

type Language = 'en' | 'pt-BR';

interface LanguageContextType {
  language: Language;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const browserLang = navigator.language;
  if (browserLang.startsWith('pt')) {
    return 'pt-BR';
  }
  return 'en';
};

const getNestedTranslation = (languageData: any, key: string): string | undefined => {
  if (!languageData) return undefined;
  return key.split('.').reduce((obj, keyPart) => {
    return obj && obj[keyPart] !== undefined ? obj[keyPart] : undefined;
  }, languageData);
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language] = useState<Language>(getInitialLanguage());

  // Determine which translation object to use synchronously
  const translations = language === 'pt-BR' ? ptBRTranslations : enTranslations;

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = getNestedTranslation(translations, key) || key;

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }

    return translation;
  };

  // The app can render immediately as there is no loading state
  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
