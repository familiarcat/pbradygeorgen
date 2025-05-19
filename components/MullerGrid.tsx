'use client';

import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';

/**
 * MullerGrid Component
 *
 * A grid system component based on Josef Müller-Brockmann's design principles.
 * This component implements a systematic grid layout with mathematical proportions
 * for spacing and sizing elements.
 *
 * Key principles:
 * - Grid-based design: Systematic grid layouts for content presentation
 * - Mathematical proportions: Uses mathematical relationships for spacing and sizing
 * - Objective design: Focuses on clarity, legibility, and functional design
 */

interface MullerGridProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
  maxWidth?: string;
  padding?: string;
  className?: string;
  verticalRhythm?: boolean;
  showGridLines?: boolean;
}

const MullerGrid: React.FC<MullerGridProps> = ({
  children,
  columns = 12,
  gap = 16,
  maxWidth = '1200px',
  padding = '1rem',
  className = '',
  verticalRhythm = false,
  showGridLines = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate grid template columns based on the number of columns
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  // Calculate gap in rem units
  const gapRem = `${gap / 16}rem`;

  return (
    <div
      className={`muller-grid ${className} ${verticalRhythm ? 'muller-vertical-rhythm' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: gapRem,
        maxWidth,
        padding,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {showGridLines && mounted && (
        <div className="muller-grid-lines" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'grid',
          gridTemplateColumns,
          gap: gapRem,
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(0, 0, 255, 0.05)',
                border: '1px dashed rgba(0, 0, 255, 0.1)',
                height: '100%',
              }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * MullerGridItem Component
 *
 * A grid item component that works with the MullerGrid component.
 * This component allows for precise control over the placement and
 * sizing of elements within the grid.
 */

interface MullerGridItemProps {
  children: ReactNode;
  colSpan?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  colStart?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  className?: string;
  style?: React.CSSProperties;
}

export const MullerGridItem: React.FC<MullerGridItemProps> = ({
  children,
  colSpan = 1,
  colStart,
  className = '',
  style = {},
}) => {
  // Handle responsive column spans
  let gridColumn = '';

  if (typeof colSpan === 'number' && typeof colStart === 'number') {
    gridColumn = `${colStart} / span ${colSpan}`;
  } else if (typeof colSpan === 'number') {
    gridColumn = `span ${colSpan} / auto`;
  } else if (typeof colSpan === 'object') {
    // This will be handled by CSS classes for responsive behavior
  }

  return (
    <div
      className={`muller-grid-item ${className} ${
        typeof colSpan === 'object'
          ? Object.entries(colSpan)
              .map(([breakpoint, span]) => `col-${breakpoint}-${span}`)
              .join(' ')
          : ''
      }`}
      style={{
        gridColumn,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * MullerTypography Component
 *
 * A typography component that implements Josef Müller-Brockmann's
 * typographic principles, including clear hierarchy and mathematical
 * proportions for font sizes.
 */

interface MullerTypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  style?: React.CSSProperties;
}

export const MullerTypography: React.FC<MullerTypographyProps> = ({
  children,
  variant = 'body1',
  align = 'left',
  className = '',
  style = {},
}) => {
  // Map variant to HTML element and styles
  const variantMap: Record<string, { element: keyof React.JSX.IntrinsicElements; styles: React.CSSProperties }> = {
    h1: {
      element: 'h1',
      styles: {
        fontSize: 'var(--muller-h1-size, 2.5rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: '1rem',
      }
    },
    h2: {
      element: 'h2',
      styles: {
        fontSize: 'var(--muller-h2-size, 2rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: '0.875rem',
      }
    },
    h3: {
      element: 'h3',
      styles: {
        fontSize: 'var(--muller-h3-size, 1.75rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.3,
        marginBottom: '0.75rem',
      }
    },
    h4: {
      element: 'h4',
      styles: {
        fontSize: 'var(--muller-h4-size, 1.5rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.3,
        marginBottom: '0.625rem',
      }
    },
    h5: {
      element: 'h5',
      styles: {
        fontSize: 'var(--muller-h5-size, 1.25rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.4,
        marginBottom: '0.5rem',
      }
    },
    h6: {
      element: 'h6',
      styles: {
        fontSize: 'var(--muller-h6-size, 1.125rem)',
        fontFamily: 'var(--pdf-heading-font, var(--font-heading))',
        fontWeight: 'bold',
        lineHeight: 1.4,
        marginBottom: '0.5rem',
      }
    },
    body1: {
      element: 'p',
      styles: {
        fontSize: 'var(--muller-body1-size, 1rem)',
        fontFamily: 'var(--pdf-body-font, var(--font-body))',
        lineHeight: 1.5,
        marginBottom: '1rem',
      }
    },
    body2: {
      element: 'p',
      styles: {
        fontSize: 'var(--muller-body2-size, 0.875rem)',
        fontFamily: 'var(--pdf-body-font, var(--font-body))',
        lineHeight: 1.5,
        marginBottom: '0.875rem',
      }
    },
    caption: {
      element: 'span',
      styles: {
        fontSize: 'var(--muller-caption-size, 0.75rem)',
        fontFamily: 'var(--pdf-body-font, var(--font-body))',
        lineHeight: 1.5,
        color: 'var(--text-secondary)',
      }
    },
    button: {
      element: 'span',
      styles: {
        fontSize: 'var(--muller-button-size, 0.875rem)',
        fontFamily: 'var(--pdf-button-font, var(--font-button))',
        fontWeight: 500,
        lineHeight: 1.75,
      }
    },
  };

  const { element: Element, styles: variantStyles } = variantMap[variant];

  return (
    <Element
      className={`muller-typography muller-${variant} ${className}`}
      style={{
        ...variantStyles,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </Element>
  );
};

export default MullerGrid;
