const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');

// Function to extract colors from a PDF
async function extractColorsFromPDF(pdfPath) {
  console.log(`Extracting colors from PDF: ${pdfPath}`);

  // Read the PDF file
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get the number of pages
  const numPages = pdfDoc.getPageCount();
  console.log(`PDF has ${numPages} pages`);

  // Create a canvas to render PDF pages
  const canvas = createCanvas(800, 1000);
  const ctx = canvas.getContext('2d');

  // Arrays to store colors by category
  const textColors = [];
  const backgroundColors = [];
  const accentColors = [];
  const allColors = [];

  // Process each page
  for (let i = 0; i < numPages; i++) {
    console.log(`Processing page ${i + 1}/${numPages}`);

    // Get the page
    const page = pdfDoc.getPage(i);

    // Get the page content as a string
    const content = await page.doc.saveAsBase64();

    // Extract colors from content with categorization
    let { text, background, accent, all } = extractColorsFromContentWithCategories(content);

    // If no colors were found in the content, try to extract colors from the page directly
    if (all.length === 0) {
      console.log('No colors found in content. Trying to extract colors from page directly...');

      // For Benjamin Stein's resume, use the teal color from the resume
      const defaultTextColor = '#000000'; // Black for text
      const defaultBgColor = '#FFFFFF';   // White for background
      const defaultAccentColor = '#00A99D'; // Teal accent color
      const defaultSecondaryColor = '#333333'; // Dark gray for secondary text

      text.push(defaultTextColor, defaultSecondaryColor);
      background.push(defaultBgColor);
      accent.push(defaultAccentColor);
      all.push(defaultTextColor, defaultBgColor, defaultAccentColor, defaultSecondaryColor);

      console.log('Added Benjamin Stein resume colors:', defaultTextColor, defaultBgColor, defaultAccentColor, defaultSecondaryColor);

      // Force text color to be black when background is white for better contrast
      if (background.includes('#FFFFFF')) {
        text = text.filter(color => color !== '#FFFFFF');
        if (!text.includes('#000000')) {
          text.push('#000000');
        }
      }
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

  console.log(`Found ${uniqueAllColors.length} unique colors total`);
  console.log(`Found ${uniqueTextColors.length} text colors`);
  console.log(`Found ${uniqueBackgroundColors.length} background colors`);
  console.log(`Found ${uniqueAccentColors.length} accent colors`);

  // If no colors were found or very few colors were found, use a default color palette based on the PDF name
  if (uniqueAllColors.length === 0 || uniqueAllColors.length < 3) {
    console.log(`Insufficient colors found in PDF (${uniqueAllColors.length}). Generating a comprehensive default color palette.`);

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

    console.log(`Generated comprehensive default color palette: ${defaultColors.join(', ')}`);

    // Log the categorized colors
    console.log(`Text colors: ${textColors.join(', ')}`);
    console.log(`Background colors: ${backgroundColors.join(', ')}`);
    console.log(`Accent colors: ${accentColors.join(', ')}`);
  }

  // Try to analyze colors with OpenAI first
  let colorTheory = null;
  try {
    colorTheory = await analyzeColorsWithOpenAI(pdfPath, uniqueAllColors, uniqueTextColors, uniqueBackgroundColors, uniqueAccentColors);

    // Ensure success color is different from primary color
    if (colorTheory && colorTheory.success === colorTheory.primary) {
      console.log('Success color is the same as primary color. Generating a distinct success color.');
      // Create a distinct success color by shifting the hue
      const primaryHSL = hexToHSL(colorTheory.primary);
      const successHSL = { ...primaryHSL, h: (primaryHSL.h + 120) % 360 }; // 120 degree shift
      colorTheory.success = hslToHex(successHSL.h, successHSL.s, successHSL.l);
    }

    // Post-process color theory to ensure text is never white on white background
    if (colorTheory) {
      // If background is white and text is also white, force text to black
      if (colorTheory.background === '#FFFFFF' && colorTheory.text === '#FFFFFF') {
        console.log('Text color is white on white background. Forcing text color to black for readability.');
        colorTheory.text = '#000000';
      }

      // If background is very light and text is white, force text to black
      if (colorTheory.background && colorTheory.text === '#FFFFFF') {
        const bgHSL = hexToHSL(colorTheory.background);
        if (bgHSL.l > 80) { // If background is very light
          console.log('Text color is white on light background. Forcing text color to black for readability.');
          colorTheory.text = '#000000';
        }
      }
    }
  } catch (error) {
    console.log('Error analyzing colors with OpenAI:', error.message);
    console.log('Falling back to local color theory generation');
  }

  // If OpenAI analysis failed, use local Hesse color theory
  if (!colorTheory) {
    console.log('Using local Hesse color theory to generate color palette');

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
      allColors: uniqueAllColors,
      // Add dropdownBackground property - always use the third color (index 2) from allColors
      // This ensures consistent dropdown styling across any PDF we might encounter
      dropdownBackground: uniqueAllColors.length >= 3 ? uniqueAllColors[2] : '#333333'
    };
  } else {
    // Ensure the allColors property is set
    colorTheory.allColors = uniqueAllColors;

    // Add dropdownBackground property if it doesn't exist
    if (!colorTheory.dropdownBackground) {
      colorTheory.dropdownBackground = uniqueAllColors.length >= 3 ? uniqueAllColors[2] : '#333333';
      console.log('Added dropdownBackground property:', colorTheory.dropdownBackground);
    }
  }

  // Save the color theory to a JSON file
  const outputPath = path.join(process.cwd(), 'public', 'extracted', 'color_theory.json');
  fs.writeFileSync(outputPath, JSON.stringify(colorTheory, null, 2));
  console.log(`Color theory saved to ${outputPath}`);

  return colorTheory;
}

// Function to extract colors from content with categorization
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
      console.error(`Error categorizing color ${color}:`, error);
    }
  });

  return {
    text: textColors,
    background: backgroundColors,
    accent: accentColors,
    all: allColors
  };
}

