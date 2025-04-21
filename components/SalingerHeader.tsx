import React from 'react';
import styles from '@/styles/SalingerHeader.module.css';

interface SalingerHeaderProps {
  onDownload?: () => void;
  onViewSummary?: () => void;
  onContact?: () => void;
}

const SalingerHeader: React.FC<SalingerHeaderProps> = ({
  onDownload,
  onViewSummary,
  onContact
}) => {

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
      default:
        break;
    }
  };

  return (
    <header className={styles.salingerHeader}>
      <h1 className={styles.siteTitle}>P. Brady Georgen</h1>

      <nav className={styles.headerActions}>
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
              href="/pbradygeorgen_resume.pdf"
              download
              className={styles.downloadOption}
            >
              PDF Format
            </a>
            <a
              href="/extracted/resume_content.md"
              download="pbradygeorgen_resume.md"
              className={styles.downloadOption}
            >
              Markdown Format
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Create and download text version
                if (onDownload) {
                  // First trigger the regular download handler to ensure any necessary state is updated
                  onDownload();
                }

                // Then create a text version using fetch to get the content
                fetch('/extracted/resume_content.md')
                  .then(response => response.text())
                  .then(content => {
                    // Format the content as plain text
                    const textContent = content
                      .replace(/^#\s+/gm, '') // Remove markdown headers
                      .replace(/^##\s+/gm, '')
                      .replace(/\*\*/g, '') // Remove bold markers
                      .replace(/\*/g, '') // Remove italic markers
                      .trim();

                    // Create and download the file
                    const blob = new Blob([textContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pbradygeorgen_resume.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  })
                  .catch(error => console.error('Error creating text version:', error));
              }}
              className={styles.downloadOption}
            >
              Text Format
            </a>
          </div>
        </div>
        <span className={styles.actionSeparator}>•</span>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('summary', e)}
          aria-label="View Summary"
        >
          Summary
        </a>
        <span className={styles.actionSeparator}>•</span>
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('contact', e)}
          aria-label="Contact"
        >
          Contact
        </a>
      </nav>
    </header>
  );
};

export default SalingerHeader;
