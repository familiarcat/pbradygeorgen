'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

// Define the theme context type
interface ServerThemeContextType {
  name: string;
  colorTheme: any;
  fontInfo: any;
  isLoading: boolean;
  lastUpdated: number;
  refreshTheme: () => Promise<void>;
}

// Create the context with default values
const ServerThemeContext = createContext<ServerThemeContextType>({
  name: '',
  colorTheme: {},
  fontInfo: {},
  isLoading: true,
  lastUpdated: 0,
  refreshTheme: async () => {}
});

// Hook to use the theme context
export const useServerTheme = () => useContext(ServerThemeContext);

interface ServerThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: {
    name: string;
    colorTheme: any;
    fontInfo: any;
    timestamp: number;
  };
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string) {
  if (!hex) return null;

  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

export default function ServerThemeProvider({
  children,
  initialTheme
}: ServerThemeProviderProps) {
  // State for theme data
  const [name, setName] = useState(initialTheme?.name || '');
  const [colorTheme, setColorTheme] = useState(initialTheme?.colorTheme || {});
  const [fontInfo, setFontInfo] = useState(initialTheme?.fontInfo || {});
  const [isLoading, setIsLoading] = useState(!initialTheme);
  const [lastUpdated, setLastUpdated] = useState(initialTheme?.timestamp || 0);

  // Function to refresh the theme
  const refreshTheme = async () => {
    try {
      setIsLoading(true);
      HesseLogger.summary.start('Refreshing theme from server');

      // Fetch the theme from the API with cache busting
      const response = await fetch(`/api/extract-pdf-style?refresh=true&_=${Date.now()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch theme: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      // Update the state
      setName(data.name || '');
      setColorTheme(data.colorTheme || {});
      setFontInfo(data.fontInfo || {});
      setLastUpdated(data.timestamp || Date.now());

      // Apply the theme
      applyTheme(data.colorTheme, data.fontInfo);

      HesseLogger.summary.complete('Theme refreshed successfully');
    } catch (error) {
      DanteLogger.error.runtime(`Failed to refresh theme: ${error}`);
      console.error('Failed to refresh theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply the theme to the document
  const applyTheme = (colors: any, fonts: any) => {
    if (typeof document === 'undefined') return;

    // Apply colors
    if (colors) {
      // Apply to our new theme variables
      document.documentElement.style.setProperty('--pdf-primary-color', colors.primary || '#3a6ea5');
      document.documentElement.style.setProperty('--pdf-secondary-color', colors.secondary || '#004e98');
      document.documentElement.style.setProperty('--pdf-accent-color', colors.accent || '#ff6700');
      document.documentElement.style.setProperty('--pdf-background-color', colors.background || '#f6f6f6');
      document.documentElement.style.setProperty('--pdf-text-color', colors.text || '#333333');
      document.documentElement.style.setProperty('--pdf-border-color', colors.border || '#c0c0c0');

      // Also set legacy variables for backward compatibility
      document.documentElement.style.setProperty('--dynamic-primary', colors.primary || '#3a6ea5');
      document.documentElement.style.setProperty('--dynamic-secondary', colors.secondary || '#004e98');
      document.documentElement.style.setProperty('--dynamic-accent', colors.accent || '#ff6700');
      document.documentElement.style.setProperty('--dynamic-background', colors.background || '#f6f6f6');
      document.documentElement.style.setProperty('--dynamic-text', colors.text || '#333333');
      document.documentElement.style.setProperty('--dynamic-border', colors.border || '#c0c0c0');

      // Generate derived colors using Hesse method
      const primaryRgb = hexToRgb(colors.primary);
      if (primaryRgb) {
        document.documentElement.style.setProperty('--pdf-primary-light', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)`);
        document.documentElement.style.setProperty('--pdf-primary-dark', `rgb(${Math.max(0, primaryRgb.r - 51)}, ${Math.max(0, primaryRgb.g - 51)}, ${Math.max(0, primaryRgb.b - 51)})`);
      }

      const secondaryRgb = hexToRgb(colors.secondary);
      if (secondaryRgb) {
        document.documentElement.style.setProperty('--pdf-secondary-light', `rgb(${Math.min(255, secondaryRgb.r + 51)}, ${Math.min(255, secondaryRgb.g + 51)}, ${Math.min(255, secondaryRgb.b + 51)})`);
        document.documentElement.style.setProperty('--pdf-secondary-dark', `rgb(${Math.max(0, secondaryRgb.r - 51)}, ${Math.max(0, secondaryRgb.g - 51)}, ${Math.max(0, secondaryRgb.b - 51)})`);
      }

      // Apply CTA colors if available
      if (colors.ctaColors) {
        // Primary CTA
        document.documentElement.style.setProperty('--cta-primary', colors.ctaColors.primary.base);
        document.documentElement.style.setProperty('--cta-primary-hover', colors.ctaColors.primary.hover);
        document.documentElement.style.setProperty('--cta-primary-active', colors.ctaColors.primary.active);
        document.documentElement.style.setProperty('--cta-primary-bg', `color-mix(in srgb, ${colors.ctaColors.primary.base} 10%, ${colors.background} 90%)`);

        // Secondary CTA
        document.documentElement.style.setProperty('--cta-secondary', colors.ctaColors.secondary.base);
        document.documentElement.style.setProperty('--cta-secondary-hover', colors.ctaColors.secondary.hover);
        document.documentElement.style.setProperty('--cta-secondary-active', colors.ctaColors.secondary.active);
        document.documentElement.style.setProperty('--cta-secondary-bg', `color-mix(in srgb, ${colors.ctaColors.secondary.base} 10%, ${colors.background} 90%)`);

        // Accent CTA
        document.documentElement.style.setProperty('--cta-accent', colors.ctaColors.accent.base);
        document.documentElement.style.setProperty('--cta-accent-hover', colors.ctaColors.accent.hover);
        document.documentElement.style.setProperty('--cta-accent-active', colors.ctaColors.accent.active);
        document.documentElement.style.setProperty('--cta-accent-bg', `color-mix(in srgb, ${colors.ctaColors.accent.base} 10%, ${colors.background} 90%)`);
      }

      // Set theme mode
      if (colors.isDark) {
        document.documentElement.classList.add('pdf-dark-theme');
        document.documentElement.classList.remove('pdf-light-theme');
      } else {
        document.documentElement.classList.add('pdf-light-theme');
        document.documentElement.classList.remove('pdf-dark-theme');
      }
    }

    // Apply fonts
    if (fonts && Object.keys(fonts).length > 0) {
      // Find the first serif, sans-serif, and monospace fonts
      const serifFont = Object.values(fonts).find((font: any) => font.isSerifFont);
      const sansFont = Object.values(fonts).find((font: any) => !font.isSerifFont && !font.isMonospace);
      const monoFont = Object.values(fonts).find((font: any) => font.isMonospace);

      // Apply the fonts to our new theme variables
      if (serifFont) {
        document.documentElement.style.setProperty('--pdf-secondary-font', `"${(serifFont as any).name}", var(--font-merriweather), serif`);
      } else {
        document.documentElement.style.setProperty('--pdf-secondary-font', `var(--font-merriweather), serif`);
      }

      if (sansFont) {
        document.documentElement.style.setProperty('--pdf-primary-font', `"${(sansFont as any).name}", var(--font-source-sans), sans-serif`);
      } else {
        document.documentElement.style.setProperty('--pdf-primary-font', `var(--font-source-sans), sans-serif`);
      }

      if (monoFont) {
        document.documentElement.style.setProperty('--pdf-mono-font', `"${(monoFont as any).name}", var(--font-geist-mono), monospace`);
      } else {
        document.documentElement.style.setProperty('--pdf-mono-font', `var(--font-geist-mono), monospace`);
      }

      // Use the serif font for headings if available, otherwise use the sans font
      document.documentElement.style.setProperty(
        '--pdf-heading-font',
        serifFont ? `"${(serifFont as any).name}", var(--font-roboto), serif` : (sansFont ? `"${(sansFont as any).name}", var(--font-roboto), sans-serif` : 'var(--font-roboto)')
      );

      // Also set legacy variables for backward compatibility
      if (serifFont) {
        document.documentElement.style.setProperty('--dynamic-secondary-font', `"${(serifFont as any).name}", serif`);
      }

      if (sansFont) {
        document.documentElement.style.setProperty('--dynamic-primary-font', `"${(sansFont as any).name}", sans-serif`);
      }

      if (monoFont) {
        document.documentElement.style.setProperty('--dynamic-mono-font', `"${(monoFont as any).name}", monospace`);
      }

      document.documentElement.style.setProperty(
        '--dynamic-heading-font',
        serifFont ? `"${(serifFont as any).name}", serif` : (sansFont ? `"${(sansFont as any).name}", sans-serif` : 'var(--font-roboto)')
      );
    }

    // Set loading state
    document.body.classList.add('theme-loaded');
    document.body.classList.add('theme-transition-container');
  };

  // Apply the theme on initial load
  useEffect(() => {
    if (initialTheme) {
      applyTheme(initialTheme.colorTheme, initialTheme.fontInfo);
    } else {
      refreshTheme();
    }
  }, []);

  // Provide the theme context
  const themeContext: ServerThemeContextType = {
    name,
    colorTheme,
    fontInfo,
    isLoading,
    lastUpdated,
    refreshTheme
  };

  return (
    <ServerThemeContext.Provider value={themeContext}>
      <div className="theme-transition-container">
        {children}
      </div>
    </ServerThemeContext.Provider>
  );
}
