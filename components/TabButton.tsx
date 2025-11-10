
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  const activeClasses = 'border-brand-primary text-brand-primary';
  const inactiveClasses = 'border-transparent text-text-secondary hover:text-text-primary';

  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold text-sm md:text-base transition-colors duration-300 border-b-2 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;
