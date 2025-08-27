'use client';

import React, { useEffect, useState } from 'react';

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
}

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

export function GlobalStylesProvider({ children }: { children: React.ReactNode }) {
  const [colorTheory, setColorTheory] = useState<ColorTheory>(defaultColorTheory);
  const [fontTheory, setFontTheory] = useState<FontTheory>(defaultFontTheory);
  const [isLoading, setIsLoading] = useState(true);

  // Load the extracted styles from the JSON files
  useEffect(() => {
    async function loadStyles() {
      try {
        // Fetch color theory
        const colorResponse = await fetch('/extracted/color_theory.json');
        if (colorResponse.ok) {
          const colorData = await colorResponse.json();
          setColorTheory(colorData);
          console.log('🎨 Hesse: Loaded color theory from extracted JSON', colorData);
        } else {
          console.warn('⚠️ Hesse: Failed to load color theory, using defaults');
        }

        // Fetch font theory
        const fontResponse = await fetch('/extracted/font_theory.json');
        if (fontResponse.ok) {
          const fontData = await fontResponse.json();
          setFontTheory(fontData);
          console.log('🎨 Hesse: Loaded font theory from extracted JSON', fontData);
        } else {
          console.warn('⚠️ Hesse: Failed to load font theory, using defaults');
        }
      } catch (error) {
        console.error('❌ Hesse: Error loading styles', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStyles();
  }, []);

  // Apply the styles to the document root
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;

    // Apply color variables with both pdf- prefix and direct variables for compatibility
    // PDF-prefixed variables (for components that use these)
    root.style.setProperty('--pdf-primary-color', colorTheory.primary);
    root.style.setProperty('--pdf-secondary-color', colorTheory.secondary);
    root.style.setProperty('--pdf-accent-color', colorTheory.accent);
    root.style.setProperty('--pdf-background-color', colorTheory.background);
    root.style.setProperty('--pdf-text-color', colorTheory.text);
    root.style.setProperty('--pdf-text-secondary', colorTheory.textSecondary);
    root.style.setProperty('--pdf-border-color', colorTheory.border);
    root.style.setProperty('--pdf-success-color', colorTheory.success);
    root.style.setProperty('--pdf-warning-color', colorTheory.warning);
    root.style.setProperty('--pdf-error-color', colorTheory.error);
    root.style.setProperty('--pdf-info-color', colorTheory.info);

    // Direct variables (for components that use these)
    root.style.setProperty('--primary', colorTheory.primary);
    root.style.setProperty('--secondary', colorTheory.secondary);
    root.style.setProperty('--accent', colorTheory.accent);
    root.style.setProperty('--background', colorTheory.background);
    root.style.setProperty('--text-color', colorTheory.text);
    root.style.setProperty('--text-secondary', colorTheory.textSecondary);
    root.style.setProperty('--border-color', colorTheory.border);
    root.style.setProperty('--success', colorTheory.success);
    root.style.setProperty('--warning', colorTheory.warning);
    root.style.setProperty('--error', colorTheory.error);
    root.style.setProperty('--info', colorTheory.info);

    // Dynamic variables (for DynamicThemeProvider compatibility)
    root.style.setProperty('--dynamic-primary', colorTheory.primary);
    root.style.setProperty('--dynamic-secondary', colorTheory.secondary);
    root.style.setProperty('--dynamic-accent', colorTheory.accent);
    root.style.setProperty('--dynamic-background', colorTheory.background);
    root.style.setProperty('--dynamic-text', colorTheory.text);
    root.style.setProperty('--dynamic-border', colorTheory.border);

    // Add RGB versions of colors for rgba() usage
    const primaryRGB = hexToRGB(colorTheory.primary);
    const secondaryRGB = hexToRGB(colorTheory.secondary);
    const accentRGB = hexToRGB(colorTheory.accent);
    const textRGB = hexToRGB(colorTheory.text);
    const borderRGB = hexToRGB(colorTheory.border);

    root.style.setProperty('--pdf-primary-color-rgb', primaryRGB);
    root.style.setProperty('--pdf-secondary-color-rgb', secondaryRGB);
    root.style.setProperty('--pdf-accent-color-rgb', accentRGB);
    root.style.setProperty('--pdf-text-color-rgb', textRGB);
    root.style.setProperty('--pdf-border-color-rgb', borderRGB);

    // Add RGB versions for CTA variables
    root.style.setProperty('--cta-primary-rgb', primaryRGB);
    root.style.setProperty('--cta-secondary-rgb', secondaryRGB);
    root.style.setProperty('--cta-tertiary-rgb', accentRGB);

    // Apply font variables with multiple naming conventions for compatibility
    // PDF-prefixed variables (for components that use these)
    root.style.setProperty('--pdf-heading-font', fontTheory.heading);
    root.style.setProperty('--pdf-body-font', fontTheory.body);
    root.style.setProperty('--pdf-mono-font', fontTheory.mono);
    root.style.setProperty('--pdf-title-font', fontTheory.title);
    root.style.setProperty('--pdf-subtitle-font', fontTheory.subtitle);
    root.style.setProperty('--pdf-button-font', fontTheory.button);
    root.style.setProperty('--pdf-nav-font', fontTheory.nav);
    root.style.setProperty('--pdf-code-font', fontTheory.code);

    // Direct font variables (for components that use these)
    root.style.setProperty('--font-heading', fontTheory.heading);
    root.style.setProperty('--font-body', fontTheory.body);
    root.style.setProperty('--font-mono', fontTheory.mono);
    root.style.setProperty('--font-title', fontTheory.title);
    root.style.setProperty('--font-subtitle', fontTheory.subtitle);
    root.style.setProperty('--font-button', fontTheory.button);
    root.style.setProperty('--font-nav', fontTheory.nav);
    root.style.setProperty('--font-code', fontTheory.code);

    // Dynamic font variables (for DynamicThemeProvider compatibility)
    root.style.setProperty('--dynamic-primary-font', fontTheory.body);
    root.style.setProperty('--dynamic-secondary-font', fontTheory.mono);
    root.style.setProperty('--dynamic-heading-font', fontTheory.heading);
    root.style.setProperty('--dynamic-mono-font', fontTheory.mono);

    // Ensure we have the most important variables set for all components
    root.style.setProperty('--font-sans', fontTheory.body);
    root.style.setProperty('--font-serif', fontTheory.body);

    console.log('🎨 Hesse: Applied font variables with multiple naming conventions for compatibility');

    // Apply derived variables for UI components
    root.style.setProperty('--pdf-button-bg', colorTheory.primary);
    root.style.setProperty('--pdf-button-text', '#ffffff');
    root.style.setProperty('--pdf-button-hover-bg', colorTheory.secondary);
    root.style.setProperty('--pdf-input-border', colorTheory.border);
    root.style.setProperty('--pdf-input-focus-border', colorTheory.primary);
    root.style.setProperty('--pdf-card-bg', '#ffffff');
    root.style.setProperty('--pdf-card-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--pdf-modal-bg', '#ffffff');
    root.style.setProperty('--pdf-modal-overlay', 'rgba(0, 0, 0, 0.5)');
    root.style.setProperty('--pdf-nav-bg', colorTheory.primary);
    root.style.setProperty('--pdf-nav-text', '#ffffff');
    root.style.setProperty('--pdf-footer-bg', colorTheory.secondary);
    root.style.setProperty('--pdf-footer-text', '#ffffff');

    // Apply Salinger Header specific variables - aligned with general UI variables
    // Using the same variables as the rest of the UI for consistency (Derrida approach)
    root.style.setProperty('--salinger-header-bg', 'var(--bg-primary)');
    root.style.setProperty('--salinger-header-text', 'var(--text-color)');
    root.style.setProperty('--salinger-header-border', 'var(--border-color)');
    root.style.setProperty('--salinger-header-link', colorTheory.primary);
    root.style.setProperty('--salinger-header-link-hover', colorTheory.secondary);
    root.style.setProperty('--salinger-header-accent', colorTheory.accent);

    // Add dropdown-specific variables for consistent styling across components
    root.style.setProperty('--dropdown-bg', 'var(--bg-primary)');
    root.style.setProperty('--dropdown-text', 'var(--text-color)');
    root.style.setProperty('--dropdown-border', 'var(--border-color)');
    // Dropdown hover background is now set in the CTA section

    // Apply CTA button variables - Using a more harmonious approach (Hesse philosophy)
    // Instead of using the extracted colors directly, we'll use a more muted, consistent palette
    // based on the text color for better visual harmony
    const muted = adjustColorBrightness(colorTheory.text, 20); // Base for all CTAs
    root.style.setProperty('--cta-primary', muted);
    root.style.setProperty('--cta-secondary', muted);
    root.style.setProperty('--cta-tertiary', muted);
    root.style.setProperty('--cta-primary-hover', adjustColorBrightness(muted, -15));
    root.style.setProperty('--cta-secondary-hover', adjustColorBrightness(muted, -15));
    root.style.setProperty('--cta-tertiary-hover', adjustColorBrightness(muted, -15));

    // Apply state variables
    root.style.setProperty('--state-success', colorTheory.success);
    root.style.setProperty('--state-warning', colorTheory.warning);
    root.style.setProperty('--state-error', colorTheory.error);
    root.style.setProperty('--state-info', colorTheory.info);
    root.style.setProperty('--state-success-light', adjustColorBrightness(colorTheory.success, 40));
    root.style.setProperty('--state-warning-light', adjustColorBrightness(colorTheory.warning, 40));
    root.style.setProperty('--state-error-light', adjustColorBrightness(colorTheory.error, 40));
    root.style.setProperty('--state-info-light', adjustColorBrightness(colorTheory.info, 40));

    // Apply general UI variables with Derrida's deconstruction approach
    // Background colors - ensure all naming conventions are covered
    root.style.setProperty('--bg-primary', colorTheory.background);
    root.style.setProperty('--bg-secondary', adjustColorBrightness(colorTheory.background, -5));
    root.style.setProperty('--bg-tertiary', adjustColorBrightness(colorTheory.background, -10));

    // Additional background variables for compatibility
    root.style.setProperty('--background-primary', colorTheory.background);
    root.style.setProperty('--background-secondary', adjustColorBrightness(colorTheory.background, -5));
    root.style.setProperty('--background-tertiary', adjustColorBrightness(colorTheory.background, -10));

    // Text colors - ensure all naming conventions are covered
    root.style.setProperty('--text-color', colorTheory.text);
    root.style.setProperty('--text-secondary', colorTheory.textSecondary);
    root.style.setProperty('--text-tertiary', adjustColorBrightness(colorTheory.textSecondary, 20));

    // Additional text variables for compatibility
    root.style.setProperty('--text-primary', colorTheory.text);

    // Border colors - ensure all naming conventions are covered
    root.style.setProperty('--border-color', colorTheory.border);
    root.style.setProperty('--border-light', adjustColorBrightness(colorTheory.border, 15));
    root.style.setProperty('--border-dark', adjustColorBrightness(colorTheory.border, -15));

    console.log('🎨 Hesse: Applied background, text, and border variables with multiple naming conventions');

    // Interaction colors - Moved to CTA section for consistency

    // CTA background colors with consistent opacity - Using text color for all CTAs
    // This ensures visual harmony across all components (Salinger philosophy)
    const textRGBValues = hexToRGB(colorTheory.text);
    root.style.setProperty('--cta-primary-bg', `rgba(${textRGBValues}, 0.1)`);
    root.style.setProperty('--cta-secondary-bg', `rgba(${textRGBValues}, 0.1)`);
    root.style.setProperty('--cta-tertiary-bg', `rgba(${textRGBValues}, 0.1)`);

    // Set consistent hover background for all CTAs
    root.style.setProperty('--hover-bg', `rgba(${textRGBValues}, 0.15)`);
    root.style.setProperty('--active-bg', `rgba(${textRGBValues}, 0.2)`);
    root.style.setProperty('--focus-ring', `rgba(${textRGBValues}, 0.3)`);

    // Set consistent dropdown hover background
    root.style.setProperty('--dropdown-hover-bg', `rgba(${textRGBValues}, 0.15)`);

    // Code and syntax highlighting
    root.style.setProperty('--code-bg', `rgba(${textRGB}, 0.05)`);
    root.style.setProperty('--code-text', colorTheory.text);

    // Calculate contrast colors for accessibility
    const isDarkPrimary = isColorDark(colorTheory.primary);
    const isDarkSecondary = isColorDark(colorTheory.secondary);
    const isDarkAccent = isColorDark(colorTheory.accent);

    root.style.setProperty('--pdf-primary-contrast', isDarkPrimary ? '#ffffff' : '#000000');
    root.style.setProperty('--pdf-secondary-contrast', isDarkSecondary ? '#ffffff' : '#000000');
    root.style.setProperty('--pdf-accent-contrast', isDarkAccent ? '#ffffff' : '#000000');

    console.log('🎨 Hesse: Applied global styles from PDF');

    // Add a class to the body to indicate that styles are loaded
    document.body.classList.add('pdf-styles-loaded');

    // Trigger a custom event for components that need to know when styles are loaded
    const event = new CustomEvent('pdf-styles-loaded', { detail: { colorTheory, fontTheory } });
    document.dispatchEvent(event);

  }, [colorTheory, fontTheory, isLoading]);

  // Function to determine if a color is dark (for contrast)
  function isColorDark(hexColor: string): boolean {
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
  }

  // Function to adjust color brightness
  function adjustColorBrightness(hexColor: string, percent: number): string {
    // Remove the hash if it exists
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    let r = parseInt(hexColor.substr(0, 2), 16);
    let g = parseInt(hexColor.substr(2, 2), 16);
    let b = parseInt(hexColor.substr(4, 2), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + Math.round(r * percent / 100)));
    g = Math.max(0, Math.min(255, g + Math.round(g * percent / 100)));
    b = Math.max(0, Math.min(255, b + Math.round(b * percent / 100)));

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Function to convert hex color to RGB string
  function hexToRGB(hexColor: string): string {
    // Remove the hash if it exists
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Return as comma-separated string for CSS variables
    return `${r}, ${g}, ${b}`;
  }

  return (
    <div
      className="pdf-styles-provider pdf-styles-loaded"
      style={{
        backgroundColor: 'var(--bg-primary, #ffffff)',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
}

export default GlobalStylesProvider;
