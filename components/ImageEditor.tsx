
import React, { useState } from 'react';
import { generateImageFromImageAndText } from '../services/geminiService';
import { SourceImage } from '../types';
import { addWatermark } from '../utils/imageUtils';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

const ImageEditor: React.FC = () => {
  const { t } = useTranslation();
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesUpload = (images: SourceImage[]) => {
    if (images.length > 0) {
      setSourceImage(images[0]);
      setEditedImage(null);
      setError(null);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    try {
      const result = await generateImageFromImageAndText(sourceImage.base64, sourceImage.mimeType, prompt);
      // FIX: Pass the base64Image property of the result to addWatermark
      const watermarkedImage = await addWatermark(result.base64Image);
      setEditedImage(watermarkedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('editor.title')}</h2>
        <p className="text-text-secondary mt-1">{t('editor.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 text-center">
          <h3 className="font-semibold text-lg">{t('editor.originalTitle')}</h3>
          <div className="p-4 bg-base-200 rounded-lg">
            {sourceImage ? (
              <>
                <img src={`data:${sourceImage.mimeType};base64,${sourceImage.base64}`} alt="Original" className="rounded-lg w-full" />
                <button onClick={() => setSourceImage(null)} className="w-full mt-2 text-sm text-center text-text-secondary hover:text-brand-primary">{t('headshot.uploadAnother')}</button>
              </>
            ) : (
              <ImageUploader onImagesUpload={handleImagesUpload} />
            )}
          </div>
        </div>
        <div className="space-y-4 text-center">
          <h3 className="font-semibold text-lg">{t('editor.editedTitle')}</h3>
          <div className="p-4 bg-base-200 rounded-lg aspect-square flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {!isLoading && editedImage && <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className="rounded-lg max-w-full max-h-full" />}
            {!isLoading && !editedImage && <p className="text-text-secondary">{t('editor.editedPlaceholder')}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label htmlFor="prompt" className="block font-semibold text-lg text-center">{t('editor.promptLabel')}</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('editor.promptPlaceholder')}
          className="w-full p-3 bg-base-200 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
        />
      </div>
      
      <div className="text-center">
        <button
          onClick={handleEdit}
          disabled={!sourceImage || !prompt || isLoading}
          className="w-full md:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {isLoading ? t('editor.editingButton') : t('editor.editButton')}
        </button>
      </div>

      {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">{error}</div>}
    </div>
  );
};

export default ImageEditor;