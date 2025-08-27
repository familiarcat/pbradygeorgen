'use client';

import React from 'react';

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-wrapper">
      {children}
      <style jsx global>{`
        .content-wrapper {
          min-height: calc(100vh - 60px);
          padding-bottom: 2rem;
        }
        
        /* Add animation for PDF styles loading */
        .pdf-styles-loaded * {
          transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
}
