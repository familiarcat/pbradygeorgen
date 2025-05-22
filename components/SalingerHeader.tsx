import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/SalingerHeader.module.css';
import PreviewModal from './PreviewModal';
import SummaryModal from './SummaryModal';
import DownloadService from '@/utils/DownloadService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import UserInfoService, { UserInfo } from '@/utils/UserInfoService';
import DocxService from '@/utils/DocxService';
import DocxDownloadHandler from './DocxDownloadHandler';

interface SalingerHeaderProps {
  onDownload?: () => void;
  onViewSummary?: () => void;
  onContact?: () => void;
  onUpload?: () => void;
  onRefresh?: () => void;
  fileName?: string;
  title?: string; // Added title property for pages like enhanced-extraction
}

const SalingerHeader: React.FC<SalingerHeaderProps> = ({
  onDownload,
  onViewSummary,
  onContact,
  onUpload,
  onRefresh,
  fileName = 'resume',
  title
}) => {
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

  // Load user information on component mount
  useEffect(() => {
    // This is a client-side component, so we need to load the user info differently
    // than in server components where we can directly use UserInfoService.loadUserInfo()
    fetch('/api/user-info')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUserInfo(data.userInfo);
          console.log('User information loaded in SalingerHeader');
        } else {
          console.warn('Failed to load user information, using defaults');
        }
      })
      .catch(error => {
        console.error('Error loading user information', error);
      });
  }, []);

  // Loading states for different download formats
  const [isLoadingMd, setIsLoadingMd] = useState(false);
  const [isLoadingTxt, setIsLoadingTxt] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // Resume preview states
  const [showMdPreview, setShowMdPreview] = useState(false);
  const [showTxtPreview, setShowTxtPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDocxPreview, setShowDocxPreview] = useState(false);

  // Introduction states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showIntroductionPdfPreview, setShowIntroductionPdfPreview] = useState(false);
  const [showIntroductionMdPreview, setShowIntroductionMdPreview] = useState(false);
  const [showIntroductionTxtPreview, setShowIntroductionTxtPreview] = useState(false);

  // Content states
  const [previewContent, setPreviewContent] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [introductionPdfDataUrl, setIntroductionPdfDataUrl] = useState<string | null>(null);
  const [introductionTextContent, setIntroductionTextContent] = useState('');

  // Loading states
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isGeneratingIntroductionPdf, setIsGeneratingIntroductionPdf] = useState(false);
  const [isGeneratingIntroductionMd, setIsGeneratingIntroductionMd] = useState(false);
  const [isGeneratingIntroductionTxt, setIsGeneratingIntroductionTxt] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  const contactButtonRef = useRef<HTMLAnchorElement>(null);

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.preventDefault();

    switch (action) {
      case 'download':
        if (onDownload) onDownload();
        break;
      case 'summary':
        // Show the summary modal
        setIsLoadingSummary(true);

        // First try to load the pre-generated introduction content
        fetch('/extracted/introduction.md')
          .then(response => {
            if (!response.ok) {
              console.warn('Pre-generated introduction not found, falling back to API');
              throw new Error('Pre-generated introduction not found');
            }
            return response.text();
          })
          .then(content => {
            console.log('Pre-generated introduction loaded successfully');
            setSummaryContent(content);
            setShowSummaryModal(true);
          })
          .catch(error => {
            console.warn('Error loading pre-generated introduction:', error);

            // Fallback to the API
            console.log('Falling back to get-summary API...');

            // Fetch the summary content with proper error handling and force refresh
            fetch('/api/get-summary?forceRefresh=true')
              .then(response => {
                if (!response.ok) {
                  console.error(`API responded with status: ${response.status}`);
                  throw new Error(`API responded with status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if (data.success) {
                  console.log('Summary loaded successfully from API');
                  setSummaryContent(data.summary);
                  setShowSummaryModal(true);
                } else {
                  console.error('API returned error:', data.error);
                  throw new Error(data.error || 'Failed to load summary');
                }
              })
              .catch(error => {
                console.error('Error loading summary from API:', error);

                // Try the analyze-content API as a second fallback
                console.log('Attempting to use analyze-content API as second fallback...');

                fetch('/api/analyze-content', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    filePath: '/extracted/resume_content.md'
                  }),
                })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(`Fallback API responded with status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then(data => {
                    if (data.success && data.analysis) {
                      console.log('Successfully loaded summary from fallback API');

                      // Convert the analysis to markdown format
                      const analysis = data.analysis;
                      const markdown = `# ${userInfo.fullName} - Summary

## Professional Summary

${analysis.summary}

## Key Skills

${analysis.keySkills.map((skill: string) => `- ${skill}`).join('\n')}

## Experience

${analysis.yearsOfExperience}

## Education

${analysis.educationLevel}

## Career Highlights

${analysis.careerHighlights.map((highlight: string) => `- ${highlight}`).join('\n')}

## Industry Experience

${analysis.industryExperience.map((industry: string) => `- ${industry}`).join('\n')}

## Recommendations

${analysis.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
`;

                      setSummaryContent(markdown);
                      setShowSummaryModal(true);
                    } else {
                      throw new Error(data.error || 'Failed to load summary from fallback API');
                    }
                  })
                  .catch(fallbackError => {
                    console.error('Error with fallback API:', fallbackError);

                    // Final fallback to the original behavior
                    if (onViewSummary) {
                      onViewSummary();
                    } else {
                      // Scroll to summary section if no handler provided
                      const summaryElement = document.querySelector('#summary-section');
                      if (summaryElement) {
                        summaryElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  });
              });
          })
          .finally(() => {
            setIsLoadingSummary(false);
          });
        break;
      case 'contact':
        if (onContact) {
          // Call the contact handler
          onContact();

          // Remove focus from the button after a short delay
          // This allows the email client to open before removing focus
          setTimeout(() => {
            if (contactButtonRef.current) {
              contactButtonRef.current.blur();
            }
          }, 100);
        } else {
          // Scroll to contact section if no handler provided
          const contactElement = document.querySelector('#contact-section');
          if (contactElement) {
            contactElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      case 'upload':
        if (onUpload) onUpload();
        break;
      case 'refresh':
        if (onRefresh) onRefresh();
        break;
      default:
        break;
    }
  };

  // Function to handle markdown download
  const handleMarkdownDownload = () => {
    // Create and download the file
    const blob = new Blob([previewContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle text download
  const handleTextDownload = () => {
    // Create and download the file
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle PDF download
  const handlePdfDownload = () => {
    // Create a link to the PDF file and trigger download
    const a = document.createElement('a');
    // Use the public/resume.pdf file which is always available
    a.href = `/resume.pdf?v=${Date.now()}`;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    DanteLogger.success.ux(`Downloaded ${fileName}.pdf`);
  };

  // Introduction download handlers

  // Function to handle Introduction PDF preview
  const handleIntroductionPdfPreview = async () => {
    try {
      setIsGeneratingIntroductionPdf(true);
      HesseLogger.summary.start('Generating Introduction PDF preview');

      // If we already have the summary content, use it
      if (summaryContent) {
        // Define consistent options for both preview and download
        // Use PDF-extracted styles for the Introduction
        const pdfOptions = {
          title: `${userInfo.fullName} - Introduction`,
          fileName: `${userInfo.introductionFileName}.pdf`,
          headerText: `${userInfo.fullName} - Introduction`,
          footerText: 'Generated with Salinger Design',
          pageSize: 'letter' as 'letter', // Explicitly type as literal 'letter'
          margins: { top: 8, right: 8, bottom: 8, left: 8 },
          // Don't force dark theme, use PDF-extracted styles instead
          isDarkTheme: false,
          // Explicitly mark this as an Introduction PDF to ensure proper styling
          isIntroduction: true
        };

        // Generate PDF data URL
        const dataUrl = await DownloadService.generatePdfDataUrl(summaryContent, pdfOptions);

        // Store the data URL and options for later use in download
        setIntroductionPdfDataUrl(dataUrl);

        // Show the preview modal
        setShowIntroductionPdfPreview(true);
        DanteLogger.success.ux('Opened Introduction PDF preview');
      } else {
        // If we don't have the content yet, show the summary modal first
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error generating Introduction PDF preview:', error);
      DanteLogger.error.runtime(`Error showing Introduction PDF preview: ${error}`);
      alert('There was an error generating the PDF preview. Please try again.');
    } finally {
      setIsGeneratingIntroductionPdf(false);
    }
  };

  // Function to handle Introduction PDF download
  const handleIntroductionPdfDownload = async () => {
    try {
      setIsGeneratingIntroductionPdf(true);

      // If we already have a data URL, use it
      if (introductionPdfDataUrl) {
        await DownloadService.downloadPdf('', userInfo.introductionFileName, {
          dataUrl: introductionPdfDataUrl
        });
      }
      // If we have content but no data URL
      else if (summaryContent) {
        // Define consistent options for both preview and download - same as in preview function
        // Use PDF-extracted styles for the Introduction
        const pdfOptions = {
          title: `${userInfo.fullName} - Introduction`,
          fileName: `${userInfo.introductionFileName}.pdf`,
          headerText: `${userInfo.fullName} - Introduction`,
          footerText: 'Generated with Salinger Design',
          pageSize: 'letter' as 'letter', // Explicitly type as literal 'letter'
          margins: { top: 8, right: 8, bottom: 8, left: 8 },
          // Don't force dark theme, use PDF-extracted styles instead
          isDarkTheme: false,
          // Explicitly mark this as an Introduction PDF to ensure proper styling
          isIntroduction: true
        };

        // First generate the data URL to ensure consistency with preview
        const dataUrl = await DownloadService.generatePdfDataUrl(summaryContent, pdfOptions);

        // Then download using the data URL
        await DownloadService.downloadPdf('', userInfo.introductionFileName, {
          dataUrl: dataUrl
        });
      }
      // If we don't have content yet
      else {
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
        return;
      }

      DanteLogger.success.ux('Downloaded Introduction PDF');
    } catch (error) {
      console.error('Error downloading Introduction PDF:', error);
      DanteLogger.error.runtime(`Error downloading Introduction PDF: ${error}`);
      alert('There was an error downloading the PDF. Please try again.');
    } finally {
      setIsGeneratingIntroductionPdf(false);
    }
  };

  // Function to handle Introduction Markdown preview
  const handleIntroductionMarkdownPreview = () => {
    try {
      setIsGeneratingIntroductionMd(true);

      // If we have content, show the preview
      if (summaryContent) {
        setIntroductionTextContent(summaryContent);
        setShowIntroductionMdPreview(true);
        DanteLogger.success.ux('Opened Introduction Markdown preview');
      } else {
        // If we don't have content yet, show the summary modal first
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error showing Introduction Markdown preview:', error);
      DanteLogger.error.runtime(`Error showing Introduction Markdown preview: ${error}`);
      alert('There was an error generating the preview. Please try again.');
    } finally {
      setIsGeneratingIntroductionMd(false);
    }
  };

  // Function to handle Introduction Markdown download
  const handleIntroductionMarkdownDownload = async () => {
    try {
      setIsGeneratingIntroductionMd(true);

      // If we have content, download it
      if (summaryContent) {
        await DownloadService.downloadMarkdown(summaryContent, userInfo.introductionFileName);
        DanteLogger.success.ux('Downloaded Introduction Markdown');
      } else {
        // If we don't have content yet, show the summary modal first
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error downloading Introduction Markdown:', error);
      DanteLogger.error.runtime(`Error downloading Introduction Markdown: ${error}`);
      alert('There was an error downloading the file. Please try again.');
    } finally {
      setIsGeneratingIntroductionMd(false);
    }
  };

  // Function to handle Introduction Text preview
  const handleIntroductionTextPreview = () => {
    try {
      setIsGeneratingIntroductionTxt(true);

      // If we have content, convert to plain text and show the preview
      if (summaryContent) {
        const plainText = DownloadService.convertMarkdownToText(summaryContent);
        setIntroductionTextContent(plainText);
        setShowIntroductionTxtPreview(true);
        DanteLogger.success.ux('Opened Introduction Text preview');
      } else {
        // If we don't have content yet, show the summary modal first
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error showing Introduction Text preview:', error);
      DanteLogger.error.runtime(`Error showing Introduction Text preview: ${error}`);
      alert('There was an error generating the preview. Please try again.');
    } finally {
      setIsGeneratingIntroductionTxt(false);
    }
  };

  // Function to handle Introduction Text download
  const handleIntroductionTextDownload = async () => {
    try {
      setIsGeneratingIntroductionTxt(true);

      // If we have content, convert to plain text and download
      if (summaryContent) {
        const plainText = DownloadService.convertMarkdownToText(summaryContent);
        await DownloadService.downloadText(plainText, userInfo.introductionFileName);
        DanteLogger.success.ux('Downloaded Introduction Text');
      } else {
        // If we don't have content yet, show the summary modal first
        alert('Please open the Introduction first to generate content.');
        setShowSummaryModal(true);
      }
    } catch (error) {
      console.error('Error downloading Introduction Text:', error);
      DanteLogger.error.runtime(`Error downloading Introduction Text: ${error}`);
      alert('There was an error downloading the file. Please try again.');
    } finally {
      setIsGeneratingIntroductionTxt(false);
    }
  };

  return (
    <>
      <header className={styles.salingerHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.siteTitle}>{userInfo.fullName}</h1>
          <div className={styles.actionGroup}>
            <a
              href="#"
              className={`${styles.actionLink} pdf-cta`}
              onClick={(e) => handleAction('summary', e)}
              aria-label="View Introduction"
            >
              {isLoadingSummary ? (
                <>
                  <svg className={`${styles.loadingSpinner} ${styles.actionIcon}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Introduction
                </>
              )}
            </a>
          </div>
        </div>

        <nav className={styles.headerActions}>
          {/* Only show Design System link when not on home page (when title is provided) */}
          {title && (
            <a
              href="/muller-test"
              className={`${styles.actionLink} pdf-cta`}
              aria-label="Müller-Brockmann Design System"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              Design System
            </a>
          )}
        <div className={styles.downloadContainer}>
          <a
            href="#"
            className={`${styles.actionLink} pdf-cta`}
            onClick={(e) => e.preventDefault()} // Prevent default to allow dropdown to work
            aria-label="Download Resume"
            aria-haspopup="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume
          </a>

          {/* Dropdown menu with Salinger-inspired styling */}
          <div className={styles.downloadMenu}>
            <div className={styles.downloadOptionGroup}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPdfPreview(true);
                }}
                className={styles.previewButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoadingPdf(true);

                  try {
                    handlePdfDownload();
                  } catch (error) {
                    console.error('Error downloading PDF:', error);
                    alert('Failed to download PDF. Please try again.');
                  } finally {
                    setIsLoadingPdf(false);
                  }
                }}
                className={styles.downloadOption}
              >
                {isLoadingPdf ? (
                  <span className={styles.loadingText}>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    PDF Format
                  </>
                )}
              </a>
            </div>
            <div className={styles.downloadOptionGroup}>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoadingPreview(true);
                  setShowMdPreview(false); // Reset preview state

                  try {
                    // First try to load the pre-generated resume content
                    try {
                      const response = await fetch('/extracted/resume.md');
                      if (response.ok) {
                        const content = await response.text();
                        console.log('Pre-generated resume loaded successfully for preview');

                        // Set the preview content and show the preview modal
                        setPreviewContent(content);
                        setShowMdPreview(true);
                        return;
                      } else {
                        console.warn('Pre-generated resume not found, falling back to API for preview');
                      }
                    } catch (error) {
                      console.warn('Error loading pre-generated resume for preview:', error);
                    }

                    // Fallback to the API
                    console.log('Falling back to format-content API for preview...');

                    // Call our server-side API to format the content
                    const apiResponse = await fetch('/api/format-content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filePath: '/extracted/resume_content.md',
                        format: 'markdown'
                      }),
                    });

                    if (!apiResponse.ok) {
                      throw new Error(`API responded with status: ${apiResponse.status}`);
                    }

                    const result = await apiResponse.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Set the preview content and show the preview modal
                    setPreviewContent(result.formattedContent);
                    setShowMdPreview(true);
                  } catch (error) {
                    console.error('Error generating markdown preview:', error);
                    alert('Failed to generate markdown preview. Please try again.');
                  } finally {
                    setIsLoadingPreview(false);
                  }
                }}
                className={styles.previewButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </a>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoadingMd(true);

                  try {
                    // First try to load the pre-generated resume content
                    try {
                      const response = await fetch('/extracted/resume.md');
                      if (response.ok) {
                        const content = await response.text();
                        console.log('Pre-generated resume loaded successfully');

                        // Download the content
                        await DownloadService.downloadMarkdown(content, userInfo.resumeFileName);
                        return;
                      } else {
                        console.warn('Pre-generated resume not found, falling back to API');
                      }
                    } catch (error) {
                      console.warn('Error loading pre-generated resume:', error);
                    }

                    // Fallback to the API
                    console.log('Falling back to format-content API...');

                    // Call our server-side API to format the content
                    const apiResponse = await fetch('/api/format-content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filePath: '/extracted/resume_content.md',
                        format: 'markdown'
                      }),
                    });

                    if (!apiResponse.ok) {
                      throw new Error(`API responded with status: ${apiResponse.status}`);
                    }

                    const result = await apiResponse.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Log the detected content type
                    console.log(`Content type detected: ${result.contentType}`);

                    // Create and download the file
                    const blob = new Blob([result.formattedContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${userInfo.resumeFileName}.md`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Error generating markdown:', error);
                    alert('Failed to generate markdown. Please try again.');
                  } finally {
                    setIsLoadingMd(false);
                  }
                }}
                className={styles.downloadOption}
              >
                {isLoadingMd ? (
                  <span className={styles.loadingText}>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Markdown Format
                  </>
                )}
              </a>
            </div>
            <div className={styles.downloadOptionGroup}>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoadingPreview(true);
                  setShowTxtPreview(false); // Reset preview state

                  try {
                    // First try to load the pre-generated resume content
                    try {
                      const response = await fetch('/extracted/resume.md');
                      if (response.ok) {
                        const content = await response.text();
                        console.log('Pre-generated resume loaded successfully for text preview');

                        // Convert to plain text
                        const plainText = DownloadService.convertMarkdownToText(content);

                        // Set the preview content and show the preview modal
                        setPreviewContent(plainText);
                        setShowTxtPreview(true);
                        return;
                      } else {
                        console.warn('Pre-generated resume not found, falling back to API for text preview');
                      }
                    } catch (error) {
                      console.warn('Error loading pre-generated resume for text preview:', error);
                    }

                    // Fallback to the API
                    console.log('Falling back to format-content API for text preview...');

                    // Call our server-side API to format the content
                    const apiResponse = await fetch('/api/format-content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filePath: '/extracted/resume_content.md',
                        format: 'text'
                      }),
                    });

                    if (!apiResponse.ok) {
                      throw new Error(`API responded with status: ${apiResponse.status}`);
                    }

                    const result = await apiResponse.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Set the preview content and show the preview modal
                    setPreviewContent(result.formattedContent);
                    setShowTxtPreview(true);
                  } catch (error) {
                    console.error('Error generating text preview:', error);
                    alert('Failed to generate text preview. Please try again.');
                  } finally {
                    setIsLoadingPreview(false);
                  }
                }}
                className={styles.previewButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </a>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoadingTxt(true);

                  try {
                    // First try to load the pre-generated resume content
                    try {
                      const response = await fetch('/extracted/resume.md');
                      if (response.ok) {
                        const content = await response.text();
                        console.log('Pre-generated resume loaded successfully');

                        // Convert to plain text
                        const plainText = DownloadService.convertMarkdownToText(content);

                        // Download the content
                        await DownloadService.downloadText(plainText, userInfo.resumeFileName);
                        return;
                      } else {
                        console.warn('Pre-generated resume not found, falling back to API');
                      }
                    } catch (error) {
                      console.warn('Error loading pre-generated resume:', error);
                    }

                    // Fallback to the API
                    console.log('Falling back to format-content API...');

                    // Call our server-side API to format the content
                    const apiResponse = await fetch('/api/format-content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filePath: '/extracted/resume_content.md',
                        format: 'text'
                      }),
                    });

                    if (!apiResponse.ok) {
                      throw new Error(`API responded with status: ${apiResponse.status}`);
                    }

                    const result = await apiResponse.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Log the detected content type
                    console.log(`Content type detected: ${result.contentType}`);

                    // Create and download the file
                    const blob = new Blob([result.formattedContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${userInfo.resumeFileName}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Error generating text format:', error);
                    alert('Failed to generate text format. Please try again.');
                  } finally {
                    setIsLoadingTxt(false);
                  }
                }}
                className={styles.downloadOption}
              >
                {isLoadingTxt ? (
                  <span className={styles.loadingText}>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Text Format
                  </>
                )}
              </a>
            </div>

            {/* Add DOCX download option */}
            <div className={styles.downloadOptionGroup}>
              <DocxDownloadHandler
                content={previewContent || ''}
                fileName={userInfo.resumeFileName}
                documentType="resume"
                className={styles.previewButton}
                iconClassName={styles.previewIcon}
                buttonText="Preview"
                isPreviewButton={true}
                onPreview={async () => {
                  setIsLoadingPreview(true);
                  setShowDocxPreview(false); // Reset preview state

                  try {
                    // First try to load the pre-generated resume content
                    try {
                      const response = await fetch('/extracted/resume.md');
                      if (response.ok) {
                        const content = await response.text();
                        console.log('Pre-generated resume loaded successfully for DOCX preview');

                        // Set the preview content and show the preview modal
                        setPreviewContent(content);
                        setShowDocxPreview(true);
                        return;
                      } else {
                        console.warn('Pre-generated resume not found, falling back to API for DOCX preview');
                      }
                    } catch (error) {
                      console.warn('Error loading pre-generated resume for DOCX preview:', error);
                    }

                    // Fallback to the API
                    console.log('Falling back to format-content API for DOCX preview...');

                    // Call our server-side API to format the content
                    const apiResponse = await fetch('/api/format-content', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filePath: '/extracted/resume_content.md',
                        format: 'markdown'
                      }),
                    });

                    if (!apiResponse.ok) {
                      throw new Error(`API responded with status: ${apiResponse.status}`);
                    }

                    const result = await apiResponse.json();

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Set the preview content and show the preview modal
                    setPreviewContent(result.formattedContent);
                    setShowDocxPreview(true);
                  } catch (error) {
                    console.error('Error generating DOCX preview:', error);
                    alert('Failed to generate DOCX preview. Please try again.');
                  } finally {
                    setIsLoadingPreview(false);
                  }
                }}
              />
              <DocxDownloadHandler
                content={previewContent || ''}
                fileName={userInfo.resumeFileName}
                documentType="resume"
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
                  title: `${userInfo.fullName} - Resume`,
                  creator: 'AlexAI',
                  description: 'Generated Resume'
                }}
                usePdfStyles={true}
              />
            </div>
          </div>
        </div>
        <span className={styles.actionSeparator}>•</span>
        <a
          ref={contactButtonRef}
          href="#"
          className={`${styles.actionLink} pdf-cta`}
          onClick={(e) => handleAction('contact', e)}
          aria-label="Contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Contact
        </a>
        {/* Upload PDF feature temporarily disabled
        <span className={styles.actionSeparator}>•</span>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('upload', e)}
          aria-label="Upload PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload PDF
        </a>
        */}

      </nav>
    </header>

    {/* Markdown Preview Modal */}
    <PreviewModal
      isOpen={showMdPreview}
      onClose={() => setShowMdPreview(false)}
      content={previewContent}
      format="markdown"
      fileName={fileName}
      onDownload={handleMarkdownDownload}
      position="right"
    />

    {/* Text Preview Modal */}
    <PreviewModal
      isOpen={showTxtPreview}
      onClose={() => setShowTxtPreview(false)}
      content={previewContent}
      format="text"
      fileName={fileName}
      onDownload={handleTextDownload}
      position="right"
    />

    {/* PDF Preview Modal */}
    <PreviewModal
      isOpen={showPdfPreview}
      onClose={() => setShowPdfPreview(false)}
      content=""
      format="pdf"
      fileName={fileName}
      onDownload={handlePdfDownload}
      position="right"
      pdfSource={`/resume.pdf`} // Use the public/resume.pdf file which is always available
    />

    {/* DOCX Preview Modal */}
    <PreviewModal
      isOpen={showDocxPreview}
      onClose={() => setShowDocxPreview(false)}
      content={previewContent}
      format="docx"
      fileName={userInfo.resumeFileName}
      onDownload={async () => {
        try {
          setIsGeneratingDocx(true);

          // Use the enhanced DocxService for consistent download experience
          // Get CSS variables from the document
          const computedStyle = getComputedStyle(document.documentElement);

          // Get font variables
          const headingFont = computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
                             computedStyle.getPropertyValue('--font-heading').trim() ||
                             'sans-serif';

          const bodyFont = computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
                          computedStyle.getPropertyValue('--font-body').trim() ||
                          'serif';

          // Get color variables
          const primaryColor = computedStyle.getPropertyValue('--dynamic-primary').trim() ||
                              computedStyle.getPropertyValue('--primary-color').trim() ||
                              '#00A99D';

          const secondaryColor = computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
                                computedStyle.getPropertyValue('--secondary-color').trim() ||
                                '#333333';

          const textColor = computedStyle.getPropertyValue('--dynamic-text').trim() ||
                           computedStyle.getPropertyValue('--text-color').trim() ||
                           '#333333';

          // Log the extracted styles
          console.log(`[SalingerHeader] Using PDF-extracted styles for DOCX preview:`, {
            headingFont,
            bodyFont,
            primaryColor,
            secondaryColor,
            textColor
          });

          await DocxService.downloadDocx(previewContent, userInfo.resumeFileName, {
            title: `${userInfo.fullName} - Resume`,
            creator: 'AlexAI',
            description: 'Generated Resume',
            headingFont,
            bodyFont,
            primaryColor,
            secondaryColor,
            textColor
          });

          return Promise.resolve();
        } catch (error) {
          console.error('Error downloading DOCX:', error);
          alert('Failed to download Word document. Please try again.');
          return Promise.reject(error);
        } finally {
          setIsGeneratingDocx(false);
        }
      }}
      position="right"
    />

    {/* Summary Modal - Using the new dark-themed SummaryModal */}
    <SummaryModal
      isOpen={showSummaryModal}
      onClose={() => setShowSummaryModal(false)}
      content={summaryContent}
      isLoading={isLoadingSummary}
      position="left"

      // Pass the Introduction download handlers
      onPdfPreview={handleIntroductionPdfPreview}
      onPdfDownload={handleIntroductionPdfDownload}
      onMarkdownPreview={handleIntroductionMarkdownPreview}
      onMarkdownDownload={handleIntroductionMarkdownDownload}
      onTextPreview={handleIntroductionTextPreview}
      onTextDownload={handleIntroductionTextDownload}
    />

    {/* Introduction Preview Modals */}
    {/* PDF Preview Modal */}
    <PreviewModal
      isOpen={showIntroductionPdfPreview}
      onClose={() => setShowIntroductionPdfPreview(false)}
      content=""
      format="pdf"
      fileName={userInfo.introductionFileName}
      onDownload={handleIntroductionPdfDownload}
      onDownloadWithDataUrl={(dataUrl) => DownloadService.downloadPdf('', userInfo.introductionFileName, { dataUrl })}
      position="right"
      pdfDataUrl={introductionPdfDataUrl || undefined}
    />

    {/* Markdown Preview Modal */}
    <PreviewModal
      isOpen={showIntroductionMdPreview}
      onClose={() => setShowIntroductionMdPreview(false)}
      content={introductionTextContent}
      format="markdown"
      fileName={userInfo.introductionFileName}
      onDownload={handleIntroductionMarkdownDownload}
      position="right"
    />

    {/* Text Preview Modal */}
    <PreviewModal
      isOpen={showIntroductionTxtPreview}
      onClose={() => setShowIntroductionTxtPreview(false)}
      content={introductionTextContent}
      format="text"
      fileName={userInfo.introductionFileName}
      onDownload={handleIntroductionTextDownload}
      position="right"
    />
    </>
  );
};

export default SalingerHeader;
