import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  onDashboardClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDashboardClick }) => {
  const { t } = useTranslation();
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header
      className="
        sticky top-0 z-20 
        bg-white/5 
        backdrop-blur-md 
        border-b border-white/10 
        shadow-[0_2px_20px_rgba(0,0,0,0.3)]
      "
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* === TITLE CLICKABLE (HOME LINK) === */}
        <a
          href="/"
          className="
            text-xl sm:text-2xl font-bold tracking-tight 
            text-white hover:text-indigo-300 
            transition-colors duration-200
          "
        >
          <span className="text-indigo-400">AI</span> {t('header.title')}
        </a>

        {/* === USER / DASHBOARD / LOGIN === */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Dashboard Button */}
              <button
                onClick={onDashboardClick}
                className="
                  flex items-center gap-2 
                  text-white 
                  p-2 rounded-lg 
                  hover:bg-white/10 
                  transition-colors 
                  focus:outline-none
                "
                title={t('tabs.mycreations')}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">
                  {t('tabs.mycreations')}
                </span>
              </button>

              {/* Welcome text */}
              <span className="hidden sm:inline text-sm text-gray-300">
                {t('auth.welcome', { name: user.user_metadata.name.split(' ')[0] })}
              </span>

              {/* Logout */}
              <button
                onClick={signOut}
                className="
                  flex items-center gap-1 
                  bg-white/10 hover:bg-white/20 
                  text-white px-3 py-2 rounded-lg text-sm 
                  transition-all duration-200 
                  shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]
                "
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="
                flex items-center gap-1
                bg-gradient-to-r from-indigo-500 to-blue-500 
                hover:from-indigo-400 hover:to-blue-400 
                text-white px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 shadow-[0_0_10px_rgba(99,102,241,0.4)]
              "
            >
              <LogIn className="w-4 h-4" />
              {t('auth.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
