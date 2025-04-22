import React, { useState } from 'react';
import styles from '@/styles/SalingerHeader.module.css';

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

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.preventDefault();

    switch (action) {
      case 'download':
        if (onDownload) onDownload();
        break;
      case 'summary':
        if (onViewSummary) onViewSummary();
        else {
          // Scroll to summary section if no handler provided
          const summaryElement = document.querySelector('#summary-section');
          if (summaryElement) {
            summaryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      case 'contact':
        if (onContact) onContact();
        else {
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
      default:
        break;
    }
  };

  return (
    <header className={styles.salingerHeader}>
      <h1 className={styles.siteTitle}>P. Brady Georgen</h1>

      <nav className={styles.headerActions}>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('summary', e)}
          aria-label="View Summary"
        >
          Summary
        </a>
        <span className={styles.actionSeparator}>•</span>
        <div className={styles.downloadContainer}>
          <a
            href="#"
            className={styles.actionLink}
            onClick={(e) => e.preventDefault()} // Prevent default to allow dropdown to work
            aria-label="Download Resume"
            aria-haspopup="true"
          >
            Download Resume
          </a>

          {/* Dropdown menu with Salinger-inspired styling */}
          <div className={styles.downloadMenu}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onDownload) onDownload();
              }}
              className={styles.downloadOption}
            >
              PDF Format
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
                'Markdown Format'
              )}
            </a>
            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                setIsLoadingTxt(true);

                try {
                  // Trigger the regular download handler if needed
                  if (onDownload) {
                    onDownload();
                  }

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
                'Text Format'
              )}
            </a>

          </div>
        </div>
        <span className={styles.actionSeparator}>•</span>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('contact', e)}
          aria-label="Contact"
        >
          Contact
        </a>
        <span className={styles.actionSeparator}>•</span>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('upload', e)}
          aria-label="Upload PDF"
        >
          Upload PDF
        </a>
      </nav>
    </header>
  );
};

export default SalingerHeader;
