const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');

/**
 * Convert RGB values to hex color
 * @param {number} r Red value (0-1)
 * @param {number} g Green value (0-1)
 * @param {number} b Blue value (0-1)
 * @returns {string} Hex color string
 */
function rgbToHex(r, g, b) {
  // Convert from 0-1 range to 0-255 range
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);
  
  return `#${rInt.toString(16).padStart(2, '0')}${gInt.toString(16).padStart(2, '0')}${bInt.toString(16).padStart(2, '0')}`;
}

/**
 * Convert hex color to RGB values
 * @param {string} hex Hex color string
 * @returns {number[]} RGB values (0-255)
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * Calculate the luminance of a color
 * @param {string} color Hex color string
 * @returns {number} Luminance value (0-1)
 */
function calculateLuminance(color) {
  const rgb = hexToRgb(color);
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Check if a color is dark
 * @param {string} color Hex color string
 * @returns {boolean} True if the color is dark
 */
function isDarkColor(color) {
  return calculateLuminance(color) < 0.5;
}

/**
 * Extract colors from a PDF page
 * @param {Object} page PDF.js page object
 * @returns {Promise<string[]>} Array of hex color strings
 */
async function extractColorsFromPage(page) {
  const operatorList = await page.getOperatorList();
  const colors = [];
  
  // Process each operation in the page
  for (let i = 0; i < operatorList.fnArray.length; i++) {
    const op = operatorList.fnArray[i];
    const args = operatorList.argsArray[i];
    
    // Check for fill color operations (setFillRGBColor, setStrokeRGBColor)
    if (op === 3 || op === 1) {
      if (args && args.length >= 3) {
        const [r, g, b] = args;
        const hexColor = rgbToHex(r, g, b);
        if (!colors.includes(hexColor)) {
          colors.push(hexColor);
        }
      }
    }
    
    // Check for fill color in CMYK space (setFillCMYKColor, setStrokeCMYKColor)
    else if (op === 4 || op === 2) {
      if (args && args.length >= 4) {
        // Simple CMYK to RGB conversion
        const [c, m, y, k] = args;
        const r = 1 - Math.min(1, c + k);
        const g = 1 - Math.min(1, m + k);
        const b = 1 - Math.min(1, y + k);
        const hexColor = rgbToHex(r, g, b);
        if (!colors.includes(hexColor)) {
          colors.push(hexColor);
        }
      }
    }
  }
  
  return colors;
}

/**
 * Generate a color theme from extracted colors
 * @param {string[]} colors Array of hex color strings
 * @returns {Object} Color theme object
 */
function generateColorTheme(colors) {
  // If no colors were found, return a default theme
  if (!colors || colors.length === 0) {
    return {
      primary: '#3a6ea5',    // A balanced blue (representing water/flow)
      secondary: '#004e98',  // Deeper blue (representing depth/knowledge)
      accent: '#ff6700',     // Vibrant orange (representing transformation)
      background: '#f6f6f6', // Light neutral (representing clarity)
      text: '#333333',       // Dark gray (representing wisdom)
      border: '#c0c0c0',     // Medium gray (representing boundaries)
      isDark: false,
      rawColors: ['#3a6ea5', '#004e98', '#ff6700', '#f6f6f6', '#333333', '#c0c0c0']
    };
  }
  
  // Sort colors by luminance (darkest to lightest)
  const sortedColors = [...colors].sort((a, b) => {
    return calculateLuminance(a) - calculateLuminance(b);
  });
  
  // Find the lightest and darkest colors
  const darkestColor = sortedColors[0];
  const lightestColor = sortedColors[sortedColors.length - 1];
  
  // Determine if the PDF has a dark background
  const isDark = isDarkColor(lightestColor);
  
  // Select colors based on luminance
  const background = isDark ? darkestColor : lightestColor;
  const text = isDark ? lightestColor : darkestColor;
  
  // Find colors for primary, secondary, and accent
  const midColors = sortedColors.filter(c => c !== darkestColor && c !== lightestColor);
  
  let primary, secondary, accent, border;
  
  if (midColors.length >= 3) {
    // If we have enough colors, select distinct ones
    primary = midColors[Math.floor(midColors.length / 4)];
    secondary = midColors[Math.floor(midColors.length / 2)];
    accent = midColors[Math.floor(3 * midColors.length / 4)];
    border = midColors[Math.floor(midColors.length / 3)];
  } else if (midColors.length > 0) {
    // If we have at least one mid color
    primary = midColors[0];
    
    // Find a contrasting color for secondary
    const findContrastingColor = (baseColor, colorPool) => {
      return colorPool.reduce((best, current) => {
        const bestContrast = Math.abs(calculateLuminance(best) - calculateLuminance(baseColor));
        const currentContrast = Math.abs(calculateLuminance(current) - calculateLuminance(baseColor));
        return currentContrast > bestContrast ? current : best;
      }, colorPool[0]);
    };
    
    secondary = findContrastingColor(primary, [...midColors, darkestColor, lightestColor]);
    accent = findContrastingColor(secondary, [...midColors, darkestColor, lightestColor]);
    
    // Create a border color by adjusting the background
    if (isDark) {
      const rgb = hexToRgb(darkestColor);
      const adjusted = rgb.map(c => Math.min(c + 30, 255));
      border = rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    } else {
      const rgb = hexToRgb(lightestColor);
      const adjusted = rgb.map(c => Math.max(c - 30, 0));
      border = rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    }
  } else {
    // Fallback to derived colors if we don't have enough
    const lightenColor = (color, amount) => {
      const rgb = hexToRgb(color);
      const adjusted = rgb.map(c => Math.min(c + Math.round(amount * 255), 255));
      return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    };
    
    const darkenColor = (color, amount) => {
      const rgb = hexToRgb(color);
      const adjusted = rgb.map(c => Math.max(c - Math.round(amount * 255), 0));
      return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    };
    
    primary = isDark ? lightenColor(darkestColor, 0.3) : darkenColor(lightestColor, 0.3);
    secondary = isDark ? lightenColor(darkestColor, 0.5) : darkenColor(lightestColor, 0.5);
    accent = isDark ? lightenColor(darkestColor, 0.7) : darkenColor(lightestColor, 0.7);
    border = isDark ? lightenColor(darkestColor, 0.1) : darkenColor(lightestColor, 0.1);
  }
  
  // Generate CTA colors
  const generateCtaColor = (baseColor) => {
    // Adjust the color to make it more suitable for a CTA
    const luminance = calculateLuminance(baseColor);
    
    // For dark themes, make CTAs brighter
    if (isDark && luminance < 0.6) {
      const rgb = hexToRgb(baseColor);
      const adjusted = rgb.map(c => Math.min(c + 50, 255));
      return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    }
    
    // For light themes, make CTAs darker and more saturated
    if (!isDark && luminance > 0.4) {
      const rgb = hexToRgb(baseColor);
      const adjusted = rgb.map(c => Math.max(c - 50, 0));
      return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
    }
    
    return baseColor;
  };
  
  // Generate hover and active states
  const generateHoverColor = (baseColor) => {
    const rgb = hexToRgb(baseColor);
    const adjusted = isDark 
      ? rgb.map(c => Math.min(c + 30, 255))
      : rgb.map(c => Math.max(c - 30, 0));
    return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
  };
  
  const generateActiveColor = (baseColor) => {
    const rgb = hexToRgb(baseColor);
    const adjusted = isDark 
      ? rgb.map(c => Math.min(c + 50, 255))
      : rgb.map(c => Math.max(c - 50, 0));
    return rgbToHex(adjusted[0]/255, adjusted[1]/255, adjusted[2]/255);
  };
  
  // Generate CTA colors
  const ctaPrimary = generateCtaColor(primary);
  const ctaSecondary = generateCtaColor(secondary);
  const ctaAccent = generateCtaColor(accent);
  
  const ctaColors = {
    primary: {
      base: ctaPrimary,
      hover: generateHoverColor(ctaPrimary),
      active: generateActiveColor(ctaPrimary)
    },
    secondary: {
      base: ctaSecondary,
      hover: generateHoverColor(ctaSecondary),
      active: generateActiveColor(ctaSecondary)
    },
    accent: {
      base: ctaAccent,
      hover: generateHoverColor(ctaAccent),
      active: generateActiveColor(ctaAccent)
    }
  };
  
  return {
    primary,
    secondary,
    accent,
    background,
    text,
    border,
    isDark,
    rawColors: sortedColors,
    ctaColors
  };
}

/**
 * Extract colors from a PDF file
 * @param {string} pdfPath Path to the PDF file
 * @returns {Promise<Object>} Color theme object
 */
async function extractColorsFromPDF(pdfPath) {
  try {
    console.log(`Extracting colors from: ${pdfPath}`);
    
    // Read the PDF file
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
    
    // Get the first few pages (for better color sampling)
    const maxPages = Math.min(pdf.numPages, 3);
    const colorPromises = [];
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      colorPromises.push(extractColorsFromPage(page));
    }
    
    // Combine colors from all pages
    const pageColors = await Promise.all(colorPromises);
    const allColors = Array.from(new Set(pageColors.flat()));
    
    console.log(`Extracted ${allColors.length} unique colors from PDF`);
    
    // Generate a color theme from the extracted colors
    const colorTheme = generateColorTheme(allColors);
    
    // Save the color theme to a JSON file
    const outputDir = path.join(path.dirname(pdfPath), 'extracted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'color_theme.json');
    fs.writeFileSync(outputPath, JSON.stringify(colorTheme, null, 2));
    
    console.log(`Color theme saved to: ${outputPath}`);
    
    return colorTheme;
  } catch (error) {
    console.error('Error extracting colors:', error);
    throw error;
  }
}

// Get the PDF path from command line arguments
const args = process.argv.slice(2);
let pdfPath;

if (args.length > 0) {
  // Use the provided file path
  pdfPath = args[0];
} else {
  // Use the default file path
  pdfPath = path.join(__dirname, '../public/default_resume.pdf');
}

// Extract colors from the PDF
extractColorsFromPDF(pdfPath)
  .then(colorTheme => {
    console.log('Color extraction completed successfully.');
    console.log('Theme generated:');
    console.log(`- Primary: ${colorTheme.primary}`);
    console.log(`- Secondary: ${colorTheme.secondary}`);
    console.log(`- Accent: ${colorTheme.accent}`);
    console.log(`- Background: ${colorTheme.background}`);
    console.log(`- Text: ${colorTheme.text}`);
    console.log(`- Dark theme: ${colorTheme.isDark}`);
  })
  .catch(error => {
    console.error('Color extraction failed:', error);
    process.exit(1);
  });
