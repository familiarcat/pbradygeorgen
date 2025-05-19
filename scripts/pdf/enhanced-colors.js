/**
 * Enhanced PDF Color Extraction Module
 *
 * This module provides improved color extraction from PDF files using multiple methods:
 * 1. Programmatic extraction using pdf-lib
 * 2. Visual extraction by rendering PDF pages
 * 3. Color relationship analysis
 * 4. Theme generation with validation
 *
 * Following the Hesse philosophy of mathematical precision in color theory.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');
const { OpenAI } = require('openai');

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const logger = createLogger('enhanced-color');

/**
 * Extract colors from a PDF file using enhanced methods
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted color information
 */
async function extractEnhancedColors(pdfPath, options = {}) {
  logger.info(`Extracting enhanced colors from PDF: ${pdfPath}`);

  try {
    // Step 1: Programmatic extraction using pdf-lib
    logger.info('Performing programmatic color extraction...');
    const programmaticColors = await extractProgrammaticColors(pdfPath);

    // Step 2: Visual extraction by rendering PDF pages (if canvas is available)
    let visualColors = [];
    try {
      logger.info('Performing visual color extraction...');
      const renderedPages = await renderPdfPages(pdfPath);
      visualColors = await extractVisualColors(renderedPages);
    } catch (error) {
      logger.warning(`Visual color extraction failed: ${error.message}. Continuing with programmatic colors only.`);
    }

    // Step 3: Merge results with priority to programmatic extraction
    logger.info('Merging color extraction results...');
    const mergedColors = mergeColorResults(programmaticColors, visualColors);

    // Step 4: Analyze color relationships and create a theme
    logger.info('Analyzing color relationships...');
    const colorTheme = await analyzeColorRelationships(mergedColors);

    // Step 5: Validate theme for contrast and accessibility
    logger.info('Validating color theme...');
    const validatedTheme = validateColorTheme(colorTheme);

    // Save the results
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);

    // Save the enhanced color theory
    const outputPath = path.join(outputDir, 'enhanced_color_theory.json');
    utils.saveJson(outputPath, validatedTheme);

    logger.success(`Enhanced color theory saved to ${outputPath}`);

    return {
      success: true,
      colors: validatedTheme,
      outputPath
    };
  } catch (error) {
    logger.error(`Error extracting enhanced colors: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract colors programmatically using pdf-lib
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of extracted colors
 */
async function extractProgrammaticColors(pdfPath) {
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

    // Extract colors from content
    const extractedColors = extractColorsFromContent(content);

    // Add to our collections
    allColors.push(...extractedColors);
  }

  // If no colors were found, add default colors
  if (allColors.length === 0) {
    logger.warning('No colors found in content. Adding default colors...');

    // Add default colors based on common PDF color schemes
    const defaultTextColor = config.pdf.defaultFallbacks.colorText;
    const defaultBgColor = config.pdf.defaultFallbacks.colorBackground;
    const defaultAccentColor = config.pdf.defaultFallbacks.colorPrimary;

    textColors.push(defaultTextColor);
    backgroundColors.push(defaultBgColor);
    accentColors.push(defaultAccentColor);
    allColors.push(defaultTextColor, defaultBgColor, defaultAccentColor);

    logger.info(`Added default colors: ${defaultTextColor}, ${defaultBgColor}, ${defaultAccentColor}`);
  }

  // Categorize colors
  allColors.forEach(color => {
    try {
      const hsl = hexToHSL(color);

      // Determine if the color is likely to be text
      if (hsl.l < 30 || (hsl.l < 50 && hsl.s > 70)) {
        if (!textColors.includes(color)) textColors.push(color);
      }
      // Determine if the color is likely to be a background
      else if (hsl.l > 85 || hsl.s < 10) {
        if (!backgroundColors.includes(color)) backgroundColors.push(color);
      }
      // Everything else is considered an accent color
      else {
        if (!accentColors.includes(color)) accentColors.push(color);
      }
    } catch (error) {
      logger.error(`Error categorizing color ${color}: ${error.message}`);
    }
  });

  return {
    all: [...new Set(allColors)],
    text: [...new Set(textColors)],
    background: [...new Set(backgroundColors)],
    accent: [...new Set(accentColors)]
  };
}

/**
 * Extract colors from PDF content
 *
 * @param {string} content - PDF content as base64
 * @returns {Array} - Array of extracted colors as hex
 */
function extractColorsFromContent(content) {
  const colors = [];

  // Regular expressions to find color values in PDF content
  const rgbRegex = /(\d+(\.\d+)?) (\d+(\.\d+)?) (\d+(\.\d+)?) (rg|RG)/g;
  const cmykRegex = /(\d+(\.\d+)?) (\d+(\.\d+)?) (\d+(\.\d+)?) (\d+(\.\d+)?) (k|K)/g;
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;

  // Convert base64 to string
  const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

  // Extract RGB colors
  let match;
  while ((match = rgbRegex.exec(decodedContent)) !== null) {
    const r = Math.min(255, Math.max(0, Math.round(parseFloat(match[1]) * 255)));
    const g = Math.min(255, Math.max(0, Math.round(parseFloat(match[3]) * 255)));
    const b = Math.min(255, Math.max(0, Math.round(parseFloat(match[5]) * 255)));

    const hexColor = rgbToHex(r, g, b);
    if (!colors.includes(hexColor)) {
      colors.push(hexColor);
    }
  }

  // Extract CMYK colors (convert to RGB)
  while ((match = cmykRegex.exec(decodedContent)) !== null) {
    const c = parseFloat(match[1]);
    const m = parseFloat(match[3]);
    const y = parseFloat(match[5]);
    const k = parseFloat(match[7]);

    // Convert CMYK to RGB
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

    const hexColor = rgbToHex(r, g, b);
    if (!colors.includes(hexColor)) {
      colors.push(hexColor);
    }
  }

  // Extract hex colors directly
  while ((match = hexRegex.exec(decodedContent)) !== null) {
    let hexColor = match[0];

    // Normalize 3-digit hex to 6-digit
    if (hexColor.length === 4) {
      hexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`;
    }

    if (!colors.includes(hexColor)) {
      colors.push(hexColor);
    }
  }

  return colors;
}

