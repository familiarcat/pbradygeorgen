'use client';

import { useState, useEffect } from 'react';
import { extractColorsFromPDF, ColorTheme, defaultColorTheme } from '@/utils/SimplePDFColorExtractor';

export default function usePdfTheme(pdfUrl: string): ColorTheme {
  const [colorTheme, setColorTheme] = useState<ColorTheme>({
    ...defaultColorTheme,
    isLoading: true
  });

  useEffect(() => {
    if (!pdfUrl) return;

    const extractColors = async () => {
      try {
        // Extract colors from the PDF
        const extractedTheme = await extractColorsFromPDF(pdfUrl);
        setColorTheme(extractedTheme);
      } catch (error) {
        console.error('Error in usePdfTheme:', error);
        setColorTheme({ ...defaultColorTheme, isLoading: false });
      }
    };

    extractColors();
  }, [pdfUrl]);

  return colorTheme;
}
