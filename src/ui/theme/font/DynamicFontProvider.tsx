'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Inter, Roboto, Merriweather, Source_Sans_3 } from 'next/font/google';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Define fallback fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

const sourceSans = Source_Sans_3({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

// Define font context
interface FontContextType {
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  monoFont: string;
  isLoading: boolean;
}

const defaultFontContext: FontContextType = {
  primaryFont: 'var(--font-source-sans)',
  secondaryFont: 'var(--font-merriweather)',
  headingFont: 'var(--font-roboto)',
  monoFont: 'var(--font-geist-mono)',
  isLoading: false,
};

const FontContext = createContext<FontContextType>(defaultFontContext);

export const useFonts = () => useContext(FontContext);

interface DynamicFontProviderProps {
  children: React.ReactNode;
  pdfUrl?: string;
}

export default function DynamicFontProvider({ children, pdfUrl }: DynamicFontProviderProps) {
  const [fonts, setFonts] = useState<FontContextType>(defaultFontContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pdfUrl) return;

    const extractFontsFromPdf = async () => {
      setIsLoading(true);
      try {
        // Load the PDF document
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Get the page's font information
        const operatorList = await page.getOperatorList();
        const commonFonts = new Set<string>();
        
        // Extract font names from the operator list
        for (let i = 0; i < operatorList.fnArray.length; i++) {
          if (operatorList.fnArray[i] === pdfjs.OPS.setFont) {
            const fontName = operatorList.argsArray[i][0];
            if (fontName) {
              commonFonts.add(fontName);
            }
          }
        }
        
        // Process extracted fonts
        const fontArray = Array.from(commonFonts);
        console.log('Extracted fonts:', fontArray);
        
        // Map PDF fonts to web fonts
        // This is a simplified mapping - in a real implementation, 
        // you would have a more comprehensive mapping system
        let primaryFont = 'var(--font-source-sans)';
        let secondaryFont = 'var(--font-merriweather)';
        let headingFont = 'var(--font-roboto)';
        
        // Check for common font families
        const fontString = fontArray.join(' ').toLowerCase();
        
        if (fontString.includes('arial') || fontString.includes('helvetica')) {
          primaryFont = 'var(--font-inter)';
          headingFont = 'var(--font-inter)';
        } else if (fontString.includes('times') || fontString.includes('serif')) {
          primaryFont = 'var(--font-merriweather)';
          secondaryFont = 'var(--font-source-sans)';
        } else if (fontString.includes('calibri') || fontString.includes('segoe')) {
          primaryFont = 'var(--font-source-sans)';
        }
        
        // Update the font context
        setFonts({
          primaryFont,
          secondaryFont,
          headingFont,
          monoFont: 'var(--font-geist-mono)',
          isLoading: false,
        });
        
      } catch (error) {
        console.error('Error extracting fonts:', error);
        // Fall back to default fonts
        setFonts(defaultFontContext);
      } finally {
        setIsLoading(false);
      }
    };

    extractFontsFromPdf();
  }, [pdfUrl]);

  // Apply the fonts to CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--dynamic-primary-font', fonts.primaryFont);
      document.documentElement.style.setProperty('--dynamic-secondary-font', fonts.secondaryFont);
      document.documentElement.style.setProperty('--dynamic-heading-font', fonts.headingFont);
      document.documentElement.style.setProperty('--dynamic-mono-font', fonts.monoFont);
    }
  }, [fonts]);

  return (
    <FontContext.Provider value={{ ...fonts, isLoading }}>
      <style jsx global>{`
        :root {
          --font-sans: var(--dynamic-primary-font), ${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          --font-serif: var(--dynamic-secondary-font), ${merriweather.style.fontFamily}, Georgia, Cambria, Times New Roman, Times, serif;
          --font-heading: var(--dynamic-heading-font), ${roboto.style.fontFamily}, var(--font-sans);
          --font-mono: var(--dynamic-mono-font), SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
        }
      `}</style>
      <div className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${sourceSans.variable}`}>
        {children}
      </div>
    </FontContext.Provider>
  );
}
