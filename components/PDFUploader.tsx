'use client';

import { useState, useRef } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

interface PDFUploaderProps {
  onPdfUploaded: (pdfUrl: string, fileName: string) => void;
  className?: string;
}

export default function PDFUploader({ onPdfUploaded, className = '' }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file');
      DanteLogger.error.validation('Invalid file type uploaded', { type: file.type });
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('pdf', file);

      // Upload the file to our API
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Call the callback with the URL of the uploaded PDF
      onPdfUploaded(data.pdfUrl, data.fileName);
      DanteLogger.success.basic('PDF uploaded successfully', { fileName: data.fileName });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload PDF');
      DanteLogger.error.dataFlow('PDF upload failed', { error });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`pdf-uploader ${className}`}>
      <div
        className={`upload-area p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
          isDragging ? 'border-[var(--cta-primary, #7E4E2D)] bg-[var(--cta-primary-bg, rgba(126, 78, 45, 0.1))]' : 'border-[var(--border-color, #dddddd)]'
        }`}
        style={{
          backgroundColor: isDragging ? 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))' : 'var(--bg-primary, #ffffff)',
          color: 'var(--text-color, #333333)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="application/pdf"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-solid rounded-full animate-spin mb-4"
                 style={{ borderTopColor: 'var(--cta-primary, #7E4E2D)' }}></div>
            <p style={{ color: 'var(--text-color, #333333)' }}>Uploading PDF...</p>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: 'var(--text-secondary, #666666)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-lg font-medium"
               style={{ color: 'var(--text-color, #333333)' }}>
              Drag and drop your PDF here
            </p>
            <p className="text-sm"
               style={{ color: 'var(--text-secondary, #666666)' }}>
              or click to select a file
            </p>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="mt-3 text-sm"
             style={{ color: 'var(--state-error, #dc3545)' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
