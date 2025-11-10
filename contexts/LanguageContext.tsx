import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
  const [translations, setTranslations] = useState<any | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const langFile = language === 'pt-BR' ? 'pt-BR.json' : 'en.json';
        const response = await fetch(`./locales/${langFile}`);
        if (!response.ok) {
            throw new Error(`Failed to load translation file: ${langFile}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error loading translations:", error);
        // Fallback to english if the primary language file fails
        if (language !== 'en') {
            try {
                const response = await fetch('./locales/en.json');
                const data = await response.json();
                setTranslations(data);
            } catch (fallbackError) {
                console.error("Error loading fallback English translations:", fallbackError);
            }
        }
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    if (!translations) {
      return key; // Return key as a fallback while loading
    }
    
    let translation = getNestedTranslation(translations, key) || key;

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }

    return translation;
  };

  // Render children only after translations have been loaded to prevent UI flicker
  if (!translations) {
    return null;
  }

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
