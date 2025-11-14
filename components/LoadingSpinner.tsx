import React, { useEffect, useState } from "react";

const messages = [
  "Gerando sua foto com IA…",
  "Ajustando luz e nitidez…",
  "Refinando detalhes faciais…",
  "Quase pronto! Finalizando toques finais…",
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full space-y-4 text-center">
      {/* Spinner visual */}
      <div className="relative">
        <svg
          className="animate-spin h-12 w-12 text-brand-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* Mensagem dinâmica */}
      <p className="text-text-secondary text-sm sm:text-base transition-opacity duration-700 ease-in-out">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingSpinner;
