'use client';

import React, { useState } from 'react';

/**
 * Simplified PDFUploader component for AWS Amplify build
 */
export default function PDFUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      alert('This is a simplified version of the PDFUploader component for AWS Amplify build. File upload is not available in this version.');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="pdf-file">
            Select PDF file
          </label>
          <input
            type="file"
            id="pdf-file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isUploading}
          />
        </div>
        {fileName && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Selected file: {fileName}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          disabled={!fileName || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
}
