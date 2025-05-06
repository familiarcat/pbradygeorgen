'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { extractColorsFromPDF, ColorTheme, defaultColorTheme } from '@/utils/SimplePDFColorExtractor';
import { PdfFonts } from '@/hooks/usePdfFonts';
import { DanteLogger } from '@/utils/DanteLogger';

// Define the theme context type
interface PdfThemeContextType {
  colors: ColorTheme;
  fonts: PdfFonts;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

// Create the theme context with default values
const PdfThemeContext = createContext<PdfThemeContextType>({
  colors: defaultColorTheme,
  fonts: {
    primaryFont: 'var(--font-source-sans)',
    secondaryFont: 'var(--font-merriweather)',
    headingFont: 'var(--font-roboto)',
    monoFont: 'var(--font-geist-mono)',
    isLoading: true,
  },
  isDarkMode: false,
  toggleDarkMode: () => {},
  isLoading: true,
});

// Hook to use the PDF theme
export const usePdfTheme = () => useContext(PdfThemeContext);

interface PdfThemeProviderProps {
  children: React.ReactNode;
  pdfUrl: string;
}

export default function PdfThemeProvider({ children, pdfUrl }: PdfThemeProviderProps) {
  // State for theme data
  const [colors, setColors] = useState<ColorTheme>(defaultColorTheme);
  const [fonts, setFonts] = useState<PdfFonts>({
    primaryFont: 'var(--font-source-sans)',
    secondaryFont: 'var(--font-merriweather)',
    headingFont: 'var(--font-roboto)',
    monoFont: 'var(--font-geist-mono)',
    isLoading: true,
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Extract colors and fonts from PDF
  useEffect(() => {
    const extractTheme = async () => {
      try {
        setIsLoading(true);
        console.log(`Extracting theme from PDF: ${pdfUrl}`);

        // Extract colors from PDF
        const extractedColors = await extractColorsFromPDF(pdfUrl);
        setColors(extractedColors);

        // Simulate font extraction (in a real app, this would use PDF.js)
        // For now, we'll use default fonts based on the PDF URL
        const filename = pdfUrl.split('/').pop()?.toLowerCase() || '';

        let primaryFont = 'var(--font-source-sans)';
        let secondaryFont = 'var(--font-merriweather)';
        let headingFont = 'var(--font-roboto)';

        if (filename.includes('resume')) {
          // Resume-like documents often use clean sans-serif fonts
          primaryFont = 'var(--font-source-sans)';
          headingFont = 'var(--font-roboto)';
        } else if (filename.includes('report') || filename.includes('paper')) {
          // Academic papers often use serif fonts
          primaryFont = 'var(--font-merriweather)';
          secondaryFont = 'var(--font-source-sans)';
        }

        setFonts({
          primaryFont,
          secondaryFont,
          headingFont,
          monoFont: 'var(--font-geist-mono)',
          isLoading: false,
        });

        console.log('Theme extraction complete');
        setIsLoading(false);
      } catch (error) {
        DanteLogger.error.runtime(`Failed to extract theme: ${error}`);
        setIsLoading(false);
      }
    };

    extractTheme();
  }, [pdfUrl]);

  // Apply theme to CSS variables
  useEffect(() => {
    if (isLoading) return;

    // Get the document root element
    const root = document.documentElement;

    // Add theme transition class
    document.body.classList.add('theme-transition-container');

    // Apply dark mode class if needed
    if (isDarkMode) {
      document.body.classList.add('pdf-dark-theme');
    } else {
      document.body.classList.remove('pdf-dark-theme');
    }

    // Apply color variables
    root.style.setProperty('--pdf-primary-color', colors.primary);
    root.style.setProperty('--pdf-secondary-color', colors.secondary);
    root.style.setProperty('--pdf-accent-color', colors.accent);
    root.style.setProperty('--pdf-background-color', colors.background);
    root.style.setProperty('--pdf-text-color', colors.text);
    root.style.setProperty('--pdf-border-color', colors.border);

    // Apply derived color variables using Hesse method
    const primaryRgb = hexToRgb(colors.primary);
    if (primaryRgb) {
      root.style.setProperty('--pdf-primary-light', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)`);
      root.style.setProperty('--pdf-primary-dark', `rgb(${Math.max(0, primaryRgb.r - 51)}, ${Math.max(0, primaryRgb.g - 51)}, ${Math.max(0, primaryRgb.b - 51)})`);
    }

    const secondaryRgb = hexToRgb(colors.secondary);
    if (secondaryRgb) {
      root.style.setProperty('--pdf-secondary-light', `rgb(${Math.min(255, secondaryRgb.r + 51)}, ${Math.min(255, secondaryRgb.g + 51)}, ${Math.min(255, secondaryRgb.b + 51)})`);
      root.style.setProperty('--pdf-secondary-dark', `rgb(${Math.max(0, secondaryRgb.r - 51)}, ${Math.max(0, secondaryRgb.g - 51)}, ${Math.max(0, secondaryRgb.b - 51)})`);
    }

    // Apply font variables
    root.style.setProperty('--pdf-primary-font', fonts.primaryFont);
    root.style.setProperty('--pdf-secondary-font', fonts.secondaryFont);
    root.style.setProperty('--pdf-heading-font', fonts.headingFont);
    root.style.setProperty('--pdf-mono-font', fonts.monoFont);

    // Log theme application
    console.log('Applied PDF theme to CSS variables');

    // Clean up function
    return () => {
      document.body.classList.remove('theme-transition-container');
      document.body.classList.remove('pdf-dark-theme');
    };
  }, [colors, fonts, isDarkMode, isLoading]);

  return (
    <PdfThemeContext.Provider
      value={{
        colors,
        fonts,
        isDarkMode,
        toggleDarkMode,
        isLoading,
      }}
    >
      {children}
    </PdfThemeContext.Provider>
  );
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}