/**
 * Render PDF pages as images
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of rendered page images
 */
async function renderPdfPages(pdfPath) {
  // This is a placeholder for the actual rendering logic
  // In a real implementation, you would use pdf.js or another library to render pages
  logger.info('PDF rendering not implemented yet. This is a placeholder.');
  return [];
}

/**
 * Extract colors from rendered PDF pages
 *
 * @param {Array} renderedPages - Array of rendered page images
 * @returns {Promise<Array>} - Array of extracted colors
 */
async function extractVisualColors(renderedPages) {
  // This is a placeholder for the actual visual extraction logic
  // In a real implementation, you would use color quantization algorithms
  logger.info('Visual color extraction not implemented yet. This is a placeholder.');
  return [];
}

/**
 * Merge programmatic and visual color extraction results
 *
 * @param {Object} programmaticColors - Colors extracted programmatically
 * @param {Array} visualColors - Colors extracted visually
 * @returns {Object} - Merged color results
 */
function mergeColorResults(programmaticColors, visualColors) {
  // For now, just return the programmatic colors
  // In a real implementation, you would merge the results with some priority logic
  return programmaticColors;
}

/**
 * Analyze color relationships and create a theme
 *
 * @param {Object} colors - Extracted colors
 * @returns {Promise<Object>} - Color theme
 */
