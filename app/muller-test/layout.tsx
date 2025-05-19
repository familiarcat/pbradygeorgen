'use client';

import React, { useEffect } from 'react';

export default function MullerTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force scrolling to work
  useEffect(() => {
    // This code only runs in the browser
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      // Clean up when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="muller-test-layout" style={{ overflow: 'auto', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
