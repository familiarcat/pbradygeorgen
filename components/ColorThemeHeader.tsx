'use client';

import React, { useEffect } from 'react';
import styles from '@/styles/SalingerHeader.module.css';
import { useServerTheme } from './ServerThemeProvider';
import { useSalingerTheme } from './SalingerThemeProvider';
import { useAdmin } from '@/contexts/AdminContext';
import { DanteLogger } from '@/utils/DanteLogger';

interface ColorThemeHeaderProps {
  onReanalyzeColors: () => Promise<void>;
  isAnalyzing: boolean;
  onBack?: () => void;
}

/**
 * ColorThemeHeader component
 * 
 * A simplified version of SalingerHeader specifically for the Color Theme Editor
 * Follows Salinger philosophy for intuitive UX and Hesse philosophy for color theory
 */
const ColorThemeHeader: React.FC<ColorThemeHeaderProps> = ({
  onReanalyzeColors,
  isAnalyzing,
  onBack
}) => {
  // Use server theme for dynamic theming
  const serverTheme = useServerTheme();
  
  // Use Salinger theme for consistent styling and PDF-extracted colors
  const salingerTheme = useSalingerTheme();
  
  // Get admin mode state
  const { isAdminMode } = useAdmin();

  // Apply PDF-extracted background color to header
  useEffect(() => {
    // Apply the extracted background color to the header if available
    if (salingerTheme.backgroundColor) {
      console.log(`🎨 Applying PDF-extracted background color to header: ${salingerTheme.backgroundColor}`);

      // Create a style element to apply the background color
      const styleElement = document.createElement('style');
      styleElement.id = 'header-background-color';
      styleElement.textContent = `
        .${styles.salingerHeader} {
          background-color: ${salingerTheme.backgroundColor}ee !important; /* With transparency */
          color: ${salingerTheme.textColor} !important;
        }
        .${styles.siteTitle} {
          color: ${salingerTheme.textColor} !important;
        }
      `;

      // Remove any existing style element
      const existingStyle = document.getElementById('header-background-color');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add the style element to the document head
      document.head.appendChild(styleElement);
    }
  }, [salingerTheme.backgroundColor, salingerTheme.textColor, styles.salingerHeader, styles.siteTitle]);

  // Handle reanalyze action
  const handleReanalyze = async () => {
    if (!isAdminMode) {
      DanteLogger.warn.security('Attempted to reanalyze colors without admin mode');
      return;
    }

    try {
      DanteLogger.info.system('🔄 Triggering PDF color reanalysis');
      await onReanalyzeColors();
    } catch (error) {
      DanteLogger.error.runtime(`❌ Error during PDF color reanalysis: ${error}`);
    }
  };

  // Handle back action
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate to home page if no back handler provided
      window.location.href = '/';
    }
  };

  return (
    <header className={styles.salingerHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.siteTitle}>Color Theme Editor</h1>
        <a
          href="#"
          className={styles.summaryLink}
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          aria-label="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </a>
      </div>

      <nav className={styles.headerActions}>
        {isAdminMode && (
          <a
            href="#"
            className={styles.actionLink}
            onClick={(e) => {
              e.preventDefault();
              handleReanalyze();
            }}
            aria-label="Reanalyze PDF Colors"
            title="Extract and analyze colors from the source PDF again"
          >
            {isAnalyzing ? (
              <>
                <svg className={`${styles.loadingSpinner} ${styles.actionIcon}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h6m-2-2v4m8-4v4m-4-8v8m8-4h4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Reanalyze PDF Colors
              </>
            )}
          </a>
        )}
      </nav>
    </header>
  );
};

export default ColorThemeHeader;
