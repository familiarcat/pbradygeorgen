const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

async function extractFontsFromPDF(pdfPath) {
  try {
    console.log(`Extracting fonts from: ${pdfPath}`);

    // Load the PDF document
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    console.log(`PDF loaded successfully. Number of pages: ${pdfDocument.numPages}`);

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

            // Determine font characteristics based on name if not explicitly set
            let isMonospace = fontObj.isMonospace || false;
            let isSerifFont = fontObj.isSerif || false;

            // Check font name for clues about its style
            const fontNameLower = fontName.toLowerCase();
            if (!isMonospace && (
                fontNameLower.includes('mono') ||
                fontNameLower.includes('courier') ||
                fontNameLower.includes('console') ||
                fontNameLower.includes('typewriter')
            )) {
              isMonospace = true;
            }

            if (!isSerifFont && (
                fontNameLower.includes('serif') && !fontNameLower.includes('sans') ||
                fontNameLower.includes('roman') ||
                fontNameLower.includes('times') ||
                fontNameLower.includes('georgia')
            )) {
              isSerifFont = true;
            }

            if (!fontInfo[fontName]) {
              fontInfo[fontName] = {
                name: fontName,
                type: fontType,
                isMonospace,
                isSerifFont,
                pages: new Set()
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

    // Save the font information to a JSON file
    const outputPath = path.join(path.dirname(pdfPath), 'extracted', 'font_info.json');

    // Create the directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(fontInfo, null, 2));
    console.log(`Font information saved to: ${outputPath}`);

    // Generate CSS with font-family declarations
    let cssContent = '/* Font families extracted from PDF */\n\n';
    cssContent += ':root {\n';

    // Add variables for each font
    const fontFamilies = Object.keys(fontInfo);
    fontFamilies.forEach((fontName, index) => {
      const font = fontInfo[fontName];
      const cssVarName = `--pdf-font-${index + 1}`;
      const fallback = font.isMonospace ? 'monospace' : (font.isSerifFont ? 'serif' : 'sans-serif');
      cssContent += `  ${cssVarName}: '${fontName}', ${fallback};\n`;
    });

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

    // Add philosophical fonts if none were found
    if (fontFamilies.length === 0) {
      console.log('No fonts found in PDF, applying philosophical font selection');

      // Generate a seed based on the current date to ensure uniqueness
      const seed = new Date().getTime();
      const random = (min, max) => Math.floor(seed % 10000 / 10000 * (max - min) + min);

      // Philosophical font selection
      // Hesse: Clarity and structure - represented by sans-serif fonts
      // Salinger: Authenticity and directness - represented by serif fonts
      // Derrida: Deconstruction and analysis - represented by monospace fonts

      // Select from philosophical font sets
      const hesseFonts = [
        '"Helvetica Neue"', '"Avenir"', '"Futura"', '"Gill Sans"', '"Open Sans"', '"Roboto"'
      ];

      const salingerFonts = [
        '"Georgia"', '"Garamond"', '"Baskerville"', '"Palatino"', '"Times New Roman"', '"Merriweather"'
      ];

      const derridaFonts = [
        '"Courier New"', '"Roboto Mono"', '"Source Code Pro"', '"Fira Mono"', '"IBM Plex Mono"'
      ];

      // Select a font from each philosophical set
      const hesseFont = hesseFonts[random(0, hesseFonts.length)];
      const salingerFont = salingerFonts[random(0, salingerFonts.length)];
      const derridaFont = derridaFonts[random(0, derridaFonts.length)];

      console.log(`Selected philosophical fonts:`);
      console.log(`- Hesse (sans-serif): ${hesseFont}`);
      console.log(`- Salinger (serif): ${salingerFont}`);
      console.log(`- Derrida (monospace): ${derridaFont}`);

      // Add philosophical fonts to CSS
      cssContent += '  /* Philosophical fonts based on Hesse, Salinger, and Derrida */\n';
      cssContent += `  --pdf-font-1: ${hesseFont}, sans-serif; /* Hesse: Clarity and structure */\n`;
      cssContent += `  --pdf-font-2: ${salingerFont}, serif; /* Salinger: Authenticity and directness */\n`;
      cssContent += `  --pdf-font-3: ${derridaFont}, monospace; /* Derrida: Deconstruction and analysis */\n`;

      // Add philosophical font classes
      cssContent += '}\n\n';
      cssContent += '/* Philosophical font classes */\n';
      cssContent += '.pdf-hesse-font {\n';
      cssContent += '  font-family: var(--pdf-font-1);\n';
      cssContent += '}\n\n';
      cssContent += '.pdf-salinger-font {\n';
      cssContent += '  font-family: var(--pdf-font-2);\n';
      cssContent += '}\n\n';
      cssContent += '.pdf-derrida-font {\n';
      cssContent += '  font-family: var(--pdf-font-3);\n';
      cssContent += '}\n';

      // Create font info JSON
      const fontInfo = {
        hesseFont: {
          name: hesseFont.replace(/"/g, ''),
          isSerifFont: false,
          isMonospace: false,
          type: "sans-serif",
          philosophy: "Hesse: Clarity and structure"
        },
        salingerFont: {
          name: salingerFont.replace(/"/g, ''),
          isSerifFont: true,
          isMonospace: false,
          type: "serif",
          philosophy: "Salinger: Authenticity and directness"
        },
        derridaFont: {
          name: derridaFont.replace(/"/g, ''),
          isSerifFont: false,
          isMonospace: true,
          type: "monospace",
          philosophy: "Derrida: Deconstruction and analysis"
        }
      };

      // Save the font info to a JSON file
      const fontInfoPath = path.join(path.dirname(pdfPath), 'extracted', 'font_info.json');
      fs.writeFileSync(fontInfoPath, JSON.stringify(fontInfo, null, 2));
      console.log(`Font information saved to: ${fontInfoPath}`);
    } else {
      cssContent += '}\n';
    }

    // Save the CSS file
    const cssOutputPath = path.join(path.dirname(pdfPath), 'extracted', 'pdf_fonts.css');
    fs.writeFileSync(cssOutputPath, cssContent);
    console.log(`CSS with font variables saved to: ${cssOutputPath}`);

    return fontInfo;
  } catch (error) {
    console.error('Error extracting fonts:', error);
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

// Extract fonts from the PDF
extractFontsFromPDF(pdfPath)
  .then(fontInfo => {
    console.log('Font extraction completed successfully.');
    console.log('Fonts found:');
    for (const fontName in fontInfo) {
      const font = fontInfo[fontName];
      console.log(`- ${fontName} (${font.type})`);
      console.log(`  Monospace: ${font.isMonospace}, Serif: ${font.isSerifFont}`);
      console.log(`  Used on pages: ${font.pages.join(', ')}`);
    }
  })
  .catch(error => {
    console.error('Font extraction failed:', error);
    process.exit(1);
  });
