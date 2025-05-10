'use client';

import { DanteLogger } from './DanteLogger';

/**
 * HesseColorTheory - A mathematical approach to color theory
 *
 * This utility implements Hermann Hesse's philosophical approach to color theory,
 * where colors are derived through mathematical relationships rather than arbitrary selection.
 *
 * The system creates a harmonious color palette with calculated variations based on:
 * - Base color (extracted from PDF)
 * - Mathematical relationships (golden ratio, complementary angles, etc.)
 * - Visual hierarchy considerations (Salinger philosophy)
 * - Contrast requirements (Derrida's différance principle)
 */

// Color conversion utilities
export function hexToRgb(hex: string | undefined): { r: number; g: number; b: number } {
  // Default to white if hex is undefined
  if (!hex) {
    return { r: 255, g: 255, b: 255 };
  }

  try {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Handle shorthand hex (e.g., #fff)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      console.warn(`Invalid hex color: ${hex}, defaulting to white`);
      return { r: 255, g: 255, b: 255 };
    }

    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  } catch (error) {
    console.error('Error in hexToRgb:', error);
    return { r: 255, g: 255, b: 255 }; // Default to white on error
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Calculate luminance for contrast checking (WCAG formula)
export function calculateLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio between two colors (WCAG formula)
export function calculateContrastRatio(color1: string | undefined, color2: string | undefined): number {
  try {
    // Default to black and white if colors are undefined
    const safeColor1 = color1 || '#ffffff';
    const safeColor2 = color2 || '#000000';

    const rgb1 = hexToRgb(safeColor1);
    const rgb2 = hexToRgb(safeColor2);

    const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

    // Ensure the lighter color is l1
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 21; // Return a high contrast ratio as a fallback (black on white is 21:1)
  }
}

// Adjust color lightness using HSL transformation
export function adjustLightness(color: string | undefined, amount: number): string {
  try {
    // Default to a medium gray if color is undefined
    const safeColor = color || '#808080';

    const rgb = hexToRgb(safeColor);

    // Convert RGB to HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    // Adjust lightness
    l = Math.max(0, Math.min(1, l + amount));

    // Convert back to RGB
    let r1 = 0, g1 = 0, b1 = 0;

    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r1 = hue2rgb(p, q, h + 1/3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1/3);
    }

    return rgbToHex(Math.round(r1 * 255), Math.round(g1 * 255), Math.round(b1 * 255));
  } catch (error) {
    console.error('Error adjusting lightness:', error);
    return color || '#808080'; // Return the original color or a default gray
  }
}

// Generate a complementary color
export function getComplementaryColor(color: string | undefined): string {
  try {
    // Default to a medium gray if color is undefined
    const safeColor = color || '#808080';

    const rgb = hexToRgb(safeColor);
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
  } catch (error) {
    console.error('Error generating complementary color:', error);
    return '#ff7f7f'; // Return a default complementary color (light red)
  }
}

// Golden ratio color harmony (Hesse mathematical approach)
export function getGoldenRatioColor(color: string | undefined): string {
  try {
    // Default to a medium gray if color is undefined
    const safeColor = color || '#808080';

    const goldenRatio = 0.618033988749895;
    const rgb = hexToRgb(safeColor);

    // Convert to HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    // Apply golden ratio to hue
    h = (h + goldenRatio) % 1;

    // Convert back to RGB
    let r1 = 0, g1 = 0, b1 = 0;

    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r1 = hue2rgb(p, q, h + 1/3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1/3);
    }

    return rgbToHex(Math.round(r1 * 255), Math.round(g1 * 255), Math.round(b1 * 255));
  } catch (error) {
    console.error('Error generating golden ratio color:', error);
    return '#7f7fff'; // Return a default golden ratio color (light blue)
  }
}

