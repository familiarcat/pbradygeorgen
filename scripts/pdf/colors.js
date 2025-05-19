/**
 * PDF Color Extraction Module
 *
 * This module extracts colors from PDF files and applies Hesse color theory
 * to create a harmonious color palette.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');

const logger = createLogger('color');

/**
 * Extract colors from a PDF file
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted color information
 */
async function extractColors(pdfPath, options = {}) {
  logger.info(`Extracting colors from PDF: ${pdfPath}`);

  try {
    // Read the PDF file
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the number of pages
    const numPages = pdfDoc.getPageCount();
    logger.info(`PDF has ${numPages} pages`);

    // Arrays to store colors by category
    const textColors = [];
    const backgroundColors = [];
    const accentColors = [];
    const allColors = [];

    // Process each page
    for (let i = 0; i < numPages; i++) {
      logger.info(`Processing page ${i + 1}/${numPages}`);

      // Get the page
      const page = pdfDoc.getPage(i);

      // Get the page content as a string
      const content = await page.doc.saveAsBase64();

      // Extract colors from content with categorization
      const { text, background, accent, all } = extractColorsFromContentWithCategories(content);

      // If no colors were found in the content, try to extract colors from the page directly
      if (all.length === 0) {
        logger.warning('No colors found in content. Adding default colors...');

        // Add default colors based on common PDF color schemes
        const defaultTextColor = config.pdf.defaultFallbacks.colorText;
        const defaultBgColor = config.pdf.defaultFallbacks.colorBackground;
        const defaultAccentColor = config.pdf.defaultFallbacks.colorPrimary;

        text.push(defaultTextColor);
        background.push(defaultBgColor);
        accent.push(defaultAccentColor);
        all.push(defaultTextColor, defaultBgColor, defaultAccentColor);

        logger.info(`Added default colors: ${defaultTextColor}, ${defaultBgColor}, ${defaultAccentColor}`);
      }

      textColors.push(...text);
      backgroundColors.push(...background);
      accentColors.push(...accent);
      allColors.push(...all);
    }

    // Remove duplicates and sort colors
    const uniqueTextColors = [...new Set(textColors)].sort();
    const uniqueBackgroundColors = [...new Set(backgroundColors)].sort();
    const uniqueAccentColors = [...new Set(accentColors)].sort();
    const uniqueAllColors = [...new Set(allColors)].sort();

    logger.info(`Found ${uniqueAllColors.length} unique colors total`);
    logger.info(`Found ${uniqueTextColors.length} text colors`);
    logger.info(`Found ${uniqueBackgroundColors.length} background colors`);
    logger.info(`Found ${uniqueAccentColors.length} accent colors`);

    // If no colors were found or very few colors were found, use a default color palette based on the PDF name
    if (uniqueAllColors.length === 0 || uniqueAllColors.length < 3) {
      logger.warning(`Insufficient colors found in PDF (${uniqueAllColors.length}). Generating a default color palette.`);

      // Get the PDF filename without extension
      const pdfName = path.basename(pdfPath, path.extname(pdfPath)).toLowerCase();

      // Generate a hash from the PDF name to create consistent colors
      const hash = createHashFromString(pdfName);

      // Generate a more comprehensive color palette based on the hash
      const defaultColors = [
        generateColor(hash, 0),     // Primary
        generateColor(hash, 100),   // Secondary
        generateColor(hash, 200),   // Accent
        generateColor(hash, 300),   // Additional color
        generateColor(hash, 50),    // Alternative primary
        generateColor(hash, 150),   // Alternative secondary
        generateColor(hash, 250),   // Alternative accent
        '#000000',                  // Black for text
        '#333333',                  // Dark gray for secondary text
        '#ffffff',                  // White for background
        '#f5f5f5',                  // Light gray for secondary background
        '#e0e0e0'                   // Medium gray for borders
      ];

      // Add to our categorized arrays
      uniqueAllColors.push(...defaultColors);

      // Add text colors
      textColors.push('#000000', '#333333', defaultColors[0], defaultColors[4]);

      // Add background colors
      backgroundColors.push('#ffffff', '#f5f5f5', defaultColors[1]);

      // Add accent colors
      accentColors.push(defaultColors[2], defaultColors[3], defaultColors[5], defaultColors[6]);

      logger.info(`Generated default color palette: ${defaultColors.join(', ')}`);
    }

    // Try to analyze colors with OpenAI if available
    let colorTheory = null;
    try {
      if (process.env.OPENAI_API_KEY) {
        const { analyzeColorsWithOpenAI } = require('../openai/analyzer');
        colorTheory = await analyzeColorsWithOpenAI(pdfPath, uniqueAllColors, uniqueTextColors, uniqueBackgroundColors, uniqueAccentColors);
      } else {
        logger.info('OpenAI API key not found. Skipping color analysis with OpenAI.');
      }
    } catch (error) {
      logger.error(`Error analyzing colors with OpenAI: ${error.message}`);
      logger.info('Falling back to local color theory generation');
    }

    // If OpenAI analysis failed, use local Hesse color theory
    if (!colorTheory) {
      logger.info('Using local Hesse color theory to generate color palette');

      // Apply Hesse color theory to create a harmonious palette
      const colorPalette = createHesseColorPalette(uniqueAllColors, uniqueTextColors, uniqueBackgroundColors, uniqueAccentColors);

      // Create color theory object with the enhanced palette
      colorTheory = {
        primary: colorPalette.primary,
        secondary: colorPalette.secondary,
        accent: colorPalette.accent,
        background: colorPalette.background,
        text: colorPalette.text,
        textSecondary: colorPalette.textSecondary,
        border: colorPalette.border,
        success: colorPalette.success,
        warning: colorPalette.warning,
        error: colorPalette.error,
        info: colorPalette.info,
        allColors: uniqueAllColors
      };
    } else {
      // Ensure the allColors property is set
      colorTheory.allColors = uniqueAllColors;
    }

    // Save the color theory to a JSON file
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);

    const outputPath = path.join(outputDir, 'color_theory.json');
    utils.saveJson(outputPath, colorTheory);

    logger.success(`Color theory saved to ${outputPath}`);

    return {
      success: true,
      colorTheory,
      outputPath
    };
  } catch (error) {
    logger.error(`Error extracting colors: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract colors from content with categorization
 *
 * @param {string} content - The content to extract colors from
 * @returns {Object} - The extracted colors by category
 */
function extractColorsFromContentWithCategories(content) {
  // Regular expressions to match different color formats
  const hexRegex = /#([0-9a-f]{3}){1,2}\b/gi;
  const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
  const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01]?\.?\d*)\s*\)/gi;

  // Extract colors
  const hexColors = content.match(hexRegex) || [];

  // Extract RGB colors and convert to hex
  const rgbColors = [];
  let rgbMatch;
  while ((rgbMatch = rgbRegex.exec(content)) !== null) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const hex = rgbToHex(r, g, b);
    rgbColors.push(hex);
  }

  // Extract RGBA colors and convert to hex
  const rgbaColors = [];
  let rgbaMatch;
  while ((rgbaMatch = rgbaRegex.exec(content)) !== null) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const hex = rgbToHex(r, g, b);
    rgbaColors.push(hex);
  }

  // Combine all colors and normalize
  const allColors = [...hexColors, ...rgbColors, ...rgbaColors].map(color => {
    // Normalize 3-digit hex to 6-digit hex
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return color.toLowerCase(); // Normalize to lowercase
  });

  // Categorize colors
  const textColors = [];
  const backgroundColors = [];
  const accentColors = [];

  allColors.forEach(color => {
    // Skip colors with transparency
    if (color.length !== 7) return;

    try {
      const hsl = hexToHSL(color);

      // Determine if the color is likely to be text
      // Text colors are usually dark (low lightness) or very saturated
      if (hsl.l < 30 || (hsl.l < 50 && hsl.s > 70)) {
        textColors.push(color);
      }
      // Determine if the color is likely to be a background
      // Backgrounds are usually light (high lightness) or very desaturated
      else if (hsl.l > 85 || hsl.s < 10) {
        backgroundColors.push(color);
      }
      // Everything else is considered an accent color
      else {
        accentColors.push(color);
      }
    } catch (error) {
      logger.error(`Error categorizing color ${color}: ${error.message}`);
    }
  });

  return {
    text: textColors,
    background: backgroundColors,
    accent: accentColors,
    all: allColors
  };
}

// Helper functions for color manipulation

/**
 * Convert RGB to hex
 *
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {string} - Hex color string
 */
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Create a hash from a string
 *
 * @param {string} str - The string to hash
 * @returns {number} - The hash value
 */
function createHashFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a color based on a hash and offset
 *
 * @param {number} hash - The hash value
 * @param {number} offset - The offset to apply
 * @returns {string} - Hex color string
 */
function generateColor(hash, offset) {
  // Use the hash to generate HSL values
  const h = (hash + offset) % 360;
  const s = 65 + (hash % 20); // 65-85% saturation
  const l = 45 + (hash % 15); // 45-60% lightness

  // Convert HSL to RGB
  return hslToHex(h, s, l);
}

/**
 * Convert hex color to HSL
 *
 * @param {string} hex - Hex color string
 * @returns {Object} - HSL values {h, s, l}
 */
function hexToHSL(hex) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Convert to percentages
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

/**
 * Convert HSL to hex
 *
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color string
 */
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
}

/**
 * Create a Hesse color palette
 *
 * @param {string[]} baseColors - Base colors
 * @param {string[]} textColors - Text colors
 * @param {string[]} backgroundColors - Background colors
 * @param {string[]} accentColors - Accent colors
 * @returns {Object} - Color palette
 */
function createHesseColorPalette(baseColors, textColors = [], backgroundColors = [], accentColors = []) {
  logger.info('Creating Hesse color palette with advanced color theory...');

  // Default colors
  const defaultPalette = {
    primary: '#3366CC',
    secondary: '#6699CC',
    accent: '#CC6633',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#CCCCCC',
    success: '#00CC66',
    warning: '#FFCC00',
    error: '#CC0000',
    info: '#3399FF'
  };

  // If we have no colors to work with, return the default palette
  if (baseColors.length === 0) {
    logger.warning('No colors found. Using default palette.');
    return defaultPalette;
  }

  // Select primary color (prefer accent colors, then text colors)
  const primary = accentColors.length > 0 ? accentColors[0] :
    (textColors.length > 0 ? textColors[0] :
      (baseColors.length > 0 ? baseColors[0] : defaultPalette.primary));

  // Select background color (prefer background colors)
  const background = backgroundColors.length > 0 ? backgroundColors[0] :
    (baseColors.find(c => {
      const hsl = hexToHSL(c);
      return hsl.l > 85; // Light color
    }) || defaultPalette.background);

  // Select text color (prefer text colors)
  const text = textColors.length > 0 ? textColors[0] :
    (baseColors.find(c => {
      const hsl = hexToHSL(c);
      return hsl.l < 30; // Dark color
    }) || defaultPalette.text);

  // Generate secondary color (complementary to primary)
  const primaryHSL = hexToHSL(primary);
  const secondaryHSL = { ...primaryHSL, h: (primaryHSL.h + 30) % 360 };
  const secondary = hslToHex(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);

  // Generate accent color (complementary to primary)
  const accentHSL = { ...primaryHSL, h: (primaryHSL.h + 180) % 360 };
  const accent = accentColors.length > 1 ? accentColors[1] :
    (hslToHex(accentHSL.h, accentHSL.s, accentHSL.l));

  // Generate secondary text color
  const textHSL = hexToHSL(text);
  const textSecondaryHSL = { ...textHSL, l: Math.min(textHSL.l + 30, 60) };
  const textSecondary = hslToHex(textSecondaryHSL.h, textSecondaryHSL.s, textSecondaryHSL.l);

  // Generate border color
  const borderHSL = { ...primaryHSL, s: primaryHSL.s * 0.5, l: 85 };
  const border = hslToHex(borderHSL.h, borderHSL.s, borderHSL.l);

  // Generate semantic colors
  const successHSL = { h: 120, s: 60, l: 40 }; // Green
  const warningHSL = { h: 45, s: 100, l: 50 }; // Yellow
  const errorHSL = { h: 0, s: 100, l: 40 }; // Red
  const infoHSL = { h: 210, s: 100, l: 50 }; // Blue

  const success = hslToHex(successHSL.h, successHSL.s, successHSL.l);
  const warning = hslToHex(warningHSL.h, warningHSL.s, warningHSL.l);
  const error = hslToHex(errorHSL.h, errorHSL.s, errorHSL.l);
  const info = hslToHex(infoHSL.h, infoHSL.s, infoHSL.l);

  return {
    primary,
    secondary,
    accent,
    background,
    text,
    textSecondary,
    border,
    success,
    warning,
    error,
    info
  };
}

module.exports = {
  extractColors,
  rgbToHex,
  hexToHSL,
  hslToHex,
  createHesseColorPalette
};
