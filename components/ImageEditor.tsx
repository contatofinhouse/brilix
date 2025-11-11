
import React, { useState } from 'react';
import { generateImageFromImageAndText } from '../services/geminiService';
import { SourceImage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

interface ImageEditorProps {
  image: SourceImage;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image }) => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState<SourceImage>(image);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editsRemaining, setEditsRemaining] = useState(3);

  const handleEdit = async (editType: 'background' | 'clothes' | 'style' | 'light') => {
    if (editsRemaining <= 0 || isLoading) return;

    setIsLoading(true);
    setError(null);

    let prompt = '';
    switch (editType) {
      case 'background':
        prompt = "Regenerate this image, maintaining the exact same person, face, expression, outfit, lighting, and style, but change the background to a different, professional setting (e.g., a different office color, a blurred natural backdrop).";
        break;
      case 'clothes':
        prompt = "Regenerate this image, maintaining the exact same person, face, expression, lighting, and style, but change the color of their clothes.";
        break;
      case 'style':
        prompt = "Regenerate this image, maintaining the exact same person, but render it in a completely different artistic style, like a vibrant pop-art portrait or a classic oil painting.";
        break;
      case 'light':
        prompt = "Regenerate this image, maintaining the exact same person, outfit, and background, but significantly improve the lighting to be more dramatic and professional, like studio lighting.";
        break;
    }

    try {
      const result = await generateImageFromImageAndText(currentImage.base64, currentImage.mimeType, prompt);
      setCurrentImage({ base64: result.base64Image, mimeType: 'image/png' });
      setEditsRemaining(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('editor.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = `data:${currentImage.mimeType};base64,${currentImage.base64}`;
    link.download = `ai-edited-image.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const editOptions = [
    { type: 'background', labelKey: 'editor.editChangeBackground' },
    { type: 'clothes', labelKey: 'editor.editChangeClothes' },
    { type: 'style', labelKey: 'editor.editChangeStyle' },
    { type: 'light', labelKey: 'editor.editImproveLighting' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('editor.title')}</h2>
        <p className="text-text-secondary mt-1">
          {editsRemaining > 0
            ? t('editor.description', { count: editsRemaining })
            : t('editor.noEdits')
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Display */}
        <div className="w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center text-text-secondary relative">
          {currentImage && <img src={`data:${currentImage.mimeType};base64,${currentImage.base64}`} alt={t('editor.imageAlt')} className="rounded-lg max-w-full max-h-full" />}
          {isLoading && (
            <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center rounded-lg">
              <LoadingSpinner />
              <p className="mt-2 text-text-primary font-semibold">{t('editor.editing')}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-lg text-center mb-4">{t('editor.optionsTitle')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {editOptions.map(opt => (
              <button
                key={opt.type}
                onClick={() => handleEdit(opt.type)}
                disabled={isLoading || editsRemaining <= 0}
                className="bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-center"
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          <div className="pt-4">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {t('editor.downloadButton')}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">{t('common.dismiss')}</button>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
