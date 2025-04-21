'use client';

import { useState, useEffect } from 'react';

interface FontMapping {
  [key: string]: string;
}

// Common PDF font to web font mappings - used for reference
// These mappings could be used in a more advanced implementation
/*
const PDF_FONT_MAPPINGS: FontMapping = {
  'Arial': 'Inter, Arial, sans-serif',
  'Helvetica': 'Inter, Helvetica, sans-serif',
  'Times': 'Merriweather, "Times New Roman", serif',
  'Times-Roman': 'Merriweather, "Times New Roman", serif',
  'Calibri': 'Source Sans 3, Calibri, sans-serif',
  'Segoe': 'Source Sans 3, "Segoe UI", sans-serif',
  'Georgia': 'Merriweather, Georgia, serif',
  'Courier': 'monospace',
  'Verdana': 'Inter, Verdana, sans-serif',
  'Tahoma': 'Inter, Tahoma, sans-serif',
};
*/

export interface PdfFonts {
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  monoFont: string;
  isLoading: boolean;
}

export default function usePdfFonts(pdfUrl: string): PdfFonts {
  const [fonts, setFonts] = useState<PdfFonts>({
    primaryFont: 'var(--font-source-sans)',
    secondaryFont: 'var(--font-merriweather)',
    headingFont: 'var(--font-roboto)',
    monoFont: 'var(--font-geist-mono)',
    isLoading: true,
  });

  useEffect(() => {
    // In a real implementation, this would use PDF.js to extract fonts
    // For now, we'll simulate font detection based on the PDF URL
    const detectFonts = async () => {
      try {
        // Simulate API call to analyze PDF
        await new Promise(resolve => setTimeout(resolve, 500));

        // For demo purposes, we'll use different fonts based on the PDF filename
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
        } else if (filename.includes('presentation')) {
          // Presentations often use modern sans-serif fonts
          primaryFont = 'var(--font-inter)';
          headingFont = 'var(--font-inter)';
        }

        setFonts({
          primaryFont,
          secondaryFont,
          headingFont,
          monoFont: 'var(--font-geist-mono)',
          isLoading: false,
        });
      } catch (error) {
        console.error('Error detecting fonts:', error);
        setFonts(prev => ({ ...prev, isLoading: false }));
      }
    };

    detectFonts();
  }, [pdfUrl]);

  return fonts;
}
