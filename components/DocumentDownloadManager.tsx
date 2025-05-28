/**
 * DocumentDownloadManager Component
 *
 * A comprehensive manager for document downloads that handles all formats
 * (PDF, Markdown, Text, DOCX) with consistent behavior and styling.
 *
 * This component follows:
 * - Derrida philosophy by deconstructing hardcoded download implementations
 * - Müller-Brockmann philosophy with clean, grid-based structure
 * - Hesse philosophy by ensuring mathematical harmony in implementation patterns
 * - Dante philosophy with methodical logging
 * - Kantian ethics by maintaining professional business orientation
 */

import React, { useState, useEffect } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import DocxService from '@/utils/DocxService';
import DownloadDropdown, { DownloadOption } from './DownloadDropdown';
import PdfGenerator from '@/utils/PdfGenerator';
import DownloadService from '@/utils/DownloadService';

interface DocumentDownloadManagerProps {
  // Content and file information
  content: string;
  documentType: 'resume' | 'introduction';
  fileName: string;
  title?: string;
  
  // Callbacks for previews
  onPdfPreview?: () => void;
  onMarkdownPreview?: () => void;
  onTextPreview?: () => void;
  onDocxPreview?: () => void;
  
  // Callbacks for downloads
  onPdfDownload?: () => void;
  onMarkdownDownload?: () => void;
  onTextDownload?: () => void;
  onDocxDownload?: () => void;
  
  // UI customization
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  iconClassName?: string;
  
  // Document metadata
  creator?: string;
  description?: string;
  