// Generate CTA background color with proper contrast against text
export function generateCtaBackground(baseColor: string | undefined, textColor: string = '#FFFFFF'): string {
  try {
    // Default to a medium blue if baseColor is undefined
    const safeBaseColor = baseColor || '#3a6ea5';

    let ctaColor = safeBaseColor;
    let contrastRatio = calculateContrastRatio(ctaColor, textColor);

    // Apply Derrida's différance principle - ensure sufficient contrast
    // WCAG AA requires 4.5:1 for normal text
    if (contrastRatio < 4.5) {
      // Adjust lightness until we achieve sufficient contrast
      const adjustment = 0.05;
      let maxIterations = 20; // Prevent infinite loops

      while (contrastRatio < 4.5 && maxIterations > 0) {
        // Darken the color to increase contrast with white text
        ctaColor = adjustLightness(ctaColor, -adjustment);
        contrastRatio = calculateContrastRatio(ctaColor, textColor);
        maxIterations--;
      }

      // Log the contrast adjustment using Dante
      try {
        DanteLogger.success.ux(`Applied Derrida's différance to CTA color. Contrast ratio: ${contrastRatio.toFixed(2)}:1`);
      } catch (logError) {
        console.log(`Applied Derrida's différance to CTA color. Contrast ratio: ${contrastRatio.toFixed(2)}:1`);
      }
    }

    return ctaColor;
  } catch (error) {
    console.error('Error generating CTA background:', error);
    return '#3a6ea5'; // Return a default CTA color (medium blue)
  }
}

// Generate a set of CTA colors based on Salinger visual hierarchy
export interface SalingerCtaColors {
  primary: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  secondary: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
  tertiary: {
    base: string;
    hover: string;
    active: string;
    text: string;
  };
}

export function generateSalingerCtaColors(baseColor: string | undefined): SalingerCtaColors {
  try {
    // Default to a medium blue if baseColor is undefined
    const safeBaseColor = baseColor || '#3a6ea5';

    // Extract colors using Hesse's mathematical approach
    const primaryColor = generateCtaBackground(safeBaseColor);
    const secondaryColor = generateCtaBackground(getGoldenRatioColor(safeBaseColor));
    const tertiaryColor = generateCtaBackground(adjustLightness(safeBaseColor, 0.2));

    // Log the color generation using console instead of Dante to avoid errors
    console.log(`Generated Salinger CTA colors using Hesse method from base: ${safeBaseColor}`);

    return {
      primary: {
        base: primaryColor,
        hover: adjustLightness(primaryColor, 0.1),
        active: adjustLightness(primaryColor, -0.1),
        text: '#FFFFFF'
      },
      secondary: {
        base: secondaryColor,
        hover: adjustLightness(secondaryColor, 0.1),
        active: adjustLightness(secondaryColor, -0.1),
        text: '#FFFFFF'
      },
      tertiary: {
        base: tertiaryColor,
        hover: adjustLightness(tertiaryColor, 0.1),
        active: adjustLightness(tertiaryColor, -0.1),
        text: '#FFFFFF'
      }
    };
  } catch (error) {
    console.error('Error generating Salinger CTA colors:', error);

    // Return default CTA colors
    return {
      primary: {
        base: '#3a6ea5',
        hover: '#4a7eb5',
        active: '#2a5e95',
        text: '#FFFFFF'
      },
      secondary: {
        base: '#5a9933',
        hover: '#6aa943',
        active: '#4a8923',
        text: '#FFFFFF'
      },
      tertiary: {
        base: '#ff6700',
        hover: '#ff7710',
        active: '#e05a00',
        text: '#FFFFFF'
      }
    };
  }
}