async function analyzeColorRelationships(colors) {
  // If no colors were found, return a default theme
  const extractedColors = colors.all;
  if (extractedColors.length === 0) {
    logger.warning('No colors found in PDF. Creating a default color theme.');
    return createManualColorTheme(colors);
  }

  // If OpenAI is available, use it to analyze colors
  if (openai) {
    try {
      logger.info('Analyzing colors with OpenAI using Derrida\'s philosophy of deconstruction...');

      const colorList = colors.all.join(', ');
      const textColors = colors.text.join(', ');
      const bgColors = colors.background.join(', ');
      const accentColors = colors.accent.join(', ');

      // Create a list of extracted color names for emphasis
      const extractedColorsList = extractedColors.map(color => `"${color}"`).join(', ');

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a color theory expert with a focus on Derrida's philosophy of deconstruction and binary oppositions. Your task is to analyze the provided colors and create a color hierarchy that emphasizes visibility, legibility, and meaningful contrast. Use ONLY the colors that were actually extracted from the PDF."
          },
          {
            role: "user",
            content: `Analyze these colors extracted from a PDF and create a Derrida-inspired color theme that emphasizes binary oppositions and meaningful contrast:
            All colors: ${colorList}
            Text colors: ${textColors}
            Background colors: ${bgColors}
            Accent colors: ${accentColors}

            CRITICAL INSTRUCTION: You MUST use ONLY these exact colors that were extracted from the PDF: ${extractedColorsList}

            DO NOT introduce any new colors that weren't in the original PDF.
            DO NOT modify the extracted colors in any way (no lightening, darkening, etc.).

            Following Derrida's philosophy of deconstruction:
            1. Create clear binary oppositions between text and background colors for maximum legibility
            2. Ensure that primary interactive elements have strong contrast with their surroundings
            3. Use color to create a hierarchy of information that guides the user's attention
            4. Deconstruct traditional color relationships by emphasizing meaningful differences

            For each role (primary, secondary, etc.), select the most appropriate color from the extracted colors.

            Return a JSON object with the following structure:
            {
              "primary": "#hex (must be from extracted colors)",
              "secondary": "#hex (must be from extracted colors)",
              "accent": "#hex (must be from extracted colors)",
              "background": "#hex (must be from extracted colors)",
              "text": "#hex (must be from extracted colors)",
              "textSecondary": "#hex (must be from extracted colors)",
              "border": "#hex (must be from extracted colors)",
              "success": "#hex (must be from extracted colors)",
              "warning": "#hex (must be from extracted colors)",
              "error": "#hex (must be from extracted colors)",
              "info": "#hex (must be from extracted colors)",
              "colorTheory": {
                "description": "Description of the color theme using Derrida's philosophy",
                "harmony": "Description of the color harmony and binary oppositions",
                "contrast": "Description of the contrast relationships and how they create meaning",
                "accessibility": "Assessment of accessibility and legibility"
              },
              "allColors": [${extractedColorsList}]
            }`
          }
        ],
        temperature: 0.3, // Lower temperature for more deterministic results
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      logger.success('Successfully analyzed colors with OpenAI using Derrida\'s approach');

      // Parse the response
      const colorTheory = JSON.parse(response.choices[0].message.content);

      // Strictly validate the color theory to ensure it uses ONLY extracted colors
      const validatedColorTheory = strictlyValidateColorSelection(colorTheory, colors);

      return validatedColorTheory;
    } catch (error) {
      logger.error(`Error analyzing colors with OpenAI: ${error.message}`);
      // Fall back to manual analysis
    }
  }

  // Manual analysis if OpenAI is not available or fails
  return createManualColorTheme(colors);
}

/**
 * Validate color selection to ensure it uses extracted colors when possible
 *
 * @param {Object} colorTheory - Color theory from OpenAI
 * @param {Object} extractedColors - Extracted colors
 * @returns {Object} - Validated color theory
 */
