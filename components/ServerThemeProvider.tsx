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
      document.documentElement.style.setProperty('--dynamic-primary', colors.primary || '#3a6ea5');
      document.documentElement.style.setProperty('--dynamic-secondary', colors.secondary || '#004e98');
      document.documentElement.style.setProperty('--dynamic-accent', colors.accent || '#ff6700');
      document.documentElement.style.setProperty('--dynamic-background', colors.background || '#f6f6f6');
      document.documentElement.style.setProperty('--dynamic-text', colors.text || '#333333');
      document.documentElement.style.setProperty('--dynamic-border', colors.border || '#c0c0c0');

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

      // Apply the fonts
      if (serifFont) {
        document.documentElement.style.setProperty('--dynamic-secondary-font', `"${(serifFont as any).name}", serif`);
      }

      if (sansFont) {
        document.documentElement.style.setProperty('--dynamic-primary-font', `"${(sansFont as any).name}", sans-serif`);
      }

      if (monoFont) {
        document.documentElement.style.setProperty('--dynamic-mono-font', `"${(monoFont as any).name}", monospace`);
      }

      // Use the serif font for headings if available, otherwise use the sans font
      document.documentElement.style.setProperty(
        '--dynamic-heading-font',
        serifFont ? `"${(serifFont as any).name}", serif` : (sansFont ? `"${(sansFont as any).name}", sans-serif` : 'var(--font-roboto)')
      );
    }

    // Set loading state
    document.body.classList.add('theme-loaded');
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
