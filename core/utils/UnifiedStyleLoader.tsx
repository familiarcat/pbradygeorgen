'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { DanteLogger } from './DanteLogger';

// Define types for color and font theories
interface ColorTheory {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  allColors?: string[];
  colorTheory?: {
    description: string;
    mood: string;
    accessibility: string;
    colorRelationships: string;
  };
}

interface FontTheory {
  heading: string;
  body: string;
  mono: string;
  title: string;
  subtitle: string;
  button: string;
  nav: string;
  code: string;
  allFonts?: string[];
  fontTheory?: {
    description: string;
    readability: string;
    hierarchy: string;
    fontPairings: string;
  };
}

// Context for styles
interface StyleContextType {
  colorTheory: ColorTheory | null;
  fontTheory: FontTheory | null;
  isLoading: boolean;
  stylesLoaded: boolean;
  error: string | null;
}

const StyleContext = createContext<StyleContextType>({
  colorTheory: null,
  fontTheory: null,
  isLoading: true,
  stylesLoaded: false,
  error: null
});

// Hook to use the style context
export const useStyles = () => useContext(StyleContext);

// Default color and font theories as fallbacks
const defaultColorTheory: ColorTheory = {
  primary: '#3a6ea5',
  secondary: '#004e98',
  accent: '#ff6700',
  background: '#f6f6f6',
  text: '#333333',
  textSecondary: '#666666',
  border: '#dddddd',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8'
};

const defaultFontTheory: FontTheory = {
  heading: 'Arial, sans-serif',
  body: 'Helvetica, Arial, sans-serif',
  mono: 'monospace',
  title: 'Arial, sans-serif',
  subtitle: 'Arial, sans-serif',
  button: 'Arial, sans-serif',
  nav: 'Arial, sans-serif',
  code: 'Consolas, Monaco, monospace'
};

/**
 * UnifiedStyleLoader component
 *
 * This component loads all styles from the extracted files and applies them
 * to the document root. It ensures that styles are loaded in the correct order
 * and that all components have access to the same styles.
 */
