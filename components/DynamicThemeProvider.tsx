'use client';

import React, { createContext, useContext, useEffect } from 'react';
import usePdfTheme from '@/hooks/usePdfTheme';
import usePdfFonts from '@/hooks/usePdfFonts';
import { ColorTheme, defaultColorTheme } from '@/utils/SimplePDFColorExtractor';

// Create context for theme
interface ThemeContextType {
  colorTheme: ColorTheme;
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  isLoading: boolean;
}

const defaultThemeContext: ThemeContextType = {
  colorTheme: defaultColorTheme,
  primaryFont: 'var(--font-source-sans)',
  secondaryFont: 'var(--font-merriweather)',
  headingFont: 'var(--font-roboto)',
  isLoading: false
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const usePdfThemeContext = () => useContext(ThemeContext);

interface DynamicThemeProviderProps {
  children: React.ReactNode;
  pdfUrl: string;
}

export default function DynamicThemeProvider({ children, pdfUrl }: DynamicThemeProviderProps) {
  // Extract colors and fonts from the PDF
  const colorTheme = usePdfTheme(pdfUrl);
  const { primaryFont, secondaryFont, headingFont, isLoading: fontsLoading } = usePdfFonts(pdfUrl);

  const isLoading = colorTheme.isLoading || fontsLoading;

  // Apply the theme to CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Apply colors
      document.documentElement.style.setProperty('--dynamic-primary', colorTheme.primary);
      document.documentElement.style.setProperty('--dynamic-secondary', colorTheme.secondary);
      document.documentElement.style.setProperty('--dynamic-accent', colorTheme.accent);
      document.documentElement.style.setProperty('--dynamic-background', colorTheme.background);
      document.documentElement.style.setProperty('--dynamic-text', colorTheme.text);
      document.documentElement.style.setProperty('--dynamic-border', colorTheme.border);

      // Apply fonts
      document.documentElement.style.setProperty('--dynamic-primary-font', primaryFont);
      document.documentElement.style.setProperty('--dynamic-secondary-font', secondaryFont);
      document.documentElement.style.setProperty('--dynamic-heading-font', headingFont);

      // Set theme mode
      if (colorTheme.isDark) {
        document.documentElement.classList.add('pdf-dark-theme');
        document.documentElement.classList.remove('pdf-light-theme');
      } else {
        document.documentElement.classList.add('pdf-light-theme');
        document.documentElement.classList.remove('pdf-dark-theme');
      }

      // Set loading state
      if (!isLoading) {
        document.body.classList.add('theme-loaded');
      } else {
        document.body.classList.remove('theme-loaded');
      }
    }
  }, [colorTheme, primaryFont, secondaryFont, headingFont, isLoading]);

  // Provide the theme context
  const themeContext: ThemeContextType = {
    colorTheme,
    primaryFont,
    secondaryFont,
    headingFont,
    isLoading
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      <div className="theme-transition-container">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
