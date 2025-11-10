import React, { useState } from 'react';
import { FOOD_ENHANCE_PROMPT } from '../constants';
import { generateImageFromImageAndText } from '../services/geminiService';
import { SourceImage } from '../types';
import { addWatermark } from '../utils/imageUtils';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ImageModal from './ImageModal';
import { useTranslation } from '../contexts/LanguageContext';

const FoodEnhancer: React.FC = () => {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<'5' | '10' | null>(null);
  const [sourceImages, setSourceImages] = useState<SourceImage[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const planLimit = plan ? parseInt(plan, 10) : 0;

  const handleImagesUpload = (newImages: SourceImage[]) => {
    const currentCount = sourceImages.length;
    const availableSlots = planLimit - currentCount;
    
    if (newImages.length > availableSlots) {
       setError(t('food.errorLimit', { count: availableSlots }));
    }
    
    const imagesToAdd = newImages.slice(0, availableSlots);
    setSourceImages(prev => [...prev, ...imagesToAdd]);
    setEnhancedImages([]);
    setError(null);
  };

  const removeImage = (indexToRemove: number) => {
    setSourceImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setError(null);
  };
  
  const handleEnhance = async () => {
    if (sourceImages.length === 0) return;
    setIsLoading(true);
    setError(null);
    setEnhancedImages([]);
    try {
      const enhancementPromises = sourceImages.map(image =>
        generateImageFromImageAndText(image.base64, image.mimeType, FOOD_ENHANCE_PROMPT)
      );
      const results = await Promise.all(enhancementPromises);
      
      const watermarkPromises = results.map(result => addWatermark(result));
      const watermarkedImages = await Promise.all(watermarkPromises);
      
      setEnhancedImages(watermarkedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setPlan(null);
    setSourceImages([]);
    setEnhancedImages([]);
    setError(null);
    setIsLoading(false);
  };

  if (!plan) {
    return (
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{t('food.title')}</h2>
          <p className="text-text-secondary mt-1">{t('food.planSelectDescription')}</p>
        </div>
        <div className="p-6 bg-base-200 rounded-lg max-w-md mx-auto">
            <h3 className="font-semibold text-lg mb-4">{t('food.planSelectTitle')}</h3>
            <div className="flex justify-center gap-4">
                <button onClick={() => setPlan('5')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors">{t('food.plan5')}</button>
                <button onClick={() => setPlan('10')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors">{t('food.plan10')}</button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
          <div className="text-center">
              <h2 className="text-2xl font-bold">{t('food.title')}</h2>
              <p className="text-text-secondary mt-1">{t('food.planSelected', { plan: plan || '' })} <button onClick={resetState} className="text-sm text-brand-primary hover:underline">{t('food.changePlan')}</button></p>
          </div>

          <div className="p-4 bg-base-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">{t('food.uploadTitle', { count: sourceImages.length, limit: planLimit })}</h3>
              {sourceImages.length < planLimit && <ImageUploader onImagesUpload={handleImagesUpload} multiple />}
              {sourceImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {sourceImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square">
                              <img src={`data:${image.mimeType};base64,${image.base64}`} alt={`Original food ${index + 1}`} className="rounded-lg w-full h-full object-cover" />
                              <div 
                                onClick={() => setExpandedImage(`data:${image.mimeType};base64,${image.base64}`)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                              </div>
                              <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              </button>
                          </div>
                      ))}
                  </div>
              )}
          </div>
        
          <div className="text-center">
              <button
              onClick={handleEnhance}
              disabled={sourceImages.length === 0 || isLoading}
              className="w-full md:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
              {isLoading ? t('food.enhancingButton', { count: sourceImages.length }) : (sourceImages.length === 1 ? t('food.enhanceButton', { count: sourceImages.length }) : t('food.enhanceButtonMultiple', { count: sourceImages.length }))}
              </button>
          </div>

          {error && <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">{error}</div>}

          {isLoading && <div className="w-full flex justify-center py-8"><LoadingSpinner /></div>}
          
          {enhancedImages.length > 0 && !isLoading && (
              <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center">{t('food.resultsTitle')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {enhancedImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square">
                              <img src={`data:image/png;base64,${image}`} alt={`Enhanced food ${index + 1}`} className="rounded-lg w-full h-full object-cover" />
                              <div 
                                onClick={() => setExpandedImage(`data:image/png;base64,${image}`)}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                              </div>
                              <a
                                  href={`data:image/png;base64,${image}`}
                                  download={`enhanced-food-${index + 1}.png`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                              >
                                {t('food.download')}
                              </a>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
      {expandedImage && (
        <ImageModal imageUrl={expandedImage} onClose={() => setExpandedImage(null)} />
      )}
    </>
  );
};

export default FoodEnhancer;