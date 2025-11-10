import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
      <div 
        className="relative max-w-4xl w-11/12 max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt="Expanded view" className="rounded-lg object-contain max-w-full max-h-full mx-auto" />
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
          aria-label="Close image view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageModal;