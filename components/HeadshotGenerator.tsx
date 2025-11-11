import React, { useState, useEffect, useCallback } from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { generateImageFromImageAndText, generateImageVariations, createCheckoutSession } from '../services/geminiService';
import { SourceImage } from '../types';
import { addWatermark } from '../utils/imageUtils';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

type Step = 'upload' | 'generating' | 'result';
interface ImageVariation {
  clean: string;
  watermarked: string;
  imageId: string;
}

const HeadshotGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { user, openAuthModal } = useAuth();
  
  const [step, setStep] = useState<Step>('upload');
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [cleanGeneratedImage, setCleanGeneratedImage] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [editVariations, setEditVariations] = useState<ImageVariation[]>([]);

  const [selectedStyle, setSelectedStyle] = useState<string>(HEADSHOT_STYLES[0].prompt);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  const [generationTrigger, setGenerationTrigger] = useState(false);

  // Handle return from Stripe checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      const pendingImageJson = sessionStorage.getItem('pendingPaymentImage');
      if (pendingImageJson) {
        try {
          const pendingImage = JSON.parse(pendingImageJson);
          setCurrentImageId(pendingImage.imageId);
          setCleanGeneratedImage(pendingImage.cleanImage);
          addWatermark(pendingImage.cleanImage).then(setDisplayImage);
          setStep('result');
          setPaymentSuccess(true);
          sessionStorage.removeItem('pendingPaymentImage');
        } catch (e) {
          console.error("Could not parse pending image from session storage", e);
        }
      }
    }
    setIsCheckingPayment(false);
    // Clean up URL
    if (urlParams.has('payment_success') || urlParams.has('payment_cancelled')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleImagesUpload = (images: SourceImage[]) => {
    if (images.length > 0) {
      setSourceImage(images[0]);
      startOver(false);
    }
  };
  
  const proceedWithGeneration = useCallback(async () => {
    if (!sourceImage || !selectedStyle) return;
    
    setStep('generating');
    setIsLoading(true);
    setError(null);
    setDisplayImage(null);
    setEditVariations([]);
    try {
      const { base64Image, imageId } = await generateImageFromImageAndText(sourceImage.base64, sourceImage.mimeType, selectedStyle);
      setCleanGeneratedImage(base64Image);
      setCurrentImageId(imageId);
      const watermarked = await addWatermark(base64Image);
      setDisplayImage(watermarked);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('headshot.errorGeneric'));
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, selectedStyle, t]);
  
  useEffect(() => {
    if (generationTrigger && user) {
      proceedWithGeneration();
      setGenerationTrigger(false);
    }
  }, [generationTrigger, user, proceedWithGeneration]);

  const handleInitialGenerate = async () => {
    if (!user) {
      setGenerationTrigger(true);
      openAuthModal();
    } else {
      proceedWithGeneration();
    }
  };
  
  const handleEdit = async (editType: 'outfit' | 'background') => {
      if (!cleanGeneratedImage) return;
      setIsEditing(true);
      setError(null);
      setEditVariations([]);
      try {
          let editPrompt = editType === 'outfit'
              ? "Regenerate this professional headshot, maintaining the exact same person, face, expression, lighting, and style, but change their outfit to a different professional attire (e.g., a different color suit, a blouse instead of a blazer)."
              : "Regenerate this professional headshot, maintaining the exact same person, face, expression, outfit, lighting, and style, but change the background to a different, professional setting (e.g., a different office color, a blurred natural backdrop).";
          
          const cleanResults = await generateImageVariations(cleanGeneratedImage, 'image/png', editPrompt, 3);
          // FIX: Pass the base64Image property of the result to addWatermark
          const watermarkedResults = await Promise.all(cleanResults.map(res => addWatermark(res.base64Image)));

          const variations = cleanResults.map((res, index) => ({
            clean: res.base64Image,
            imageId: res.imageId,
            watermarked: watermarkedResults[index]
          }));
          
          setEditVariations(variations);
          if (variations.length > 0) {
            setDisplayImage(variations[0].watermarked);
            setCleanGeneratedImage(variations[0].clean);
            setCurrentImageId(variations[0].imageId);
            setPaymentSuccess(false);
          }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('headshot.errorEdit'));
      } finally {
          setIsEditing(false);
      }
  }
  
  const handlePayment = async () => {
      if(!currentImageId || !cleanGeneratedImage) return;
      setIsLoading(true);
      try {
        sessionStorage.setItem('pendingPaymentImage', JSON.stringify({ imageId: currentImageId, cleanImage: cleanGeneratedImage }));
        
        const { url } = await createCheckoutSession(currentImageId);
        
        // The backend provides a direct URL to the Stripe checkout page.
        // We redirect the user straight to it, which is the correct modern approach.
        window.location.href = url;

      } catch(err) {
        setError(err instanceof Error ? err.message : t('headshot.errorPayment'));
        sessionStorage.removeItem('pendingPaymentImage'); // Clean up on error
        setIsLoading(false); // Ensure loading state is reset on failure
      }
  }

  const handleDownload = () => {
    if(!cleanGeneratedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${cleanGeneratedImage}`;
    link.download = `ai-headshot-${currentImageId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const startOver = (fullReset = true) => {
    setStep('upload');
    if(fullReset) setSourceImage(null);
    setDisplayImage(null);
    setCleanGeneratedImage(null);
    setCurrentImageId(null);
    setEditVariations([]);
    setError(null);
    setPaymentSuccess(false);
  };

  if (isCheckingPayment) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const renderUploadStep = () => (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('headshot.title')}</h2>
        <p className="text-text-secondary mt-1">{t('headshot.description')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-lg">{t('headshot.uploadTitle')}</h3>
          {sourceImage ? (
            <img src={`data:${sourceImage.mimeType};base64,${sourceImage.base64}`} alt="Uploaded selfie" className="rounded-lg w-full" />
          ) : (
            <ImageUploader onImagesUpload={handleImagesUpload} />
          )}
           {sourceImage && <button onClick={() => setSourceImage(null)} className="w-full mt-2 text-sm text-center text-text-secondary hover:text-brand-primary">{t('headshot.uploadAnother')}</button>}
        </div>
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-lg">{t('headshot.styleTitle')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {HEADSHOT_STYLES.map(style => (
              <button
                key={style.nameKey}
                onClick={() => setSelectedStyle(style.prompt)}
                className={`p-3 rounded-md text-sm transition-colors duration-200 ${selectedStyle === style.prompt ? 'bg-brand-primary text-white' : 'bg-base-300 hover:bg-base-300/80'}`}
              >
                {t(style.nameKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <button
          onClick={handleInitialGenerate}
          disabled={!sourceImage || isLoading}
          className="w-full md:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {t('headshot.generateButton')}
        </button>
      </div>
    </>
  );

  const renderGeneratingStep = () => (
    <div className="text-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">{t('headshot.generatingTitle')}</h2>
        <p className="text-text-secondary">{t('headshot.generatingDescription')}</p>
        <div className="flex justify-center pt-4">
            <LoadingSpinner />
        </div>
    </div>
  );

  const renderResultStep = () => (
    <>
       <div className="text-center">
        <h2 className="text-2xl font-bold">{t('headshot.resultTitle')}</h2>
        <p className="text-text-secondary mt-1">{paymentSuccess ? t('headshot.paymentSuccessBody') : t('headshot.resultDescription')}</p>
      </div>

       <div className="w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center text-text-secondary relative">
          {displayImage && <img src={`data:image/png;base64,${displayImage}`} alt="Generated headshot" className="rounded-lg max-w-full max-h-full" />}
          {(isLoading || isEditing) && (
            <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center rounded-lg">
              <LoadingSpinner />
              <p className="mt-2 text-text-primary font-semibold">{isEditing ? t('headshot.editingVariations') : t('headshot.paymentProcessing')}</p>
            </div>
          )}
        </div>
        
        {!paymentSuccess && (
          <div className="p-4 bg-base-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg text-center">{t('headshot.editsTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleEdit('outfit')} disabled={isEditing || isLoading} className="bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('headshot.editOutfit')}</button>
                <button onClick={() => handleEdit('background')} disabled={isEditing || isLoading} className="bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('headshot.editBackground')}</button>
            </div>
          </div>
        )}

        {editVariations.length > 0 && !paymentSuccess && (
          <div className="p-4 bg-base-200 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-center">{t('headshot.variationsTitle')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {editVariations.map((variation, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setDisplayImage(variation.watermarked);
                    setCleanGeneratedImage(variation.clean);
                    setCurrentImageId(variation.imageId);
                  }}
                  className={`rounded-md overflow-hidden border-2 ${displayImage === variation.watermarked ? 'border-brand-primary' : 'border-transparent'} hover:border-brand-primary/70 transition-all duration-200`}
                >
                  <img src={`data:image/png;base64,${variation.watermarked}`} alt={`Variation ${index + 1}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button
              onClick={() => startOver()}
              className="w-full sm:w-auto bg-base-300 text-text-primary font-bold py-3 px-8 rounded-lg hover:bg-base-300/80 transition-colors duration-300"
            >
              {t('headshot.startOverButton')}
            </button>
            {paymentSuccess ? (
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {t('headshot.downloadButton')}
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isEditing || isLoading}
                className="w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                {t('headshot.payButton')}
              </button>
            )}
        </div>
    </>
  );

  return (
    <div className="space-y-6">
       {error && (
        <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">{t('common.dismiss')}</button>
        </div>
      )}
      {step === 'upload' && renderUploadStep()}
      {step === 'generating' && renderGeneratingStep()}
      {step === 'result' && renderResultStep()}
    </div>
  );
};

export default HeadshotGenerator;