  // Styling options
  headingFont?: string;
  bodyFont?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

const DocumentDownloadManager: React.FC<DocumentDownloadManagerProps> = ({
  // Content and file information
  content,
  documentType,
  fileName,
  title = documentType === 'resume' ? 'Resume' : 'Introduction',
  
  // Callbacks for previews
  onPdfPreview,
  onMarkdownPreview,
  onTextPreview,
  onDocxPreview,
  
  // Callbacks for downloads
  onPdfDownload,
  onMarkdownDownload,
  onTextDownload,
  onDocxDownload,
  
  // UI customization
  className = '',
  buttonClassName = '',
  menuClassName = '',
  iconClassName = '',
  
  // Document metadata
  creator = 'AlexAI',
  description = `Generated ${documentType === 'resume' ? 'Resume' : 'Introduction'}`,
  
  // Styling options
  headingFont = 'var(--pdf-heading-font, var(--font-heading, sans-serif))',
  bodyFont = 'var(--pdf-body-font, var(--font-body, serif))',
  primaryColor = 'var(--pdf-primary-color, var(--primary-color, #00A99D))',
  secondaryColor = 'var(--pdf-secondary-color, var(--secondary-color, #333333))',
  textColor = 'var(--pdf-text-color, var(--text-color, #333333))'
}) => {
  // Loading states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMd, setIsGeneratingMd] = useState(false);
  const [isGeneratingTxt, setIsGeneratingTxt] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  
  // Default handlers for PDF
  const handlePdfPreview = () => {
    if (onPdfPreview) {
      onPdfPreview();
    } else {
      DanteLogger.error.runtime('No PDF preview handler provided');
      alert('PDF preview functionality not available.');
    }
  };
  
  const handlePdfDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      HesseLogger.summary.start(`Exporting ${fileName} as PDF`);
      
      if (onPdfDownload) {
        await onPdfDownload();
      } else {
        // Default PDF download implementation
        await DownloadService.downloadPdf(content, fileName, {
          title: `${title}`,
          creator,
          description,
          headingFont,
          bodyFont,
          primaryColor,
          secondaryColor,
          textColor
        });
      }
      
      DanteLogger.success.ux(`Downloaded ${fileName}.pdf successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading PDF: ${error}`);
      alert('There was an error generating the PDF file. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  // Default handlers for Markdown
  const handleMarkdownPreview = () => {
    if (onMarkdownPreview) {
      onMarkdownPreview();
    } else {
      DanteLogger.error.runtime('No Markdown preview handler provided');
      alert('Markdown preview functionality not available.');
    }
  };
  
  const handleMarkdownDownload = async () => {
    try {
      setIsGeneratingMd(true);
      HesseLogger.summary.start(`Exporting ${fileName} as Markdown`);
      
      if (onMarkdownDownload) {
        await onMarkdownDownload();
      } else {
        // Default Markdown download implementation
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      DanteLogger.success.ux(`Downloaded ${fileName}.md successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading Markdown: ${error}`);
      alert('There was an error generating the Markdown file. Please try again.');
    } finally {
      setIsGeneratingMd(false);
    }
  };
  
  // Default handlers for Text
  const handleTextPreview = () => {
    if (onTextPreview) {
      onTextPreview();
    } else {
      DanteLogger.error.runtime('No Text preview handler provided');
      alert('Text preview functionality not available.');
    }
  };
  
  const handleTextDownload = async () => {
    try {
      setIsGeneratingTxt(true);
      HesseLogger.summary.start(`Exporting ${fileName} as Text`);
      
      if (onTextDownload) {
        await onTextDownload();
      } else {
        // Default Text download implementation
        // Convert markdown to plain text by removing markdown syntax
        const plainText = content
          .replace(/#{1,6}\s+/g, '') // Remove headers
          .replace(/\*\*/g, '') // Remove bold
          .replace(/\*/g, '') // Remove italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
          .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
          .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
          .replace(/>/g, '') // Remove blockquotes
          .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
        
        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      DanteLogger.success.ux(`Downloaded ${fileName}.txt successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading Text: ${error}`);
      alert('There was an error generating the Text file. Please try again.');
    } finally {
      setIsGeneratingTxt(false);
    }
  };
  
  // Default handlers for DOCX
  const handleDocxPreview = () => {
    if (onDocxPreview) {
      onDocxPreview();
    } else {
      DanteLogger.error.runtime('No DOCX preview handler provided');
      alert('DOCX preview functionality not available.');
    }
  };
  
  const handleDocxDownload = async () => {
    try {
      setIsGeneratingDocx(true);
      HesseLogger.summary.start(`Exporting ${fileName} as DOCX`);
      
      if (onDocxDownload) {
        await onDocxDownload();
      } else {
        // Default DOCX download implementation using DocxService
        await DocxService.downloadDocx(content, fileName, {
          title: `${title}`,
          creator,
          description,
          headingFont,
          bodyFont,
          primaryColor,
          secondaryColor,
          textColor
        });
      }
      
      DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading DOCX: ${error}`);
      alert('There was an error generating the Word document. Please try again.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };
  
  // Define download options
  const downloadOptions: DownloadOption[] = [
    {
      format: 'pdf',
      buttonText: 'PDF Format',
      isLoading: isGeneratingPdf,
      onPreview: handlePdfPreview,
      onDownload: handlePdfDownload
    },
    {
      format: 'markdown',
      buttonText: 'Markdown Format',
      isLoading: isGeneratingMd,
      onPreview: handleMarkdownPreview,
      onDownload: handleMarkdownDownload
    },
    {
      format: 'text',
      buttonText: 'Text Format',
      isLoading: isGeneratingTxt,
      onPreview: handleTextPreview,
      onDownload: handleTextDownload
    },
    {
      format: 'docx',
      buttonText: 'Word Format',
      isLoading: isGeneratingDocx,
      onPreview: handleDocxPreview,
      onDownload: handleDocxDownload
    }
  ];
  
  return (
    <DownloadDropdown
      title={title}
      documentType={documentType}
      fileName={fileName}
      options={downloadOptions}
      className={className}
      buttonClassName={buttonClassName}
      menuClassName={menuClassName}
      iconClassName={iconClassName}
    />
  );
};

export default DocumentDownloadManager;