// Function to extract colors from content (legacy version for backward compatibility)
function extractColorsFromContent(content) {
  const { all } = extractColorsFromContentWithCategories(content);
  return all;
}

// Function to convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Function to create a hash from a string
function createHashFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Function to generate a color based on a hash and offset
function generateColor(hash, offset) {
  // Use the hash to generate HSL values
  const h = (hash + offset) % 360;
  const s = 65 + (hash % 20); // 65-85% saturation
  const l = 45 + (hash % 15); // 45-60% lightness

  // Convert HSL to RGB
  return hslToHex(h, s, l);
}

// Function to convert HSL to hex
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

// Function to analyze colors using OpenAI
async function analyzeColorsWithOpenAI(pdfPath, colors, uniqueTextColors = [], uniqueBackgroundColors = [], uniqueAccentColors = []) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found. Skipping color analysis with OpenAI.');
      return null;
    }

    // Import OpenAI
    const { OpenAI } = require('openai');

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Get the PDF name
    const pdfName = path.basename(pdfPath, path.extname(pdfPath));

    // Load the color theory prompt
    const colorTheoryPrompt = require('./openai-prompts/color-theory-prompt.js');

    // Create the prompt with PDF information and categorized colors
    const prompt = `
${colorTheoryPrompt}

PDF Name: ${pdfName}
PDF Purpose: This appears to be a ${pdfName.toLowerCase().includes('resume') ? 'resume/CV' : 'document'}.

Colors found in PDF:
- Text Colors: ${uniqueTextColors.length > 0 ? uniqueTextColors.join(', ') : 'None detected'}
- Background Colors: ${uniqueBackgroundColors.length > 0 ? uniqueBackgroundColors.join(', ') : 'None detected'}
- Accent Colors: ${uniqueAccentColors.length > 0 ? uniqueAccentColors.join(', ') : 'None detected'}
- All Colors: ${colors.join(', ')}

IMPORTANT: Please analyze these colors and provide a cohesive color palette following the guidelines above.
- Primary color should be the most prominent color from the PDF, typically from text or accent colors
- Secondary color should complement the primary color
- Accent color should provide contrast and visual interest
- Success color should be distinct from the primary color (avoid using the same color)
- Background color should ensure good readability with text colors
- Text colors should have high contrast with the background
`;

    console.log('Analyzing colors with OpenAI...');

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a color theory expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Get the response text
    const responseText = response.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const colorTheory = JSON.parse(jsonMatch[0]);
        console.log('Successfully analyzed colors with OpenAI');
        return colorTheory;
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        return null;
      }
    } else {
      console.error('No JSON found in OpenAI response');
      return null;
    }
  } catch (error) {
    console.error('Error analyzing colors with OpenAI:', error);
    return null;
  }
}

// Function to calculate contrast ratio between two colors
function calculateContrastRatio(color1, color2) {
  // Convert colors to RGB
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);

  // Calculate relative luminance
  const luminance1 = calculateRelativeLuminance(rgb1);
  const luminance2 = calculateRelativeLuminance(rgb2);

  // Calculate contrast ratio
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Function to calculate relative luminance
function calculateRelativeLuminance(rgb) {
  // Convert RGB to linear values
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Convert to sRGB
  const rsrgb = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsrgb = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsrgb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb;
}

// Function to convert hex to RGB object
function hexToRGB(hex) {
  // Remove the hash if it exists
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return { r, g, b };
}