export function UnifiedStyleLoader({ children }: { children: React.ReactNode }) {
  const [colorTheory, setColorTheory] = useState<ColorTheory | null>(null);
  const [fontTheory, setFontTheory] = useState<FontTheory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the extracted styles from the JSON files
  useEffect(() => {
    async function loadStyles() {
      try {
        DanteLogger.success.basic('UnifiedStyleLoader: Starting style loading process');
        console.log('UnifiedStyleLoader: Starting style loading process');

        // Step 1: Load the CSS file first to ensure it's available
        try {
          const cssResponse = await fetch('/extracted/pdf_fonts.css');
          if (cssResponse.ok) {
            const cssContent = await cssResponse.text();

            // Create a style element
            const styleElement = document.createElement('style');
            styleElement.id = 'pdf-fonts-css';
            styleElement.textContent = cssContent;

            // Remove any existing style element with the same ID
            const existingStyle = document.getElementById('pdf-fonts-css');
            if (existingStyle) {
              existingStyle.remove();
            }

            // Add the style element to the head
            document.head.appendChild(styleElement);

            DanteLogger.success.basic('UnifiedStyleLoader: PDF fonts CSS loaded successfully');
            console.log('UnifiedStyleLoader: PDF fonts CSS loaded successfully');
          } else {
            throw new Error(`Failed to load PDF fonts CSS: ${cssResponse.status} ${cssResponse.statusText}`);
          }
        } catch (cssError) {
          DanteLogger.error.dataFlow(`UnifiedStyleLoader: Failed to load PDF fonts CSS: ${cssError}`);
          console.error('UnifiedStyleLoader: Failed to load PDF fonts CSS:', cssError);
          // Continue with other style loading even if CSS fails
        }

        // Step 2: Fetch color theory
        const colorResponse = await fetch('/extracted/color_theory.json');
        let colorData: ColorTheory;

        if (colorResponse.ok) {
          colorData = await colorResponse.json();
          setColorTheory(colorData);
          DanteLogger.success.basic('UnifiedStyleLoader: Loaded color theory from extracted JSON');
          console.log('UnifiedStyleLoader: Loaded color theory from extracted JSON', colorData);
        } else {
          DanteLogger.error.dataFlow('UnifiedStyleLoader: Failed to load color theory, using defaults');
          console.warn('UnifiedStyleLoader: Failed to load color theory, using defaults');
          colorData = defaultColorTheory;
          setColorTheory(defaultColorTheory);
        }

        // Step 3: Fetch font theory
        const fontResponse = await fetch('/extracted/font_theory.json');
        let fontData: FontTheory;

        if (fontResponse.ok) {
          fontData = await fontResponse.json();
          setFontTheory(fontData);
          DanteLogger.success.basic('UnifiedStyleLoader: Loaded font theory from extracted JSON');
          console.log('UnifiedStyleLoader: Loaded font theory from extracted JSON', fontData);
        } else {
          DanteLogger.error.dataFlow('UnifiedStyleLoader: Failed to load font theory, using defaults');
          console.warn('UnifiedStyleLoader: Failed to load font theory, using defaults');
          fontData = defaultFontTheory;
          setFontTheory(defaultFontTheory);
        }

        // Step 4: Apply the styles to the document root
        applyStylesToRoot(colorData, fontData);

        setStylesLoaded(true);
        DanteLogger.success.basic('UnifiedStyleLoader: All styles loaded and applied successfully');
        console.log('UnifiedStyleLoader: All styles loaded and applied successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        DanteLogger.error.runtime(`UnifiedStyleLoader: Error loading styles: ${errorMessage}`);
        console.error('UnifiedStyleLoader: Error loading styles', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStyles();
  }, []);

  // Function to apply styles to the document root
  function applyStylesToRoot(colorData: ColorTheory, fontData: FontTheory) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply color variables with all naming conventions for maximum compatibility

    // PDF-prefixed variables (for components that use these)
    root.style.setProperty('--pdf-primary-color', colorData.primary);
    root.style.setProperty('--pdf-secondary-color', colorData.secondary);
    root.style.setProperty('--pdf-accent-color', colorData.accent);
    root.style.setProperty('--pdf-background-color', colorData.background);
    root.style.setProperty('--pdf-text-color', colorData.text);
    root.style.setProperty('--pdf-text-secondary', colorData.textSecondary);
    root.style.setProperty('--pdf-border-color', colorData.border);
    root.style.setProperty('--pdf-success-color', colorData.success);
    root.style.setProperty('--pdf-warning-color', colorData.warning);
    root.style.setProperty('--pdf-error-color', colorData.error);
    root.style.setProperty('--pdf-info-color', colorData.info);

    // Direct variables (for components that use these)
    root.style.setProperty('--primary', colorData.primary);
    root.style.setProperty('--secondary', colorData.secondary);
    root.style.setProperty('--accent', colorData.accent);
    root.style.setProperty('--background', colorData.background);
    root.style.setProperty('--text-color', colorData.text);
    root.style.setProperty('--text-secondary', colorData.textSecondary);
    root.style.setProperty('--border-color', colorData.border);
    root.style.setProperty('--success', colorData.success);
    root.style.setProperty('--warning', colorData.warning);
    root.style.setProperty('--error', colorData.error);
    root.style.setProperty('--info', colorData.info);

    // Dynamic variables (for DynamicThemeProvider compatibility)
    root.style.setProperty('--dynamic-primary', colorData.primary);
    root.style.setProperty('--dynamic-secondary', colorData.secondary);
    root.style.setProperty('--dynamic-accent', colorData.accent);
    root.style.setProperty('--dynamic-background', colorData.background);
    root.style.setProperty('--dynamic-text', colorData.text);
    root.style.setProperty('--dynamic-border', colorData.border);

    // Apply font variables with all naming conventions for maximum compatibility

    // PDF-prefixed variables (for components that use these)
    root.style.setProperty('--pdf-heading-font', fontData.heading);
    root.style.setProperty('--pdf-body-font', fontData.body);
    root.style.setProperty('--pdf-mono-font', fontData.mono);
    root.style.setProperty('--pdf-title-font', fontData.title);
    root.style.setProperty('--pdf-subtitle-font', fontData.subtitle);
    root.style.setProperty('--pdf-button-font', fontData.button);
    root.style.setProperty('--pdf-nav-font', fontData.nav);
    root.style.setProperty('--pdf-code-font', fontData.code);

    // Direct font variables (for components that use these)
    root.style.setProperty('--font-heading', fontData.heading);
    root.style.setProperty('--font-body', fontData.body);
    root.style.setProperty('--font-mono', fontData.mono);
    root.style.setProperty('--font-title', fontData.title);
    root.style.setProperty('--font-subtitle', fontData.subtitle);
    root.style.setProperty('--font-button', fontData.button);
    root.style.setProperty('--font-nav', fontData.nav);
    root.style.setProperty('--font-code', fontData.code);

    // Dynamic font variables (for DynamicThemeProvider compatibility)
    root.style.setProperty('--dynamic-primary-font', fontData.body);
    root.style.setProperty('--dynamic-secondary-font', fontData.mono);
    root.style.setProperty('--dynamic-heading-font', fontData.heading);
    root.style.setProperty('--dynamic-mono-font', fontData.mono);

    // Add a class to the body to indicate that styles are loaded
    document.body.classList.add('pdf-styles-loaded');

    // Trigger a custom event for components that need to know when styles are loaded
    const event = new CustomEvent('pdf-styles-loaded', {
      detail: { colorTheory: colorData, fontTheory: fontData }
    });
    document.dispatchEvent(event);
  }

  return (
    <StyleContext.Provider value={{ colorTheory, fontTheory, isLoading, stylesLoaded, error }}>
      <div className={`unified-style-provider ${stylesLoaded ? 'styles-loaded' : 'styles-loading'}`}>
        {children}
      </div>
    </StyleContext.Provider>
  );
}

export default UnifiedStyleLoader;
