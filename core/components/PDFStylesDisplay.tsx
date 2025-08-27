'use client';

import React, { useEffect, useState } from 'react';

interface ColorTheory {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  allColors?: string[];
}

interface FontTheory {
  heading: string;
  body: string;
  mono: string;
  allFonts?: string[];
}

interface PDFStylesDisplayProps {
  showColors?: boolean;
  showFonts?: boolean;
  showSamples?: boolean;
}

export default function PDFStylesDisplay({ 
  showColors = true, 
  showFonts = true,
  showSamples = true
}: PDFStylesDisplayProps) {
  const [colorTheory, setColorTheory] = useState<ColorTheory | null>(null);
  const [fontTheory, setFontTheory] = useState<FontTheory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStyles() {
      try {
        // Fetch color theory
        const colorResponse = await fetch('/extracted/color_theory.json');
        if (colorResponse.ok) {
          const colorData = await colorResponse.json();
          setColorTheory(colorData);
        }

        // Fetch font theory
        const fontResponse = await fetch('/extracted/font_theory.json');
        if (fontResponse.ok) {
          const fontData = await fontResponse.json();
          setFontTheory(fontData);
        }
      } catch (error) {
        console.error('Error loading styles', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStyles();
  }, []);

  if (isLoading) {
    return <div>Loading styles...</div>;
  }

  return (
    <div className="pdf-styles-display">
      <h2>PDF Extracted Styles</h2>
      
      {showColors && colorTheory && (
        <div className="styles-section">
          <h3>Color Theory</h3>
          <div className="color-grid">
            {Object.entries(colorTheory).map(([key, value]) => {
              if (key === 'allColors' || typeof value !== 'string') return null;
              return (
                <div key={key} className="color-item">
                  <div className="color-swatch" style={{ backgroundColor: value }}></div>
                  <div className="color-info">
                    <div className="color-name">{key}</div>
                    <div className="color-value">{value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {showFonts && fontTheory && (
        <div className="styles-section">
          <h3>Font Theory</h3>
          <div className="font-list">
            {Object.entries(fontTheory).map(([key, value]) => {
              if (key === 'allFonts' || typeof value !== 'string') return null;
              return (
                <div key={key} className="font-item">
                  <div className="font-name">{key}:</div>
                  <div className="font-value" style={{ fontFamily: value }}>{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {showSamples && (
        <div className="styles-section">
          <h3>Style Samples</h3>
          
          <div className="sample-section">
            <h4>Typography</h4>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>This is a paragraph with <a href="#">a link</a> and <strong>bold text</strong> and <em>italic text</em>.</p>
            <code>This is code text</code>
          </div>
          
          <div className="sample-section">
            <h4>Buttons</h4>
            <div className="button-group">
              <button>Primary Button</button>
              <button className="secondary">Secondary Button</button>
              <button className="accent">Accent Button</button>
              <button className="outline">Outline Button</button>
            </div>
          </div>
          
          <div className="sample-section">
            <h4>Form Elements</h4>
            <div className="form-group">
              <label>Text Input</label>
              <input type="text" placeholder="Enter text" />
            </div>
            <div className="form-group">
              <label>Select</label>
              <select>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          
          <div className="sample-section">
            <h4>Alerts</h4>
            <div className="alert alert-success">Success Alert</div>
            <div className="alert alert-warning">Warning Alert</div>
            <div className="alert alert-error">Error Alert</div>
            <div className="alert alert-info">Info Alert</div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .pdf-styles-display {
          padding: 2rem;
          background-color: var(--pdf-background-color, #f6f6f6);
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        
        .styles-section {
          margin-bottom: 2rem;
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .color-item {
          display: flex;
          align-items: center;
          background-color: white;
          padding: 0.5rem;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 0.25rem;
          margin-right: 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .color-info {
          flex: 1;
        }
        
        .color-name {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        
        .font-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .font-item {
          display: flex;
          align-items: center;
          background-color: white;
          padding: 0.5rem;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .font-name {
          font-weight: bold;
          width: 100px;
        }
        
        .font-value {
          flex: 1;
          font-size: 1.2rem;
        }
        
        .sample-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: white;
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}
