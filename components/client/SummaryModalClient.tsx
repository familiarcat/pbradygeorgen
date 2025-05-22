'use client';

/**
 * Summary Modal Client Component
 *
 * A specialized modal for displaying and downloading introduction content.
 * This component extends the base Modal component and adds summary-specific functionality.
 *
 * Following philosophies:
 * - Salinger: Intuitive UX with consistent download behavior
 * - Hesse: Mathematical harmony in layout
 * - Derrida: Deconstruction through format-specific downloads
 * - Dante: Methodical logging of download events
 */

import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/shared/Modal';
import StyledMarkdown from '@/components/StyledMarkdown';
import DocxDownloadHandler from '@/components/DocxDownloadHandler';
import PreviewModalClient from '@/components/client/PreviewModalClient';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { usePdfThemeContext } from '@/components/DynamicThemeProvider';
import UserInfoService, { UserInfo } from '@/utils/UserInfoService';
import styles from '@/styles/SummaryModal.module.css';

export interface SummaryModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** The content to display */
  content: string;
  /** The title of the summary */
  title: string;
  /** Optional position of the modal */
  position?: 'left' | 'right' | 'center';
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional callback for PDF download */
  onPdfDownload?: () => Promise<void>;
  /** Optional callback for PDF preview */
  onPdfPreview?: () => void;
  /** Optional callback for Markdown download */
  onMarkdownDownload?: () => Promise<void>;
  /** Optional callback for Markdown preview */
  onMarkdownPreview?: () => void;
  /** Optional callback for Text download */
  onTextDownload?: () => Promise<void>;
  /** Optional callback for Text preview */
  onTextPreview?: () => void;
  /** Optional callback for DOCX download */
  onDocxDownload?: () => Promise<void>;
  /** Optional callback for DOCX preview */
  onDocxPreview?: () => void;
}

/**
 * Summary Modal Client Component
 *
 * A specialized modal for displaying and downloading introduction content.
 */
