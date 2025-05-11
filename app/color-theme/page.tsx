'use client';

import React from 'react';
import Link from 'next/link';
import ColorThemeEditor from '@/components/ColorThemeEditor';
import { useServerTheme } from '@/components/ServerThemeProvider';
import { useAdmin } from '@/contexts/AdminContext';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * Color Theme Page
 *
 * This page provides a comprehensive view of the color theme extracted from the PDF
 * and allows for adjustments to the color palette.
 *
 * Philosophical Framework:
 * - Hesse: Balancing color harmony with mathematical precision
 * - Derrida: Deconstructing the color theory to understand its components
 * - Salinger: Simplifying the interface for intuitive color adjustments
 * - Dante: Guiding the user through the color theory journey
 */
export default function ColorThemePage() {
  const { colorTheme, refreshTheme } = useServerTheme();
  const { isAdminMode, enableAdminMode } = useAdmin();

  // Enable admin mode by default for this page
  React.useEffect(() => {
    // Enable admin mode when the component mounts
    enableAdminMode();
    DanteLogger.info.system('🔑 Admin mode enabled for Color Theme Editor page');
  }, [enableAdminMode]);

  // Handle theme refresh
  const handleRefreshTheme = async () => {
    try {
      DanteLogger.info.system('🔄 Manually refreshing theme from Color Theme page');
      await refreshTheme();
      DanteLogger.success.ux('✅ Theme refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh theme:', error);
      DanteLogger.error.runtime(`❌ Error refreshing theme: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pdf-background-color)] text-[var(--pdf-text-color)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--pdf-modal-header,var(--header-bg))] p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--pdf-heading-font)' }}>
            Color Theme Editor
          </h1>

          {/* Admin Status Indicator */}
          <div className="flex items-center mr-auto ml-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Admin Mode Active
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRefreshTheme}
              className="px-4 py-2 bg-[var(--cta-primary)] text-white rounded hover:bg-[var(--cta-primary-hover)] transition-colors"
              style={{ fontFamily: 'var(--pdf-primary-font)' }}
            >
              Refresh Theme
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-[var(--cta-secondary)] text-white rounded hover:bg-[var(--cta-secondary-hover)] transition-colors"
              style={{ fontFamily: 'var(--pdf-primary-font)' }}
            >
              Back to Main App
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto" style={{ margin: '0 15%' }}>
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--pdf-heading-font)' }}>
              PDF Color Theory
            </h2>
            <p className="mb-4" style={{ fontFamily: 'var(--pdf-primary-font)' }}>
              This page displays the color theory extracted from the source PDF and allows for adjustments to ensure optimal legibility and visual harmony.
              The colors are applied throughout the application using the Hesse method mathematics for color variations.
            </p>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
              <p className="font-bold">Admin Page</p>
              <p>This is an administrative page for editing the color theme. Changes made here will affect the entire application.</p>
            </div>
          </section>

          {/* Color Theme Editor */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <ColorThemeEditor />
          </section>

          {/* Sample UI Components with Applied Colors */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--pdf-heading-font)' }}>
              Sample UI Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modal Header Sample */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-[var(--pdf-modal-header)] text-[var(--pdf-text-light)]">
                  <h4 className="font-bold">Modal Header</h4>
                </div>
                <div className="p-4 bg-[var(--pdf-modal-body)] text-[var(--pdf-text-primary)]">
                  <p>Modal content with primary text color</p>
                  <p className="text-[var(--pdf-text-secondary)]">Secondary text in modal body</p>
                </div>
              </div>

              {/* Button Samples */}
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-4">Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-[var(--cta-primary)] text-white rounded">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 bg-[var(--cta-secondary)] text-white rounded">
                    Secondary Button
                  </button>
                  <button className="px-4 py-2 bg-[var(--cta-tertiary)] text-white rounded">
                    Tertiary Button
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--pdf-modal-header,var(--header-bg))] p-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-[var(--pdf-text-light)]">
          <p style={{ fontFamily: 'var(--pdf-primary-font)' }}>
            AlexAI - PDF Processing and Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
