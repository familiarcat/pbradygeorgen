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
        <a
          href="#"
          className={styles.actionLink}
          onClick={(e) => handleAction('download', e)}
          aria-label="Download Resume"
        >
          Download Resume
        </a>
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
