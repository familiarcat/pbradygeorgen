/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// We'll use dynamic imports for PDF.js to avoid build issues
let pdfjs: any = null;

// Initialize PDF.js worker (client-side only)
if (typeof window !== 'undefined') {
  // This will be executed only in the browser
  import('pdfjs-dist').then((module) => {
    pdfjs = module;
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }
  }).catch(err => {
    console.error('Error loading PDF.js:', err);
  });
}

// Define color theme interface
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  isDark: boolean;
  isLoading: boolean;
  rawColors: string[];
}

// Default color theme (our Salinger-inspired earth tones)
export const defaultColorTheme: ColorTheme = {
  primary: '#7E6233', // coyote
  secondary: '#5F6B54', // ebony
  accent: '#7E4E2D', // terracotta
  background: '#F5F1E0', // parchment
  text: '#3A4535', // dark forest
  border: '#D5CDB5', // light border
  isDark: false,
  isLoading: false,
  rawColors: []
};

// Convert RGB array to hex color
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Calculate color luminance (for determining if a color is light or dark)
function getLuminance(hexColor: string): number {
  const rgb = hexColor.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const [r, g, b] = rgb.map(c => c / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Check if a color is dark
function isDarkColor(hexColor: string): boolean {
  return getLuminance(hexColor) < 0.5;
}

// Calculate color contrast
function getContrast(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Find the most contrasting color to a given color
function findContrastingColor(color: string, colorPool: string[]): string {
  let maxContrast = 0;
  let contrastingColor = colorPool[0] || '#000000';

  for (const poolColor of colorPool) {
    const contrast = getContrast(color, poolColor);
    if (contrast > maxContrast) {
      maxContrast = contrast;
      contrastingColor = poolColor;
    }
  }

  return contrastingColor;
}

// Extract dominant colors from a PDF page
async function extractColorsFromPage(page: any): Promise<string[]> {
  const operatorList = await page.getOperatorList();
  const colors: string[] = [];

  // Process each operation in the page
  for (let i = 0; i < operatorList.fnArray.length; i++) {
    const op = operatorList.fnArray[i];
    const args = operatorList.argsArray[i];

    // Check for fill color operations
    // Use numeric operation codes instead of OPS constants
    if (op === 3 || op === 1) { // 3 = setFillRGBColor, 1 = setStrokeRGBColor
      if (args && args.length >= 3) {
        const [r, g, b] = args;
        const hexColor = rgbToHex(r, g, b);
        if (!colors.includes(hexColor)) {
          colors.push(hexColor);
        }
      }
    }

    // Check for fill color in CMYK space
    // Use numeric operation codes instead of OPS constants
    else if (op === 4 || op === 2) { // 4 = setFillCMYKColor, 2 = setStrokeCMYKColor
      if (args && args.length >= 4) {
        // Simple CMYK to RGB conversion (not perfect but works for our purpose)
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

// Filter out grayscale and near-grayscale colors
function filterGrayscaleColors(colors: string[]): string[] {
  return colors.filter(color => {
    const rgb = color.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
    const [r, g, b] = rgb;

    // Check if the color is close to grayscale
    const avg = (r + g + b) / 3;
    const threshold = 15; // Tolerance for how close the RGB values need to be

    return !(
      Math.abs(r - avg) < threshold &&
      Math.abs(g - avg) < threshold &&
      Math.abs(b - avg) < threshold
    );
  });
}

// Generate a color theme from extracted colors
function generateColorTheme(colors: string[]): ColorTheme {
  // Filter out grayscale colors and sort by luminance
  const filteredColors = filterGrayscaleColors(colors);
  const sortedColors = [...filteredColors].sort((a, b) => getLuminance(a) - getLuminance(b));

  if (sortedColors.length === 0) {
    return { ...defaultColorTheme, isLoading: false };
  }

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
    secondary = findContrastingColor(primary, [...midColors, darkestColor, lightestColor]);
    accent = findContrastingColor(secondary, [...midColors, darkestColor, lightestColor]);
    // Fix spread argument error by using array destructuring
    if (isDark) {
      const rgb = hexToRgb(darkestColor).map(c => Math.min(c + 30, 255)) as [number, number, number];
      border = rgbToHex(rgb[0]/255, rgb[1]/255, rgb[2]/255);
    } else {
      const rgb = hexToRgb(lightestColor).map(c => Math.max(c - 30, 0)) as [number, number, number];
      border = rgbToHex(rgb[0]/255, rgb[1]/255, rgb[2]/255);
    }
  } else {
    // Fallback to derived colors if we don't have enough
    primary = isDark ? lightenColor(darkestColor, 0.3) : darkenColor(lightestColor, 0.3);
    secondary = isDark ? lightenColor(darkestColor, 0.5) : darkenColor(lightestColor, 0.5);
    accent = isDark ? lightenColor(darkestColor, 0.7) : darkenColor(lightestColor, 0.7);
    border = isDark ? lightenColor(darkestColor, 0.1) : darkenColor(lightestColor, 0.1);
  }

  return {
    primary,
    secondary,
    accent,
    background,
    text,
    border,
    isDark,
    isLoading: false,
    rawColors: sortedColors
  };
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const rgb = hex.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  return rgb as [number, number, number];
}

// Helper function to lighten a color
function lightenColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const newRgb = rgb.map(c => Math.min(255, c + Math.round(amount * 255))) as [number, number, number];
  return rgbToHex(newRgb[0]/255, newRgb[1]/255, newRgb[2]/255);
}

// Helper function to darken a color
function darkenColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const newRgb = rgb.map(c => Math.max(0, c - Math.round(amount * 255))) as [number, number, number];
  return rgbToHex(newRgb[0]/255, newRgb[1]/255, newRgb[2]/255);
}

// Main function to extract colors from a PDF
export async function extractColorsFromPDF(pdfUrl: string): Promise<ColorTheme> {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return { ...defaultColorTheme, isLoading: false };
    }

    // Ensure PDF.js is loaded
    if (!pdfjs) {
      pdfjs = await import('pdfjs-dist');
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      }
    }

    // Load the PDF document
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    // Get the first few pages (for better color sampling)
    const maxPages = Math.min(pdf.numPages, 3);
    const colorPromises: Promise<string[]>[] = [];

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      colorPromises.push(extractColorsFromPage(page));
    }

    // Combine colors from all pages
    const pageColors = await Promise.all(colorPromises);
    const allColors = Array.from(new Set(pageColors.flat()));

    // Generate a color theme from the extracted colors
    return generateColorTheme(allColors);
  } catch (error) {
    console.error('Error extracting colors from PDF:', error);
    return { ...defaultColorTheme, isLoading: false };
  }
}
