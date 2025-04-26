import React, { useState, useRef } from 'react';
import styles from '@/styles/SalingerHeader.module.css';
import PreviewModal from './PreviewModal';
import SummaryModal from './SummaryModal';

interface SalingerHeaderProps {
  onDownload?: () => void;
  onViewSummary?: () => void;
  onContact?: () => void;
  onUpload?: () => void;
  onRefresh?: () => void;
  fileName?: string;
}

const SalingerHeader: React.FC<SalingerHeaderProps> = ({
  onDownload,
  onViewSummary,
  onContact,
  onUpload,
  onRefresh,
  fileName = 'resume'
}) => {
  // Loading states for different download formats
  const [isLoadingMd, setIsLoadingMd] = useState(false);
  const [isLoadingTxt, setIsLoadingTxt] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // Preview states
  const [showMdPreview, setShowMdPreview] = useState(false);
  const [showTxtPreview, setShowTxtPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
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

        // Fetch the summary content with proper error handling
        fetch('/api/get-summary')
          .then(response => {
            if (!response.ok) {
              console.error(`API responded with status: ${response.status}`);
              throw new Error(`API responded with status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              console.log('Summary loaded successfully');
              setSummaryContent(data.summary);
              setShowSummaryModal(true);
            } else {
              console.error('API returned error:', data.error);
              throw new Error(data.error || 'Failed to load summary');
            }
          })
          .catch(error => {
            console.error('Error loading summary:', error);

            // Try the analyze-content API as a fallback
            console.log('Attempting to use analyze-content API as fallback...');

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
                  const markdown = `# P. Brady Georgen - Summary

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
    a.href = `/pbradygeorgen_resume.pdf?v=${Date.now()}`;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <header className={styles.salingerHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.siteTitle}>P. Brady Georgen</h1>
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
                Summary
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
                    a.download = `${fileName}.md`;
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
                    a.download = `${fileName}.txt`;
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

          </div>
        </div>
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
    />

    {/* Summary Modal - Using the new dark-themed SummaryModal */}
    <SummaryModal
      isOpen={showSummaryModal}
      onClose={() => setShowSummaryModal(false)}
      content={summaryContent}
      isLoading={isLoadingSummary}
      onRefreshAnalysis={() => {
        setIsLoadingSummary(true);

        // Call the get-summary API to refresh the analysis
        fetch('/api/get-summary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`API responded with status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              // Update the summary content with the new analysis
              setSummaryContent(data.summary);
              console.log('Analysis refreshed successfully');
            } else {
              throw new Error(data.error || 'Failed to refresh analysis');
            }
          })
          .catch(error => {
            console.error('Error refreshing analysis:', error);

            // Show a more helpful error message
            alert('Unable to refresh analysis. The server may be busy. Please try again in a moment.');
          })
          .finally(() => {
            setIsLoadingSummary(false);
          });
      }}
      position="left"
    />
    </>
  );
};

export default SalingerHeader;
