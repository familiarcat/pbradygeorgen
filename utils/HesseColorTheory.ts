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
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
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
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const l1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  // Ensure the lighter color is l1
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Adjust color lightness using HSL transformation
export function adjustLightness(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  
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
}

// Generate a complementary color
export function getComplementaryColor(color: string): string {
  const rgb = hexToRgb(color);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

// Golden ratio color harmony (Hesse mathematical approach)
export function getGoldenRatioColor(color: string): string {
  const goldenRatio = 0.618033988749895;
  const rgb = hexToRgb(color);
  
  // Convert to HSL
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
}

// Generate CTA background color with proper contrast against text
export function generateCtaBackground(baseColor: string, textColor: string = '#FFFFFF'): string {
  let ctaColor = baseColor;
  let contrastRatio = calculateContrastRatio(ctaColor, textColor);
  
  // Apply Derrida's différance principle - ensure sufficient contrast
  // WCAG AA requires 4.5:1 for normal text
  if (contrastRatio < 4.5) {
    // Adjust lightness until we achieve sufficient contrast
    let adjustment = 0.05;
    let maxIterations = 20; // Prevent infinite loops
    
    while (contrastRatio < 4.5 && maxIterations > 0) {
      // Darken the color to increase contrast with white text
      ctaColor = adjustLightness(ctaColor, -adjustment);
      contrastRatio = calculateContrastRatio(ctaColor, textColor);
      maxIterations--;
    }
    
    // Log the contrast adjustment using Dante
    DanteLogger.success.ux(`Applied Derrida's différance to CTA color. Contrast ratio: ${contrastRatio.toFixed(2)}:1`);
  }
  
  return ctaColor;
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

export function generateSalingerCtaColors(baseColor: string): SalingerCtaColors {
  // Extract colors using Hesse's mathematical approach
  const primaryColor = generateCtaBackground(baseColor);
  const secondaryColor = generateCtaBackground(getGoldenRatioColor(baseColor));
  const tertiaryColor = generateCtaBackground(adjustLightness(baseColor, 0.2));
  
  // Log the color generation using Dante
  DanteLogger.success.core(`Generated Salinger CTA colors using Hesse method from base: ${baseColor}`);
  
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
}

// Analyze and log color contrast information
export function analyzeColorContrast(colors: SalingerCtaColors): void {
  const primaryContrast = calculateContrastRatio(colors.primary.base, colors.primary.text);
  const secondaryContrast = calculateContrastRatio(colors.secondary.base, colors.secondary.text);
  const tertiaryContrast = calculateContrastRatio(colors.tertiary.base, colors.tertiary.text);
  
  // Log using Dante's levels based on contrast values
  if (primaryContrast >= 7) {
    DanteLogger.success.perfection(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (AAA)`);
  } else if (primaryContrast >= 4.5) {
    DanteLogger.success.core(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (AA)`);
  } else {
    DanteLogger.warn.performance(`Primary CTA contrast: ${primaryContrast.toFixed(2)}:1 (Below AA)`);
  }
  
  if (secondaryContrast >= 7) {
    DanteLogger.success.perfection(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (AAA)`);
  } else if (secondaryContrast >= 4.5) {
    DanteLogger.success.core(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (AA)`);
  } else {
    DanteLogger.warn.performance(`Secondary CTA contrast: ${secondaryContrast.toFixed(2)}:1 (Below AA)`);
  }
  
  if (tertiaryContrast >= 7) {
    DanteLogger.success.perfection(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (AAA)`);
  } else if (tertiaryContrast >= 4.5) {
    DanteLogger.success.core(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (AA)`);
  } else {
    DanteLogger.warn.performance(`Tertiary CTA contrast: ${tertiaryContrast.toFixed(2)}:1 (Below AA)`);
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
  analyzeColorContrast
};
