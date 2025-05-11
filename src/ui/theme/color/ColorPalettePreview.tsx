'use client';

import React from 'react';
import Link from 'next/link';
import { useServerTheme } from './ServerThemeProvider';
import { useAdmin } from '@/contexts/AdminContext';
import styles from '@/styles/ColorPalettePreview.module.css';
import HesseColorTheory from '@/utils/HesseColorTheory';

/**
 * ColorPalettePreview component
 *
 * Displays a visual preview of the comprehensive color palette
 * Only visible in admin mode
 */
const ColorPalettePreview: React.FC = () => {
  const { colorTheme } = useServerTheme();
  const { isAdminMode } = useAdmin();

  // Don't render anything if not in admin mode
  if (!isAdminMode) {
    return null;
  }

  // Don't render if no palette is available
  if (!colorTheme.palette) {
    return (
      <div className={styles.container}>
        <div className={styles.headerWithLink}>
          <h3 className={styles.title}>Color Palette Preview</h3>
          <Link href="/color-theme" className={styles.editLink}>
            Edit Theme
          </Link>
        </div>
        <p className={styles.message}>No comprehensive color palette available.</p>
      </div>
    );
  }

  // Calculate contrast ratios for text/background combinations
  const calculateContrastRatio = (background: string, text: string) => {
    const ratio = HesseColorTheory.calculateContrastRatio(background, text);
    const isAccessible = ratio >= 4.5;
    return {
      ratio: ratio.toFixed(2),
      isAccessible
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWithLink}>
        <h3 className={styles.title}>Comprehensive Color Palette</h3>
        <Link href="/color-theme" className={styles.editLink}>
          Edit Theme
        </Link>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Primary Colors</h4>
        <div className={styles.colorGrid}>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.base }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Base</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.base}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.light }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Light</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.light}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.lighter }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Lighter</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.lighter}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.dark }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Dark</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.dark}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.darker }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Darker</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.darker}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.primary.contrast }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Contrast</span>
              <span className={styles.colorValue}>{colorTheme.palette.primary.contrast}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>UI-Specific Colors</h4>
        <div className={styles.colorGrid}>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.ui.modalHeader }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Modal Header</span>
              <span className={styles.colorValue}>{colorTheme.palette.ui.modalHeader}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.ui.modalBody }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Modal Body</span>
              <span className={styles.colorValue}>{colorTheme.palette.ui.modalBody}</span>
            </div>
          </div>
          <div className={styles.colorItem}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: colorTheme.palette.ui.headerBackground }}
            />
            <div className={styles.colorInfo}>
              <span className={styles.colorName}>Header Background</span>
              <span className={styles.colorValue}>{colorTheme.palette.ui.headerBackground}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Contrast Ratios</h4>
        <div className={styles.contrastGrid}>
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: colorTheme.palette.ui.modalHeader,
                color: colorTheme.palette.text.light
              }}
            >
              Modal Header + Light Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(
                  colorTheme.palette.ui.modalHeader,
                  colorTheme.palette.text.light
                );
                return (
                  <>
                    <span className={styles.contrastRatio}>
                      {ratio}:1
                    </span>
                    <span className={isAccessible ? styles.accessible : styles.notAccessible}>
                      {isAccessible ? '✓ WCAG AA' : '✗ Not Accessible'}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: colorTheme.palette.ui.modalBody,
                color: colorTheme.palette.text.primary
              }}
            >
              Modal Body + Primary Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(
                  colorTheme.palette.ui.modalBody,
                  colorTheme.palette.text.primary
                );
                return (
                  <>
                    <span className={styles.contrastRatio}>
                      {ratio}:1
                    </span>
                    <span className={isAccessible ? styles.accessible : styles.notAccessible}>
                      {isAccessible ? '✓ WCAG AA' : '✗ Not Accessible'}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalettePreview;