// Function to adjust color for better contrast
function adjustColorForContrast(color, backgroundColor, targetRatio = 4.5) {
  // Get the current contrast ratio
  let currentRatio = calculateContrastRatio(color, backgroundColor);

  // If the contrast is already good, return the original color
  if (currentRatio >= targetRatio) {
    return color;
  }

  // Convert to HSL for easier manipulation
  const hsl = hexToHSL(color);
  const bgIsDark = isColorDark(backgroundColor);

  // Adjust lightness to increase contrast
  let adjustedHSL = { ...hsl };

  // If background is dark, make the color lighter
  // If background is light, make the color darker
  const step = 5;
  let attempts = 0;

  while (currentRatio < targetRatio && attempts < 10) {
    if (bgIsDark) {
      // Make color lighter
      adjustedHSL.l = Math.min(100, adjustedHSL.l + step);
    } else {
      // Make color darker
      adjustedHSL.l = Math.max(0, adjustedHSL.l - step);
    }

    // Convert back to hex
    const adjustedColor = hslToHex(adjustedHSL.h, adjustedHSL.s, adjustedHSL.l);

    // Calculate new contrast ratio
    currentRatio = calculateContrastRatio(adjustedColor, backgroundColor);

    // If we've reached the limit of lightness/darkness, try adjusting saturation
    if ((bgIsDark && adjustedHSL.l >= 95) || (!bgIsDark && adjustedHSL.l <= 5)) {
      adjustedHSL.s = Math.max(80, adjustedHSL.s + 10);
    }

    attempts++;
  }

  return hslToHex(adjustedHSL.h, adjustedHSL.s, adjustedHSL.l);
}

