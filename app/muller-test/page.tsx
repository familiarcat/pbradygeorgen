'use client';

import React, { useState } from 'react';
import MullerGrid, { MullerGridItem, MullerTypography } from '@/components/MullerGrid';
import Link from 'next/link';

/**
 * MullerTest Page
 * 
 * This page demonstrates the implementation of Josef Müller-Brockmann's design principles
 * in the AlexAI application, including grid systems, typographic hierarchy, and mathematical proportions.
 */
export default function MullerTestPage() {
  const [showGridLines, setShowGridLines] = useState(false);
  
  return (
    <div className="min-h-screen bg-[var(--pdf-background-color, #f5f5f5)]">
      <header className="bg-[var(--pdf-background-color, #f5f5f5)] border-b border-[var(--pdf-border-color, #ddd)] sticky top-0 z-10">
        <div className="max-w-[var(--muller-max-width, 1200px)] mx-auto px-[var(--muller-space-2, 16px)] py-[var(--muller-space-2, 16px)] flex justify-between items-center">
          <h1 className="text-[var(--muller-h3-size, 1.75rem)] font-bold text-[var(--pdf-text-color, #333)]">
            Josef Müller-Brockmann Design System
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGridLines(!showGridLines)}
              className="px-4 py-2 bg-[var(--pdf-accent-color, #0070f3)] text-white rounded"
            >
              {showGridLines ? 'Hide Grid Lines' : 'Show Grid Lines'}
            </button>
            <Link
              href="/"
              className="text-[var(--pdf-accent-color, #0070f3)]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="py-[var(--muller-space-4, 32px)]">
        <MullerGrid showGridLines={showGridLines}>
          <MullerGridItem colSpan={12}>
            <MullerTypography variant="h1" align="center">
              Grid System & Typography
            </MullerTypography>
            <MullerTypography variant="body1" align="center">
              Based on Josef Müller-Brockmann's design principles
            </MullerTypography>
          </MullerGridItem>
        </MullerGrid>

        <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-6, 48px)]">
          <MullerGridItem colSpan={4}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h3">
                Grid-based Design
              </MullerTypography>
              <MullerTypography variant="body1">
                Müller-Brockmann advocated for systematic grid layouts that create visual harmony and organization. This grid system uses a 12-column layout with mathematically proportioned spacing.
              </MullerTypography>
            </div>
          </MullerGridItem>
          
          <MullerGridItem colSpan={4}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h3">
                Typographic Hierarchy
              </MullerTypography>
              <MullerTypography variant="body1">
                Clear typographic hierarchy based on mathematical proportions ensures readability and visual organization. Font sizes follow the golden ratio (1.618) for harmonious progression.
              </MullerTypography>
            </div>
          </MullerGridItem>
          
          <MullerGridItem colSpan={4}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h3">
                Objective Design
              </MullerTypography>
              <MullerTypography variant="body1">
                Focus on clarity, legibility, and functional design over decoration. Every element serves a purpose and contributes to the overall communication objective.
              </MullerTypography>
            </div>
          </MullerGridItem>
        </MullerGrid>

        <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-4, 32px)]">
          <MullerGridItem colSpan={6}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h2">
                Typography Showcase
              </MullerTypography>
              
              <div className="mt-[var(--muller-space-3, 24px)]">
                <MullerTypography variant="h1">
                  Heading 1
                </MullerTypography>
                <MullerTypography variant="h2">
                  Heading 2
                </MullerTypography>
                <MullerTypography variant="h3">
                  Heading 3
                </MullerTypography>
                <MullerTypography variant="h4">
                  Heading 4
                </MullerTypography>
                <MullerTypography variant="h5">
                  Heading 5
                </MullerTypography>
                <MullerTypography variant="h6">
                  Heading 6
                </MullerTypography>
              </div>
              
              <div className="mt-[var(--muller-space-3, 24px)]">
                <MullerTypography variant="body1">
                  Body 1: This is the primary body text style. It uses the PDF-extracted body font with a size of 1rem (16px) and a line height of 1.5 for optimal readability.
                </MullerTypography>
                <MullerTypography variant="body2">
                  Body 2: This is a smaller body text style, useful for secondary information. It uses the PDF-extracted body font with a size of 0.875rem (14px).
                </MullerTypography>
                <MullerTypography variant="caption">
                  Caption: This is a caption text style, useful for image captions or small print. It uses the PDF-extracted body font with a size of 0.75rem (12px).
                </MullerTypography>
              </div>
            </div>
          </MullerGridItem>
          
          <MullerGridItem colSpan={6}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h2">
                Mathematical Proportions
              </MullerTypography>
              
              <MullerTypography variant="body1">
                Josef Müller-Brockmann emphasized the use of mathematical relationships for spacing and sizing elements. This design system uses a base unit of 8px for all spacing calculations.
              </MullerTypography>
              
              <div className="mt-[var(--muller-space-3, 24px)] space-y-[var(--muller-space-2, 16px)]">
                <div>
                  <MullerTypography variant="body2">
                    Space 1 (8px)
                  </MullerTypography>
                  <div className="h-[var(--muller-space-1, 8px)] bg-[var(--pdf-accent-color, #0070f3)]"></div>
                </div>
                
                <div>
                  <MullerTypography variant="body2">
                    Space 2 (16px)
                  </MullerTypography>
                  <div className="h-[var(--muller-space-2, 16px)] bg-[var(--pdf-accent-color, #0070f3)]"></div>
                </div>
                
                <div>
                  <MullerTypography variant="body2">
                    Space 3 (24px)
                  </MullerTypography>
                  <div className="h-[var(--muller-space-3, 24px)] bg-[var(--pdf-accent-color, #0070f3)]"></div>
                </div>
                
                <div>
                  <MullerTypography variant="body2">
                    Space 4 (32px)
                  </MullerTypography>
                  <div className="h-[var(--muller-space-4, 32px)] bg-[var(--pdf-accent-color, #0070f3)]"></div>
                </div>
                
                <div>
                  <MullerTypography variant="body2">
                    Space 5 (40px)
                  </MullerTypography>
                  <div className="h-[var(--muller-space-5, 40px)] bg-[var(--pdf-accent-color, #0070f3)]"></div>
                </div>
              </div>
            </div>
          </MullerGridItem>
        </MullerGrid>

        <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-4, 32px)]">
          <MullerGridItem colSpan={12}>
            <div className="bg-white p-[var(--muller-space-3, 24px)] rounded shadow-sm">
              <MullerTypography variant="h2">
                Responsive Grid System
              </MullerTypography>
              
              <MullerTypography variant="body1">
                The grid system is fully responsive and adapts to different screen sizes. Try resizing your browser window to see how the layout changes.
              </MullerTypography>
              
              <div className="mt-[var(--muller-space-3, 24px)]">
                <MullerGrid showGridLines={showGridLines}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <MullerGridItem key={i} colSpan={1}>
                      <div className="bg-[var(--pdf-accent-color, #0070f3)] h-[var(--muller-space-4, 32px)] rounded flex items-center justify-center text-white">
                        {i + 1}
                      </div>
                    </MullerGridItem>
                  ))}
                </MullerGrid>
                
                <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-2, 16px)]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <MullerGridItem key={i} colSpan={2}>
                      <div className="bg-[var(--pdf-accent-color, #0070f3)] h-[var(--muller-space-4, 32px)] rounded flex items-center justify-center text-white">
                        2 cols
                      </div>
                    </MullerGridItem>
                  ))}
                </MullerGrid>
                
                <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-2, 16px)]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <MullerGridItem key={i} colSpan={3}>
                      <div className="bg-[var(--pdf-accent-color, #0070f3)] h-[var(--muller-space-4, 32px)] rounded flex items-center justify-center text-white">
                        3 cols
                      </div>
                    </MullerGridItem>
                  ))}
                </MullerGrid>
                
                <MullerGrid showGridLines={showGridLines} className="mt-[var(--muller-space-2, 16px)]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MullerGridItem key={i} colSpan={4}>
                      <div className="bg-[var(--pdf-accent-color, #0070f3)] h-[var(--muller-space-4, 32px)] rounded flex items-center justify-center text-white">
                        4 cols
                      </div>
                    </MullerGridItem>
                  ))}
                </MullerGrid>
              </div>
            </div>
          </MullerGridItem>
        </MullerGrid>
      </main>
    </div>
  );
}
