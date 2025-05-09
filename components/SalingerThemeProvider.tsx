'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useServerTheme } from './ServerThemeProvider';
import { DanteLogger } from '@/utils/DanteLogger';

// Define the theme context type
interface SalingerThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  primaryFont: string;
  headingFont: string;
  ctaPrimaryBg: string;
  ctaSecondaryBg: string;
  ctaPrimaryHover: string;
  ctaSecondaryHover: string;
  headerBg: string;
  isLoading: boolean;
}

// Create the context with default values
const SalingerThemeContext = createContext<SalingerThemeContextType>({
  primaryColor: '#2e65b8', // blue
  secondaryColor: '#99335c', // magenta
  accentColor: '#d99126', // orange
  backgroundColor: '#f1f2f4', // light gray
  textColor: '#21252c', // dark gray
  borderColor: '#c2cad6', // medium gray
  primaryFont: 'var(--font-source-sans)',
  headingFont: 'var(--font-roboto)',
  ctaPrimaryBg: 'rgba(46, 101, 184, 0.2)',
  ctaSecondaryBg: 'rgba(153, 51, 92, 0.15)',
  ctaPrimaryHover: '#2e65b8',
  ctaSecondaryHover: '#99335c',
  headerBg: 'rgba(241, 242, 244, 0.95)',
  isLoading: true,
});

// Hook to use the Salinger theme
export const useSalingerTheme = () => useContext(SalingerThemeContext);

interface SalingerThemeProviderProps {
  children: ReactNode;
}

