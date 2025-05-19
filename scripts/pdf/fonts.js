/**
 * PDF Font Extraction Module
 *
 * This module extracts fonts from PDF files and creates a typography system.
 */

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');

const logger = createLogger('font');

/**
 * Extract fonts from a PDF file
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted font information
 */
async function extractFonts(pdfPath, options = {}) {
  try {
    logger.info(`Extracting fonts from: ${pdfPath}`);

    // Load the PDF document
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    logger.info(`PDF loaded successfully. Number of pages: ${pdfDocument.numPages}`);

    // Extract fonts from each page
    const fontInfo = {};

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const operatorList = await page.getOperatorList();
      const commonObjs = page.commonObjs;

      // Get font objects
      for (const key in commonObjs._objs) {
        if (key.startsWith('g_')) {
          const fontObj = commonObjs._objs[key];
          if (fontObj && fontObj.name) {
            const fontName = fontObj.name;
            const fontType = fontObj.type || 'unknown';
            const isMonospace = fontObj.isMonospace || false;
            const isSerifFont = fontObj.isSerif || false;

            // Extract font style and weight information from the font name
            const fontDetails = analyzeFontName(fontName);

            if (!fontInfo[fontName]) {
              fontInfo[fontName] = {
                name: fontName,
                type: fontType,
                isMonospace,
                isSerifFont,
                weight: fontDetails.weight,
                style: fontDetails.style,
                family: fontDetails.family,
                pages: new Set(),
                usage: 'unknown' // Will be determined later
              };
            }

            fontInfo[fontName].pages.add(pageNum);
          }
        }
      }
    }

    // Convert Sets to Arrays for JSON serialization
    for (const font in fontInfo) {
      fontInfo[font].pages = Array.from(fontInfo[font].pages);
    }

    // Analyze font usage based on characteristics
    analyzeFontUsage(fontInfo);

    // Save the font information to a JSON file
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);

    const outputPath = path.join(outputDir, 'font_info.json');
    utils.saveJson(outputPath, fontInfo);

    logger.success(`Font information saved to: ${outputPath}`);

    // Generate CSS with font-family declarations
    let cssContent = '/* Font families extracted from PDF */\n\n';
    cssContent += ':root {\n';

    // Add variables for each font
    const fontFamilies = Object.keys(fontInfo);

    // If no fonts were found, add default fallback fonts
    if (fontFamilies.length === 0) {
      logger.warning('No fonts found in PDF. Adding default fallback fonts to CSS.');
      cssContent += '  /* No fonts found in PDF, using fallbacks */\n';

      // Add PDF-prefixed variables with !important
      cssContent += '  /* PDF-prefixed variables */\n';
      cssContent += `  --pdf-heading-font: ${config.pdf.defaultFallbacks.fontHeading} !important;\n`;
      cssContent += `  --pdf-body-font: ${config.pdf.defaultFallbacks.fontBody} !important;\n`;
      cssContent += `  --pdf-mono-font: ${config.pdf.defaultFallbacks.fontMono} !important;\n`;
      cssContent += '  --pdf-title-font: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --pdf-subtitle-font: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --pdf-button-font: Helvetica, Arial, sans-serif !important;\n';
      cssContent += '  --pdf-nav-font: Verdana, sans-serif !important;\n';
      cssContent += '  --pdf-code-font: Consolas, monospace !important;\n';

      // Add direct variables for compatibility with !important
      cssContent += '\n  /* Direct variables for compatibility */\n';
      cssContent += '  --font-heading: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --font-body: Georgia, "Times New Roman", serif !important;\n';
      cssContent += '  --font-mono: "Courier New", monospace !important;\n';
      cssContent += '  --font-title: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --font-subtitle: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --font-button: Helvetica, Arial, sans-serif !important;\n';
      cssContent += '  --font-nav: Verdana, sans-serif !important;\n';
      cssContent += '  --font-code: Consolas, monospace !important;\n';

      // Add dynamic variables for compatibility with !important
      cssContent += '\n  /* Dynamic variables for compatibility */\n';
      cssContent += '  --dynamic-heading-font: Arial, Helvetica, sans-serif !important;\n';
      cssContent += '  --dynamic-primary-font: Georgia, "Times New Roman", serif !important;\n';
      cssContent += '  --dynamic-secondary-font: "Courier New", monospace !important;\n';
      cssContent += '  --dynamic-mono-font: "Courier New", monospace !important;\n';
    } else {
      // Add variables for each font found in the PDF
      // PDF-prefixed variables with !important
      cssContent += '  /* PDF-prefixed variables */\n';
      fontFamilies.forEach((fontName, index) => {
        const font = fontInfo[fontName];
        const cssVarName = `--pdf-font-${index + 1}`;
        const fallback = font.isMonospace ? 'monospace' : (font.isSerifFont ? 'serif' : 'sans-serif');
        cssContent += `  ${cssVarName}: '${fontName}', ${fallback} !important;\n`;
      });

      // Add standard font variables based on font types
      const serifFonts = fontFamilies.filter(name => fontInfo[name].isSerifFont);
      const sansSerifFonts = fontFamilies.filter(name => !fontInfo[name].isSerifFont && !fontInfo[name].isMonospace);
      const monoFonts = fontFamilies.filter(name => fontInfo[name].isMonospace);

      // Use the first font of each type, or fallback
      const headingFont = sansSerifFonts.length > 0 ? sansSerifFonts[0] : (fontFamilies.length > 0 ? fontFamilies[0] : 'Arial');
      const bodyFont = serifFonts.length > 0 ? serifFonts[0] : (sansSerifFonts.length > 0 ? sansSerifFonts[0] : (fontFamilies.length > 0 ? fontFamilies[0] : 'Georgia'));
      const monoFont = monoFonts.length > 0 ? monoFonts[0] : 'Courier New';

      // Add PDF-prefixed semantic variables with !important
      cssContent += '\n  /* PDF-prefixed semantic variables */\n';
      cssContent += `  --pdf-heading-font: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --pdf-body-font: '${bodyFont}', ${fontInfo[bodyFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --pdf-mono-font: '${monoFont}', monospace !important;\n`;
      cssContent += `  --pdf-title-font: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --pdf-subtitle-font: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --pdf-button-font: '${sansSerifFonts.length > 0 ? sansSerifFonts[0] : headingFont}', sans-serif !important;\n`;
      cssContent += `  --pdf-nav-font: '${sansSerifFonts.length > 0 ? sansSerifFonts[0] : headingFont}', sans-serif !important;\n`;
      cssContent += `  --pdf-code-font: '${monoFont}', monospace !important;\n`;

      // Add direct variables for compatibility with !important
      cssContent += '\n  /* Direct variables for compatibility */\n';
      cssContent += `  --font-heading: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --font-body: '${bodyFont}', ${fontInfo[bodyFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --font-mono: '${monoFont}', monospace !important;\n`;
      cssContent += `  --font-title: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --font-subtitle: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --font-button: '${sansSerifFonts.length > 0 ? sansSerifFonts[0] : headingFont}', sans-serif !important;\n`;
      cssContent += `  --font-nav: '${sansSerifFonts.length > 0 ? sansSerifFonts[0] : headingFont}', sans-serif !important;\n`;
      cssContent += `  --font-code: '${monoFont}', monospace !important;\n`;

      // Add dynamic variables for compatibility with !important
      cssContent += '\n  /* Dynamic variables for compatibility */\n';
      cssContent += `  --dynamic-heading-font: '${headingFont}', ${fontInfo[headingFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --dynamic-primary-font: '${bodyFont}', ${fontInfo[bodyFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --dynamic-secondary-font: '${bodyFont}', ${fontInfo[bodyFont]?.isSerifFont ? 'serif' : 'sans-serif'} !important;\n`;
      cssContent += `  --dynamic-mono-font: '${monoFont}', monospace !important;\n`;
    }

    cssContent += '}\n\n';

    // Add some utility classes
    if (fontFamilies.length > 0) {
      cssContent += '/* Primary font from PDF */\n';
      cssContent += '.pdf-primary-font {\n';
      cssContent += `  font-family: var(--pdf-font-1);\n`;
      cssContent += '}\n\n';
    }

    if (fontFamilies.length > 1) {
      cssContent += '/* Secondary font from PDF */\n';
      cssContent += '.pdf-secondary-font {\n';
      cssContent += `  font-family: var(--pdf-font-2);\n`;
      cssContent += '}\n\n';
    }

    // Add monospace and serif utility classes if available
    const monospaceFonts = fontFamilies.filter(name => fontInfo[name].isMonospace);
    if (monospaceFonts.length > 0) {
      const monoIndex = fontFamilies.indexOf(monospaceFonts[0]) + 1;
      cssContent += '/* Monospace font from PDF */\n';
      cssContent += '.pdf-monospace-font {\n';
      cssContent += `  font-family: var(--pdf-font-${monoIndex});\n`;
      cssContent += '}\n\n';
    }

    const serifFonts = fontFamilies.filter(name => fontInfo[name].isSerifFont);
    if (serifFonts.length > 0) {
      const serifIndex = fontFamilies.indexOf(serifFonts[0]) + 1;
      cssContent += '/* Serif font from PDF */\n';
      cssContent += '.pdf-serif-font {\n';
      cssContent += `  font-family: var(--pdf-font-${serifIndex});\n`;
      cssContent += '}\n\n';
    }

    // Save the CSS file
    const cssOutputPath = path.join(outputDir, 'pdf_fonts.css');
    utils.saveText(cssOutputPath, cssContent);

    logger.success(`CSS with font variables saved to: ${cssOutputPath}`);

    // Create a font theory object for the GlobalStylesProvider
    let fontTheory = await createFontTheory(pdfPath, fontFamilies, fontInfo);

    // Save the font theory to a JSON file
    const fontTheoryPath = path.join(outputDir, 'font_theory.json');
    utils.saveJson(fontTheoryPath, fontTheory);

    logger.success(`Font theory saved to: ${fontTheoryPath}`);

    return {
      success: true,
      fontInfo,
      fontTheory,
      cssPath: cssOutputPath,
      fontInfoPath: outputPath,
      fontTheoryPath
    };
  } catch (error) {
    logger.error(`Error extracting fonts: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Analyzes a font name to extract information about its family, weight, and style
 *
 * @param {string} fontName - The name of the font
 * @returns {Object} An object containing the font family, weight, and style
 */
function analyzeFontName(fontName) {
  // Default values
  const result = {
    family: fontName,
    weight: 'normal',
    style: 'normal'
  };

  // Convert to lowercase for easier matching
  const lowerName = fontName.toLowerCase();

  // Extract font family (remove weight and style indicators)
  // Common font family names
  const commonFamilies = [
    'arial', 'helvetica', 'times', 'times new roman', 'courier', 'verdana',
    'georgia', 'palatino', 'garamond', 'bookman', 'tahoma', 'trebuchet',
    'calibri', 'roboto', 'open sans', 'segoe', 'gill sans', 'century gothic'
  ];

  // Try to match a common font family
  for (const family of commonFamilies) {
    if (lowerName.includes(family)) {
      result.family = family.charAt(0).toUpperCase() + family.slice(1);
      break;
    }
  }

  // Detect font weight
  if (lowerName.includes('bold') || lowerName.includes('heavy') || lowerName.includes('black')) {
    result.weight = 'bold';
  } else if (lowerName.includes('light') || lowerName.includes('thin')) {
    result.weight = 'light';
  } else if (lowerName.includes('medium')) {
    result.weight = 'medium';
  } else if (lowerName.includes('semibold') || lowerName.includes('demibold')) {
    result.weight = 'semibold';
  }

  // Detect font style
  if (lowerName.includes('italic') || lowerName.includes('oblique')) {
    result.style = 'italic';
  }

  return result;
}

/**
 * Analyzes font usage based on characteristics
 *
 * @param {Object} fontInfo - The font information object
 */
function analyzeFontUsage(fontInfo) {
  logger.info('Analyzing font usage...');

  // Group fonts by family
  const fontFamilies = {};
  for (const fontName in fontInfo) {
    const font = fontInfo[fontName];
    const family = font.family;

    if (!fontFamilies[family]) {
      fontFamilies[family] = [];
    }

    fontFamilies[family].push(fontName);
  }

  // For each family, determine the most likely usage based on weight and style
  for (const family in fontFamilies) {
    const fonts = fontFamilies[family];

    // Find the normal weight, normal style font (body text)
    const normalFont = fonts.find(name =>
      fontInfo[name].weight === 'normal' && fontInfo[name].style === 'normal'
    );

    // Find the bold weight font (headings)
    const boldFont = fonts.find(name =>
      fontInfo[name].weight === 'bold' && fontInfo[name].style === 'normal'
    );

    // Find the italic font (emphasis)
    const italicFont = fonts.find(name =>
      fontInfo[name].style === 'italic'
    );

    // Find the bold italic font (strong emphasis)
    const boldItalicFont = fonts.find(name =>
      fontInfo[name].weight === 'bold' && fontInfo[name].style === 'italic'
    );

    // Assign usage based on findings
    if (normalFont) {
      fontInfo[normalFont].usage = 'body';
    }

    if (boldFont) {
      fontInfo[boldFont].usage = 'heading';
    }

    if (italicFont) {
      fontInfo[italicFont].usage = 'emphasis';
    }

    if (boldItalicFont) {
      fontInfo[boldItalicFont].usage = 'strong-emphasis';
    }
  }

  // If we have sans-serif and serif fonts, prefer sans-serif for headings and serif for body
  const sansSerifFonts = Object.keys(fontInfo).filter(name => !fontInfo[name].isSerifFont);
  const serifFonts = Object.keys(fontInfo).filter(name => fontInfo[name].isSerifFont);

  if (sansSerifFonts.length > 0 && serifFonts.length > 0) {
    // Find a sans-serif font for headings if none is already assigned
    const headingFont = sansSerifFonts.find(name => fontInfo[name].weight === 'bold' || fontInfo[name].weight === 'semibold');
    if (headingFont) {
      fontInfo[headingFont].usage = 'heading';
    } else if (sansSerifFonts.length > 0) {
      fontInfo[sansSerifFonts[0]].usage = 'heading';
    }

    // Find a serif font for body if none is already assigned
    const bodyFont = serifFonts.find(name => fontInfo[name].weight === 'normal');
    if (bodyFont) {
      fontInfo[bodyFont].usage = 'body';
    } else if (serifFonts.length > 0) {
      fontInfo[serifFonts[0]].usage = 'body';
    }
  }

  // If we only have sans-serif fonts, use weight to differentiate
  else if (sansSerifFonts.length > 0) {
    // Find a bold sans-serif font for headings
    const headingFont = sansSerifFonts.find(name => fontInfo[name].weight === 'bold' || fontInfo[name].weight === 'semibold');
    if (headingFont) {
      fontInfo[headingFont].usage = 'heading';
    }

    // Find a normal sans-serif font for body
    const bodyFont = sansSerifFonts.find(name => fontInfo[name].weight === 'normal');
    if (bodyFont) {
      fontInfo[bodyFont].usage = 'body';
    }

    // If we still don't have assignments, use the first font
    if (sansSerifFonts.length > 0 && !sansSerifFonts.some(name => fontInfo[name].usage === 'heading')) {
      fontInfo[sansSerifFonts[0]].usage = 'heading';
    }

    if (sansSerifFonts.length > 1 && !sansSerifFonts.some(name => fontInfo[name].usage === 'body')) {
      fontInfo[sansSerifFonts[1]].usage = 'body';
    } else if (sansSerifFonts.length === 1 && !sansSerifFonts.some(name => fontInfo[name].usage === 'body')) {
      fontInfo[sansSerifFonts[0]].usage = 'body';
    }
  }

  // Log the results
  logger.info('Font usage analysis results:');
  for (const fontName in fontInfo) {
    logger.info(`- ${fontName}: ${fontInfo[fontName].usage}`);
  }
}

/**
 * Create a font theory object for the GlobalStylesProvider
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {string[]} fontFamilies - Array of font family names
 * @param {Object} fontInfo - Font information object
 * @returns {Promise<Object>} - Font theory object
 */
async function createFontTheory(pdfPath, fontFamilies, fontInfo) {
  // Default font theory with fallbacks
  let fontTheory = {
    heading: config.pdf.defaultFallbacks.fontHeading,
    body: config.pdf.defaultFallbacks.fontBody,
    mono: config.pdf.defaultFallbacks.fontMono,
    allFonts: fontFamilies,
    // Add new properties for specific UI elements with fallbacks
    title: 'Arial, sans-serif',
    subtitle: 'Arial, sans-serif',
    button: 'Helvetica, sans-serif',
    nav: 'Verdana, sans-serif',
    code: 'Consolas, monospace',
    // Add a fontTheory description for better documentation
    fontTheory: {
      description: "The typography system aims to balance professionalism and readability for a resume/CV.",
      readability: "The serif body text enhances readability, while sans-serif headings provide hierarchy and contrast. Monospace font for code ensures clear technical content.",
      hierarchy: "Headings in Arial for prominence, body text in Georgia for legibility, and code in Consolas for technical clarity.",
      fontPairings: "Arial and Georgia create a classic combination, maintaining a balance of formality and readability."
    }
  };

  // Try to analyze fonts with OpenAI if available
  try {
    if (process.env.OPENAI_API_KEY) {
      const { analyzeFontsWithOpenAI } = require('../openai/analyzer');
      const openAIFontTheory = await analyzeFontsWithOpenAI(pdfPath, fontFamilies, fontInfo);

      if (openAIFontTheory) {
        logger.info('Using OpenAI font analysis');
        fontTheory = { ...openAIFontTheory, allFonts: fontFamilies };
      } else {
        logger.info('Falling back to local font theory generation');
      }
    } else {
      logger.info('OpenAI API key not found. Skipping font analysis with OpenAI.');
    }
  } catch (error) {
    logger.error(`Error analyzing fonts with OpenAI: ${error.message}`);
    logger.info('Falling back to local font theory generation');
  }

  // If OpenAI analysis failed or we need to fill in missing values, use local font theory
  if (!fontTheory.heading || !fontTheory.body) {
    logger.info('Using local font theory to generate typography system');

    // Assign fonts based on their characteristics
    const sansSerifFonts = fontFamilies.filter(name => !fontInfo[name].isSerifFont && !fontInfo[name].isMonospace);
    const serifFonts = fontFamilies.filter(name => fontInfo[name].isSerifFont);
    const monoFonts = fontFamilies.filter(name => fontInfo[name].isMonospace);

    // If no fonts were found in the PDF, create a default font set
    if (fontFamilies.length === 0) {
      logger.warning('No fonts found in PDF. Using default font theory.');
      return fontTheory;
    }

    // Assign heading font (prefer sans-serif)
    if (sansSerifFonts.length > 0) {
      const headingFont = sansSerifFonts.find(name => fontInfo[name].usage === 'heading') || sansSerifFonts[0];
      fontTheory.heading = `'${headingFont}', sans-serif`;
      fontTheory.title = `'${headingFont}', sans-serif`;
      fontTheory.subtitle = `'${headingFont}', sans-serif`;
      fontTheory.nav = `'${headingFont}', sans-serif`;
      fontTheory.button = `'${headingFont}', sans-serif`;
    }

    // Assign body font (prefer serif)
    if (serifFonts.length > 0) {
      const bodyFont = serifFonts.find(name => fontInfo[name].usage === 'body') || serifFonts[0];
      fontTheory.body = `'${bodyFont}', serif`;
    } else if (sansSerifFonts.length > 0) {
      const bodyFont = sansSerifFonts.find(name => fontInfo[name].usage === 'body') ||
        (sansSerifFonts.length > 1 ? sansSerifFonts[1] : sansSerifFonts[0]);
      fontTheory.body = `'${bodyFont}', sans-serif`;
    }

    // Assign mono font
    if (monoFonts.length > 0) {
      const monoFont = monoFonts[0];
      fontTheory.mono = `'${monoFont}', monospace`;
      fontTheory.code = `'${monoFont}', monospace`;
    }
  }

  return fontTheory;
}

module.exports = {
  extractFonts,
  analyzeFontName,
  analyzeFontUsage,
  createFontTheory
};