// Analyze and log color contrast information
export function analyzeColorContrast(colors: SalingerCtaColors | undefined): void {
  try {
    if (!colors) {
      console.warn('No colors provided for contrast analysis');
      return;
    }

    // Ensure all required properties exist
    const safeColors = {
      primary: {
        base: colors.primary?.base || '#3a6ea5',
        text: colors.primary?.text || '#FFFFFF'
      },
      secondary: {
        base: colors.secondary?.base || '#5a9933',
        text: colors.secondary?.text || '#FFFFFF'
      },
      tertiary: {
        base: colors.tertiary?.base || '#ff6700',
        text: colors.tertiary?.text || '#FFFFFF'
      }
    };

    const primaryContrast = calculateContrastRatio(safeColors.primary.base, safeColors.primary.text);
    const secondaryContrast = calculateContrastRatio(safeColors.secondary.base, safeColors.secondary.text);
    const tertiaryContrast = calculateContrastRatio(safeColors.tertiary.base, safeColors.tertiary.text);

    // Log using console instead of Dante to avoid errors
    if (primaryContrast >= 7) {
      console.log(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (AAA)`);
    } else if (primaryContrast >= 4.5) {
      console.log(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (AA)`);
    } else {
      console.warn(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (Below AA)`);
    }

    if (secondaryContrast >= 7) {
      console.log(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (AAA)`);
    } else if (secondaryContrast >= 4.5) {
      console.log(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (AA)`);
    } else {
      console.warn(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (Below AA)`);
    }

    if (tertiaryContrast >= 7) {
      console.log(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (AAA)`);
    } else if (tertiaryContrast >= 4.5) {
      console.log(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (AA)`);
    } else {
      console.warn(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (Below AA)`);
    }
  } catch (error) {
    console.error('Error analyzing color contrast:', error);
  }
}

// Generate a comprehensive color palette with light/dark variants
export interface ColorVariants {
  base: string;
  light: string;
  lighter: string;
  dark: string;
  darker: string;
  contrast: string; // High contrast version for accessibility
}

export interface ComprehensiveColorPalette {
  primary: ColorVariants;
  secondary: ColorVariants;
  accent: ColorVariants;
  background: {
    base: string;
    light: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
  };
  border: {
    light: string;
    base: string;
    dark: string;
  };
  ui: {
    modalHeader: string;
    modalBody: string;
    headerBackground: string;
  };
  isDark: boolean;
}

/**
 * Generates a comprehensive color palette with light/dark variants
 * using Hesse's mathematical approach to color theory
 */
export function generateComprehensiveColorPalette(
  primary: string | undefined,
  secondary: string | undefined,
  accent: string | undefined,
  background: string | undefined,
  text: string | undefined,
  border: string | undefined,
  isDark: boolean
): ComprehensiveColorPalette {
  try {
  // Default colors if undefined
    const safePrimary = primary || '#3a6ea5';
    const safeSecondary = secondary || '#004e98';
    const safeAccent = accent || '#ff6700';
    const safeBackground = background || '#f6f6f6';
    const safeText = text || '#333333';
    const safeBorder = border || '#c0c0c0';

    // Generate variants for primary color
    const primaryVariants: ColorVariants = {
      base: safePrimary,
      light: adjustLightness(safePrimary, 0.15),
      lighter: adjustLightness(safePrimary, 0.3),
      dark: adjustLightness(safePrimary, -0.15),
      darker: adjustLightness(safePrimary, -0.3),
      contrast: generateCtaBackground(safePrimary, isDark ? '#000000' : '#FFFFFF')
    };

    // Generate variants for secondary color
    const secondaryVariants: ColorVariants = {
      base: safeSecondary,
      light: adjustLightness(safeSecondary, 0.15),
      lighter: adjustLightness(safeSecondary, 0.3),
      dark: adjustLightness(safeSecondary, -0.15),
      darker: adjustLightness(safeSecondary, -0.3),
      contrast: generateCtaBackground(safeSecondary, isDark ? '#000000' : '#FFFFFF')
    };

    // Generate variants for accent color
    const accentVariants: ColorVariants = {
      base: safeAccent,
      light: adjustLightness(safeAccent, 0.15),
      lighter: adjustLightness(safeAccent, 0.3),
      dark: adjustLightness(safeAccent, -0.15),
      darker: adjustLightness(safeAccent, -0.3),
      contrast: generateCtaBackground(safeAccent, isDark ? '#000000' : '#FFFFFF')
    };

    // Generate background variants
    const backgroundVariants = {
      base: safeBackground,
      light: adjustLightness(safeBackground, 0.1),
      dark: adjustLightness(safeBackground, -0.1)
    };

    // Generate text variants
    const textVariants = {
      primary: safeText,
      secondary: adjustLightness(safeText, isDark ? 0.2 : -0.2),
      light: isDark ? '#FFFFFF' : adjustLightness(safeText, 0.3),
      dark: isDark ? adjustLightness(safeText, -0.3) : '#000000'
    };

    // Generate border variants
    const borderVariants = {
      base: safeBorder,
      light: adjustLightness(safeBorder, 0.1),
      dark: adjustLightness(safeBorder, -0.1)
    };

    // Generate UI-specific colors
    // These are carefully calculated to ensure proper contrast and legibility
    const uiColors = {
      // Modal header should have good contrast with text but not be too jarring
      modalHeader: isDark
        ? adjustLightness(safePrimary, -0.2) // Darker version of primary for dark mode
        : adjustLightness(safePrimary, 0.4), // Lighter version of primary for light mode

      // Modal body should be subtle but distinct from the background
      modalBody: isDark
        ? adjustLightness(safeBackground, -0.05) // Slightly darker than background for dark mode
        : adjustLightness(safeBackground, 0.05), // Slightly lighter than background for light mode

      // Header background should be subtle
      headerBackground: isDark
        ? `rgba(${hexToRgb(adjustLightness(safeBackground, -0.1)).r}, ${hexToRgb(adjustLightness(safeBackground, -0.1)).g}, ${hexToRgb(adjustLightness(safeBackground, -0.1)).b}, 0.95)`
        : `rgba(${hexToRgb(adjustLightness(safeBackground, 0.1)).r}, ${hexToRgb(adjustLightness(safeBackground, 0.1)).g}, ${hexToRgb(adjustLightness(safeBackground, 0.1)).b}, 0.95)`
    };

    // Ensure all text/background combinations have sufficient contrast
    // This is a critical step for accessibility
    const ensureContrast = (bgColor: string, textColor: string, minContrast: number = 4.5): string => {
      const contrast = calculateContrastRatio(bgColor, textColor);
      if (contrast >= minContrast) return textColor;

      // Adjust text color to achieve minimum contrast
      let adjustedColor = textColor;
      let adjustmentAmount = isDark ? 0.05 : -0.05; // Lighten in dark mode, darken in light mode
      let attempts = 0;

      while (calculateContrastRatio(bgColor, adjustedColor) < minContrast && attempts < 20) {
        adjustedColor = adjustLightness(adjustedColor, adjustmentAmount);
        attempts++;
      }

      return adjustedColor;
    };

    // Ensure modal header text has good contrast
    const modalHeaderText = ensureContrast(uiColors.modalHeader, textVariants.primary);

    // Log the generated palette
    console.log(`Generated comprehensive color palette using Hesse method`);
    console.log(`- Primary base: ${primaryVariants.base}`);
    console.log(`- Secondary base: ${secondaryVariants.base}`);
    console.log(`- Accent base: ${accentVariants.base}`);
    console.log(`- Modal header: ${uiColors.modalHeader} (contrast with text: ${calculateContrastRatio(uiColors.modalHeader, modalHeaderText).toFixed(2)}:1)`);

    return {
      primary: primaryVariants,
      secondary: secondaryVariants,
      accent: accentVariants,
      background: backgroundVariants,
      text: textVariants,
      border: borderVariants,
      ui: uiColors,
      isDark
    };
  } catch (error) {
    console.error('Error generating comprehensive color palette:', error);

    // Return a default color palette
    return {
      primary: {
        base: '#3a6ea5',
        light: '#5a8ec5',
        lighter: '#7aaedf',
        dark: '#1a4e85',
        darker: '#0a3e75',
        contrast: '#1a4e85'
      },
      secondary: {
        base: '#004e98',
        light: '#206eb8',
        lighter: '#408ed8',
        dark: '#003e78',
        darker: '#002e58',
        contrast: '#003e78'
      },
      accent: {
        base: '#ff6700',
        light: '#ff8720',
        lighter: '#ffa740',
        dark: '#e05a00',
        darker: '#c04a00',
        contrast: '#e05a00'
      },
      background: {
        base: '#f6f6f6',
        light: '#ffffff',
        dark: '#e6e6e6'
      },
      text: {
        primary: '#333333',
        secondary: '#555555',
        light: '#777777',
        dark: '#111111'
      },
      border: {
        base: '#c0c0c0',
        light: '#d0d0d0',
        dark: '#b0b0b0'
      },
      ui: {
        modalHeader: '#c2f0c7',
        modalBody: '#ffffff',
        headerBackground: 'rgba(246, 246, 246, 0.95)'
      },
      isDark: false
    };
  }
}

export default {
  hexToRgb,
  rgbToHex,
  calculateLuminance,
  calculateContrastRatio,
  adjustLightness,
  getComplementaryColor,
  getGoldenRatioColor,
  generateCtaBackground,
  generateSalingerCtaColors,
  analyzeColorContrast,
  generateComprehensiveColorPalette
};
