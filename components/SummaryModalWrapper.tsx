'use client';

import React, { useState } from 'react';
import SummaryModal from './SummaryModal';
import { CoverLetterProvider, useCoverLetter } from './CoverLetterProvider';

interface SummaryModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'center';
}

// Inner component that uses the CoverLetter context
const SummaryModalInner: React.FC<SummaryModalWrapperProps> = ({ isOpen, onClose, position = 'left' }) => {
  const { content, isLoading, error, refreshContent } = useCoverLetter();
  
  // Log the content for debugging
  if (isOpen) {
    console.log(`SummaryModalInner: content length = ${content?.length || 0}, isLoading = ${isLoading}, error = ${error || 'none'}`);
  }

  return (
    <SummaryModal
      isOpen={isOpen}
      onClose={onClose}
      content={content || ''}
      position={position}
      isLoading={isLoading}
    />
  );
};

// Wrapper component that provides the CoverLetter context
const SummaryModalWrapper: React.FC<SummaryModalWrapperProps> = (props) => {
  return (
    <CoverLetterProvider>
      <SummaryModalInner {...props} />
    </CoverLetterProvider>
  );
};

export default SummaryModalWrapper;