export default function SalingerThemeProvider({ children }: SalingerThemeProviderProps) {
  // Get the server theme
  const serverTheme = useServerTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Create a CSS class with the theme variables
  useEffect(() => {
    if (!serverTheme || serverTheme.isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      // Extract colors from the server theme
      const colors = serverTheme.colorTheme || {};
      const fonts = serverTheme.fontInfo || {};

      // Log the extracted colors for debugging
      console.log('Extracted colors from serverTheme:', colors);

      // Create a style element for the Salinger theme
      const styleId = 'salinger-theme-style';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      // Define the CSS variables - use the actual extracted colors
      // These should match the values in public/extracted/color_theme.json
      const primaryColor = colors.primary || '#2e65b8';
      const secondaryColor = colors.secondary || '#99335c';
      const accentColor = colors.accent || '#d99126';
      const backgroundColor = colors.background || '#f1f2f4';
      const textColor = colors.text || '#21252c';
      const borderColor = colors.border || '#c2cad6';

      // Log the colors we're actually using
      console.log('Using colors for Salinger theme:', {
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        borderColor
      });

      // Get CTA colors from the theme if available
      const ctaColors = colors.ctaColors || {};
      const ctaPrimaryBg = ctaColors.primary?.base ? `${ctaColors.primary.base}33` : 'rgba(46, 101, 184, 0.2)'; // 20% opacity
      const ctaSecondaryBg = ctaColors.secondary?.base ? `${ctaColors.secondary.base}26` : 'rgba(153, 51, 92, 0.15)'; // 15% opacity
      const ctaPrimaryHover = ctaColors.primary?.hover || primaryColor;
      const ctaSecondaryHover = ctaColors.secondary?.hover || secondaryColor;

      // Calculate header background with transparency
      const headerBg = `${backgroundColor}F2`; // 95% opacity

      // Get fonts from the server theme
      const primaryFont = fonts.primaryFont || 'var(--font-source-sans)';
      const headingFont = fonts.headingFont || 'var(--font-roboto)';

      // Create the CSS
      const css = `
        /* Apply theme variables to :root for global access */
        :root {
          --pdf-primary-color: ${primaryColor};
          --pdf-secondary-color: ${secondaryColor};
          --pdf-accent-color: ${accentColor};
          --pdf-background-color: ${backgroundColor};
          --pdf-text-color: ${textColor};
          --pdf-border-color: ${borderColor};
          --pdf-primary-font: ${primaryFont};
          --pdf-heading-font: ${headingFont};
          --cta-primary-bg: ${ctaPrimaryBg};
          --cta-secondary-bg: ${ctaSecondaryBg};
          --cta-primary-hover: ${ctaPrimaryHover};
          --cta-secondary-hover: ${ctaSecondaryHover};
          --header-bg: ${headerBg};
        }

        /* Apply background color to html and body */
        html, body {
          background-color: ${backgroundColor} !important;
        }

        /* Apply styles to the Salinger theme container */
        .salinger-theme {
          --pdf-primary-color: ${primaryColor};
          --pdf-secondary-color: ${secondaryColor};
          --pdf-accent-color: ${accentColor};
          --pdf-background-color: ${backgroundColor};
          --pdf-text-color: ${textColor};
          --pdf-border-color: ${borderColor};
          --pdf-primary-font: ${primaryFont};
          --pdf-heading-font: ${headingFont};
          --cta-primary-bg: ${ctaPrimaryBg};
          --cta-secondary-bg: ${ctaSecondaryBg};
          --cta-primary-hover: ${ctaPrimaryHover};
          --cta-secondary-hover: ${ctaSecondaryHover};
          --header-bg: ${headerBg};

          /* Apply fonts directly */
          font-family: ${primaryFont};
          color: ${textColor};
          background-color: ${backgroundColor};
          min-height: 100vh;
        }

        /* Apply to modals */
        .salinger-theme .modal-content {
          --pdf-primary-color: ${primaryColor};
          --pdf-secondary-color: ${secondaryColor};
          --pdf-accent-color: ${accentColor};
          --pdf-background-color: ${backgroundColor};
          --pdf-text-color: ${textColor};
          --pdf-border-color: ${borderColor};
          --pdf-primary-font: ${primaryFont};
          --pdf-heading-font: ${headingFont};
          --cta-primary-bg: ${ctaPrimaryBg};
          --cta-secondary-bg: ${ctaSecondaryBg};
          --cta-primary-hover: ${ctaPrimaryHover};
          --cta-secondary-hover: ${ctaSecondaryHover};
          --header-bg: ${headerBg};

          /* Apply fonts directly */
          font-family: ${primaryFont};
          color: ${textColor};
        }
      `;

      // Set the CSS
      styleEl.textContent = css;

      // Apply background color directly to html and body elements for immediate effect
      document.documentElement.style.backgroundColor = backgroundColor;
      document.body.style.backgroundColor = backgroundColor;

      // Force the background color with !important to override any other styles
      const styleElement = document.createElement('style');
      styleElement.id = 'salinger-force-background';
      styleElement.textContent = `
        html, body, .pdf-content-layout, .salinger-theme {
          background-color: ${backgroundColor} !important;
        }

        :root {
          --pdf-background-color: ${backgroundColor} !important;
          --background-rgb: ${hexToRgb(backgroundColor)} !important;
        }
      `;

      // Remove any existing style element
      const existingStyle = document.getElementById('salinger-force-background');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add the new style element
      document.head.appendChild(styleElement);

      // Helper function to convert hex to RGB
      function hexToRgb(hex: string) {
        // Remove # if present
        hex = hex.replace(/^#/, '');

        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
      }

      // Update the context value
      setIsLoading(false);

      DanteLogger.success.basic('Salinger theme applied successfully');
    } catch (error) {
      console.error('Error applying Salinger theme:', error);
      DanteLogger.error.runtime(`Error applying Salinger theme: ${error}`);
      setIsLoading(false);
    }
  }, [serverTheme]);

  // Create the context value
  const themeValue: SalingerThemeContextType = {
    primaryColor: serverTheme?.colorTheme?.primary || '#2e65b8',
    secondaryColor: serverTheme?.colorTheme?.secondary || '#99335c',
    accentColor: serverTheme?.colorTheme?.accent || '#d99126',
    backgroundColor: serverTheme?.colorTheme?.background || '#f1f2f4',
    textColor: serverTheme?.colorTheme?.text || '#21252c',
    borderColor: serverTheme?.colorTheme?.border || '#c2cad6',
    primaryFont: serverTheme?.fontInfo?.primaryFont || 'var(--font-source-sans)',
    headingFont: serverTheme?.fontInfo?.headingFont || 'var(--font-roboto)',
    ctaPrimaryBg: serverTheme?.colorTheme?.ctaColors?.primary?.base ?
      `${serverTheme.colorTheme.ctaColors.primary.base}33` : 'rgba(46, 101, 184, 0.2)',
    ctaSecondaryBg: serverTheme?.colorTheme?.ctaColors?.secondary?.base ?
      `${serverTheme.colorTheme.ctaColors.secondary.base}26` : 'rgba(153, 51, 92, 0.15)',
    ctaPrimaryHover: serverTheme?.colorTheme?.ctaColors?.primary?.hover ||
      serverTheme?.colorTheme?.primary || '#2e65b8',
    ctaSecondaryHover: serverTheme?.colorTheme?.ctaColors?.secondary?.hover ||
      serverTheme?.colorTheme?.secondary || '#99335c',
    headerBg: `${serverTheme?.colorTheme?.background || '#f1f2f4'}F2`,
    isLoading,
  };

  return (
    <SalingerThemeContext.Provider value={themeValue}>
      <div className="salinger-theme">
        {children}
      </div>
    </SalingerThemeContext.Provider>
  );
}
