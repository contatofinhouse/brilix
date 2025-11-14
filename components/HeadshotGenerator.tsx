import React, { useState, useEffect, useCallback } from 'react';
import { HEADSHOT_STYLES } from '../constants';
import {
  generateImageFromImageAndText,
  createCheckoutSession,
  confirmPurchase,
} from '../services/geminiService';
import { SourceImage } from '../types';
import { addWatermark } from '../utils/imageUtils';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

type Step = 'upload' | 'generating' | 'result';

interface HeadshotGeneratorProps {
  onPaymentSuccess?: () => void;
}

const HeadshotGenerator: React.FC<HeadshotGeneratorProps> = ({
  onPaymentSuccess: invalidateCreations = () => {},
}) => {
  const { t } = useTranslation();
  const { user, openAuthModal } = useAuth();

  const [step, setStep] = useState<Step>('upload');
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [cleanGeneratedImage, setCleanGeneratedImage] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(HEADSHOT_STYLES[0].prompt);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const [isConfirmingPurchase, setIsConfirmingPurchase] = useState(false);

  const [generationTrigger, setGenerationTrigger] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const [editsRemaining, setEditsRemaining] = useState(3);

  // ✅ Stripe checkout return
  useEffect(() => {
    const handlePaymentReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has('payment_success') && !urlParams.has('payment_cancelled')) {
        setIsCheckingPayment(false);
        return;
      }

      if (!user) return;
      window.history.replaceState({}, document.title, window.location.pathname);

      if (urlParams.get('payment_success') === 'true') {
        const sessionId = urlParams.get('session_id');
        const pendingImageJson = sessionStorage.getItem('pendingPaymentImage');
        sessionStorage.removeItem('pendingPaymentImage');

        if (!sessionId) {
          setError(t('headshot.errorMissingSession'));
          setIsCheckingPayment(false);
          setStep('upload');
          return;
        }

        if (pendingImageJson) {
          try {
            setIsConfirmingPurchase(true);
            const pendingImage = JSON.parse(pendingImageJson);
            await confirmPurchase(pendingImage.imageId, sessionId);
            invalidateCreations();
            setCurrentImageId(pendingImage.imageId);
            setCleanGeneratedImage(pendingImage.cleanImage);
            setDisplayImage(pendingImage.cleanImage);
            setStep('result');
            setPaymentSuccess(true);
          } catch (e) {
            console.error('Could not process purchase confirmation:', e);
            const errorMessage = e instanceof Error ? e.message : t('headshot.errorPayment');
            setError(errorMessage);
            setStep('upload');
          } finally {
            setIsConfirmingPurchase(false);
          }
        }
      }

      setIsCheckingPayment(false);
    };

    handlePaymentReturn();
  }, [user, invalidateCreations, t]);

  // ✅ Handle post-login pending generation
  useEffect(() => {
    const pendingDataJSON = sessionStorage.getItem('pendingHeadshotGeneration');
    if (user && pendingDataJSON) {
      try {
        const pendingData = JSON.parse(pendingDataJSON);
        sessionStorage.removeItem('pendingHeadshotGeneration');
        setSourceImage(pendingData.sourceImage);
        setSelectedStyle(pendingData.selectedStyle);
        setGenerationTrigger(true);
      } catch {
        sessionStorage.removeItem('pendingHeadshotGeneration');
      }
    }
  }, [user]);

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
    try {
      const { base64Image, imageId } = await generateImageFromImageAndText(
        sourceImage.base64,
        sourceImage.mimeType,
        selectedStyle
      );
      setCleanGeneratedImage(base64Image);
      setCurrentImageId(imageId);
      const watermarked = await addWatermark(base64Image);
      setDisplayImage(watermarked);
      setStep('result');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('headshot.errorGeneric');
      if (errorMessage.includes('limit')) {
        setError(t('headshot.limitReached'));
        setLimitReached(true);
      } else {
        setError(errorMessage);
      }
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
      if (sourceImage) {
        sessionStorage.setItem(
          'pendingHeadshotGeneration',
          JSON.stringify({ sourceImage, selectedStyle })
        );
        openAuthModal();
      }
    } else {
      proceedWithGeneration();
    }
  };

  // ✅ EDIÇÃO INTELIGENTE (pré-pagamento)
  const simpleEditOptions = [
    { type: 'attire-formal', label: 'Roupa formal (terno/blazer)' },
    { type: 'bg-office-bright', label: 'Fundo de escritório moderno' },
    { type: 'polish-sharp', label: 'Aumentar nitidez e detalhes' },
    { type: 'smile-subtle', label: 'Adicionar leve sorriso' },
    { type: 'lighting-better', label: 'Melhorar iluminação' },
    { type: 'skin-smooth', label: 'Pele mais suave (natural)' },
    { type: 'framing-center', label: 'Ajustar enquadramento' },
  ] as const;

  type EditType = typeof simpleEditOptions[number]['type'];

  const handleSmartEdit = async (editType: EditType) => {
    if (editsRemaining <= 0 || !cleanGeneratedImage || isEditing || isLoading) return;

    setIsEditing(true);
    setError(null);

    let prompt = '';
    switch (editType) {
      case 'bg-office-bright':
        prompt =
          'Maintain the same person and pose but change the background to a bright, modern, professional office setting.';
        break;
      case 'attire-formal':
        prompt =
          'Maintain the same person and expression but change the attire to professional business formal, such as blazer and shirt.';
        break;
      case 'polish-sharp':
        prompt =
          'Increase overall sharpness, definition, and clarity while keeping the same composition.';
        break;
      case 'smile-subtle':
        prompt =
          'Regenerate the image keeping the same person, pose, and lighting, but add a very subtle, natural smile.';
        break;
      case 'lighting-better':
        prompt =
          'Improve lighting quality with balanced brightness and soft shadows, keeping background and subject consistent.';
        break;
      case 'skin-smooth':
        prompt =
          'Keep everything identical but make skin texture smoother and even, maintaining a realistic look.';
        break;
      case 'framing-center':
        prompt =
          'Adjust framing so the face is centered and well-proportioned while preserving everything else identical.';
        break;
    }

    try {
      const { base64Image, imageId } = await generateImageFromImageAndText(
        cleanGeneratedImage,
        'image/png',
        prompt
      );
      setCleanGeneratedImage(base64Image);
      setCurrentImageId(imageId);
      const watermarked = await addWatermark(base64Image);
      setDisplayImage(watermarked);
      setEditsRemaining(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('headshot.errorEdit'));
    } finally {
      setIsEditing(false);
    }
  };

  // ✅ Pagamento
  const handlePayment = async () => {
    if (!currentImageId || !cleanGeneratedImage) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        'pendingPaymentImage',
        JSON.stringify({ imageId: currentImageId, cleanImage: cleanGeneratedImage })
      );
      const { url } = await createCheckoutSession(currentImageId);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t('headshot.errorPayment'));
      sessionStorage.removeItem('pendingPaymentImage');
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cleanGeneratedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${cleanGeneratedImage}`;
    link.download = `ai-headshot-${currentImageId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startOver = (fullReset = true) => {
    setStep('upload');
    if (fullReset) setSourceImage(null);
    setDisplayImage(null);
    setCleanGeneratedImage(null);
    setCurrentImageId(null);
    setError(null);
    setPaymentSuccess(false);
    setEditsRemaining(3);
    setLimitReached(false);
  };

  if (isCheckingPayment || isConfirmingPurchase) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <LoadingSpinner />
        <p className="text-text-secondary">
          {isConfirmingPurchase
            ? t('headshot.confirmingPurchase')
            : t('headshot.paymentProcessing')}
        </p>
      </div>
    );
  }

  // ✅ Interface
  const renderResultStep = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{t('headshot.resultTitle')}</h2>
        <p className="text-text-secondary mt-1">
          {paymentSuccess
            ? t('headshot.paymentSuccessBody')
            : t('headshot.resultDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center text-text-secondary relative">
          {displayImage && (
            <img
              src={`data:image/png;base64,${displayImage}`}
              alt="Generated headshot"
              className="rounded-lg max-w-full max-h-full"
            />
          )}
          {(isLoading || isEditing) && (
            <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center rounded-lg">
              <LoadingSpinner />
              <p className="mt-2 text-text-primary font-semibold">
                {isEditing
                  ? t('headshot.editing')
                  : t('headshot.paymentProcessing')}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!paymentSuccess && (
            <div className="p-4 bg-base-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg text-center mb-2">
                {editsRemaining > 0
                  ? `Melhorias disponíveis: ${editsRemaining}`
                  : 'Limite de edições atingido'}
              </h3>
              <div className="flex flex-col gap-2">
                {simpleEditOptions.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => handleSmartEdit(opt.type)}
                    disabled={isEditing || isLoading || editsRemaining <= 0}
                    className="w-full bg-base-300 hover:bg-brand-primary/20 p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-center text-base font-semibold"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-4">
            {paymentSuccess ? (
              <button
                onClick={handleDownload}
                className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {t('headshot.downloadButton')}
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isEditing || isLoading || limitReached}
                className="w-full bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('headshot.payButton')}
              </button>
            )}
            <button
              onClick={() => startOver()}
              className="w-full bg-base-300 text-text-primary font-bold py-3 px-8 rounded-lg hover:bg-base-300/80 transition-colors duration-300"
            >
              {t('headshot.startOverButton')}
            </button>
          </div>
        </div>
      </div>
    </>
  );

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
            <img
              src={`data:${sourceImage.mimeType};base64,${sourceImage.base64}`}
              alt="Uploaded selfie"
              className="rounded-lg w-full"
            />
          ) : (
            <ImageUploader onImagesUpload={handleImagesUpload} />
          )}
          {sourceImage && (
            <button
              onClick={() => setSourceImage(null)}
              className="w-full mt-2 text-sm text-center text-text-secondary hover:text-brand-primary"
            >
              {t('headshot.uploadAnother')}
            </button>
          )}
        </div>
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-lg">{t('headshot.styleTitle')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {HEADSHOT_STYLES.map(style => (
              <button
                key={style.nameKey}
                onClick={() => setSelectedStyle(style.prompt)}
                className={`p-3 rounded-md text-sm transition-colors duration-200 ${
                  selectedStyle === style.prompt
                    ? 'bg-brand-primary text-white'
                    : 'bg-base-300 hover:bg-base-300/80'
                }`}
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
          disabled={!sourceImage || isLoading || limitReached}
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-center p-4 bg-red-900/50 text-red-300 border border-red-500 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">
            {t('common.dismiss')}
          </button>
        </div>
      )}
      {step === 'upload' && renderUploadStep()}
      {step === 'generating' && renderGeneratingStep()}
      {step === 'result' && renderResultStep()}
    </div>
  );
};

export default HeadshotGenerator;
