'use client';

import React, { useState, useEffect } from 'react';
import SalingerHeader from '@/components/SalingerHeader';
import StyleDebugger from '@/components/StyleDebugger';
import Link from 'next/link';

/**
 * Enhanced Extraction Page
 *
 * This page displays the results of the enhanced PDF extraction process,
 * including the unified style theme, color palette, and typography system.
 */
export default function EnhancedExtractionPage() {
  const [colorTheme, setColorTheme] = useState<any>(null);
  const [fontTheme, setFontTheme] = useState<any>(null);
  const [unifiedTheme, setUnifiedTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the enhanced extraction data
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch the enhanced color theory
        const colorResponse = await fetch('/extracted/enhanced_color_theory.json');
        if (!colorResponse.ok) {
          throw new Error(`Failed to fetch enhanced color theory: ${colorResponse.statusText}`);
        }
        const colorData = await colorResponse.json();
        setColorTheme(colorData);

        // Fetch the enhanced font theory
        const fontResponse = await fetch('/extracted/enhanced_font_theory.json');
        if (!fontResponse.ok) {
          throw new Error(`Failed to fetch enhanced font theory: ${fontResponse.statusText}`);
        }
        const fontData = await fontResponse.json();
        setFontTheme(fontData);

        // Fetch the unified style theme
        const themeResponse = await fetch('/extracted/unified_style_theme.json');
        if (!themeResponse.ok) {
          throw new Error(`Failed to fetch unified style theme: ${themeResponse.statusText}`);
        }
        const themeData = await themeResponse.json();
        setUnifiedTheme(themeData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching extraction data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render a color swatch
  const renderColorSwatch = (color: string, name: string) => {
    return (
      <div className="flex flex-col items-center mr-4 mb-4">
        <div
          className="w-16 h-16 rounded-md shadow-md mb-2"
          style={{ backgroundColor: color }}
        />
        <div className="text-xs font-mono">{name}</div>
        <div className="text-xs font-mono">{color}</div>
      </div>
    );
  };

  // Render a font sample
  const renderFontSample = (fontFamily: string, name: string) => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">{name}</h3>
        <div
          className="p-3 border rounded-md"
          style={{ fontFamily }}
        >
          <p className="text-xl mb-2">The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
        </div>
        <div className="text-xs font-mono mt-2">{fontFamily}</div>
      </div>
    );
  };

  // Render a component preview
  const renderComponentPreview = (component: string, styles: any) => {
    if (component === 'button') {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Button</h3>
          <button
            className="px-4 py-2 rounded-md shadow-md"
            style={{
              fontFamily: styles.fontFamily,
              backgroundColor: styles.backgroundColor,
              color: styles.textColor,
              borderRadius: styles.borderRadius
            }}
          >
            Sample Button
          </button>
          <div className="text-xs font-mono mt-2">
            <pre>{JSON.stringify(styles, null, 2)}</pre>
          </div>
        </div>
      );
    }

    if (component === 'card') {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Card</h3>
          <div
            className="p-4 shadow-md"
            style={{
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor,
              borderRadius: styles.borderRadius,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <h4 className="text-lg font-semibold mb-2">Card Title</h4>
            <p>This is a sample card component styled with the extracted theme.</p>
          </div>
          <div className="text-xs font-mono mt-2">
            <pre>{JSON.stringify(styles, null, 2)}</pre>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SalingerHeader title="Enhanced PDF Extraction" />

      <div className="mb-6">
        <p className="text-lg mb-4">
          This page displays the results of the enhanced PDF extraction process, including the unified style theme, color palette, and typography system.
        </p>
        <div className="flex space-x-4 mb-4">
          <Link href="/pdf-styles" className="px-4 py-2 border rounded-md hover:bg-gray-100">
            Standard PDF Styles
          </Link>
          <Link href="/style-debug" className="px-4 py-2 border rounded-md hover:bg-gray-100">
            Style Debugger
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading extraction data...</div>
        </div>
      ) : error ? (
        <div className="mb-8 border border-red-300 rounded-md overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-red-300">
            <h2 className="text-lg font-semibold text-red-700">Error Loading Data</h2>
          </div>
          <div className="p-4">
            <p>{error}</p>
            <p className="mt-4">
              This could be because the enhanced extraction has not been run yet. Try running the build process with:
            </p>
            <pre className="bg-gray-100 p-3 rounded-md mt-2">npm run build</pre>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-6 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px" id="extraction-tabs" role="tablist">
              <li className="mr-2" role="presentation">
                <button
                  className="inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active"
                  id="unified-tab"
                  type="button"
                  role="tab"
                  aria-controls="unified"
                  aria-selected="true"
                >
                  Unified Theme
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300"
                  id="colors-tab"
                  type="button"
                  role="tab"
                  aria-controls="colors"
                  aria-selected="false"
                >
                  Colors
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300"
                  id="typography-tab"
                  type="button"
                  role="tab"
                  aria-controls="typography"
                  aria-selected="false"
                >
                  Typography
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300"
                  id="components-tab"
                  type="button"
                  role="tab"
                  aria-controls="components"
                  aria-selected="false"
                >
                  Components
                </button>
              </li>
              <li role="presentation">
                <button
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300"
                  id="raw-tab"
                  type="button"
                  role="tab"
                  aria-controls="raw"
                  aria-selected="false"
                >
                  Raw Data
                </button>
              </li>
            </ul>
          </div>

          <div id="extraction-content">
            <div className="p-4 rounded-lg bg-white" id="unified" role="tabpanel" aria-labelledby="unified-tab">
              <div className="mb-8 border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="text-lg font-semibold">Unified Style Theme</h2>
                  <p className="text-sm text-gray-600">
                    A comprehensive style theme extracted from the PDF, combining colors, typography, and component styles.
                  </p>
                </div>
                <div className="p-4">
                  {unifiedTheme && (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Theme Information</h3>
                        <p><strong>Name:</strong> {unifiedTheme.name}</p>
                        <p><strong>Version:</strong> {unifiedTheme.version}</p>
                        <p><strong>Description:</strong> {unifiedTheme.description}</p>
                      </div>

                      <hr className="my-6" />

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
                        <div className="flex flex-wrap">
                          {Object.entries(unifiedTheme.colors).map(([name, color]) => {
                            if (typeof color === 'string' && color.startsWith('#')) {
                              return renderColorSwatch(color as string, name);
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      <hr className="my-6" />

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Typography</h3>
                        {Object.entries(unifiedTheme.typography).map(([name, fontFamily]) => {
                          if (typeof fontFamily === 'string') {
                            return renderFontSample(fontFamily as string, name);
                          }
                          return null;
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <StyleDebugger />
      </div>
    </div>
  );
}