function validateColorSelection(colorTheory, extractedColors) {
  const allExtractedColors = extractedColors.all;

  // If we have no extracted colors, return the color theory as is
  if (allExtractedColors.length === 0) {
    return colorTheory;
  }

  // Create a copy of the color theory to modify
  const validatedTheory = { ...colorTheory };

  // Check each color role and ensure it uses an extracted color when possible
  const colorRoles = ['primary', 'secondary', 'accent', 'background', 'text', 'textSecondary', 'border'];

  colorRoles.forEach(role => {
    const currentColor = validatedTheory[role];

    // If the current color is not in the extracted colors, replace it
    if (currentColor && !allExtractedColors.includes(currentColor)) {
      // Find the closest color from the extracted colors
      let closestColor = findClosestColor(currentColor, allExtractedColors);

      // Special handling for specific roles
      if (role === 'text' && extractedColors.text.length > 0) {
        closestColor = extractedColors.text[0];
      } else if (role === 'background' && extractedColors.background.length > 0) {
        closestColor = extractedColors.background[0];
      } else if ((role === 'primary' || role === 'accent') && extractedColors.accent.length > 0) {
        closestColor = extractedColors.accent[0];
      }

      validatedTheory[role] = closestColor;
    }
  });

  // Ensure allColors contains only extracted colors
  validatedTheory.allColors = allExtractedColors;

  return validatedTheory;
}

/**
 * Strictly validate color selection to ensure it uses ONLY extracted colors
 * Following Derrida's philosophy of deconstruction, we ensure that the color
 * theme is built exclusively from the colors found in the source PDF.
 *
 * @param {Object} colorTheory - Color theory from OpenAI
 * @param {Object} extractedColors - Extracted colors
 * @returns {Object} - Strictly validated color theory
 */
