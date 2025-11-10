
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, signInWithGoogle, signOut } = useAuth();
  
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
          <span className="text-brand-primary">AI</span> {t('header.title')}
        </h1>
        <div className="flex-1 text-right">
          {user ? (
             <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-text-secondary hidden sm:inline">{t('auth.welcome', { name: user.user_metadata.name.split(' ')[0] })}</span>
                <button 
                  onClick={signOut}
                  className="bg-base-300 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-base-300/80 transition-colors"
                >
                  {t('auth.logout')}
                </button>
             </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-brand-secondary transition-colors"
            >
              {t('auth.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
