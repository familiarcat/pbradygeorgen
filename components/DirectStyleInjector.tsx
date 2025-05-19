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

        // Step 1: Try to load PDF source configuration
        let activePdfPrefix = '';
        try {
          const configResponse = await fetch('/api/pdf-source-config');
          if (configResponse.ok) {
            const config = await configResponse.json();
            if (config.success && config.activeSource) {
              activePdfPrefix = config.activeSource.outputPrefix || '';
              console.log(`DirectStyleInjector: Using active PDF source: ${config.activeSource.name} (prefix: ${activePdfPrefix})`);
              DanteLogger.success.basic(`DirectStyleInjector: Using active PDF source: ${config.activeSource.name}`);
            }
          }
        } catch (configError) {
          console.warn('DirectStyleInjector: Failed to load PDF source config, using default files:', configError);
          DanteLogger.error.dataFlow(`DirectStyleInjector: Failed to load PDF source config: ${configError}`);
        }

        // Step 2: Load color theory (try prefixed file first, then fall back to default)
        let colorTheory;
        try {
          // Try to load the active PDF's color theory first
          let colorResponse;
          if (activePdfPrefix) {
            colorResponse = await fetch(`/extracted/${activePdfPrefix}color_theory.json`);
            if (!colorResponse.ok) {
              console.warn(`DirectStyleInjector: Failed to load prefixed color theory, falling back to default`);
              colorResponse = await fetch('/extracted/color_theory.json');
            }
          } else {
            colorResponse = await fetch('/extracted/color_theory.json');
          }

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

        // Step 3: Load font theory (try prefixed file first, then fall back to default)
        let fontTheory;
        try {
          // Try to load the active PDF's font theory first
          let fontResponse;
          if (activePdfPrefix) {
            fontResponse = await fetch(`/extracted/${activePdfPrefix}font_theory.json`);
            if (!fontResponse.ok) {
              console.warn(`DirectStyleInjector: Failed to load prefixed font theory, falling back to default`);
              fontResponse = await fetch('/extracted/font_theory.json');
            }
          } else {
            fontResponse = await fetch('/extracted/font_theory.json');
          }

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

  // Function to generate CSS content with high specificity selectors
  const generateCssContent = (colorTheory: any, fontTheory: any): string => {
    // Calculate hover and focus colors based on the primary color
    const primaryHSL = hexToHSL(colorTheory.accent || colorTheory.primary);
    const accentHoverHSL = { ...primaryHSL, l: Math.min(primaryHSL.l + 10, 70) };
    const accentHover = hslToHex(accentHoverHSL.h, accentHoverHSL.s, accentHoverHSL.l);
    const focusRingHSL = { ...primaryHSL, s: Math.max(primaryHSL.s - 20, 30), l: Math.min(primaryHSL.l + 30, 90) };
    const focusRing = hslToHex(focusRingHSL.h, focusRingHSL.s, focusRingHSL.l);

    return `
      /* Direct injected PDF styles with high specificity selectors */

      /* Root variables */
      :root {
        /* Color variables */
        --pdf-primary-color: ${colorTheory.primary} !important;
        --pdf-secondary-color: ${colorTheory.secondary} !important;
        --pdf-accent-color: ${colorTheory.accent || colorTheory.primary} !important;
        --pdf-accent-hover: ${accentHover} !important;
        --pdf-focus-ring: ${focusRing} !important;
        --pdf-background-color: ${colorTheory.background} !important;
        --pdf-text-color: ${colorTheory.text} !important;
        --pdf-text-secondary: ${colorTheory.textSecondary} !important;
        --pdf-border-color: ${colorTheory.border} !important;

        /* Direct color variables */
        --primary: ${colorTheory.primary} !important;
        --secondary: ${colorTheory.secondary} !important;
        --accent: ${colorTheory.accent || colorTheory.primary} !important;
        --background: ${colorTheory.background} !important;
        --text-color: ${colorTheory.text} !important;
        --text-secondary: ${colorTheory.textSecondary} !important;
        --border-color: ${colorTheory.border} !important;

        /* Dynamic color variables */
        --dynamic-primary: ${colorTheory.primary} !important;
        --dynamic-secondary: ${colorTheory.secondary} !important;
        --dynamic-accent: ${colorTheory.accent || colorTheory.primary} !important;
        --dynamic-background: ${colorTheory.background} !important;
        --dynamic-text: ${colorTheory.text} !important;
        --dynamic-border: ${colorTheory.border} !important;

        /* Font variables */
        --pdf-heading-font: ${fontTheory.heading} !important;
        --pdf-body-font: ${fontTheory.body} !important;
        --pdf-mono-font: ${fontTheory.mono} !important;
        --pdf-title-font: ${fontTheory.title || fontTheory.heading} !important;
        --pdf-subtitle-font: ${fontTheory.subtitle || fontTheory.heading} !important;
        --pdf-button-font: ${fontTheory.button || fontTheory.heading} !important;
        --pdf-nav-font: ${fontTheory.nav || fontTheory.heading} !important;
        --pdf-code-font: ${fontTheory.code || fontTheory.mono} !important;

        /* Direct font variables */
        --font-heading: ${fontTheory.heading} !important;
        --font-body: ${fontTheory.body} !important;
        --font-mono: ${fontTheory.mono} !important;
        --font-title: ${fontTheory.title || fontTheory.heading} !important;
        --font-subtitle: ${fontTheory.subtitle || fontTheory.heading} !important;
        --font-button: ${fontTheory.button || fontTheory.heading} !important;
        --font-nav: ${fontTheory.nav || fontTheory.heading} !important;
        --font-code: ${fontTheory.code || fontTheory.mono} !important;

        /* Dynamic font variables */
        --dynamic-heading-font: ${fontTheory.heading} !important;
        --dynamic-primary-font: ${fontTheory.body} !important;
        --dynamic-secondary-font: ${fontTheory.body} !important;
        --dynamic-mono-font: ${fontTheory.mono} !important;
      }

      /* Apply styles directly to elements with high specificity */
      html[data-pdf-styles-loaded="true"] body {
        font-family: ${fontTheory.body} !important;
        color: #000000 !important; /* Force black text for readability */
        background-color: ${colorTheory.background || '#FFFFFF'} !important;
      }

      /* Force black text for all headings */
      html[data-pdf-styles-loaded="true"] h1,
      html[data-pdf-styles-loaded="true"] h2,
      html[data-pdf-styles-loaded="true"] h3,
      html[data-pdf-styles-loaded="true"] h4,
      html[data-pdf-styles-loaded="true"] h5,
      html[data-pdf-styles-loaded="true"] h6 {
        font-family: ${fontTheory.heading} !important;
        color: #000000 !important; /* Force black text for readability */
      }

      /* Ensure text is visible in all components with extremely high specificity */
      html[data-pdf-styles-loaded="true"] p,
      html[data-pdf-styles-loaded="true"] span,
      html[data-pdf-styles-loaded="true"] div,
      html[data-pdf-styles-loaded="true"] li,
      html[data-pdf-styles-loaded="true"] td,
      html[data-pdf-styles-loaded="true"] th,
      html[data-pdf-styles-loaded="true"] label,
      html[data-pdf-styles-loaded="true"] .markdownPreview *,
      html[data-pdf-styles-loaded="true"] [class*="content"] *,
      html[data-pdf-styles-loaded="true"] [class*="preview"] *,
      html[data-pdf-styles-loaded="true"] [class*="text"] * {
        color: #000000 !important; /* Force black text for readability */
      }

      /* Additional selectors for specific components */
      html[data-pdf-styles-loaded="true"] [class*="name"],
      html[data-pdf-styles-loaded="true"] [class*="title"],
      html[data-pdf-styles-loaded="true"] [class*="heading"],
      html[data-pdf-styles-loaded="true"] [class*="header"] *:not([class*="actionLink"]):not([class*="actionIcon"]):not(button):not(a) {
        color: #000000 !important; /* Force black text for readability */
      }

      html[data-pdf-styles-loaded="true"] button,
      html[data-pdf-styles-loaded="true"] .button,
      html[data-pdf-styles-loaded="true"] [class*="btn"] {
        font-family: ${fontTheory.button || fontTheory.heading} !important;
        background-color: ${colorTheory.accent || colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        border-color: ${colorTheory.accent || colorTheory.primary} !important;
      }

      html[data-pdf-styles-loaded="true"] a {
        color: ${colorTheory.accent || colorTheory.primary} !important;
      }

      html[data-pdf-styles-loaded="true"] code,
      html[data-pdf-styles-loaded="true"] pre {
        font-family: ${fontTheory.mono} !important;
      }

      /* Apply styles to specific components with very high specificity */
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

      /* SalingerHeader specific styles with extremely high specificity */
      html[data-pdf-styles-loaded="true"] body [class*="salingerHeader"] {
        background-color: ${colorTheory.background} !important;
        color: ${colorTheory.text} !important;
        border-color: ${colorTheory.border} !important;
      }

      html[data-pdf-styles-loaded="true"] body [class*="siteTitle"] {
        color: ${colorTheory.text} !important;
        font-family: ${fontTheory.title || fontTheory.heading} !important;
      }

      /* Action links, buttons, and download options with extremely high specificity */
      html[data-pdf-styles-loaded="true"] body [class*="actionLink"],
      html[data-pdf-styles-loaded="true"] body [class*="actionLink"]:link,
      html[data-pdf-styles-loaded="true"] body [class*="actionLink"]:visited,
      html[data-pdf-styles-loaded="true"] body a[class*="actionLink"] {
        background-color: ${colorTheory.accent || colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        font-family: ${fontTheory.button || fontTheory.heading} !important;
        border: 1px solid ${colorTheory.accent || colorTheory.primary} !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
      }

      html[data-pdf-styles-loaded="true"] body [class*="actionLink"]:hover,
      html[data-pdf-styles-loaded="true"] body a[class*="actionLink"]:hover {
        background-color: ${accentHover} !important;
        color: ${colorTheory.background} !important;
        border: 1px solid ${accentHover} !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
      }

      html[data-pdf-styles-loaded="true"] body [class*="actionLink"]:focus,
      html[data-pdf-styles-loaded="true"] body a[class*="actionLink"]:focus {
        background-color: ${colorTheory.accent || colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        box-shadow: 0 0 0 2px ${focusRing} !important;
      }

      html[data-pdf-styles-loaded="true"] body [class*="downloadOption"],
      html[data-pdf-styles-loaded="true"] body [class*="previewButton"] {
        background-color: ${colorTheory.accent || colorTheory.primary} !important;
        color: ${colorTheory.background} !important;
        font-family: ${fontTheory.button || fontTheory.heading} !important;
      }

      html[data-pdf-styles-loaded="true"] body [class*="downloadOption"]:hover,
      html[data-pdf-styles-loaded="true"] body [class*="previewButton"]:hover {
        background-color: ${accentHover} !important;
        color: ${colorTheory.background} !important;
      }

      /* Icon styling with extremely high specificity */
      html[data-pdf-styles-loaded="true"] body [class*="actionIcon"],
      html[data-pdf-styles-loaded="true"] body [class*="previewIcon"],
      html[data-pdf-styles-loaded="true"] body [class*="downloadIcon"] {
        stroke: ${colorTheory.background} !important;
        fill: none !important;
        stroke-width: 2.5 !important;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5)) !important;
      }

      /* Icon styling for buttons with text background */
      html[data-pdf-styles-loaded="true"] body [class*="previewButton"] [class*="previewIcon"],
      html[data-pdf-styles-loaded="true"] body [class*="downloadOption"] [class*="downloadIcon"] {
        stroke: ${colorTheory.background} !important;
      }

      /* Ensure consistent styling for all icons in action links */
      html[data-pdf-styles-loaded="true"] body [class*="actionLink"] svg,
      html[data-pdf-styles-loaded="true"] body [class*="downloadOption"] svg,
      html[data-pdf-styles-loaded="true"] body [class*="previewButton"] svg {
        stroke: ${colorTheory.background} !important;
        fill: none !important;
      }
    `;
  };

  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string): { h: number, s: number, l: number } => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Convert to percentages
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
  };

  // Helper function to convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;

    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (c: number): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // This component doesn't render anything visible
  return null;
};

export default DirectStyleInjector;
