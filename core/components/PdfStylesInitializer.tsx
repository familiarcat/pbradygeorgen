'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * PdfStylesInitializer
 * 
 * This component initializes PDF styles early in the application lifecycle.
 * It loads the PDF styles from the extracted files and applies them to the document
 * with high specificity to override any inline styles.
 */
const PdfStylesInitializer: React.FC = () => {
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStyles = async () => {
      try {
        DanteLogger.success.basic('PdfStylesInitializer: Starting style initialization');
        console.log('PdfStylesInitializer: Starting style initialization');

        // Step 1: Load color theory
        let colorTheory;
        try {
          const colorResponse = await fetch('/extracted/color_theory.json');
          if (colorResponse.ok) {
            colorTheory = await colorResponse.json();
            DanteLogger.success.basic('PdfStylesInitializer: Loaded color theory');
            console.log('PdfStylesInitializer: Loaded color theory', colorTheory);
          } else {
            throw new Error(`Failed to load color theory: ${colorResponse.status} ${colorResponse.statusText}`);
          }
        } catch (colorError) {
          DanteLogger.error.dataFlow(`PdfStylesInitializer: Failed to load color theory: ${colorError}`);
          console.error('PdfStylesInitializer: Failed to load color theory:', colorError);
          // Continue with other style loading even if color theory fails
        }

        // Step 2: Load font theory
        let fontTheory;
        try {
          const fontResponse = await fetch('/extracted/font_theory.json');
          if (fontResponse.ok) {
            fontTheory = await fontResponse.json();
            DanteLogger.success.basic('PdfStylesInitializer: Loaded font theory');
            console.log('PdfStylesInitializer: Loaded font theory', fontTheory);
          } else {
            throw new Error(`Failed to load font theory: ${fontResponse.status} ${fontResponse.statusText}`);
          }
        } catch (fontError) {
          DanteLogger.error.dataFlow(`PdfStylesInitializer: Failed to load font theory: ${fontError}`);
          console.error('PdfStylesInitializer: Failed to load font theory:', fontError);
          // Continue with other style loading even if font theory fails
        }

        // Step 3: Apply styles to the document
        if (colorTheory || fontTheory) {
          applyStylesToDocument(colorTheory, fontTheory);
          setStylesLoaded(true);
          DanteLogger.success.ux('PdfStylesInitializer: Applied PDF styles to document');
          console.log('PdfStylesInitializer: Applied PDF styles to document');
        } else {
          throw new Error('Failed to load any styles');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        DanteLogger.error.runtime(`PdfStylesInitializer: Error initializing styles: ${errorMessage}`);
        console.error('PdfStylesInitializer: Error initializing styles:', err);
      }
    };

    initializeStyles();
  }, []);

  // Function to apply styles to the document
  const applyStylesToDocument = (colorTheory: any, fontTheory: any) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Set data attribute to enable CSS selectors
    root.setAttribute('data-pdf-styles-loaded', 'true');

    // Apply color variables
    if (colorTheory) {
      // PDF-prefixed variables
      root.style.setProperty('--pdf-primary-color', colorTheory.primary);
      root.style.setProperty('--pdf-secondary-color', colorTheory.secondary);
      root.style.setProperty('--pdf-accent-color', colorTheory.accent);
      root.style.setProperty('--pdf-background-color', colorTheory.background);
      root.style.setProperty('--pdf-text-color', colorTheory.text);
      root.style.setProperty('--pdf-text-secondary', colorTheory.textSecondary);
      root.style.setProperty('--pdf-border-color', colorTheory.border);
      
      // Calculate contrast colors for accessibility
      const isDarkPrimary = isColorDark(colorTheory.primary);
      root.style.setProperty('--pdf-primary-contrast', isDarkPrimary ? '#ffffff' : '#000000');
    }

    // Apply font variables
    if (fontTheory) {
      // PDF-prefixed variables
      root.style.setProperty('--pdf-heading-font', fontTheory.heading);
      root.style.setProperty('--pdf-body-font', fontTheory.body);
      root.style.setProperty('--pdf-mono-font', fontTheory.mono);
      root.style.setProperty('--pdf-title-font', fontTheory.title);
      root.style.setProperty('--pdf-subtitle-font', fontTheory.subtitle);
      root.style.setProperty('--pdf-button-font', fontTheory.button);
      root.style.setProperty('--pdf-nav-font', fontTheory.nav);
      root.style.setProperty('--pdf-code-font', fontTheory.code);
    }

    // Add a class to the body to indicate that styles are loaded
    document.body.classList.add('pdf-styles-loaded');

    // Trigger a custom event for components that need to know when styles are loaded
    const event = new CustomEvent('pdf-styles-loaded', {
      detail: { colorTheory, fontTheory }
    });
    document.dispatchEvent(event);
  };

  // Function to determine if a color is dark (for contrast)
  const isColorDark = (hexColor: string): boolean => {
    // Remove the hash if it exists
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if the color is dark
    return luminance < 0.5;
  };

  // This component doesn't render anything visible
  return null;
};

export default PdfStylesInitializer;
