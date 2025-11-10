import React, { useCallback, useState } from 'react';
import { SourceImage } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ImageUploaderProps {
  onImagesUpload: (images: SourceImage[]) => void;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload, multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const promises = imageFiles.map(file => {
      return new Promise<SourceImage>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve({ base64: base64String, mimeType: file.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(images => {
        onImagesUpload(images);
      })
      .catch(err => {
        console.error("Error reading files:", err);
      });
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative w-full h-48 bg-base-200 rounded-lg border-2 border-dashed border-base-300 flex flex-col justify-center items-center text-text-secondary cursor-pointer hover:border-brand-primary hover:text-text-primary transition-all duration-300 ${isDragging ? 'border-brand-primary scale-105' : ''}`}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <p className="font-semibold">{multiple ? t('uploader.promptMultiple') : t('uploader.prompt')}</p>
    </div>
  );
};

export default ImageUploader;