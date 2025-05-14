/**
 * PDF Styling Demo Page
 *
 * This page demonstrates the PDF-driven styling system, showing how
 * colors and fonts extracted from a PDF are applied to components
 * with a cascading animation effect.
 *
 * Philosophical Framework:
 * - Salinger: Intuitive and natural-feeling UI
 * - Hesse: Mathematical precision in styling
 * - Derrida: Deconstructing hardcoded styles into dynamic elements
 * - Dante: Methodical approach to style application
 */

import React from 'react';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the ColorTheme interface and default theme here since we can't import it
interface ColorTheme {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  isDark?: boolean;
  isLoading?: boolean;
  rawColors?: string[];
  ctaColors?: {
    primary: string;
    hover: string;
    active: string;
    disabled: string;
    text: string;
  };
}

const defaultColorTheme: ColorTheme = {
  primary: '#3a6ea5',
  secondary: '#004e98',
  accent: '#ff6700',
  background: '#ffffff',
  text: '#000000',
  textSecondary: '#333333',
  border: '#dddddd',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  isLoading: false
};

// Define the FontTheme interface and default theme here since we can't import it
interface FontTheme {
  heading: string;
  body: string;
  mono: string;
  allFonts: string[];
}

const defaultFontTheme: FontTheme = {
  heading: "'Arial', sans-serif",
  body: "'Helvetica', Arial, sans-serif",
  mono: "'Courier New', monospace",
  allFonts: ['Arial', 'Helvetica', 'Courier New']
};

// This is a server component that loads the PDF styles during build
export default async function PDFStylingDemoPage() {
  // Load the color theme from the extracted directory
  let colorTheme: ColorTheme = { ...defaultColorTheme, isLoading: false };
  let fontTheme: FontTheme = defaultFontTheme;

  try {
    const colorTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'color_theory.json');
    const fontTheoryPath = path.join(process.cwd(), 'public', 'extracted', 'font_theory.json');

    // Load color theme if it exists
    if (existsSync(colorTheoryPath)) {
      const colorTheoryData = await fs.readFile(colorTheoryPath, 'utf8');
      colorTheme = JSON.parse(colorTheoryData);
    }

    // Load font theme if it exists
    if (existsSync(fontTheoryPath)) {
      const fontTheoryData = await fs.readFile(fontTheoryPath, 'utf8');
      fontTheme = JSON.parse(fontTheoryData);
    }
  } catch (error) {
    console.error('Error loading PDF styles:', error);
  }

  return (
    <div className="pdf-styling-demo" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div>
        <h1
          style={{
            fontFamily: fontTheme.heading,
            color: colorTheme.primary,
            borderBottom: `2px solid ${colorTheme.border}`,
            padding: '0.5rem 0',
            marginBottom: '1rem'
          }}
        >
          PDF-Driven Styling Demo
        </h1>

        <div
          style={{
            fontFamily: fontTheme.body,
            backgroundColor: colorTheme.background,
            color: colorTheme.text,
            padding: '1rem',
            borderRadius: '0.5rem',
            border: `1px solid ${colorTheme.border}`,
            marginBottom: '1rem'
          }}
        >
          This page demonstrates how styles extracted from a PDF are applied to components.
          The colors and fonts you see here are extracted from the PDF file during the build process.
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            style={{
              fontFamily: fontTheme.body,
              backgroundColor: colorTheme.primary,
              color: colorTheme.isDark ? '#ffffff' : '#000000',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Primary Button
          </button>

          <button
            style={{
              fontFamily: fontTheme.body,
              backgroundColor: colorTheme.secondary,
              color: colorTheme.isDark ? '#ffffff' : '#000000',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Secondary Button
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontFamily: fontTheme.heading,
            color: colorTheme.primary,
            borderBottom: `2px solid ${colorTheme.border}`,
            padding: '0.5rem 0',
            marginBottom: '1rem'
          }}
        >
          Color Palette
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {[
            { name: 'Primary', color: colorTheme.primary },
            { name: 'Secondary', color: colorTheme.secondary },
            { name: 'Accent', color: colorTheme.accent },
            { name: 'Background', color: colorTheme.background },
            { name: 'Text', color: colorTheme.text },
            { name: 'Border', color: colorTheme.border }
          ].map((item, index) => (
            <div
              key={item.name}
              style={{
                width: '120px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  backgroundColor: item.color,
                  height: '80px',
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem',
                  border: `1px solid ${colorTheme.border}`
                }}
              />
              <div style={{ fontFamily: fontTheme.body }}>
                <strong>{item.name}</strong>
                <div style={{ fontSize: '0.8rem' }}>{item.color}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2
          style={{
            fontFamily: fontTheme.heading,
            color: colorTheme.primary,
            borderBottom: `2px solid ${colorTheme.border}`,
            padding: '0.5rem 0',
            marginBottom: '1rem'
          }}
        >
          Font Samples
        </h2>

        <div style={{ marginTop: '1rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Heading Font</h3>
            <div
              style={{
                fontFamily: fontTheme.heading,
                padding: '1rem',
                backgroundColor: colorTheme.background,
                color: colorTheme.text,
                borderRadius: '0.25rem',
                border: `1px solid ${colorTheme.border}`
              }}
            >
              <p style={{ fontSize: '1.5rem' }}>The quick brown fox jumps over the lazy dog.</p>
              <p style={{ fontSize: '1.2rem' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p style={{ fontSize: '1.2rem' }}>abcdefghijklmnopqrstuvwxyz</p>
              <p style={{ fontSize: '1.2rem' }}>0123456789</p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Body Font</h3>
            <div
              style={{
                fontFamily: fontTheme.body,
                padding: '1rem',
                backgroundColor: colorTheme.background,
                color: colorTheme.text,
                borderRadius: '0.25rem',
                border: `1px solid ${colorTheme.border}`
              }}
            >
              <p>The quick brown fox jumps over the lazy dog.</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789</p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Monospace Font</h3>
            <div
              style={{
                fontFamily: fontTheme.mono,
                padding: '1rem',
                backgroundColor: colorTheme.isDark ? '#333333' : '#f5f5f5',
                color: colorTheme.accent,
                borderRadius: '0.25rem',
                border: `1px solid ${colorTheme.border}`
              }}
            >
              <p>The quick brown fox jumps over the lazy dog.</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
