'use client';

import { useEffect } from 'react';

export default function ScrollFix() {
  useEffect(() => {
    // Force the body to be scrollable
    document.body.style.overflow = 'auto';
    
    // Force the html element to be scrollable
    document.documentElement.style.overflow = 'auto';
    
    // Force the style-test container to be scrollable
    const styleTestContainer = document.querySelector('.style-test-container');
    if (styleTestContainer) {
      (styleTestContainer as HTMLElement).style.overflow = 'auto';
      (styleTestContainer as HTMLElement).style.height = 'auto';
      (styleTestContainer as HTMLElement).style.minHeight = '100vh';
    }
    
    return () => {
      // Clean up when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
  
  return null;
}
