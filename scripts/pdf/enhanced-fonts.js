/**
 * Enhanced PDF Font Extraction Module
 *
 * This module provides improved font extraction from PDF files using multiple methods:
 * 1. Programmatic extraction using pdfjs-dist
 * 2. Visual font analysis
 * 3. Font relationship analysis
 * 4. Typography system generation
 *
 * Following the Hesse philosophy of mathematical precision in typography.
 */

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');
const { OpenAI } = require('openai');

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const logger = createLogger('enhanced-font');

/**
 * Extract fonts from a PDF file using enhanced methods
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted font information
 */
async function extractEnhancedFonts(pdfPath, options = {}) {
  logger.info(`Extracting enhanced fonts from PDF: ${pdfPath}`);

  try {
    // Step 1: Programmatic extraction using pdfjs-dist
    logger.info('Performing programmatic font extraction...');
    const programmaticFonts = await extractProgrammaticFonts(pdfPath);

    // Step 2: Visual font analysis (placeholder for future implementation)
    let visualFonts = [];
    try {
      logger.info('Performing visual font analysis...');
      visualFonts = await analyzeVisualFonts(pdfPath);
    } catch (error) {
      logger.warning(`Visual font analysis failed: ${error.message}. Continuing with programmatic fonts only.`);
    }

    // Step 3: Merge results with priority to programmatic extraction
    logger.info('Merging font extraction results...');
    const mergedFonts = mergeFontResults(programmaticFonts, visualFonts);

    // Step 4: Analyze font usage and create a typography system
    logger.info('Analyzing font usage...');
    const fontSystem = await analyzeFontUsage(mergedFonts, pdfPath);

    // Step 5: Generate font pairings and fallbacks
    logger.info('Generating font pairings and fallbacks...');
    const enhancedFontSystem = generateFontPairings(fontSystem);

    // Save the results
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);

    // Save the enhanced font theory
    const fontTheoryPath = path.join(outputDir, 'enhanced_font_theory.json');
    utils.saveJson(fontTheoryPath, enhancedFontSystem);

    // Generate CSS with font variables
    const cssContent = generateFontCss(enhancedFontSystem);
    const cssPath = path.join(outputDir, 'enhanced_pdf_fonts.css');
    utils.saveText(cssPath, cssContent);

    logger.success(`Enhanced font theory saved to ${fontTheoryPath}`);
    logger.success(`Enhanced font CSS saved to ${cssPath}`);

    return {
      success: true,
      fontSystem: enhancedFontSystem,
      fontTheoryPath,
      cssPath
    };
  } catch (error) {
    logger.error(`Error extracting enhanced fonts: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract fonts programmatically using pdfjs-dist
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Object>} - Extracted font information
 */
async function extractProgrammaticFonts(pdfPath) {
  // Set up the worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js');

  // Load the PDF file
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;

  logger.info(`PDF loaded successfully. Number of pages: ${pdfDocument.numPages}`);

  // Font information object
  const fontInfo = {};

  // Process each page
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    logger.info(`Processing page ${pageNum}/${pdfDocument.numPages}`);

    const page = await pdfDocument.getPage(pageNum);
    const operatorList = await page.getOperatorList();
    const commonObjs = page.commonObjs;

    // Extract font data from the page
    for (const key in commonObjs.objs) {
      if (key.startsWith('g_font_')) {
        const fontObj = commonObjs.objs[key];

        if (fontObj && fontObj.data) {
          const fontName = fontObj.data.name || 'Unknown Font';

          // Initialize font info if not already present
          if (!fontInfo[fontName]) {
            fontInfo[fontName] = {
              name: fontName,
              type: fontObj.data.type || 'Unknown',
              subtype: fontObj.data.subtype || 'Unknown',
              encoding: fontObj.data.encoding || 'Unknown',
              isMonospace: fontObj.data.isMonospace || false,
              isSerifFont: fontObj.data.isSerifFont || false,
              isSymbolicFont: fontObj.data.isSymbolicFont || false,
              weight: fontObj.data.weight || 'normal',
              italic: fontObj.data.italic || false,
              pages: new Set([pageNum]),
              usage: 'unknown'
            };
          } else {
            // Add page number to the set of pages where this font is used
            fontInfo[fontName].pages.add(pageNum);
          }
        }
      }
    }

    // Try to extract text content to analyze font usage
    try {
      const textContent = await page.getTextContent();

      // Process text items to extract font information
      for (const item of textContent.items) {
        if (item.fontName) {
          // Clean up font name
          const fontName = item.fontName.replace(/^g_/, '');

          // Initialize font info if not already present
          if (!fontInfo[fontName]) {
            // Try to determine font characteristics from the name
            const isMonospace = /mono|courier|typewriter|console/i.test(fontName);
            const isSerifFont = /serif|times|georgia|garamond|baskerville/i.test(fontName) && !/sans/i.test(fontName);
            const isSansSerif = /sans|arial|helvetica|verdana|tahoma|trebuchet/i.test(fontName);
            const isItalic = /italic|oblique/i.test(fontName);
            const isBold = /bold|black|heavy/i.test(fontName);

            fontInfo[fontName] = {
              name: fontName,
              type: 'Unknown',
              subtype: 'Unknown',
              encoding: 'Unknown',
              isMonospace: isMonospace,
              isSerifFont: isSerifFont,
              isSansSerif: isSansSerif,
              isSymbolicFont: false,
              weight: isBold ? 'bold' : 'normal',
              italic: isItalic,
              pages: new Set([pageNum]),
              usage: 'text',
              fontSize: item.fontSize || 0,
              samples: [item.str.substring(0, 50)]
            };
          } else {
            // Add page number to the set of pages where this font is used
            fontInfo[fontName].pages.add(pageNum);

            // Update font size information (keep track of the largest size)
            if (item.fontSize && item.fontSize > (fontInfo[fontName].fontSize || 0)) {
              fontInfo[fontName].fontSize = item.fontSize;
            }

            // Add text sample if we don't have many yet
            if (fontInfo[fontName].samples && fontInfo[fontName].samples.length < 5 && item.str.trim().length > 0) {
              fontInfo[fontName].samples.push(item.str.substring(0, 50));
            }
          }
        }
      }
    } catch (error) {
      logger.warning(`Error extracting text content from page ${pageNum}: ${error.message}`);
    }
  }

  // Convert Sets to Arrays for JSON serialization
  for (const font in fontInfo) {
    fontInfo[font].pages = Array.from(fontInfo[font].pages);
  }

  // If no fonts were found, try to extract from metadata
  if (Object.keys(fontInfo).length === 0) {
    try {
      const metadata = await pdfDocument.getMetadata();
      if (metadata && metadata.info) {
        logger.info('Attempting to extract fonts from PDF metadata');

        // Some PDFs store font information in the metadata
        if (metadata.info.FontName) {
          const fontName = metadata.info.FontName;
          fontInfo[fontName] = {
            name: fontName,
            type: 'Unknown',
            subtype: 'Unknown',
            encoding: 'Unknown',
            isMonospace: /mono|courier|typewriter|console/i.test(fontName),
            isSerifFont: /serif|times|georgia|garamond|baskerville/i.test(fontName) && !/sans/i.test(fontName),
            isSansSerif: /sans|arial|helvetica|verdana|tahoma|trebuchet/i.test(fontName),
            isSymbolicFont: false,
            weight: /bold|black|heavy/i.test(fontName) ? 'bold' : 'normal',
            italic: /italic|oblique/i.test(fontName),
            pages: [1],
            usage: 'metadata',
            source: 'metadata'
          };
        }
      }
    } catch (error) {
      logger.warning(`Error extracting metadata: ${error.message}`);
    }
  }

  // If still no fonts were found, return an empty object
  if (Object.keys(fontInfo).length === 0) {
    logger.warning('No fonts found in PDF.');
    return { fonts: {} };
  }

  // Try to determine font roles based on usage patterns
  const fontRoles = determineFontRoles(fontInfo);

  logger.info(`Found ${Object.keys(fontInfo).length} fonts in the PDF.`);

  return {
    fonts: fontInfo,
    roles: fontRoles
  };
}

/**
 * Determine font roles based on usage patterns
 *
 * @param {Object} fontInfo - Font information
 * @returns {Object} - Font roles
 */
function determineFontRoles(fontInfo) {
  const fontNames = Object.keys(fontInfo);
  const roles = {
    heading: null,
    body: null,
    mono: null
  };

  // If we have font size information, use it to determine roles
  const fontsWithSize = fontNames.filter(name => fontInfo[name].fontSize);

  if (fontsWithSize.length > 0) {
    // Sort fonts by size (descending)
    fontsWithSize.sort((a, b) => fontInfo[b].fontSize - fontInfo[a].fontSize);

    // Largest font is likely a heading font
    roles.heading = fontsWithSize[0];

    // Most used font that's not the heading is likely body text
    const fontsByUsage = [...fontsWithSize];
    fontsByUsage.sort((a, b) => fontInfo[b].pages.length - fontInfo[a].pages.length);

    for (const font of fontsByUsage) {
      if (font !== roles.heading) {
        roles.body = font;
        break;
      }
    }
  } else {
    // No size information, use font characteristics

    // Find monospace fonts
    const monoFonts = fontNames.filter(name => fontInfo[name].isMonospace);
    if (monoFonts.length > 0) {
      roles.mono = monoFonts[0];
    }

    // Find serif and sans-serif fonts
    const serifFonts = fontNames.filter(name => fontInfo[name].isSerifFont);
    const sansSerifFonts = fontNames.filter(name => !fontInfo[name].isSerifFont && !fontInfo[name].isMonospace);

    // Typically, sans-serif fonts are used for headings and serif for body text
    // But this can vary, so we'll check if we have both types
    if (sansSerifFonts.length > 0 && serifFonts.length > 0) {
      roles.heading = sansSerifFonts[0];
      roles.body = serifFonts[0];
    } else if (sansSerifFonts.length > 1) {
      // If we have multiple sans-serif fonts, use the first for headings and second for body
      roles.heading = sansSerifFonts[0];
      roles.body = sansSerifFonts[1];
    } else if (serifFonts.length > 1) {
      // If we have multiple serif fonts, use the first for headings and second for body
      roles.heading = serifFonts[0];
      roles.body = serifFonts[1];
    } else if (fontNames.length > 1) {
      // If we have multiple fonts but couldn't categorize them, just use the first two
      roles.heading = fontNames[0];
      roles.body = fontNames[1];
    } else if (fontNames.length === 1) {
      // If we only have one font, use it for both heading and body
      roles.heading = fontNames[0];
      roles.body = fontNames[0];
    }
  }

  return roles;
}

/**
 * Analyze fonts visually (placeholder for future implementation)
 *
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of visually analyzed fonts
 */
async function analyzeVisualFonts(pdfPath) {
  // This is a placeholder for future implementation
  logger.info('Visual font analysis not implemented yet. This is a placeholder.');
  return [];
}

/**
 * Merge programmatic and visual font extraction results
 *
 * @param {Object} programmaticFonts - Fonts extracted programmatically
 * @param {Array} visualFonts - Fonts analyzed visually
 * @returns {Object} - Merged font results
 */
function mergeFontResults(programmaticFonts, visualFonts) {
  // For now, just return the programmatic fonts
  // In a real implementation, you would merge the results with some priority logic
  return programmaticFonts;
}

/**
 * Analyze font usage and create a typography system
 *
 * @param {Object} fontData - Extracted font information
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Object>} - Typography system
 */
async function analyzeFontUsage(fontData, pdfPath) {
  // If no fonts were found, return a default system
  const extractedFontNames = Object.keys(fontData.fonts);
  if (extractedFontNames.length === 0) {
    logger.warning('No fonts found in PDF. Creating a default typography system.');
    return createManualFontSystem(fontData);
  }

  // If OpenAI is available, use it to analyze fonts
  if (openai) {
    try {
      logger.info('Analyzing fonts with OpenAI...');

      // Get the PDF filename for context
      const pdfFilename = path.basename(pdfPath);

      // Prepare font data for OpenAI
      const fontList = Object.values(fontData.fonts).map(font => ({
        name: font.name,
        type: font.type,
        isMonospace: font.isMonospace,
        isSerifFont: font.isSerifFont,
        isSansSerif: font.isSansSerif,
        isSymbolicFont: font.isSymbolicFont,
        weight: font.weight,
        italic: font.italic,
        fontSize: font.fontSize,
        samples: font.samples
      }));

      // Include font roles if available
      const fontRoles = fontData.roles || {};

      // Create a list of extracted font names for emphasis
      const extractedFontsList = extractedFontNames.map(name => `"${name}"`).join(', ');

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a typography expert with a focus on Derrida's philosophy of deconstruction. Your task is to analyze the provided font information and create a typography system that STRICTLY uses ONLY the fonts found in the PDF. Do not introduce any external fonts whatsoever. The goal is to deconstruct the PDF's typography and reconstruct it faithfully in the UI."
          },
          {
            role: "user",
            content: `Analyze these fonts extracted from the PDF "${pdfFilename}" and create a cohesive typography system:

            Font Information:
            ${JSON.stringify(fontList, null, 2)}

            Detected Font Roles:
            ${JSON.stringify(fontRoles, null, 2)}

            CRITICAL INSTRUCTION: You MUST use ONLY these exact fonts that were extracted from the PDF: ${extractedFontsList}

            DO NOT introduce any external fonts like Arial, Helvetica, Roboto, Lora, Times New Roman, etc.
            DO NOT add fallback fonts that weren't in the original PDF.

            If a role requires a font (e.g., monospace) that wasn't found in the PDF, use one of the extracted fonts anyway - do not introduce external fonts.

            For each font role in the response, use ONLY the exact font names from the list above.

            Return a JSON object with the following structure:
            {
              "heading": "Font name for headings (must be from extracted fonts)",
              "body": "Font name for body text (must be from extracted fonts)",
              "mono": "Font name for monospace text (must be from extracted fonts)",
              "title": "Font name for titles (must be from extracted fonts)",
              "subtitle": "Font name for subtitles (must be from extracted fonts)",
              "button": "Font name for buttons (must be from extracted fonts)",
              "nav": "Font name for navigation (must be from extracted fonts)",
              "code": "Font name for code (must be from extracted fonts)",
              "fontTheory": {
                "description": "Description of the typography system using only extracted fonts",
                "readability": "Assessment of readability",
                "hierarchy": "Description of the typographic hierarchy",
                "fontPairings": "Description of font pairings using only extracted fonts"
              },
              "allFonts": [${extractedFontsList}]
            }`
          }
        ],
        temperature: 0.3, // Lower temperature for more deterministic results
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      logger.success('Successfully analyzed fonts with OpenAI');

      // Parse the response
      const fontTheory = JSON.parse(response.choices[0].message.content);

      // Add the original font data
      fontTheory.extractedFonts = fontData.fonts;
      fontTheory.extractedRoles = fontData.roles;

      // Strictly validate the font theory to ensure it uses ONLY extracted fonts
      const validatedFontTheory = strictlyValidateFontTheory(fontTheory, fontData);

      return validatedFontTheory;
    } catch (error) {
      logger.error(`Error analyzing fonts with OpenAI: ${error.message}`);
      // Fall back to manual analysis
    }
  }

  // Manual analysis if OpenAI is not available or fails
  return createManualFontSystem(fontData);
}

/**
 * Validate font theory to ensure it uses extracted fonts when possible
 *
 * @param {Object} fontTheory - Font theory from OpenAI
 * @param {Object} fontData - Extracted font data
 * @returns {Object} - Validated font theory
 */
function validateFontTheory(fontTheory, fontData) {
  const extractedFontNames = Object.keys(fontData.fonts);
  const roles = fontData.roles || {};

  // If we have no extracted fonts, return the font theory as is
  if (extractedFontNames.length === 0) {
    return fontTheory;
  }

  // Create a copy of the font theory to modify
  const validatedTheory = { ...fontTheory };

  // Check each role and ensure it uses an extracted font when possible
  const roleKeys = ['heading', 'body', 'mono', 'title', 'subtitle', 'button', 'nav', 'code'];

  roleKeys.forEach(role => {
    // If we have a detected role for this, use it
    if (roles[role] && extractedFontNames.includes(roles[role])) {
      validatedTheory[role] = `'${roles[role]}'`;
      return;
    }

    // If the current value doesn't include any of our extracted fonts, try to find a match
    const currentValue = validatedTheory[role] || '';
    const hasExtractedFont = extractedFontNames.some(font =>
      currentValue.includes(font) || currentValue.includes(font.replace(/'/g, ''))
    );

    if (!hasExtractedFont) {
      // For heading roles, prefer sans-serif fonts
      if (['heading', 'title', 'button', 'nav'].includes(role)) {
        // Find sans-serif fonts
        const sansSerifFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isSansSerif ||
          (!fontData.fonts[name].isSerifFont && !fontData.fonts[name].isMonospace)
        );

        if (sansSerifFonts.length > 0) {
          validatedTheory[role] = `'${sansSerifFonts[0]}'`;
          return;
        }
      }

      // For body roles, prefer serif fonts
      if (['body', 'subtitle'].includes(role)) {
        // Find serif fonts
        const serifFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isSerifFont
        );

        if (serifFonts.length > 0) {
          validatedTheory[role] = `'${serifFonts[0]}'`;
          return;
        }
      }

      // For mono roles, prefer monospace fonts
      if (['mono', 'code'].includes(role)) {
        // Find monospace fonts
        const monoFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isMonospace
        );

        if (monoFonts.length > 0) {
          validatedTheory[role] = `'${monoFonts[0]}'`;
          return;
        }
      }

      // If we couldn't find a specific match, use the first extracted font
      if (extractedFontNames.length > 0) {
        validatedTheory[role] = `'${extractedFontNames[0]}'`;
      }
    }
  });

  // Update allFonts to include all extracted fonts
  validatedTheory.allFonts = extractedFontNames;

  return validatedTheory;
}

/**
 * Strictly validate font theory to ensure it uses ONLY extracted fonts
 * Following Derrida's philosophy of deconstruction, we ensure that the typography
 * system is built exclusively from the fonts found in the source PDF.
 *
 * @param {Object} fontTheory - Font theory from OpenAI
 * @param {Object} fontData - Extracted font data
 * @returns {Object} - Strictly validated font theory
 */
function strictlyValidateFontTheory(fontTheory, fontData) {
  const extractedFontNames = Object.keys(fontData.fonts);
  const roles = fontData.roles || {};

  // If we have no extracted fonts, return a minimal font theory
  if (extractedFontNames.length === 0) {
    logger.warning('No fonts found in PDF for strict validation.');
    return createManualFontSystem(fontData);
  }

  // Create a copy of the font theory to modify
  const validatedTheory = { ...fontTheory };

  // Check each role and ensure it uses ONLY an extracted font
  const roleKeys = ['heading', 'body', 'mono', 'title', 'subtitle', 'button', 'nav', 'code'];

  roleKeys.forEach(role => {
    let currentValue = validatedTheory[role] || '';

    // Remove any quotes and trim
    currentValue = currentValue.replace(/['"]/g, '').trim();

    // Remove any fallback fonts (anything after a comma)
    if (currentValue.includes(',')) {
      currentValue = currentValue.split(',')[0].trim();
    }

    // Check if the current value is an extracted font
    const isExtractedFont = extractedFontNames.some(font =>
      font === currentValue || font.replace(/['"]/g, '') === currentValue
    );

    if (!isExtractedFont) {
      logger.warning(`Font "${currentValue}" for role "${role}" is not from the extracted fonts. Replacing with an extracted font.`);

      // If we have a detected role for this, use it
      if (roles[role] && extractedFontNames.includes(roles[role])) {
        validatedTheory[role] = roles[role];
        return;
      }

      // Otherwise, use the most appropriate font based on role
      if (['heading', 'title', 'button', 'nav'].includes(role)) {
        // For heading roles, prefer sans-serif fonts
        const sansSerifFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isSansSerif ||
          (!fontData.fonts[name].isSerifFont && !fontData.fonts[name].isMonospace)
        );

        if (sansSerifFonts.length > 0) {
          validatedTheory[role] = sansSerifFonts[0];
          return;
        }
      }

      if (['body', 'subtitle'].includes(role)) {
        // For body roles, prefer serif fonts
        const serifFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isSerifFont
        );

        if (serifFonts.length > 0) {
          validatedTheory[role] = serifFonts[0];
          return;
        }
      }

      if (['mono', 'code'].includes(role)) {
        // For mono roles, prefer monospace fonts
        const monoFonts = extractedFontNames.filter(name =>
          fontData.fonts[name].isMonospace
        );

        if (monoFonts.length > 0) {
          validatedTheory[role] = monoFonts[0];
          return;
        }
      }

      // If we couldn't find a specific match, use the first extracted font
      validatedTheory[role] = extractedFontNames[0];
    } else {
      // Keep the font but ensure it's just the name without quotes or fallbacks
      validatedTheory[role] = currentValue;
    }
  });

  // Update allFonts to include ONLY extracted fonts
  validatedTheory.allFonts = extractedFontNames;

  // Update font theory description to emphasize Derrida's approach
  validatedTheory.fontTheory.description =
    `A typography system strictly using only the fonts extracted from the PDF: ${extractedFontNames.join(', ')}. ` +
    `Following Derrida's philosophy of deconstruction, we've preserved the original typography without introducing external elements.`;

  return validatedTheory;
}

/**
 * Create a font system manually based on extracted fonts
 *
 * @param {Object} fontData - Extracted font information
 * @returns {Object} - Font system
 */
function createManualFontSystem(fontData) {
  const fonts = fontData.fonts;
  const fontNames = Object.keys(fonts);
  const roles = fontData.roles || {};

  // Default font system - only used if no fonts are found
  const defaultSystem = {
    heading: 'Arial',
    body: 'Arial',
    mono: 'Arial',
    title: 'Arial',
    subtitle: 'Arial',
    button: 'Arial',
    nav: 'Arial',
    code: 'Arial',
    fontTheory: {
      description: "A typography system based on extracted fonts from the PDF.",
      readability: "Optimized for readability with clear font choices.",
      hierarchy: "Clear hierarchy with distinct heading and body fonts.",
      fontPairings: "Following Derrida's philosophy of deconstruction, using only fonts from the source."
    },
    allFonts: fontNames,
    extractedFonts: fonts,
    extractedRoles: roles
  };

  // If no fonts were found, return the default system with a warning
  if (fontNames.length === 0) {
    logger.warning('No fonts found in PDF. Using default font system.');
    return defaultSystem;
  }

  // Create a new system using only extracted fonts
  const strictSystem = {
    heading: fontNames[0],
    body: fontNames[0],
    mono: fontNames[0],
    title: fontNames[0],
    subtitle: fontNames[0],
    button: fontNames[0],
    nav: fontNames[0],
    code: fontNames[0],
    fontTheory: {
      description: `A typography system strictly using only the fonts extracted from the PDF: ${fontNames.join(', ')}.`,
      readability: "Optimized for readability while maintaining the PDF's original style.",
      hierarchy: "Typography hierarchy based on the PDF's original font usage.",
      fontPairings: "Following Derrida's philosophy of deconstruction, using only fonts from the source."
    },
    allFonts: fontNames,
    extractedFonts: fonts,
    extractedRoles: roles
  };

  // Use detected roles if available
  if (roles.heading) strictSystem.heading = roles.heading;
  if (roles.body) strictSystem.body = roles.body;
  if (roles.mono) strictSystem.mono = roles.mono;

  // If we have heading role, use it for title, button, and nav as well
  if (roles.heading) {
    strictSystem.title = roles.heading;
    strictSystem.button = roles.heading;
    strictSystem.nav = roles.heading;
  }

  // If we have body role, use it for subtitle as well
  if (roles.body) {
    strictSystem.subtitle = roles.body;
  }

  // If we have mono role, use it for code as well
  if (roles.mono) {
    strictSystem.code = roles.mono;
  }

  // If we don't have detected roles, use font characteristics
  if (!roles.heading || !roles.body) {
    // Find serif and sans-serif fonts
    const serifFonts = fontNames.filter(name => fonts[name].isSerifFont);
    const sansSerifFonts = fontNames.filter(name =>
      fonts[name].isSansSerif || (!fonts[name].isSerifFont && !fonts[name].isMonospace)
    );
    const monospaceFonts = fontNames.filter(name => fonts[name].isMonospace);

    // Assign heading font (prefer sans-serif) if not already assigned
    if (!roles.heading && sansSerifFonts.length > 0) {
      strictSystem.heading = sansSerifFonts[0];
      strictSystem.title = sansSerifFonts[0];
      strictSystem.button = sansSerifFonts[0];
      strictSystem.nav = sansSerifFonts[0];
    }

    // Assign body font (prefer serif) if not already assigned
    if (!roles.body && serifFonts.length > 0) {
      strictSystem.body = serifFonts[0];
      strictSystem.subtitle = serifFonts[0];
    } else if (!roles.body && sansSerifFonts.length > 1) {
      // If no serif fonts, use a different sans-serif for body
      strictSystem.body = sansSerifFonts[1];
      strictSystem.subtitle = sansSerifFonts[1];
    } else if (!roles.body && fontNames.length > 1) {
      // If we have at least two fonts, use the second for body
      strictSystem.body = fontNames[1];
      strictSystem.subtitle = fontNames[1];
    }

    // Assign monospace font if not already assigned
    if (!roles.mono && monospaceFonts.length > 0) {
      strictSystem.mono = monospaceFonts[0];
      strictSystem.code = monospaceFonts[0];
    }
  }

  // Update font theory description with Derrida's philosophy
  const fontDescription = fontNames.join(', ');
  strictSystem.fontTheory.description =
    `A typography system strictly using only the fonts extracted from the PDF: ${fontDescription}. ` +
    `Following Derrida's philosophy of deconstruction, we've preserved the original typography without introducing external elements.`;

  return strictSystem;
}

/**
 * Generate font pairings and fallbacks
 *
 * @param {Object} fontSystem - Font system
 * @returns {Object} - Enhanced font system with pairings and fallbacks
 */
function generateFontPairings(fontSystem) {
  // Add web-safe fallbacks to each font family
  const enhancedSystem = { ...fontSystem };

  // Ensure heading font has appropriate fallbacks
  if (!enhancedSystem.heading.includes('sans-serif') && !enhancedSystem.heading.includes('serif')) {
    enhancedSystem.heading = `${enhancedSystem.heading}, Arial, sans-serif`;
  }

  // Ensure body font has appropriate fallbacks
  if (!enhancedSystem.body.includes('sans-serif') && !enhancedSystem.body.includes('serif')) {
    enhancedSystem.body = `${enhancedSystem.body}, Georgia, serif`;
  }

  // Ensure mono font has appropriate fallbacks
  if (!enhancedSystem.mono.includes('monospace')) {
    enhancedSystem.mono = `${enhancedSystem.mono}, 'Courier New', monospace`;
  }

  return enhancedSystem;
}

/**
 * Generate CSS with font variables
 *
 * @param {Object} fontSystem - Font system
 * @returns {string} - CSS content
 */
function generateFontCss(fontSystem) {
  let cssContent = '/* Enhanced font families extracted from PDF */\n\n';
  cssContent += ':root {\n';

  // Add PDF-prefixed variables with !important
  cssContent += '  /* PDF-prefixed variables */\n';
  cssContent += `  --pdf-heading-font: ${fontSystem.heading} !important;\n`;
  cssContent += `  --pdf-body-font: ${fontSystem.body} !important;\n`;
  cssContent += `  --pdf-mono-font: ${fontSystem.mono} !important;\n`;
  cssContent += `  --pdf-title-font: ${fontSystem.title} !important;\n`;
  cssContent += `  --pdf-subtitle-font: ${fontSystem.subtitle} !important;\n`;
  cssContent += `  --pdf-button-font: ${fontSystem.button} !important;\n`;
  cssContent += `  --pdf-nav-font: ${fontSystem.nav} !important;\n`;
  cssContent += `  --pdf-code-font: ${fontSystem.code} !important;\n\n`;

  // Add direct variables for compatibility
  cssContent += '  /* Direct variables for compatibility */\n';
  cssContent += `  --font-heading: ${fontSystem.heading} !important;\n`;
  cssContent += `  --font-body: ${fontSystem.body} !important;\n`;
  cssContent += `  --font-mono: ${fontSystem.mono} !important;\n`;
  cssContent += `  --font-title: ${fontSystem.title} !important;\n`;
  cssContent += `  --font-subtitle: ${fontSystem.subtitle} !important;\n`;
  cssContent += `  --font-button: ${fontSystem.button} !important;\n`;
  cssContent += `  --font-nav: ${fontSystem.nav} !important;\n`;
  cssContent += `  --font-code: ${fontSystem.code} !important;\n\n`;

  // Add dynamic variables for compatibility
  cssContent += '  /* Dynamic variables for compatibility */\n';
  cssContent += `  --dynamic-heading-font: ${fontSystem.heading} !important;\n`;
  cssContent += `  --dynamic-primary-font: ${fontSystem.body} !important;\n`;
  cssContent += `  --dynamic-secondary-font: ${fontSystem.body} !important;\n`;
  cssContent += `  --dynamic-mono-font: ${fontSystem.mono} !important;\n`;
  cssContent += '}\n\n';

  // Add utility classes
  cssContent += '/* Utility classes */\n';
  cssContent += '.pdf-heading-font {\n';
  cssContent += `  font-family: var(--pdf-heading-font);\n`;
  cssContent += '}\n\n';

  cssContent += '.pdf-body-font {\n';
  cssContent += `  font-family: var(--pdf-body-font);\n`;
  cssContent += '}\n\n';

  cssContent += '.pdf-mono-font {\n';
  cssContent += `  font-family: var(--pdf-mono-font);\n`;
  cssContent += '}\n\n';

  return cssContent;
}

module.exports = {
  extractEnhancedFonts,
  generateFontCss
};
