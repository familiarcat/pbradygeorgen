'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * DirectStyleInjector
 *
 * This component directly injects the PDF styles into the document head
 * to ensure they are applied to all components in the application.
 */
const DirectStyleInjector: React.FC = () => {
  const [stylesInjected, setStylesInjected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const injectStyles = async () => {
      console.log('DirectStyleInjector: injectStyles called');
      try {
        console.log('DirectStyleInjector: Starting style injection');
        DanteLogger.success.basic('DirectStyleInjector: Starting style injection');

        // Step 1: Load color theory
        let colorTheory;
        try {
          const colorResponse = await fetch('/extracted/color_theory.json');
          if (colorResponse.ok) {
            colorTheory = await colorResponse.json();
            console.log('DirectStyleInjector: Loaded color theory', colorTheory);
            DanteLogger.success.basic('DirectStyleInjector: Loaded color theory');
          } else {
            throw new Error(`Failed to load color theory: ${colorResponse.status} ${colorResponse.statusText}`);
          }
        } catch (colorError) {
          console.error('DirectStyleInjector: Failed to load color theory:', colorError);
          DanteLogger.error.dataFlow(`DirectStyleInjector: Failed to load color theory: ${colorError}`);
          // Continue with default colors
          colorTheory = {
            primary: '#000000',
            secondary: '#CCCCCC',
            accent: '#3366CC',
            background: '#FFFFFF',
            text: '#000000',
            textSecondary: '#666666',
            border: '#CCCCCC'
          };
        }

        // Step 2: Load font theory
        let fontTheory;
        try {
          const fontResponse = await fetch('/extracted/font_theory.json');
          if (fontResponse.ok) {
            fontTheory = await fontResponse.json();
            console.log('DirectStyleInjector: Loaded font theory', fontTheory);
            DanteLogger.success.basic('DirectStyleInjector: Loaded font theory');
          } else {
            throw new Error(`Failed to load font theory: ${fontResponse.status} ${fontResponse.statusText}`);
          }
        } catch (fontError) {
          console.error('DirectStyleInjector: Failed to load font theory:', fontError);
          DanteLogger.error.dataFlow(`DirectStyleInjector: Failed to load font theory: ${fontError}`);
          // Continue with default fonts
          fontTheory = {
            heading: 'Helvetica Neue, Arial, sans-serif',
            body: 'Georgia, serif',
            mono: 'Courier New, monospace',
            title: 'Helvetica Neue, Arial, sans-serif',
            subtitle: 'Helvetica Neue, Arial, sans-serif',
            button: 'Helvetica Neue, Arial, sans-serif',
            nav: 'Helvetica Neue, Arial, sans-serif',
            code: 'Courier New, monospace'
          };
        }

        // Step 3: Create and inject the style element
        const styleElement = document.createElement('style');
        styleElement.id = 'direct-injected-pdf-styles';
        styleElement.innerHTML = generateCssContent(colorTheory, fontTheory);

        // Remove any existing style element with the same ID
        const existingStyle = document.getElementById('direct-injected-pdf-styles');
        if (existingStyle) {
          existingStyle.remove();
        }

        // Add the style element to the head
        document.head.appendChild(styleElement);

        // Set data attribute on html element to enable CSS selectors
        document.documentElement.setAttribute('data-pdf-styles-loaded', 'true');

        // Add class to body
        document.body.classList.add('pdf-styles-loaded');

        setStylesInjected(true);
        console.log('DirectStyleInjector: Styles injected successfully');
        DanteLogger.success.ux('DirectStyleInjector: Styles injected successfully');

        // Trigger a custom event for components that need to know when styles are loaded
        const event = new CustomEvent('pdf-styles-loaded', {
          detail: { colorTheory, fontTheory }
        });
        document.dispatchEvent(event);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        console.error('DirectStyleInjector: Error injecting styles:', err);
        DanteLogger.error.runtime(`DirectStyleInjector: Error injecting styles: ${errorMessage}`);
      }
    };

    // Initial injection
    injectStyles();

    // Listen for force-style-injection event
    const handleForceInjection = () => {
      console.log('DirectStyleInjector: Force style injection event received');
      DanteLogger.error.runtime('DirectStyleInjector: Force style injection event received');
      injectStyles();
    };

    document.addEventListener('force-style-injection', handleForceInjection);

    // Cleanup
    return () => {
      document.removeEventListener('force-style-injection', handleForceInjection);
    };
  }, []);

  // Function to generate CSS content
  const generateCssContent = (colorTheory: any, fontTheory: any): string => {
    return `
      /* Direct injected PDF styles */

      /* Root variables */
      :root {
        /* Color variables */
        --pdf-primary-color: ${colorTheory.primary} !important;
        --pdf-secondary-color: ${colorTheory.secondary} !important;
        --pdf-accent-color: ${colorTheory.accent} !important;
        --pdf-background-color: ${colorTheory.background} !important;
        --pdf-text-color: ${colorTheory.text} !important;
        --pdf-text-secondary: ${colorTheory.textSecondary} !important;
        --pdf-border-color: ${colorTheory.border} !important;

        /* Direct color variables */
        --primary: ${colorTheory.primary} !important;
        --secondary: ${colorTheory.secondary} !important;
        --accent: ${colorTheory.accent} !important;
        --background: ${colorTheory.background} !important;
        --text-color: ${colorTheory.text} !important;
        --text-secondary: ${colorTheory.textSecondary} !important;
        --border-color: ${colorTheory.border} !important;

        /* Dynamic color variables */
        --dynamic-primary: ${colorTheory.primary} !important;
        --dynamic-secondary: ${colorTheory.secondary} !important;
        --dynamic-accent: ${colorTheory.accent} !important;
        --dynamic-background: ${colorTheory.background} !important;
        --dynamic-text: ${colorTheory.text} !important;
        --dynamic-border: ${colorTheory.border} !important;

        /* Font variables */
        --pdf-heading-font: ${fontTheory.heading} !important;
        --pdf-body-font: ${fontTheory.body} !important;
        --pdf-mono-font: ${fontTheory.mono} !important;
        --pdf-title-font: ${fontTheory.title} !important;
        --pdf-subtitle-font: ${fontTheory.subtitle} !important;
        --pdf-button-font: ${fontTheory.button} !important;
        --pdf-nav-font: ${fontTheory.nav} !important;
        --pdf-code-font: ${fontTheory.code} !important;

        /* Direct font variables */
        --font-heading: ${fontTheory.heading} !important;
        --font-body: ${fontTheory.body} !important;
        --font-mono: ${fontTheory.mono} !important;
        --font-title: ${fontTheory.title} !important;
        --font-subtitle: ${fontTheory.subtitle} !important;
        --font-button: ${fontTheory.button} !important;
        --font-nav: ${fontTheory.nav} !important;
        --font-code: ${fontTheory.code} !important;

        /* Dynamic font variables */
        --dynamic-heading-font: ${fontTheory.heading} !important;
        --dynamic-primary-font: ${fontTheory.body} !important;
        --dynamic-secondary-font: ${fontTheory.body} !important;
        --dynamic-mono-font: ${fontTheory.mono} !important;
      }

      /* Apply styles directly to elements */
      html[data-pdf-styles-loaded="true"] body {
        font-family: ${fontTheory.body} !important;
        color: ${colorTheory.text} !important;
        background-color: ${colorTheory.background} !important;
      }

      html[data-pdf-styles-loaded="true"] h1,
      html[data-pdf-styles-loaded="true"] h2,
      html[data-pdf-styles-loaded="true"] h3,
      html[data-pdf-styles-loaded="true"] h4,
      html[data-pdf-styles-loaded="true"] h5,
      html[data-pdf-styles-loaded="true"] h6 {
        font-family: ${fontTheory.heading} !important;
        color: ${colorTheory.text} !important;
      }

      html[data-pdf-styles-loaded="true"] button,
      html[data-pdf-styles-loaded="true"] .button,
      html[data-pdf-styles-loaded="true"] [class*="btn"] {
        font-family: ${fontTheory.button} !important;
        background-color: ${colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        border-color: ${colorTheory.primary} !important;
      }

      html[data-pdf-styles-loaded="true"] a {
        color: ${colorTheory.primary} !important;
      }

      html[data-pdf-styles-loaded="true"] code,
      html[data-pdf-styles-loaded="true"] pre {
        font-family: ${fontTheory.mono} !important;
      }

      /* Apply styles to specific components */
      html[data-pdf-styles-loaded="true"] .markdownPreview {
        font-family: ${fontTheory.body} !important;
        color: ${colorTheory.text} !important;
        background-color: ${colorTheory.background} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="modalContent"] {
        background-color: ${colorTheory.background} !important;
        color: ${colorTheory.text} !important;
        border-color: ${colorTheory.border} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="modalHeader"] {
        background-color: ${colorTheory.background} !important;
        border-bottom-color: ${colorTheory.border} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="modalTitle"] {
        color: ${colorTheory.text} !important;
        font-family: ${fontTheory.heading} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="actionLink"],
      html[data-pdf-styles-loaded="true"] [class*="downloadOption"],
      html[data-pdf-styles-loaded="true"] [class*="previewButton"] {
        background-color: ${colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        font-family: ${fontTheory.button} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="salingerHeader"] {
        background-color: ${colorTheory.background} !important;
        color: ${colorTheory.text} !important;
        border-color: ${colorTheory.border} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="salingerTitle"] {
        color: ${colorTheory.text} !important;
        font-family: ${fontTheory.heading} !important;
      }

      html[data-pdf-styles-loaded="true"] [class*="salingerNav"] a {
        color: ${colorTheory.primary} !important;
        font-family: ${fontTheory.nav} !important;
      }
    `;
  };

  // This component doesn't render anything visible
  return null;
};

export default DirectStyleInjector;