const SummaryModalClient: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  content,
  title,
  position = 'center',
  isLoading,
  onPdfDownload,
  onPdfPreview,
  onMarkdownDownload,
  onMarkdownPreview,
  onTextDownload,
  onTextPreview,
  onDocxDownload,
  onDocxPreview,
}) => {
  // Refs for content elements
  const contentRef = useRef<HTMLDivElement>(null);

  // User information state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'User',
    firstName: 'User',
    lastName: '',
    fullName: 'User',
    filePrefix: 'user',
    resumeFileName: 'resume',
    introductionFileName: 'introduction',
    email: '',
    phone: '',
    location: '',
    title: '',
    extractionDate: new Date().toISOString()
  });

  // States for download operations
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMd, setIsGeneratingMd] = useState(false);
  const [isGeneratingTxt, setIsGeneratingTxt] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  // States for preview modals
  const [activePreview, setActivePreview] = useState<'pdf' | 'markdown' | 'text' | 'docx' | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  // Access the PDF theme context to use extracted styles
  const themeContext = usePdfThemeContext();

  // Effect to fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-info');
        const data = await response.json();

        if (data.success && data.userInfo) {
          setUserInfo(data.userInfo);
          console.log('User info loaded:', data.userInfo);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to handle PDF export
  const handleExportToPdf = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingPdf(true);
        HesseLogger.summary.start('Exporting introduction as PDF');
        DanteLogger.success.basic('Starting PDF export for introduction');

        // Import PdfGenerator dynamically
        const PdfGeneratorModule = await import('@/utils/PdfGenerator');
        const PdfGenerator = PdfGeneratorModule.default;

        // Generate PDF
        const pdfDataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, {
          title: `${userInfo.fullName || 'User'} - Introduction`,
          author: 'AlexAI',
          subject: 'Introduction',
          keywords: 'introduction, cover letter'
        });

        // Save PDF data URL for preview
        setPdfDataUrl(pdfDataUrl);

        // Create a link element
        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = `${userInfo.introductionFileName || 'introduction'}.pdf`;
        link.setAttribute('type', 'application/pdf');

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();

        // Small delay before removing the element
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);

        DanteLogger.success.ux('Downloaded introduction.pdf successfully');
        HesseLogger.summary.complete('Introduction.pdf downloaded successfully');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
        HesseLogger.summary.error(`PDF export failed: ${error}`);
        alert('There was an error generating the PDF. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingPdf(false);
      }
    });
  };

  // Function to handle Markdown export
  const handleExportToMarkdown = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingMd(true);
        HesseLogger.summary.start('Exporting introduction as Markdown');
        DanteLogger.success.basic('Starting Markdown export for introduction');

        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userInfo.introductionFileName || 'introduction'}.md`;

        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();

        // Small delay before removing the element and revoking the URL
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        DanteLogger.success.ux('Downloaded introduction.md successfully');
        HesseLogger.summary.complete('Introduction.md downloaded successfully');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to Markdown: ${error}`);
        HesseLogger.summary.error(`Markdown export failed: ${error}`);
        alert('There was an error generating the Markdown file. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingMd(false);
      }
    });
  };

  // Function to handle Text export
  const handleExportToText = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingTxt(true);
        HesseLogger.summary.start('Exporting introduction as Text');
        DanteLogger.success.basic('Starting Text export for introduction');

        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userInfo.introductionFileName || 'introduction'}.txt`;

        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();

        // Small delay before removing the element and revoking the URL
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        DanteLogger.success.ux('Downloaded introduction.txt successfully');
        HesseLogger.summary.complete('Introduction.txt downloaded successfully');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to Text: ${error}`);
        HesseLogger.summary.error(`Text export failed: ${error}`);
        alert('There was an error generating the Text file. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingTxt(false);
      }
    });
  };

  // Function to handle DOCX preview
  const handleDocxPreview = () => {
    setPreviewContent(content);
    setActivePreview('docx');
  };

  // Function to handle Markdown preview
  const handleMarkdownPreview = () => {
    setPreviewContent(content);
    setActivePreview('markdown');
  };

  // Function to handle Text preview
  const handleTextPreview = () => {
    setPreviewContent(content);
    setActivePreview('text');
  };

  // Function to handle PDF preview
  const handlePdfPreview = async () => {
    try {
      // If we don't have a PDF data URL yet, generate one
      if (!pdfDataUrl) {
        // Import PdfGenerator dynamically
        const PdfGeneratorModule = await import('@/utils/PdfGenerator');
        const PdfGenerator = PdfGeneratorModule.default;

        // Generate PDF
        const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, {
          title: `${userInfo.fullName || 'User'} - Introduction`,
          author: 'AlexAI',
          subject: 'Introduction',
          keywords: 'introduction, cover letter'
        });

        // Save PDF data URL
        setPdfDataUrl(dataUrl);
      }

      // Show PDF preview
      setActivePreview('pdf');
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('There was an error generating the PDF preview. Please try again.');
    }
  };

  // Function to close preview
  const handleClosePreview = () => {
    setActivePreview(null);
  };

  // Create the download menu
  const renderDownloadMenu = () => (
    <div className={styles.downloadContainer}>
      <a href="#" className={styles.actionLink} onClick={(e) => e.preventDefault()}>
        Download
        <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
      <div className={styles.downloadMenu}>
        <div className={styles.downloadOptionGroup}>
          <button
            className={styles.previewButton}
            onClick={onPdfPreview || handlePdfPreview}
            disabled={isGeneratingPdf}
          >
            <svg className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Preview
          </button>
          <button
            className={styles.downloadOption}
            onClick={onPdfDownload || handleExportToPdf}
            disabled={isGeneratingPdf}
          >
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            PDF Format
            {isGeneratingPdf && ' (Generating...)'}
          </button>
        </div>
        <div className={styles.downloadOptionGroup}>
          <button
            className={styles.previewButton}
            onClick={onMarkdownPreview || handleMarkdownPreview}
            disabled={isGeneratingMd}
          >
            <svg className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Preview
          </button>
          <button
            className={styles.downloadOption}
            onClick={onMarkdownDownload || handleExportToMarkdown}
            disabled={isGeneratingMd}
          >
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Markdown Format
            {isGeneratingMd && ' (Generating...)'}
          </button>
        </div>
        <div className={styles.downloadOptionGroup}>
          <button
            className={styles.previewButton}
            onClick={onTextPreview || handleTextPreview}
            disabled={isGeneratingTxt}
          >
            <svg className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Preview
          </button>
          <button
            className={styles.downloadOption}
            onClick={onTextDownload || handleExportToText}
            disabled={isGeneratingTxt}
          >
            <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Text Format
            {isGeneratingTxt && ' (Generating...)'}
          </button>
        </div>
        <div className={styles.downloadOptionGroup}>
          {/* Preview button using DocxDownloadHandler */}
          <DocxDownloadHandler
            content={content}
            fileName={userInfo.introductionFileName || "introduction"}
            documentType="introduction"
            className={styles.previewButton}
            iconClassName={styles.previewIcon}
            buttonText="Preview"
            isPreviewButton={true}
            onPreview={onDocxPreview || handleDocxPreview}
          />

          {/* Download button using DocxDownloadHandler */}
          <DocxDownloadHandler
            content={content}
            fileName={userInfo.introductionFileName || "introduction"}
            documentType="introduction"
            className={styles.downloadOption}
            iconClassName={styles.downloadIcon}
            buttonText="Word Format"
            loadingText="Downloading..."
            onDownloadStart={() => setIsGeneratingDocx(true)}
            onDownloadComplete={() => setIsGeneratingDocx(false)}
            onError={(error) => {
              console.error('Error downloading DOCX:', error);
              setIsGeneratingDocx(false);
              alert('Failed to download Word document. Please try again.');
            }}
            options={{
              title: `${userInfo.fullName || 'User'} - Introduction`,
              creator: 'AlexAI',
              description: 'Generated Introduction'
            }}
            usePdfStyles={true}
          />
        </div>
      </div>
    </div>
  );

  // Render the modal
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        headerActions={renderDownloadMenu()}
        position={position}
        id="summary-modal"
        className="summary-modal-content"
        ariaLabel={`${title} Summary`}
        ariaDescribedby="summary-content"
      >
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className={styles.loadingText}>Generating summary...</div>
          </div>
        ) : (
          <div id="summary-content" ref={contentRef}>
            <StyledMarkdown>{content}</StyledMarkdown>
          </div>
        )}
      </Modal>

      {/* Preview modals */}
      <PreviewModalClient
        isOpen={activePreview === 'pdf'}
        onClose={handleClosePreview}
        content={previewContent}
        format="pdf"
        title={title}
        fileName={userInfo.introductionFileName || "introduction"}
        pdfDataUrl={pdfDataUrl || undefined}
        onDownload={handleExportToPdf}
        position="right"
      />

      <PreviewModalClient
        isOpen={activePreview === 'markdown'}
        onClose={handleClosePreview}
        content={previewContent}
        format="markdown"
        title={title}
        fileName={userInfo.introductionFileName || "introduction"}
        onDownload={handleExportToMarkdown}
        position="right"
      />

      <PreviewModalClient
        isOpen={activePreview === 'text'}
        onClose={handleClosePreview}
        content={previewContent}
        format="text"
        title={title}
        fileName={userInfo.introductionFileName || "introduction"}
        onDownload={handleExportToText}
        position="right"
      />

      <PreviewModalClient
        isOpen={activePreview === 'docx'}
        onClose={handleClosePreview}
        content={previewContent}
        format="docx"
        title={title}
        fileName={userInfo.introductionFileName || "introduction"}
        position="right"
      />
    </>
  );
};

export default SummaryModalClient;
