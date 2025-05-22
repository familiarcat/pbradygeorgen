/**
 * DOCX Download Option Component (DEPRECATED)
 *
 * @deprecated This component is deprecated and will be removed in a future release.
 * Please use DocxDownloadHandler instead, which provides more features and better reliability.
 *
 * This is now a wrapper around DocxDownloadHandler that maintains backward compatibility.
 *
 * Following philosophies:
 * - Occam's razor: the simplest solution is often the best
 * - Derrida: deconstructing hardcoded implementations
 * - Hesse: mathematical harmony in implementation patterns
 * - Müller-Brockmann: clean, grid-based structure
 * - Dante: methodical logging
 */

import React from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import DocxDownloadHandler from './DocxDownloadHandler';
import { DocxDownloadOptions } from '@/utils/DocxService';

interface DocxDownloadOptionProps {
  fileName: string;
  content: string;
  className?: string;
  iconClassName?: string;
  buttonText?: string;
  loadingText?: string;
  usePdfStyles?: boolean;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: Error) => void;
}

const DocxDownloadOption: React.FC<DocxDownloadOptionProps> = ({
  fileName,
  content,
  className = '',
  iconClassName = '',
  buttonText = 'Word Format',
  loadingText = 'Downloading...',
  usePdfStyles = true,
  onDownloadStart,
  onDownloadComplete,
  onError
}) => {
  // Log deprecation warning
  console.warn(
    'DocxDownloadOption is deprecated and will be removed in a future release. ' +
    'Please use DocxDownloadHandler instead, which provides more features and better reliability.'
  );

  DanteLogger.warn.deprecated('Using deprecated DocxDownloadOption component. Please migrate to DocxDownloadHandler.');

  // Create options object for DocxDownloadHandler
  const options: DocxDownloadOptions = {};

  // Determine document type based on fileName (fallback logic)
  const documentType = fileName.toLowerCase().includes('introduction') ? 'introduction' : 'resume';

  return (
    <DocxDownloadHandler
      content={content}
      fileName={fileName}
      documentType={documentType}
      className={className}
      iconClassName={iconClassName}
      buttonText={buttonText}
      loadingText={loadingText}
      usePdfStyles={usePdfStyles}
      onDownloadStart={onDownloadStart}
      onDownloadComplete={onDownloadComplete}
      onError={onError}
      options={options}
    />
  );
};

export default DocxDownloadOption;
