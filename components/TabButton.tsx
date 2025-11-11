import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, disabled = false }) => {
  const { t } = useTranslation();
  const activeClasses = 'border-brand-primary text-brand-primary';
  const inactiveClasses = 'border-transparent text-text-secondary hover:text-text-primary';
  const disabledClasses = 'text-text-secondary/50 cursor-not-allowed border-transparent';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-3 font-semibold text-sm md:text-base transition-colors duration-300 border-b-2 ${
        disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)
      }`}
    >
      <span>{label}</span>
      {disabled && (
        <span className="ml-2 bg-base-300 text-text-secondary/70 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {t('common.comingSoon')}
        </span>
      )}
    </button>
  );
};

export default TabButton;