'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StyleDebugger from '@/components/StyleDebugger';
import { DanteLogger } from '@/utils/DanteLogger';

export default function StyleTestPage() {
  // State to store CSS variable values
  const [cssVars, setCssVars] = useState({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    text: '',
    headingFont: '',
    bodyFont: '',
    monoFont: '',
    // Add variables for both naming conventions
    pdfPrimary: '',
    dynamicPrimary: '',
    directPrimary: '',
  });

  // Force scrolling to work
  useEffect(() => {
    // This code only runs in the browser
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Log that the style test page is being accessed
    DanteLogger.success.basic('Style Test Page accessed - testing PDF-extracted styles');

    // Get CSS variable values with all naming conventions
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setCssVars({
      // PDF-prefixed variables
      primary: computedStyle.getPropertyValue('--pdf-primary-color').trim(),
      secondary: computedStyle.getPropertyValue('--pdf-secondary-color').trim(),
      accent: computedStyle.getPropertyValue('--pdf-accent-color').trim(),
      background: computedStyle.getPropertyValue('--pdf-background-color').trim(),
      text: computedStyle.getPropertyValue('--pdf-text-color').trim(),
      headingFont: computedStyle.getPropertyValue('--pdf-heading-font').trim(),
      bodyFont: computedStyle.getPropertyValue('--pdf-body-font').trim(),
      monoFont: computedStyle.getPropertyValue('--pdf-mono-font').trim(),

      // Check different naming conventions
      pdfPrimary: computedStyle.getPropertyValue('--pdf-primary-color').trim(),
      dynamicPrimary: computedStyle.getPropertyValue('--dynamic-primary').trim(),
      directPrimary: computedStyle.getPropertyValue('--primary').trim(),
    });

    // Log the values for debugging
    console.log('CSS Variables:', {
      'pdf-primary-color': computedStyle.getPropertyValue('--pdf-primary-color').trim(),
      'dynamic-primary': computedStyle.getPropertyValue('--dynamic-primary').trim(),
      'primary': computedStyle.getPropertyValue('--primary').trim(),
    });
  }, []);

  return (
    <div className="p-8" style={{ minHeight: '200vh' }}>
      <h1 className="text-3xl font-bold mb-6">PDF-Driven Styling Test</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Typography</h2>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">PDF-prefixed Variables</h3>
          <h1 style={{ fontFamily: 'var(--pdf-heading-font)' }}>Heading 1 with PDF Font</h1>
          <h2 style={{ fontFamily: 'var(--pdf-heading-font)' }}>Heading 2 with PDF Font</h2>
          <p style={{ fontFamily: 'var(--pdf-body-font)' }}>
            This paragraph uses the body font extracted from the PDF.
            The text should be styled according to the PDF's typography.
          </p>
          <code style={{ fontFamily: 'var(--pdf-mono-font)' }}>
            This code block uses the monospace font from the PDF.
          </code>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Direct Variables</h3>
          <h1 style={{ fontFamily: 'var(--font-heading)' }}>Heading 1 with Direct Font Variable</h1>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Heading 2 with Direct Font Variable</h2>
          <p style={{ fontFamily: 'var(--font-body)' }}>
            This paragraph uses the direct body font variable.
            It should match the styling above.
          </p>
          <code style={{ fontFamily: 'var(--font-mono)' }}>
            This code block uses the direct mono font variable.
          </code>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Dynamic Variables</h3>
          <h1 style={{ fontFamily: 'var(--dynamic-heading-font)' }}>Heading 1 with Dynamic Font Variable</h1>
          <h2 style={{ fontFamily: 'var(--dynamic-heading-font)' }}>Heading 2 with Dynamic Font Variable</h2>
          <p style={{ fontFamily: 'var(--dynamic-primary-font)' }}>
            This paragraph uses the dynamic primary font variable.
            It should match the styling above.
          </p>
          <code style={{ fontFamily: 'var(--dynamic-mono-font)' }}>
            This code block uses the dynamic mono font variable.
          </code>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Colors</h2>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">PDF-prefixed Variables</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--pdf-primary-color)', color: 'white' }}>
              Primary Color (pdf)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--pdf-secondary-color)', color: 'white' }}>
              Secondary Color (pdf)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--pdf-accent-color)', color: 'white' }}>
              Accent Color (pdf)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--pdf-background-color)', color: 'var(--pdf-text-color)', border: '1px solid var(--pdf-border-color)' }}>
              Background Color (pdf)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: '#fff', color: 'var(--pdf-text-color)', border: '1px solid var(--pdf-border-color)' }}>
              Text Color (pdf)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: '#fff', color: 'var(--pdf-text-secondary)', border: '1px solid var(--pdf-border-color)' }}>
              Secondary Text (pdf)
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Direct Variables</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              Primary Color (direct)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
              Secondary Color (direct)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Accent Color (direct)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
              Background Color (direct)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: '#fff', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
              Text Color (direct)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: '#fff', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              Secondary Text (direct)
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Dynamic Variables</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--dynamic-primary)', color: 'white' }}>
              Primary Color (dynamic)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--dynamic-secondary)', color: 'white' }}>
              Secondary Color (dynamic)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--dynamic-accent)', color: 'white' }}>
              Accent Color (dynamic)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--dynamic-background)', color: 'var(--dynamic-text)', border: '1px solid var(--dynamic-border)' }}>
              Background Color (dynamic)
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: '#fff', color: 'var(--dynamic-text)', border: '1px solid var(--dynamic-border)' }}>
              Text Color (dynamic)
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">UI Elements</h2>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">PDF-prefixed Variables</h3>
          <div className="space-y-4">
            <div>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--pdf-primary-color)',
                color: 'white',
                fontFamily: 'var(--pdf-button-font)'
              }}>
                Primary Button (pdf)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--pdf-secondary-color)',
                color: 'white',
                fontFamily: 'var(--pdf-button-font)'
              }}>
                Secondary Button (pdf)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--pdf-accent-color)',
                color: 'white',
                fontFamily: 'var(--pdf-button-font)'
              }}>
                Accent Button (pdf)
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Input with PDF styling"
                className="mr-2 mb-2 p-2 w-64"
                style={{
                  border: '1px solid var(--pdf-border-color)',
                  fontFamily: 'var(--pdf-body-font)',
                  backgroundColor: 'var(--pdf-background-color)',
                  color: 'var(--pdf-text-color)'
                }}
              />
            </div>

            <div className="p-4 rounded" style={{
              backgroundColor: 'var(--pdf-background-color)',
              border: '1px solid var(--pdf-border-color)'
            }}>
              <h3 className="font-bold mb-2" style={{
                color: 'var(--pdf-text-color)',
                fontFamily: 'var(--pdf-heading-font)'
              }}>
                Card with PDF Styling
              </h3>
              <p style={{
                color: 'var(--pdf-text-secondary)',
                fontFamily: 'var(--pdf-body-font)'
              }}>
                This card uses background, shadow, and border colors from the PDF.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Direct Variables</h3>
          <div className="space-y-4">
            <div>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontFamily: 'var(--font-button)'
              }}>
                Primary Button (direct)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--secondary)',
                color: 'white',
                fontFamily: 'var(--font-button)'
              }}>
                Secondary Button (direct)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontFamily: 'var(--font-button)'
              }}>
                Accent Button (direct)
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Input with direct styling"
                className="mr-2 mb-2 p-2 w-64"
                style={{
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-color)'
                }}
              />
            </div>

            <div className="p-4 rounded" style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)'
            }}>
              <h3 className="font-bold mb-2" style={{
                color: 'var(--text-color)',
                fontFamily: 'var(--font-heading)'
              }}>
                Card with Direct Styling
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)'
              }}>
                This card uses direct variable naming for styling.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Dynamic Variables</h3>
          <div className="space-y-4">
            <div>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--dynamic-primary)',
                color: 'white',
                fontFamily: 'var(--dynamic-primary-font)'
              }}>
                Primary Button (dynamic)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--dynamic-secondary)',
                color: 'white',
                fontFamily: 'var(--dynamic-primary-font)'
              }}>
                Secondary Button (dynamic)
              </button>
              <button className="mr-2 mb-2 px-4 py-2 rounded" style={{
                backgroundColor: 'var(--dynamic-accent)',
                color: 'white',
                fontFamily: 'var(--dynamic-primary-font)'
              }}>
                Accent Button (dynamic)
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Input with dynamic styling"
                className="mr-2 mb-2 p-2 w-64"
                style={{
                  border: '1px solid var(--dynamic-border)',
                  fontFamily: 'var(--dynamic-primary-font)',
                  backgroundColor: 'var(--dynamic-background)',
                  color: 'var(--dynamic-text)'
                }}
              />
            </div>

            <div className="p-4 rounded" style={{
              backgroundColor: 'var(--dynamic-background)',
              border: '1px solid var(--dynamic-border)'
            }}>
              <h3 className="font-bold mb-2" style={{
                color: 'var(--dynamic-text)',
                fontFamily: 'var(--dynamic-heading-font)'
              }}>
                Card with Dynamic Styling
              </h3>
              <p style={{
                color: 'var(--dynamic-text)',
                fontFamily: 'var(--dynamic-primary-font)'
              }}>
                This card uses dynamic variable naming for styling.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>

      <div className="mt-8 p-4 rounded" style={{ backgroundColor: 'var(--pdf-info-color)', color: '#fff' }}>
        <h3 className="font-bold mb-2">Current CSS Variables</h3>
        <pre className="text-xs overflow-auto" style={{ maxHeight: '200px' }}>
{`
--pdf-primary-color: ${cssVars.primary}
--pdf-secondary-color: ${cssVars.secondary}
--pdf-accent-color: ${cssVars.accent}
--pdf-background-color: ${cssVars.background}
--pdf-text-color: ${cssVars.text}
--pdf-heading-font: ${cssVars.headingFont}
--pdf-body-font: ${cssVars.bodyFont}
--pdf-mono-font: ${cssVars.monoFont}

Different naming conventions for primary color:
--pdf-primary-color: ${cssVars.pdfPrimary}
--dynamic-primary: ${cssVars.dynamicPrimary}
--primary: ${cssVars.directPrimary}
`}
        </pre>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">CSS Variables Debugger</h2>
        <p className="mb-4">
          This component shows all CSS variables currently set on the :root element.
          Use it to debug styling issues and ensure that all variables are being set correctly.
        </p>
        <StyleDebugger />
      </div>
    </div>
  );
}