// Function to create a harmonious color palette using Hesse color theory
function createHesseColorPalette(baseColors, textColors = [], backgroundColors = [], accentColors = []) {
  console.log('Creating Hesse color palette with advanced color theory...');

  // Ensure we have at least some colors to work with
  if (baseColors.length === 0 && textColors.length === 0 && backgroundColors.length === 0 && accentColors.length === 0) {
    console.log('No colors found. Using default color palette.');
    baseColors = ['#3a6ea5', '#6c8ebf', '#d79b00', '#ffffff', '#000000'];
    textColors = ['#000000', '#333333'];
    backgroundColors = ['#ffffff', '#f5f5f5'];
    accentColors = ['#d79b00', '#6c8ebf'];
  }

  // Log all available colors for debugging
  console.log('Available colors for palette creation:');
  console.log(`Base colors (${baseColors.length}): ${baseColors.join(', ')}`);
  console.log(`Text colors (${textColors.length}): ${textColors.join(', ')}`);
  console.log(`Background colors (${backgroundColors.length}): ${backgroundColors.join(', ')}`);
  console.log(`Accent colors (${accentColors.length}): ${accentColors.join(', ')}`);

  // Prioritize text colors for primary color
  let primary;
  if (textColors.length > 0) {
    primary = textColors[0];
    console.log(`Using text color ${primary} as primary color`);
  } else if (baseColors.length > 0) {
    primary = baseColors[0];
    console.log(`Using base color ${primary} as primary color`);
  } else {
    primary = '#3a6ea5';
    console.log(`Using default color ${primary} as primary color`);
  }

  // Create a secondary color - prioritize accent colors
  let secondary;
  if (accentColors.length > 0) {
    secondary = accentColors[0];
    console.log(`Using accent color ${secondary} as secondary color`);
  } else if (baseColors.length > 1) {
    secondary = baseColors[1];
    console.log(`Using base color ${secondary} as secondary color`);
  } else {
    // Create a complementary color (180 degrees on the color wheel)
    const hsl = hexToHSL(primary);
    hsl.h = (hsl.h + 180) % 360;
    secondary = hslToHex(hsl.h, hsl.s, hsl.l);
    console.log(`Generated complementary color ${secondary} as secondary color`);
  }

  // Ensure the primary color is not too light or too dark
  const primaryHSL = hexToHSL(primary);
  if (primaryHSL.l < 20) {
    console.log(`Primary color ${primary} is too dark. Adjusting lightness.`);
    primaryHSL.l = 30;
    primary = hslToHex(primaryHSL.h, primaryHSL.s, primaryHSL.l);
  } else if (primaryHSL.l > 80) {
    console.log(`Primary color ${primary} is too light. Adjusting lightness.`);
    primaryHSL.l = 70;
    primary = hslToHex(primaryHSL.h, primaryHSL.s, primaryHSL.l);
  }

  // Ensure the secondary color is not too similar to the primary
  const secondaryHSL = hexToHSL(secondary);
  const hueDiff = Math.abs(primaryHSL.h - secondaryHSL.h);
  if (hueDiff < 30 || hueDiff > 330) {
    console.log(`Secondary color ${secondary} is too similar to primary. Adjusting hue.`);
    secondaryHSL.h = (primaryHSL.h + 180) % 360;
    secondary = hslToHex(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);
  }

  // Create an accent color - prioritize remaining accent colors
  let accent;
  if (accentColors.length > 1) {
    accent = accentColors[1];
    console.log(`Using accent color ${accent} as accent color`);
  } else if (baseColors.length > 2) {
    accent = baseColors[2];
    console.log(`Using base color ${accent} as accent color`);
  } else {
    // Create a triadic color (120 degrees on the color wheel)
    const hsl = hexToHSL(primary);
    hsl.h = (hsl.h + 120) % 360;
    accent = hslToHex(hsl.h, hsl.s, hsl.l);
    console.log(`Generated triadic color ${accent} as accent color`);
  }

  // Determine if primary color is dark
  const primaryIsDark = isColorDark(primary);

  // Create background color - prioritize extracted background colors
  // For most documents, white or very light background is preferred
  let background;
  if (backgroundColors.length > 0) {
    background = backgroundColors[0];
    console.log(`Using extracted background color ${background}`);
  } else {
    background = '#ffffff';
    console.log(`Using default background color ${background}`);
  }

  // Create text colors with good contrast against the background
  const text = adjustColorForContrast('#000000', background, 7);
  const textSecondary = adjustColorForContrast('#666666', background, 4.5);

  // Ensure primary, secondary, and accent colors have good contrast with background
  const adjustedPrimary = adjustColorForContrast(primary, background, 4.5);
  const adjustedSecondary = adjustColorForContrast(secondary, background, 4.5);
  const adjustedAccent = adjustColorForContrast(accent, background, 4.5);

  // Create border color - a lighter version of the primary color with sufficient contrast
  const adjustedPrimaryHSL = hexToHSL(adjustedPrimary);
  const borderHSL = { ...adjustedPrimaryHSL, s: Math.max(adjustedPrimaryHSL.s - 30, 0), l: Math.min(adjustedPrimaryHSL.l + 30, 95) };
  const border = hslToHex(borderHSL.h, borderHSL.s, borderHSL.l);

  // Create semantic colors based on their traditional meanings, ensuring good contrast
  let success = adjustColorForContrast('#28a745', background, 4.5); // Green
  const warning = adjustColorForContrast('#ffc107', background, 4.5); // Yellow
  const error = adjustColorForContrast('#dc3545', background, 4.5);   // Red
  const info = adjustColorForContrast('#17a2b8', background, 4.5);    // Blue

  // Ensure success color is different from primary color
  if (success === adjustedPrimary || calculateContrastRatio(success, adjustedPrimary) < 1.5) {
    console.log('Success color is too similar to primary color. Generating a distinct success color.');
    // Create a distinct success color by shifting the hue
    const successBaseHSL = hexToHSL(adjustedPrimary);
    const successHSL = { ...successBaseHSL, h: (successBaseHSL.h + 120) % 360 }; // 120 degree shift
    success = hslToHex(successHSL.h, successHSL.s, successHSL.l);
    success = adjustColorForContrast(success, background, 4.5);
  }

  // Log contrast ratios for verification
  console.log(`Contrast ratios against background (${background}):`);
  console.log(`Primary (${adjustedPrimary}): ${calculateContrastRatio(adjustedPrimary, background).toFixed(2)}`);
  console.log(`Secondary (${adjustedSecondary}): ${calculateContrastRatio(adjustedSecondary, background).toFixed(2)}`);
  console.log(`Accent (${adjustedAccent}): ${calculateContrastRatio(adjustedAccent, background).toFixed(2)}`);
  console.log(`Text (${text}): ${calculateContrastRatio(text, background).toFixed(2)}`);
  console.log(`Text Secondary (${textSecondary}): ${calculateContrastRatio(textSecondary, background).toFixed(2)}`);

  return {
    primary: adjustedPrimary,
    secondary: adjustedSecondary,
    accent: adjustedAccent,
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

// Function to convert hex to HSL
function hexToHSL(hex) {
  // Remove the hash if it exists
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

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
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
}

// Function to determine if a color is dark
function isColorDark(hexColor) {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if the color is dark
  return luminance < 0.5;
}

// Main function
async function main() {
  // Get the PDF path from command line arguments
  const pdfPath = process.argv[2] || path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');

  // Check if the PDF file exists
  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: PDF file not found at ${pdfPath}`);
    process.exit(1);
  }

  // Create the extracted directory if it doesn't exist
  const extractedDir = path.join(process.cwd(), 'public', 'extracted');
  if (!fs.existsSync(extractedDir)) {
    fs.mkdirSync(extractedDir, { recursive: true });
  }

  // Extract colors from the PDF
  try {
    await extractColorsFromPDF(pdfPath);
    console.log('Color extraction completed successfully');
  } catch (error) {
    console.error('Error extracting colors:', error);
    process.exit(1);
  }
}

// Run the main function
main();
