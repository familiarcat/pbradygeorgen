'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * PdfStyleLoader component
 * 
 * This component dynamically loads the PDF fonts CSS file and ensures that
 * the styles are properly applied to all components in the application.
 * 
 * It also provides a debugging interface to check if the styles are loaded.
 */
const PdfStyleLoader: React.FC = () => {
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdfStyles = async () => {
      try {
        // Check if the PDF fonts CSS file exists
        const response = await fetch('/extracted/pdf_fonts.css');
        
        if (!response.ok) {
          throw new Error(`Failed to load PDF fonts CSS: ${response.status} ${response.statusText}`);
        }
        
        // Get the CSS content
        const cssContent = await response.text();
        
        // Create a style element
        const styleElement = document.createElement('style');
        styleElement.id = 'pdf-fonts-css';
        styleElement.textContent = cssContent;
        
        // Remove any existing style element with the same ID
        const existingStyle = document.getElementById('pdf-fonts-css');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        // Add the style element to the head
        document.head.appendChild(styleElement);
        
        // Set the styles loaded flag
        setStylesLoaded(true);
        
        // Add a class to the body to indicate that styles are loaded
        document.body.classList.add('pdf-fonts-loaded');
        
        // Log success
        DanteLogger.success.basic('PDF fonts CSS loaded successfully');
        console.log('PDF fonts CSS loaded successfully');
      } catch (err) {
        // Set the error state
        setError(err instanceof Error ? err.message : String(err));
        
        // Log error
        DanteLogger.error.dataFlow(`Failed to load PDF fonts CSS: ${err}`);
        console.error('Failed to load PDF fonts CSS:', err);
      }
    };
    
    // Load the PDF styles
    loadPdfStyles();
    
    // Cleanup function
    return () => {
      // Remove the style element when the component unmounts
      const styleElement = document.getElementById('pdf-fonts-css');
      if (styleElement) {
        styleElement.remove();
      }
      
      // Remove the class from the body
      document.body.classList.remove('pdf-fonts-loaded');
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default PdfStyleLoader;
