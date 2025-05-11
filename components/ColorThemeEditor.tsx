'use client';

import React, { useState, useEffect } from 'react';
import { useServerTheme } from './ServerThemeProvider';
import { useAdmin } from '@/contexts/AdminContext';
import HesseColorTheory from '@/utils/HesseColorTheory';
import { DanteLogger } from '@/utils/DanteLogger';
import { analyzeColorsWithOpenAI } from '@/utils/OpenAIColorAnalyzer';
import styles from '@/styles/ColorThemeEditor.module.css';

/**
 * ColorThemeEditor component
 *
 * Provides a comprehensive interface for viewing and editing the color theme
 * extracted from the PDF.
 *
 * Philosophical Framework:
 * - Hesse: Mathematical precision in color relationships
 * - Derrida: Deconstructing color theory to understand its components
 * - Salinger: Intuitive interface for color adjustments
 */
const ColorThemeEditor: React.FC = () => {
  const { colorTheme, updateTheme } = useServerTheme();
  const { isAdminMode } = useAdmin();
  const [editedTheme, setEditedTheme] = useState(colorTheme);
  const [activeTab, setActiveTab] = useState('primary');
  const [showTailwindValues, setShowTailwindValues] = useState(false);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Update local state when colorTheme changes
  useEffect(() => {
    console.log('ColorTheme changed:', colorTheme);

    // Default theme values
    const defaultTheme = {
      primary: '#3a6ea5',
      secondary: '#004e98',
      accent: '#ff6700',
      background: '#f6f6f6',
      text: '#333333',
      border: '#c0c0c0',
      isDark: false,
      isLoading: false,
      rawColors: ['#3a6ea5', '#004e98', '#ff6700', '#f6f6f6', '#333333', '#c0c0c0']
    };

    // Check if the colorTheme exists
    if (!colorTheme) {
      console.warn('ColorTheme is undefined, using default theme');

      // Create a theme with default values
      const defaultColorTheme = { ...defaultTheme };

      // Generate a palette
      defaultColorTheme.palette = HesseColorTheory.generateComprehensiveColorPalette(
        defaultTheme.primary,
        defaultTheme.secondary,
        defaultTheme.accent,
        defaultTheme.background,
        defaultTheme.text,
        defaultTheme.border,
        defaultTheme.isDark
      );

      // Update the state with the default theme
      setEditedTheme(defaultColorTheme);
    }
    // Check if the colorTheme exists but doesn't have a palette
    else if (!colorTheme.palette) {
      console.warn('ColorTheme does not have a palette, generating one');

      // Create a copy of the colorTheme with a generated palette
      const themeWithPalette = { ...colorTheme };

      // Generate a palette if it doesn't exist
      themeWithPalette.palette = HesseColorTheory.generateComprehensiveColorPalette(
        colorTheme.primary || defaultTheme.primary,
        colorTheme.secondary || defaultTheme.secondary,
        colorTheme.accent || defaultTheme.accent,
        colorTheme.background || defaultTheme.background,
        colorTheme.text || defaultTheme.text,
        colorTheme.border || defaultTheme.border,
        colorTheme.isDark || defaultTheme.isDark
      );

      // Update the state with the enhanced theme
      setEditedTheme(themeWithPalette);
    } else {
      // Update the state with the original theme
      setEditedTheme(colorTheme);
    }
  }, [colorTheme]);

  // Handle color change
  const handleColorChange = (category: string, variant: string, value: string) => {
    if (!isAdminMode) return;

    setEditedTheme(prev => {
      const newTheme = { ...prev };

      // Handle nested properties
      if (category === 'primary' || category === 'secondary' || category === 'accent') {
        newTheme.palette = {
          ...newTheme.palette,
          [category]: {
            ...newTheme.palette[category],
            [variant]: value
          }
        };
      } else if (category === 'ui') {
        newTheme.palette = {
          ...newTheme.palette,
          ui: {
            ...newTheme.palette.ui,
            [variant]: value
          }
        };
      } else if (category === 'text') {
        newTheme.palette = {
          ...newTheme.palette,
          text: {
            ...newTheme.palette.text,
            [variant]: value
          }
        };
      }

      return newTheme;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!isAdminMode) return;

    try {
      DanteLogger.info.system('💾 Saving updated color theme');
      await updateTheme(editedTheme);
      DanteLogger.success.ux('✅ Color theme updated successfully');
    } catch (error) {
      DanteLogger.error.runtime(`❌ Error updating color theme: ${error}`);
    }
  };

  // Reset changes
  const handleReset = () => {
    setEditedTheme(colorTheme);
    DanteLogger.info.ux('🔄 Reset color theme to original values');
  };

  // Trigger OpenAI analysis
  const handleOpenAIAnalysis = async () => {
    if (!isAdminMode) return;

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      DanteLogger.info.system('🧠 Triggering OpenAI color analysis');

      // Get the raw colors from the current theme
      const rawColors = editedTheme.rawColors || [];

      // Force a refresh to bypass cache
      const analyzedTheme = await analyzeColorsWithOpenAI(rawColors, true);

      // Update the edited theme with the analyzed theme
      setEditedTheme(analyzedTheme);

      DanteLogger.success.ux('✅ OpenAI color analysis completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      DanteLogger.error.runtime(`❌ Error during OpenAI color analysis: ${errorMessage}`);
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Tailwind-compatible color value
  const getTailwindValue = (hexColor: string) => {
    if (!hexColor) return '';
    return hexColor.replace('#', '');
  };

  // Calculate contrast ratio for a color pair
  const calculateContrastRatio = (background: string | undefined, text: string | undefined) => {
    // Default values if colors are undefined
    const safeBackground = background || '#ffffff';
    const safeText = text || '#000000';

    try {
      const ratio = HesseColorTheory.calculateContrastRatio(safeBackground, safeText);
      const isAccessible = ratio >= 4.5;
      return {
        ratio: ratio.toFixed(2),
        isAccessible
      };
    } catch (error) {
      console.error('Error calculating contrast ratio:', error);
      return {
        ratio: '0.00',
        isAccessible: false
      };
    }
  };

  // Render color input with label
  const renderColorInput = (label: string, category: string, variant: string, value: string) => {
    // Default color values for different categories
    const defaultColors = {
      primary: {
        base: '#3a6ea5',
        light: '#5a8ec5',
        lighter: '#7aaedf',
        dark: '#1a4e85',
        darker: '#0a3e75',
        contrast: '#ffffff'
      },
      secondary: {
        base: '#004e98',
        light: '#206eb8',
        lighter: '#408ed8',
        dark: '#003e78',
        darker: '#002e58',
        contrast: '#ffffff'
      },
      accent: {
        base: '#ff6700',
        light: '#ff8720',
        lighter: '#ffa740',
        dark: '#e05a00',
        darker: '#c04a00',
        contrast: '#ffffff'
      },
      ui: {
        modalHeader: '#5a8ec5',
        modalBody: '#f8f8f8',
        headerBackground: 'rgba(246, 246, 246, 0.95)',
        background: '#ffffff',
        cardBackground: '#f8f9fa'
      },
      text: {
        primary: '#333333',
        secondary: '#555555',
        light: '#777777',
        dark: '#111111'
      }
    };

    // Use the provided value or fall back to the default
    const safeValue = value || (defaultColors[category as keyof typeof defaultColors]?.[variant as any] || '#000000');

    return (
      <div className={styles.colorInput}>
        <label className={styles.colorLabel}>
          {label}
          {showTailwindValues && (
            <span className={styles.tailwindValue}>bg-[#{getTailwindValue(safeValue)}]</span>
          )}
        </label>
        <div className={styles.colorInputWrapper}>
          <input
            type="color"
            value={safeValue}
            onChange={(e) => handleColorChange(category, variant, e.target.value)}
            disabled={!isAdminMode}
            className={styles.colorPicker}
          />
          <input
            type="text"
            value={safeValue}
            onChange={(e) => handleColorChange(category, variant, e.target.value)}
            disabled={!isAdminMode}
            className={styles.colorText}
          />
        </div>
      </div>
    );
  };

  // Render primary colors tab
  const renderPrimaryColorsTab = () => {
    if (!editedTheme || !editedTheme.palette?.primary) return <p>No primary colors available</p>;

    return (
      <div className={styles.colorGrid}>
        {renderColorInput('Base', 'primary', 'base', editedTheme.palette.primary.base)}
        {renderColorInput('Light', 'primary', 'light', editedTheme.palette.primary.light)}
        {renderColorInput('Lighter', 'primary', 'lighter', editedTheme.palette.primary.lighter)}
        {renderColorInput('Dark', 'primary', 'dark', editedTheme.palette.primary.dark)}
        {renderColorInput('Darker', 'primary', 'darker', editedTheme.palette.primary.darker)}
        {renderColorInput('Contrast', 'primary', 'contrast', editedTheme.palette.primary.contrast)}
      </div>
    );
  };

  // Render secondary colors tab
  const renderSecondaryColorsTab = () => {
    if (!editedTheme || !editedTheme.palette?.secondary) return <p>No secondary colors available</p>;

    return (
      <div className={styles.colorGrid}>
        {renderColorInput('Base', 'secondary', 'base', editedTheme.palette.secondary.base)}
        {renderColorInput('Light', 'secondary', 'light', editedTheme.palette.secondary.light)}
        {renderColorInput('Lighter', 'secondary', 'lighter', editedTheme.palette.secondary.lighter)}
        {renderColorInput('Dark', 'secondary', 'dark', editedTheme.palette.secondary.dark)}
        {renderColorInput('Darker', 'secondary', 'darker', editedTheme.palette.secondary.darker)}
        {renderColorInput('Contrast', 'secondary', 'contrast', editedTheme.palette.secondary.contrast)}
      </div>
    );
  };

  // Render accent colors tab
  const renderAccentColorsTab = () => {
    if (!editedTheme || !editedTheme.palette?.accent) return <p>No accent colors available</p>;

    return (
      <div className={styles.colorGrid}>
        {renderColorInput('Base', 'accent', 'base', editedTheme.palette.accent.base)}
        {renderColorInput('Light', 'accent', 'light', editedTheme.palette.accent.light)}
        {renderColorInput('Lighter', 'accent', 'lighter', editedTheme.palette.accent.lighter)}
        {renderColorInput('Dark', 'accent', 'dark', editedTheme.palette.accent.dark)}
        {renderColorInput('Darker', 'accent', 'darker', editedTheme.palette.accent.darker)}
        {renderColorInput('Contrast', 'accent', 'contrast', editedTheme.palette.accent.contrast)}
      </div>
    );
  };

  // Render UI colors tab
  const renderUIColorsTab = () => {
    if (!editedTheme || !editedTheme.palette?.ui) return <p>No UI colors available</p>;

    return (
      <div className={styles.colorGrid}>
        {renderColorInput('Modal Header', 'ui', 'modalHeader', editedTheme.palette.ui.modalHeader)}
        {renderColorInput('Modal Body', 'ui', 'modalBody', editedTheme.palette.ui.modalBody)}
        {renderColorInput('Header Background', 'ui', 'headerBackground', editedTheme.palette.ui.headerBackground)}
        {renderColorInput('Background', 'ui', 'background', editedTheme.palette.ui.background || '#ffffff')}
        {renderColorInput('Card Background', 'ui', 'cardBackground', editedTheme.palette.ui.cardBackground || '#f8f9fa')}
      </div>
    );
  };

  // Render text colors tab
  const renderTextColorsTab = () => {
    if (!editedTheme || !editedTheme.palette?.text) return <p>No text colors available</p>;

    return (
      <div className={styles.colorGrid}>
        {renderColorInput('Primary', 'text', 'primary', editedTheme.palette.text.primary)}
        {renderColorInput('Secondary', 'text', 'secondary', editedTheme.palette.text.secondary)}
        {renderColorInput('Light', 'text', 'light', editedTheme.palette.text.light)}
        {renderColorInput('Dark', 'text', 'dark', editedTheme.palette.text.dark || '#000000')}
      </div>
    );
  };

  // Render contrast checker
  const renderContrastChecker = () => {
    if (!editedTheme || !editedTheme.palette) return null;

    // Default values for UI and text colors
    const defaultUi = {
      modalHeader: '#5a8ec5',
      modalBody: '#f8f8f8',
      headerBackground: 'rgba(246, 246, 246, 0.95)',
      background: '#ffffff',
      cardBackground: '#f8f9fa'
    };

    // Ensure UI object has all required properties
    const ensureUiProperties = (ui: any) => {
      return {
        modalHeader: ui?.modalHeader || defaultUi.modalHeader,
        modalBody: ui?.modalBody || defaultUi.modalBody,
        headerBackground: ui?.headerBackground || defaultUi.headerBackground,
        background: ui?.background || defaultUi.background,
        cardBackground: ui?.cardBackground || defaultUi.cardBackground
      };
    };

    const defaultText = {
      primary: '#333333',
      secondary: '#555555',
      light: '#777777',
      dark: '#111111'
    };

    // Ensure text object has all required properties
    const ensureTextProperties = (text: any) => {
      return {
        primary: text?.primary || defaultText.primary,
        secondary: text?.secondary || defaultText.secondary,
        light: text?.light || defaultText.light,
        dark: text?.dark || defaultText.dark
      };
    };

    // Use the palette values or fall back to defaults
    const ui = ensureUiProperties(editedTheme.palette.ui);
    const text = ensureTextProperties(editedTheme.palette.text);
    const primary = editedTheme.palette.primary?.base || editedTheme.primary || '#3a6ea5';
    const secondary = editedTheme.palette.secondary?.base || editedTheme.secondary || '#004e98';
    const accent = editedTheme.palette.accent?.base || editedTheme.accent || '#ff6700';

    return (
      <div className={styles.contrastSection}>
        <h3 className={styles.sectionTitle}>Accessibility Contrast Checker</h3>
        <p className="mb-4 text-sm text-gray-600">
          The contrast checker evaluates color combinations against WCAG AA standards, which require a minimum contrast ratio of 4.5:1 for normal text.
          A "Not Accessible" warning indicates that the current color combination may be difficult to read for some users, especially those with visual impairments.
        </p>

        <div className={styles.contrastGrid}>
          {/* Modal Header + Light Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: ui.modalHeader,
                color: text.light
              }}
            >
              Modal Header + Light Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(ui.modalHeader, text.light);
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

          {/* Modal Body + Primary Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: ui.modalBody,
                color: text.primary
              }}
            >
              Modal Body + Primary Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(ui.modalBody, text.primary);
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

          {/* Primary Button + White Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: primary,
                color: '#ffffff'
              }}
            >
              Primary Button + White Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(primary, '#ffffff');
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

          {/* Secondary Button + White Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: secondary,
                color: '#ffffff'
              }}
            >
              Secondary Button + White Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(secondary, '#ffffff');
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

          {/* Accent Button + White Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: accent,
                color: '#ffffff'
              }}
            >
              Accent Button + White Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(accent, '#ffffff');
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

          {/* Background + Primary Text */}
          <div className={styles.contrastItem}>
            <div
              className={styles.contrastSwatch}
              style={{
                backgroundColor: ui.background,
                color: text.primary
              }}
            >
              Background + Primary Text
            </div>
            <div className={styles.contrastInfo}>
              {(() => {
                const { ratio, isAccessible } = calculateContrastRatio(ui.background, text.primary);
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

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-sm font-bold text-blue-800 mb-1">Accessibility Tips</h4>
          <ul className="text-xs text-blue-700 list-disc pl-4">
            <li>Aim for a contrast ratio of at least 4.5:1 for normal text (WCAG AA)</li>
            <li>For large text (18pt+), a contrast ratio of 3:1 is acceptable</li>
            <li>For optimal accessibility (WCAG AAA), aim for 7:1 contrast ratio</li>
            <li>If a combination fails, try adjusting the colors to increase contrast</li>
            <li>Consider using darker shades of your primary colors for text on light backgrounds</li>
            <li>For buttons with text, ensure the text has sufficient contrast with the button color</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Color Theme Editor</h2>
        <div className={styles.actions}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showTailwindValues}
              onChange={() => setShowTailwindValues(!showTailwindValues)}
              className={styles.toggleInput}
            />
            Show Tailwind Values
          </label>
          <div className={styles.previewToggle}>
            <button
              className={`${styles.previewButton} ${previewMode === 'light' ? styles.activePreview : ''}`}
              onClick={() => setPreviewMode('light')}
            >
              Light
            </button>
            <button
              className={`${styles.previewButton} ${previewMode === 'dark' ? styles.activePreview : ''}`}
              onClick={() => setPreviewMode('dark')}
            >
              Dark
            </button>
          </div>
          {isAdminMode && (
            <div className={styles.editorActions}>
              <button
                onClick={handleReset}
                className={styles.resetButton}
                disabled={isAnalyzing}
              >
                Reset
              </button>
              <button
                onClick={handleOpenAIAnalysis}
                className={styles.analyzeButton}
                disabled={isAnalyzing}
                title="Analyze colors with OpenAI"
              >
                {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
              </button>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={isAnalyzing}
              >
                Save Changes
              </button>
            </div>
          )}
          {analysisError && (
            <div className={styles.errorMessage}>
              Error: {analysisError}
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'primary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('primary')}
        >
          Primary
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'secondary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('secondary')}
        >
          Secondary
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'accent' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('accent')}
        >
          Accent
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'ui' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ui')}
        >
          UI
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'text' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'primary' && renderPrimaryColorsTab()}
        {activeTab === 'secondary' && renderSecondaryColorsTab()}
        {activeTab === 'accent' && renderAccentColorsTab()}
        {activeTab === 'ui' && renderUIColorsTab()}
        {activeTab === 'text' && renderTextColorsTab()}
      </div>

      {renderContrastChecker()}
    </div>
  );
};

export default ColorThemeEditor;
