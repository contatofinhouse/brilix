import React, { useState } from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { generateImageFromImageAndText, generateImageVariations } from '../services/geminiService';
import { SourceImage } from '../types';
import { addWatermark } from '../utils/imageUtils';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';

type Step = 'upload' | 'generating' | 'result';
interface ImageVariation {
  clean: string;
  watermarked: string;
}

const HeadshotGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('upload');
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  
  const [cleanGeneratedImage, setCleanGeneratedImage] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [editVariations, setEditVariations] = useState<ImageVariation[]>([]);

  const [selectedStyle, setSelectedStyle] = useState<string>(HEADSHOT_STYLES[0].prompt);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesUpload = (images: SourceImage[]) => {
    if (images.length > 0) {
      setSourceImage(images[0]);
      setDisplayImage(null);
      setCleanGeneratedImage(null);
      setEditVariations([]);
      setError(null);
    }
  };
  
  const handleGenerate = async (baseImg: string, mime: string, prompt: string) => {
      const result = await generateImageFromImageAndText(baseImg, mime, prompt);
      setCleanGeneratedImage(result);
      const watermarked = await addWatermark(result);
      setDisplayImage(watermarked);
  };

  const handleInitialGenerate = async () => {
    if (!sourceImage || !selectedStyle) return;
    setStep('generating');
    setError(null);
    setDisplayImage(null);
    setEditVariations([]);
    try {
      await handleGenerate(sourceImage.base64, sourceImage.mimeType, selectedStyle);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('headshot.errorGeneric'));
      setStep('upload');
    }
  };
  
  const handleEdit = async (editType: 'outfit' | 'background') => {
      if (!cleanGeneratedImage) return;
      setIsEditing(true);
      setError(null);
      setEditVariations([]);
      try {
          let editPrompt = '';
          if (editType === 'outfit') {
              editPrompt = "Regenerate this professional headshot, maintaining the exact same person, face, expression, lighting, and style, but change their outfit to a different professional attire (e.g., a different color suit, a blouse instead of a blazer)."
          } else { // background
              editPrompt = "Regenerate this professional headshot, maintaining the exact same person, face, expression, outfit, lighting, and style, but change the background to a different, professional setting (e.g., a different office color, a blurred natural backdrop)."
          }
          const cleanResults = await generateImageVariations(cleanGeneratedImage, 'image/png', editPrompt, 3);
          const watermarkedResults = await Promise.all(cleanResults.map(res => addWatermark(res)));

          const variations = cleanResults.map((clean, index) => ({
            clean,
            watermarked: watermarkedResults[index]
          }));
          
          setEditVariations(variations);
          if (variations.length > 0) {
            setDisplayImage(variations[0].watermarked);
            setCleanGeneratedImage(variations[0].clean);
          }

      } catch (err) {
          setError(err instanceof Error ? err.message : t('headshot.errorEdit'));
      } finally {
          setIsEditing(false);
      }
  }
  
  const handlePaymentAndDownload = () => {
      if(!cleanGeneratedImage) return;
      alert(`${t('headshot.paymentSuccessTitle')}\n\n${t('headshot.paymentSuccessBody')}`);

      const link = document.createElement('a');
      link.href = `data:image/png;base64,${cleanGeneratedImage}`;
      link.download = 'ai-headshot-final.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const startOver = () => {
    setStep('upload');
    setSourceImage(null);
    setDisplayImage(null);
    setCleanGeneratedImage(null);
    setEditVariations([]);
    setError(null);
  };

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
      <div className="text-center">
        <button
          onClick={handleInitialGenerate}
          disabled={!sourceImage}
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
        <p className="text-text-secondary mt-1">{t('headshot.resultDescription')}</p>
      </div>

       <div className="w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center text-text-secondary relative">
          {displayImage && <img src={`data:image/png;base64,${displayImage}`} alt="Generated headshot" className="rounded-lg max-w-full max-h-full" />}
          {isEditing && (
            <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center rounded-lg">
              <LoadingSpinner />
              <p className="mt-2 text-text-primary font-semibold">{t('headshot.editingVariations')}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-base-200 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg text-center">{t('headshot.editsTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleEdit('outfit')} disabled={isEditing} className="bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('headshot.editOutfit')}</button>
                <button onClick={() => handleEdit('background')} disabled={isEditing} className="bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('headshot.editBackground')}</button>
            </div>
        </div>

        {editVariations.length > 0 && (
          <div className="p-4 bg-base-200 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-center">{t('headshot.variationsTitle')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {editVariations.map((variation, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setDisplayImage(variation.watermarked);
                    setCleanGeneratedImage(variation.clean);
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
              onClick={startOver}
              className="w-full sm:w-auto bg-base-300 text-text-primary font-bold py-3 px-8 rounded-lg hover:bg-base-300/80 transition-colors duration-300"
            >
              {t('headshot.startOverButton')}
            </button>
            <button
              onClick={handlePaymentAndDownload}
              disabled={isEditing}
              className="w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
              {t('headshot.payButton')}
            </button>
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