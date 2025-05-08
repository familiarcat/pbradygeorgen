import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/SalingerHeader.module.css';
import PreviewModal from './PreviewModal';
import SummaryModalWrapper from './SummaryModalWrapper';
import DownloadService from '@/utils/DownloadService';
import { useServerTheme } from './ServerThemeProvider';
import { formatContentAsMarkdown, formatContentAsText } from '@/app/actions/formatContentActions';

interface SalingerHeaderProps {
  onDownload?: () => void;
  onViewSummary?: () => void;
  onContact?: () => void;
  onUpload?: () => void;
  fileName?: string;
}

const SalingerHeader: React.FC<SalingerHeaderProps> = ({
  onDownload,
  onViewSummary,
  onContact,
  onUpload,
  fileName = 'resume'
}) => {
  // Loading states for different download formats
  const [isLoadingMd, setIsLoadingMd] = useState(false);
  const [isLoadingTxt, setIsLoadingTxt] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // Resume preview states
  const [showMdPreview, setShowMdPreview] = useState(false);
  const [showTxtPreview, setShowTxtPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Cover Letter states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showCoverLetterPdfPreview, setShowCoverLetterPdfPreview] = useState(false);
  const [showCoverLetterMdPreview, setShowCoverLetterMdPreview] = useState(false);
  const [showCoverLetterTxtPreview, setShowCoverLetterTxtPreview] = useState(false);

  // Content states
  const [previewContent, setPreviewContent] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [coverLetterPdfDataUrl, setCoverLetterPdfDataUrl] = useState<string | null>(null);
  const [coverLetterTextContent, setCoverLetterTextContent] = useState('');

  // Loading states
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isGeneratingCoverLetterPdf, setIsGeneratingCoverLetterPdf] = useState(false);
  const [isGeneratingCoverLetterMd, setIsGeneratingCoverLetterMd] = useState(false);
  const [isGeneratingCoverLetterTxt, setIsGeneratingCoverLetterTxt] = useState(false);

  // This useEffect ensures that the loading states are properly tracked
  // even though they're not directly used in the JSX
  useEffect(() => {
    // Log loading states for debugging purposes
    if (isLoadingPreview || isGeneratingCoverLetterPdf ||
        isGeneratingCoverLetterMd || isGeneratingCoverLetterTxt) {
      console.debug('Loading states:', {
        isLoadingPreview,
        isGeneratingCoverLetterPdf,
        isGeneratingCoverLetterMd,
        isGeneratingCoverLetterTxt
      });
    }
  }, [isLoadingPreview, isGeneratingCoverLetterPdf,
      isGeneratingCoverLetterMd, isGeneratingCoverLetterTxt]);

  const contactButtonRef = useRef<HTMLAnchorElement>(null);

  // Use server theme for dynamic theming
  const serverTheme = useServerTheme();

  // Theme is now automatically refreshed during API calls

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.preventDefault();

    switch (action) {
      case 'download':
        if (onDownload) onDownload();
        break;
      case 'summary':
        // Show the summary modal
        setIsLoadingSummary(true);

        // Fetch the summary content with proper error handling and cache busting
        const timestamp = new Date().getTime(); // Add timestamp to bust cache
        console.log(`🔄 Fetching summary content with timestamp: ${timestamp}`);

        fetch(`/api/get-summary?t=${timestamp}`)
          .then(response => {
            console.log(`📡 API response status: ${response.status}`);
            if (!response.ok) {
              console.error(`❌ API responded with status: ${response.status}`);
              throw new Error(`API responded with status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log(`📊 API response data:`, data);
            if (data.success) {
              // Check if summary exists and has a length property
              if (data.summary && typeof data.summary === 'string') {
                console.log(`✅ Summary loaded successfully (${data.summary.length} characters)`);
                console.log(`📝 Summary preview: "${data.summary.substring(0, 100)}..."`);
                setSummaryContent(data.summary);
              } else {
                // Use a default summary if none is provided
                console.log('⚠️ No summary found in API response, using default');
                const defaultSummary = `# Professional Resume - Summary\n\nThis is a placeholder summary. The API did not return any content.`;
                setSummaryContent(defaultSummary);
              }
              setShowSummaryModal(true);
            } else {
              console.error('❌ API returned error:', data.error);
              throw new Error(data.error || 'Failed to load summary');
            }
          })
          .catch(error => {
            console.error('❌ Error loading summary:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error stack:', error.stack);

            // Try the analyze-content API as a fallback
            console.log('🔄 Attempting to use analyze-content API as fallback...');

            // Add timestamp to bust cache
            const fallbackTimestamp = new Date().getTime();
            fetch(`/api/analyze-content?t=${fallbackTimestamp}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filePath: '/extracted/resume_content.md',
                forceRefresh: true // Force refresh to ensure fresh content
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
                  const markdown = `# ${serverTheme.name || 'Professional'} - Summary

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
      // Refresh case removed as it's now handled automatically
      default:
        break;
    }
  };

  // Function to handle markdown download using the unified approach
  const handleMarkdownDownload = async () => {
    try {
      // Use the unified downloadContent method
      await DownloadService.downloadContent('resume', 'markdown', fileName);
      console.log(`Downloaded ${fileName}.md using unified approach`);
    } catch (error) {
      console.error('Error downloading markdown:', error);
      alert('There was an error downloading the markdown file. Please try again.');
    }
  };

  // Function to handle text download using the unified approach
  const handleTextDownload = async () => {
    try {
      // Use the unified downloadContent method
      await DownloadService.downloadContent('resume', 'text', fileName);
      console.log(`Downloaded ${fileName}.txt using unified approach`);
    } catch (error) {
      console.error('Error downloading text:', error);
      alert('There was an error downloading the text file. Please try again.');
    }
  };

  // Function to handle PDF download using the unified approach
  const handlePdfDownload = async () => {
    try {
      // Use the unified downloadContent method
      await DownloadService.downloadContent('resume', 'pdf', fileName);
      console.log(`Downloaded ${fileName}.pdf using unified approach`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('There was an error downloading the PDF file. Please try again.');
    }
  };

  // Cover Letter download handlers

  // Function to handle Cover Letter PDF preview using the unified approach
  const handleCoverLetterPdfPreview = async () => {
    try {
      setIsGeneratingCoverLetterPdf(true);
      console.log('Generating Cover Letter PDF preview');

      // Import the server action dynamically to avoid server/client mismatch
      const { getFormattedContent } = await import('@/app/actions/contentActions');

      // Get the content from the ContentStateService via server action
      const result = await getFormattedContent('cover_letter', 'markdown');

      if (!result.success) {
        const errorMsg = result.error || 'Failed to get cover letter content';
        console.error(errorMsg);

        // If we don't have content yet, show the summary modal first
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
        return;
      }

      // Get the theme name once before using it in multiple places
      const themeName = serverTheme?.name || 'Professional';

      // Define consistent options for both preview and download
      const pdfOptions = {
        title: `${themeName} - Cover Letter`,
        fileName: 'cover_letter.pdf',
        headerText: `${themeName} - Cover Letter`,
        footerText: 'Generated with Salinger Design',
        pageSize: 'letter' as const,
        margins: { top: 8, right: 8, bottom: 8, left: 8 }
      };

      // Generate PDF data URL
      const dataUrl = await DownloadService.generatePdfDataUrl(result.data || '', pdfOptions);

      // Store the data URL and options for later use in download
      setCoverLetterPdfDataUrl(dataUrl);

      // Show the preview modal
      setShowCoverLetterPdfPreview(true);
      console.log('Opened Cover Letter PDF preview using unified approach');
    } catch (error) {
      console.error('Error generating Cover Letter PDF preview:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error generating the PDF preview. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterPdf(false);
    }
  };

  // Function to handle Cover Letter PDF download using the unified approach
  const handleCoverLetterPdfDownload = async () => {
    try {
      setIsGeneratingCoverLetterPdf(true);

      // If we already have a data URL from the preview, use it
      if (coverLetterPdfDataUrl) {
        await DownloadService.downloadPdf('', 'cover_letter', {
          dataUrl: coverLetterPdfDataUrl
        });
        console.log('Downloaded Cover Letter PDF using cached data URL');
      } else {
        // Use the unified downloadContent method
        await DownloadService.downloadContent('cover_letter', 'pdf', 'cover_letter');
        console.log('Downloaded Cover Letter PDF using unified approach');
      }
    } catch (error) {
      console.error('Error downloading Cover Letter PDF:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error downloading the PDF. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterPdf(false);
    }
  };

  // Function to handle Cover Letter Markdown preview using the unified approach
  const handleCoverLetterMarkdownPreview = async () => {
    try {
      setIsGeneratingCoverLetterMd(true);

      // Import the server action dynamically to avoid server/client mismatch
      const { getFormattedContent } = await import('@/app/actions/contentActions');

      // Get the content from the ContentStateService via server action
      const result = await getFormattedContent('cover_letter', 'markdown');

      if (!result.success) {
        const errorMsg = result.error || 'Failed to get cover letter content';
        console.error(errorMsg);

        // If we don't have content yet, show the summary modal first
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
        return;
      }

      // Set the preview content and show the preview modal
      setCoverLetterTextContent(result.data || '');
      setShowCoverLetterMdPreview(true);
      console.log('Opened Cover Letter Markdown preview using unified approach');
    } catch (error) {
      console.error('Error showing Cover Letter Markdown preview:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error generating the preview. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterMd(false);
    }
  };

  // Function to handle Cover Letter Markdown download using the unified approach
  const handleCoverLetterMarkdownDownload = async () => {
    try {
      setIsGeneratingCoverLetterMd(true);

      // Use the unified downloadContent method
      await DownloadService.downloadContent('cover_letter', 'markdown', 'cover_letter');
      console.log('Downloaded Cover Letter Markdown using unified approach');
    } catch (error) {
      console.error('Error downloading Cover Letter Markdown:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error downloading the file. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterMd(false);
    }
  };

  // Function to handle Cover Letter Text preview using the unified approach
  const handleCoverLetterTextPreview = async () => {
    try {
      setIsGeneratingCoverLetterTxt(true);

      // Import the server action dynamically to avoid server/client mismatch
      const { getFormattedContent } = await import('@/app/actions/contentActions');

      // Get the content from the ContentStateService via server action
      const result = await getFormattedContent('cover_letter', 'text');

      if (!result.success) {
        const errorMsg = result.error || 'Failed to get cover letter content';
        console.error(errorMsg);

        // If we don't have content yet, show the summary modal first
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
        return;
      }

      // Set the preview content and show the preview modal
      setCoverLetterTextContent(result.data || '');
      setShowCoverLetterTxtPreview(true);
      console.log('Opened Cover Letter Text preview using unified approach');
    } catch (error) {
      console.error('Error showing Cover Letter Text preview:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error generating the preview. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterTxt(false);
    }
  };

  // Function to handle Cover Letter Text download using the unified approach
  const handleCoverLetterTextDownload = async () => {
    try {
      setIsGeneratingCoverLetterTxt(true);

      // Use the unified downloadContent method
      await DownloadService.downloadContent('cover_letter', 'text', 'cover_letter');
      console.log('Downloaded Cover Letter Text using unified approach');
    } catch (error) {
      console.error('Error downloading Cover Letter Text:', error);

      // If the error indicates missing content, show the summary modal
      if (error instanceof Error && error.message.includes('Failed to get cover_letter content')) {
        alert('Please open the Cover Letter first to generate content.');
        setShowSummaryModal(true);
      } else {
        alert('There was an error downloading the file. Please try again.');
      }
    } finally {
      setIsGeneratingCoverLetterTxt(false);
    }
  };

  return (
    <>
      <header className={styles.salingerHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.siteTitle}>{serverTheme.name || 'Professional Resume'}</h1>
          <a
            href="#"
            className={styles.summaryLink}
            onClick={(e) => handleAction('summary', e)}
            aria-label="View Summary"
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
                Cover Letter
              </>
            )}
          </a>
        </div>

        <nav className={styles.headerActions}>
        <div className={styles.downloadContainer}>
          <a
            href="#"
            className={styles.actionLink}
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
                    // Get the content from the file
                    const contentResponse = await fetch('/extracted/resume_content.md');
                    const content = await contentResponse.text();

                    // Use the server action to format the content
                    const result = await formatContentAsMarkdown(content, 'resume');

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Set the preview content and show the preview modal
                    setPreviewContent(result.data);
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
                    // Use the unified downloadContent method
                    await DownloadService.downloadContent('resume', 'markdown', fileName);
                    console.log(`Downloaded ${fileName}.md using unified approach`);
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
                    // Get the content from the file
                    const contentResponse = await fetch('/extracted/resume_content.md');
                    const content = await contentResponse.text();

                    // Use the server action to format the content
                    const result = await formatContentAsText(content, 'resume');

                    if (!result.success) {
                      throw new Error(result.error || 'Unknown error');
                    }

                    // Set the preview content and show the preview modal
                    setPreviewContent(result.data);
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
                    // Use the unified downloadContent method
                    await DownloadService.downloadContent('resume', 'text', fileName);
                    console.log(`Downloaded ${fileName}.txt using unified approach`);
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

          </div>
        </div>
        <span className={styles.actionSeparator}>•</span>
        <a
          href="/json-view"
          className={styles.actionLink}
          aria-label="View JSON"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M8 12h8"></path>
            <path d="M8 16h8"></path>
            <path d="M8 20h8"></path>
          </svg>
          View JSON
        </a>

        <span className={styles.actionSeparator}>•</span>
        <a
          ref={contactButtonRef}
          href="#"
          className={styles.actionLink}
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
      pdfSource="/default_resume.pdf" // Explicitly set to resume PDF
    />

    {/* Summary Modal - Using the SummaryModalWrapper with CoverLetterProvider */}
    <SummaryModalWrapper
      isOpen={showSummaryModal}
      onClose={() => setShowSummaryModal(false)}
      position="left"
    />

    {/* Cover Letter Preview Modals */}
    {/* PDF Preview Modal */}
    <PreviewModal
      isOpen={showCoverLetterPdfPreview}
      onClose={() => setShowCoverLetterPdfPreview(false)}
      content=""
      format="pdf"
      fileName="cover_letter"
      onDownload={handleCoverLetterPdfDownload}
      onDownloadWithDataUrl={(dataUrl) => DownloadService.downloadPdf('', 'cover_letter', { dataUrl })}
      position="right"
      pdfDataUrl={coverLetterPdfDataUrl || undefined}
    />

    {/* Markdown Preview Modal */}
    <PreviewModal
      isOpen={showCoverLetterMdPreview}
      onClose={() => setShowCoverLetterMdPreview(false)}
      content={coverLetterTextContent}
      format="markdown"
      fileName="cover_letter"
      onDownload={handleCoverLetterMarkdownDownload}
      position="right"
    />

    {/* Text Preview Modal */}
    <PreviewModal
      isOpen={showCoverLetterTxtPreview}
      onClose={() => setShowCoverLetterTxtPreview(false)}
      content={coverLetterTextContent}
      format="text"
      fileName="cover_letter"
      onDownload={handleCoverLetterTextDownload}
      position="right"
    />
    </>
  );
};

export default SalingerHeader;
