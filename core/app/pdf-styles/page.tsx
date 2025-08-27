'use client';

/**
 * PDF Styles Page
 *
 * This page demonstrates the PDF-driven styling system, showing how
 * colors and fonts extracted from a PDF are applied to components.
 *
 * Philosophical Framework:
 * - Salinger: Intuitive and natural-feeling UI
 * - Hesse: Mathematical precision in styling
 * - Derrida: Deconstructing hardcoded styles into dynamic elements
 * - Dante: Methodical approach to style application
 */

import React from 'react';
import StylesLoadingIndicator from '@/components/StylesLoadingIndicator';
import PDFStylesDisplay from '@/components/PDFStylesDisplay';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PDFStylesPage() {
  return (
    <div className="pdf-styles-page">
      <Navigation />
      <StylesLoadingIndicator />

      <header>
        <h1>PDF-Driven Styling System</h1>
        <p>This page demonstrates how styles extracted from a PDF are applied throughout the application.</p>
      </header>

      <main>
        <section className="intro-section">
          <h2>How It Works</h2>
          <p>
            During the build process, AlexAI extracts colors and fonts from the selected PDF file.
            These styles are then applied to the entire application using CSS variables and a global
            styles provider component.
          </p>
          <p>
            The styles you see on this page are extracted from the PDF file you selected using the
            PDF selection tool. You can change the PDF file and rebuild the application to see how
            the styles change.
          </p>

          <div className="cta-container">
            <Link href="/" className="cta-button primary">
              View Resume
            </Link>
            <Link href="/upload" className="cta-button secondary">
              Upload New PDF
            </Link>
          </div>
        </section>

        <PDFStylesDisplay />

        <section className="philosophical-section">
          <h2>Philosophical Framework</h2>

          <div className="philosophy-card">
            <h3>Salinger</h3>
            <p>
              The Salinger approach focuses on intuitive user experience. The styles extracted from
              the PDF are applied in a way that feels natural and familiar to the user, creating a
              seamless experience.
            </p>
          </div>

          <div className="philosophy-card">
            <h3>Hesse</h3>
            <p>
              The Hesse approach emphasizes mathematical precision in styling. Colors are analyzed
              for contrast and accessibility, and fonts are categorized based on their characteristics.
            </p>
          </div>

          <div className="philosophy-card">
            <h3>Derrida</h3>
            <p>
              The Derrida approach deconstructs hardcoded styles into dynamic elements. Instead of
              using fixed values, styles are derived from the PDF and applied consistently throughout
              the application.
            </p>
          </div>

          <div className="philosophy-card">
            <h3>Dante</h3>
            <p>
              The Dante approach follows a methodical process for style application. Each step is
              logged and tracked, ensuring that styles are applied correctly and consistently.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>AlexAI PDF Styling System</p>
      </footer>

      <style jsx>{`
        .pdf-styles-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        header {
          margin-bottom: 2rem;
          text-align: center;
        }

        header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        section {
          margin-bottom: 3rem;
        }

        .intro-section {
          background-color: var(--pdf-card-bg, #ffffff);
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .cta-container {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          justify-content: center;
        }

        .cta-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .cta-button.primary {
          background-color: var(--pdf-primary-color, #3a6ea5);
          color: white;
        }

        .cta-button.secondary {
          background-color: var(--pdf-secondary-color, #004e98);
          color: white;
        }

        .cta-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .philosophical-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .philosophy-card {
          background-color: var(--pdf-card-bg, #ffffff);
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .philosophy-card h3 {
          color: var(--pdf-primary-color, #3a6ea5);
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--pdf-border-color, #dddddd);
          padding-bottom: 0.5rem;
        }

        footer {
          margin-top: 3rem;
          text-align: center;
          padding: 1rem;
          background-color: var(--pdf-footer-bg, #004e98);
          color: var(--pdf-footer-text, #ffffff);
          border-radius: 0.5rem;
        }

        @media (max-width: 768px) {
          .philosophical-section {
            grid-template-columns: 1fr;
          }

          .cta-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