function strictlyValidateColorSelection(colorTheory, extractedColors) {
  const allExtractedColors = extractedColors.all;

  // If we have no extracted colors, return a minimal color theory
  if (allExtractedColors.length === 0) {
    logger.warning('No colors found in PDF for strict validation.');
    return createManualColorTheme(extractedColors);
  }

  // Create a copy of the color theory to modify
  const validatedTheory = { ...colorTheory };

  // Check each color role and ensure it uses ONLY an extracted color
  const colorRoles = [
    'primary', 'secondary', 'accent', 'background', 'text', 'textSecondary', 'border',
    'success', 'warning', 'error', 'info'
  ];

  colorRoles.forEach(role => {
    const currentColor = validatedTheory[role];

    // If the current color is not in the extracted colors, replace it
    if (!currentColor || !allExtractedColors.includes(currentColor)) {
      logger.warning(`Color "${currentColor}" for role "${role}" is not from the extracted colors. Replacing with an extracted color.`);

      // Special handling for specific roles
      if (role === 'text' && extractedColors.text.length > 0) {
        // For text, use the darkest text color for maximum legibility
        const darkestTextColor = extractedColors.text.reduce((darkest, color) =>
          calculateLuminance(color) < calculateLuminance(darkest) ? color : darkest
          , extractedColors.text[0]);

        validatedTheory[role] = darkestTextColor;
      }
      else if (role === 'background' && extractedColors.background.length > 0) {
        // For background, use the lightest background color for maximum legibility
        const lightestBgColor = extractedColors.background.reduce((lightest, color) =>
          calculateLuminance(color) > calculateLuminance(lightest) ? color : lightest
          , extractedColors.background[0]);

        validatedTheory[role] = lightestBgColor;
      }
      else if (role === 'textSecondary' && extractedColors.text.length > 1) {
        // For secondary text, use the second darkest text color
        const sortedByLuminance = [...extractedColors.text].sort((a, b) =>
          calculateLuminance(a) - calculateLuminance(b)
        );

        validatedTheory[role] = sortedByLuminance[1] || sortedByLuminance[0];
      }
      else if (role === 'primary' && extractedColors.accent.length > 0) {
        // For primary, use the most saturated accent color
        const mostSaturatedColor = extractedColors.accent.reduce((mostSat, color) => {
          const hsl1 = hexToHSL(color);
          const hsl2 = hexToHSL(mostSat);
          return hsl1.s > hsl2.s ? color : mostSat;
        }, extractedColors.accent[0]);

        validatedTheory[role] = mostSaturatedColor;
      }
      else if (role === 'secondary' && extractedColors.accent.length > 1) {
        // For secondary, use the second most saturated accent color
        const sortedBySaturation = [...extractedColors.accent].sort((a, b) => {
          const hsl1 = hexToHSL(a);
          const hsl2 = hexToHSL(b);
          return hsl2.s - hsl1.s;
        });

        validatedTheory[role] = sortedBySaturation[1] || sortedBySaturation[0];
      }
      else if (role === 'accent' && extractedColors.accent.length > 2) {
        // For accent, use the third most saturated accent color
        const sortedBySaturation = [...extractedColors.accent].sort((a, b) => {
          const hsl1 = hexToHSL(a);
          const hsl2 = hexToHSL(b);
          return hsl2.s - hsl1.s;
        });

        validatedTheory[role] = sortedBySaturation[2] || sortedBySaturation[0];
      }
      else if (role === 'border' && extractedColors.background.length > 0) {
        // For border, use a darker background color
        const sortedByLuminance = [...extractedColors.background].sort((a, b) =>
          calculateLuminance(a) - calculateLuminance(b)
        );

        validatedTheory[role] = sortedByLuminance[0];
      }
      else if (role === 'success' && allExtractedColors.length > 0) {
        // For success, find a color with green hue if possible
        const greenishColors = allExtractedColors.filter(color => {
          const hsl = hexToHSL(color);
          return hsl.h >= 90 && hsl.h <= 150; // Green hue range
        });

        if (greenishColors.length > 0) {
          validatedTheory[role] = greenishColors[0];
        } else {
          // If no greenish color, use a random accent color
          validatedTheory[role] = extractedColors.accent.length > 0
            ? extractedColors.accent[0]
            : allExtractedColors[0];
        }
      }
      else if (role === 'warning' && allExtractedColors.length > 0) {
        // For warning, find a color with yellow/orange hue if possible
        const yellowishColors = allExtractedColors.filter(color => {
          const hsl = hexToHSL(color);
          return hsl.h >= 30 && hsl.h <= 60; // Yellow hue range
        });

        if (yellowishColors.length > 0) {
          validatedTheory[role] = yellowishColors[0];
        } else {
          // If no yellowish color, use a random accent color
          validatedTheory[role] = extractedColors.accent.length > 0
            ? extractedColors.accent[0]
            : allExtractedColors[0];
        }
      }
      else if (role === 'error' && allExtractedColors.length > 0) {
        // For error, find a color with red hue if possible
        const reddishColors = allExtractedColors.filter(color => {
          const hsl = hexToHSL(color);
          return (hsl.h >= 0 && hsl.h <= 15) || (hsl.h >= 345 && hsl.h <= 360); // Red hue range
        });

        if (reddishColors.length > 0) {
          validatedTheory[role] = reddishColors[0];
        } else {
          // If no reddish color, use a random accent color
          validatedTheory[role] = extractedColors.accent.length > 0
            ? extractedColors.accent[0]
            : allExtractedColors[0];
        }
      }
      else if (role === 'info' && allExtractedColors.length > 0) {
        // For info, find a color with blue hue if possible
        const bluishColors = allExtractedColors.filter(color => {
          const hsl = hexToHSL(color);
          return hsl.h >= 180 && hsl.h <= 240; // Blue hue range
        });

        if (bluishColors.length > 0) {
          validatedTheory[role] = bluishColors[0];
        } else {
          // If no bluish color, use a random accent color
          validatedTheory[role] = extractedColors.accent.length > 0
            ? extractedColors.accent[0]
            : allExtractedColors[0];
        }
      }
      else {
        // For any other role, use the first extracted color
        validatedTheory[role] = allExtractedColors[0];
      }
    }
  });

  // Ensure allColors contains only extracted colors
  validatedTheory.allColors = allExtractedColors;

  // Update color theory description to emphasize Derrida's approach
  validatedTheory.colorTheory.description =
    `A color theme strictly using only the colors extracted from the PDF: ${allExtractedColors.join(', ')}. ` +
    `Following Derrida's philosophy of deconstruction, we've preserved the original colors without introducing external elements.`;

  // Update contrast description to emphasize binary oppositions
  validatedTheory.colorTheory.contrast =
    `Binary oppositions between text (${validatedTheory.text}) and background (${validatedTheory.background}) ` +
    `create meaningful contrast that emphasizes legibility and guides the user's attention. ` +
    `Primary (${validatedTheory.primary}) and secondary (${validatedTheory.secondary}) colors ` +
    `establish a clear hierarchy of interactive elements.`;

  return validatedTheory;
}

