import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { getMyCreations, UserImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const MyCreations: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [images, setImages] = useState<UserImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) {
        setImages([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const userImages = await getMyCreations();
        setImages(userImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('creations.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [user, t]);

  const handleDownload = async (imageUrl: string, imageId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ai-headshot-${imageId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao baixar imagem:', err);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16 bg-base-200 rounded-lg">
        <h2 className="text-2xl font-bold">{t('creations.loginPrompt')}</h2>
        <p className="text-text-secondary mt-2">{t('auth.modalInfo')}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('creations.title')}</h2>
        <p className="text-text-secondary mt-1">{t('creations.description')}</p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
              <img
                src={image.image_url}
                alt={`Generated creation ${image.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button
                  onClick={() => handleDownload(image.image_url, image.id)}
                  className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-300 flex items-center text-sm"
                  aria-label={t('creations.download')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>{t('common.download')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-base-200 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold">{t('creations.emptyTitle')}</h3>
          <p className="text-text-secondary mt-1">{t('creations.emptyBody')}</p>
        </div>
      )}
    </div>
  );
};

export default MyCreations;
