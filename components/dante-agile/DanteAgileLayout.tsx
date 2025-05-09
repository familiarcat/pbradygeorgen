'use client';

import React, { ReactNode } from 'react';

interface DanteAgileLayoutProps {
  children: ReactNode;
}

/**
 * Simplified DanteAgileLayout component for AWS Amplify build
 */
export default function DanteAgileLayout({ children }: DanteAgileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold">Dante Agile Framework</h1>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-white p-4 text-center">
        <p>Dante Agile Framework - Inspired by Dante's Divine Comedy</p>
      </footer>
    </div>
  );
}