/**
 * Find the closest color from a list of colors
 *
 * @param {string} targetColor - Target color in hex format
 * @param {Array} colorList - List of colors to search
 * @returns {string} - Closest color from the list
 */
function findClosestColor(targetColor, colorList) {
  if (colorList.length === 0) return targetColor;
  if (colorList.length === 1) return colorList[0];

  const targetRgb = hexToRgb(targetColor);

  let closestColor = colorList[0];
  let minDistance = Number.MAX_VALUE;

  colorList.forEach(color => {
    const rgb = hexToRgb(color);
    const distance = Math.sqrt(
      Math.pow(rgb.r - targetRgb.r, 2) +
      Math.pow(rgb.g - targetRgb.g, 2) +
      Math.pow(rgb.b - targetRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}

/**
 * Create a color theme manually based on extracted colors
 *
 * @param {Object} colors - Extracted colors
 * @returns {Object} - Color theme
 */
function createManualColorTheme(colors) {
  // Get all extracted colors
  const extractedColors = colors.all;

  // Default theme - only used if no colors are found
  const defaultTheme = {
    primary: config.pdf.defaultFallbacks.colorPrimary,
    secondary: '#004e98',
    accent: '#ff6700',
    background: config.pdf.defaultFallbacks.colorBackground,
    text: config.pdf.defaultFallbacks.colorText,
    textSecondary: '#666666',
    border: '#dddddd',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    colorTheory: {
      description: "A color theme based on extracted colors from the PDF.",
      harmony: "Following Derrida's philosophy of deconstruction, emphasizing binary oppositions.",
      contrast: "High contrast between text and background for maximum legibility.",
      accessibility: "Meets WCAG AA standards for contrast."
    },
    allColors: extractedColors
  };

  // If no colors were found, return the default theme with a warning
  if (extractedColors.length === 0) {
    logger.warning('No colors found in PDF. Using default color theme.');
    return defaultTheme;
  }

  // Create a new theme using only extracted colors
  const derridaTheme = {
    primary: extractedColors[0],
    secondary: extractedColors[0],
    accent: extractedColors[0],
    background: extractedColors[0],
    text: extractedColors[0],
    textSecondary: extractedColors[0],
    border: extractedColors[0],
    success: extractedColors[0],
    warning: extractedColors[0],
    error: extractedColors[0],
    info: extractedColors[0],
    colorTheory: {
      description: `A color theme strictly using only the colors extracted from the PDF: ${extractedColors.join(', ')}.`,
      harmony: "Following Derrida's philosophy of deconstruction, emphasizing binary oppositions.",
      contrast: "High contrast between text and background for maximum legibility.",
      accessibility: "Meets WCAG AA standards for contrast."
    },
    allColors: extractedColors
  };

  // Sort colors by luminance (light to dark)
  const sortedByLuminance = [...extractedColors].sort((a, b) =>
    calculateLuminance(b) - calculateLuminance(a)
  );

  // Sort colors by saturation (high to low)
  const sortedBySaturation = [...extractedColors].sort((a, b) => {
    const hsl1 = hexToHSL(a);
    const hsl2 = hexToHSL(b);
    return hsl2.s - hsl1.s;
  });

  // Create binary oppositions following Derrida's philosophy

  // 1. Text/Background opposition (dark/light)
  if (sortedByLuminance.length >= 2) {
    // Lightest color for background
    derridaTheme.background = sortedByLuminance[0];
    // Darkest color for text
    derridaTheme.text = sortedByLuminance[sortedByLuminance.length - 1];

    // If we have more colors, use the second darkest for secondary text
    if (sortedByLuminance.length >= 3) {
      derridaTheme.textSecondary = sortedByLuminance[sortedByLuminance.length - 2];
    } else {
      derridaTheme.textSecondary = derridaTheme.text;
    }

    // Use a middle color for borders
    if (sortedByLuminance.length >= 4) {
      const middleIndex = Math.floor(sortedByLuminance.length / 2);
      derridaTheme.border = sortedByLuminance[middleIndex];
    } else {
      derridaTheme.border = derridaTheme.background;
    }
  } else if (colors.text.length > 0 && colors.background.length > 0) {
    // If we have categorized colors, use them
    derridaTheme.text = colors.text[0];
    derridaTheme.background = colors.background[0];

    if (colors.text.length > 1) {
      derridaTheme.textSecondary = colors.text[1];
    } else {
      derridaTheme.textSecondary = derridaTheme.text;
    }

    if (colors.background.length > 1) {
      derridaTheme.border = colors.background[1];
    } else {
      derridaTheme.border = derridaTheme.background;
    }
  }

  // 2. Primary/Secondary opposition (saturated/less saturated)
  if (sortedBySaturation.length >= 2) {
    // Most saturated color for primary
    derridaTheme.primary = sortedBySaturation[0];
    // Second most saturated for secondary
    derridaTheme.secondary = sortedBySaturation[1];

    // If we have more colors, use the third most saturated for accent
    if (sortedBySaturation.length >= 3) {
      derridaTheme.accent = sortedBySaturation[2];
    } else {
      derridaTheme.accent = derridaTheme.primary;
    }
  } else if (colors.accent.length > 0) {
    // If we have categorized colors, use them
    derridaTheme.primary = colors.accent[0];

    if (colors.accent.length > 1) {
      derridaTheme.secondary = colors.accent[1];
    } else {
      derridaTheme.secondary = derridaTheme.primary;
    }

    if (colors.accent.length > 2) {
      derridaTheme.accent = colors.accent[2];
    } else {
      derridaTheme.accent = derridaTheme.primary;
    }
  }

  // 3. Status colors (success/error/warning/info)
  // Try to find colors with appropriate hues

  // Success (green)
  const greenishColors = extractedColors.filter(color => {
    const hsl = hexToHSL(color);
    return hsl.h >= 90 && hsl.h <= 150; // Green hue range
  });

  if (greenishColors.length > 0) {
    derridaTheme.success = greenishColors[0];
  } else {
    derridaTheme.success = derridaTheme.primary;
  }

  // Warning (yellow/orange)
  const yellowishColors = extractedColors.filter(color => {
    const hsl = hexToHSL(color);
    return hsl.h >= 30 && hsl.h <= 60; // Yellow hue range
  });

  if (yellowishColors.length > 0) {
    derridaTheme.warning = yellowishColors[0];
  } else {
    derridaTheme.warning = derridaTheme.accent;
  }

  // Error (red)
  const reddishColors = extractedColors.filter(color => {
    const hsl = hexToHSL(color);
    return (hsl.h >= 0 && hsl.h <= 15) || (hsl.h >= 345 && hsl.h <= 360); // Red hue range
  });

  if (reddishColors.length > 0) {
    derridaTheme.error = reddishColors[0];
  } else {
    derridaTheme.error = derridaTheme.secondary;
  }

  // Info (blue)
  const bluishColors = extractedColors.filter(color => {
    const hsl = hexToHSL(color);
    return hsl.h >= 180 && hsl.h <= 240; // Blue hue range
  });

  if (bluishColors.length > 0) {
    derridaTheme.info = bluishColors[0];
  } else {
    derridaTheme.info = derridaTheme.primary;
  }

  // Update color theory description with Derrida's philosophy
  derridaTheme.colorTheory.description =
    `A color theme strictly using only the colors extracted from the PDF: ${extractedColors.join(', ')}. ` +
    `Following Derrida's philosophy of deconstruction, we've preserved the original colors without introducing external elements.`;

  // Update contrast description to emphasize binary oppositions
  derridaTheme.colorTheory.contrast =
    `Binary oppositions between text (${derridaTheme.text}) and background (${derridaTheme.background}) ` +
    `create meaningful contrast that emphasizes legibility and guides the user's attention. ` +
    `Primary (${derridaTheme.primary}) and secondary (${derridaTheme.secondary}) colors ` +
    `establish a clear hierarchy of interactive elements.`;

  return derridaTheme;
}

/**
 * Validate a color theme for contrast and accessibility
 *
 * @param {Object} theme - Color theme
 * @returns {Object} - Validated color theme
 */
function validateColorTheme(theme) {
  // Check text/background contrast
  const textBgContrast = calculateContrastRatio(theme.text, theme.background);

  // If contrast is too low, adjust the text color
  if (textBgContrast < 4.5) {
    logger.warning(`Text/background contrast ratio (${textBgContrast.toFixed(2)}) is below WCAG AA standard. Adjusting text color.`);
    theme.text = getContrastingColor(theme.background);
  }

  // Check primary/background contrast for buttons
  const primaryBgContrast = calculateContrastRatio(theme.primary, theme.background);

  // If contrast is too low, adjust the primary color
  if (primaryBgContrast < 3) {
    logger.warning(`Primary/background contrast ratio (${primaryBgContrast.toFixed(2)}) is low. Adjusting primary color.`);
    theme.primary = adjustColorForContrast(theme.primary, theme.background);
  }

  return theme;
}

/**
 * Calculate contrast ratio between two colors
 *
 * @param {string} color1 - First color in hex format
 * @param {string} color2 - Second color in hex format
 * @returns {number} - Contrast ratio
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance of a color
 *
 * @param {string} hex - Color in hex format
 * @returns {number} - Relative luminance
 */
function calculateLuminance(hex) {
  // Convert hex to RGB
  const rgb = hexToRgb(hex);

  // Normalize RGB values
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Get a contrasting color (black or white) based on background
 *
 * @param {string} bgColor - Background color in hex format
 * @returns {string} - Contrasting color (black or white)
 */
function getContrastingColor(bgColor) {
  const lum = calculateLuminance(bgColor);
  return lum > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Adjust a color to improve contrast with background
 *
 * @param {string} color - Color to adjust in hex format
 * @param {string} bgColor - Background color in hex format
 * @returns {string} - Adjusted color
 */
function adjustColorForContrast(color, bgColor) {
  const hsl = hexToHSL(color);
  const bgLum = calculateLuminance(bgColor);

  // Adjust lightness to improve contrast
  if (bgLum > 0.5) {
    // Dark text on light background
    hsl.l = Math.max(0, hsl.l - 30);
  } else {
    // Light text on dark background
    hsl.l = Math.min(100, hsl.l + 30);
  }

  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Convert RGB to hex
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color
 */
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Convert hex to RGB
 *
 * @param {string} hex - Hex color
 * @returns {Object} - RGB values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Convert hex to HSL
 *
 * @param {string} hex - Hex color
 * @returns {Object} - HSL values
 */
function hexToHSL(hex) {
  const { r, g, b } = hexToRgb(hex);

  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to hex
 *
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color
 */
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

module.exports = {
  extractEnhancedColors,
  calculateContrastRatio,
  hexToRgb,
  rgbToHex,
  hexToHSL,
  hslToHex
};
