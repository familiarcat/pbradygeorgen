const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

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
  console.log('Analyzing font usage...');

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
  console.log('Font usage analysis results:');
  for (const fontName in fontInfo) {
    console.log(`- ${fontName}: ${fontInfo[fontName].usage}`);
  }
}

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

    // If no fonts were found, add default fallback fonts
    if (fontFamilies.length === 0) {
      console.log('No fonts found in PDF. Adding Benjamin Stein resume fonts to CSS.');
      cssContent += '  /* No fonts found in PDF, using Benjamin Stein resume fonts */\n';

      // Add PDF-prefixed variables with !important
      cssContent += '  /* PDF-prefixed variables */\n';
      cssContent += '  --pdf-heading-font: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-body-font: "Open Sans", "Helvetica Neue", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-mono-font: "Consolas", "Monaco", monospace !important;\n';
      cssContent += '  --pdf-title-font: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-subtitle-font: "Roboto Light", "Segoe UI Light", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-button-font: "Roboto Medium", "Segoe UI Semibold", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-nav-font: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --pdf-code-font: "Consolas", "Monaco", monospace !important;\n';

      // Add direct variables for compatibility with !important
      cssContent += '\n  /* Direct variables for compatibility */\n';
      cssContent += '  --font-heading: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --font-body: "Open Sans", "Helvetica Neue", Arial, sans-serif !important;\n';
      cssContent += '  --font-mono: "Consolas", "Monaco", monospace !important;\n';
      cssContent += '  --font-title: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --font-subtitle: "Roboto Light", "Segoe UI Light", Arial, sans-serif !important;\n';
      cssContent += '  --font-button: "Roboto Medium", "Segoe UI Semibold", Arial, sans-serif !important;\n';
      cssContent += '  --font-nav: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --font-code: "Consolas", "Monaco", monospace !important;\n';

      // Add dynamic variables for compatibility with !important
      cssContent += '\n  /* Dynamic variables for compatibility */\n';
      cssContent += '  --dynamic-heading-font: "Roboto", "Segoe UI", Arial, sans-serif !important;\n';
      cssContent += '  --dynamic-primary-font: "Open Sans", "Helvetica Neue", Arial, sans-serif !important;\n';
      cssContent += '  --dynamic-secondary-font: "Open Sans", "Helvetica Neue", Arial, sans-serif !important;\n';
      cssContent += '  --dynamic-mono-font: "Consolas", "Monaco", monospace !important;\n';
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
    const cssOutputPath = path.join(path.dirname(pdfPath), 'extracted', 'pdf_fonts.css');
    fs.writeFileSync(cssOutputPath, cssContent);
    console.log(`CSS with font variables saved to: ${cssOutputPath}`);

    // Function to analyze fonts using OpenAI
    async function analyzeFontsWithOpenAI(pdfPath, fontFamilies, fontInfo) {
      try {
        // Check if OpenAI API key is available
        if (!process.env.OPENAI_API_KEY) {
          console.log('OpenAI API key not found. Skipping font analysis with OpenAI.');
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

        // Load the font theory prompt
        const fontTheoryPrompt = require('./openai-prompts/font-theory-prompt.js');

        // Create a summary of font information
        const fontSummary = fontFamilies.map(name => {
          const font = fontInfo[name];
          return `${name} (${font.isSerifFont ? 'Serif' : font.isMonospace ? 'Monospace' : 'Sans-serif'})`;
        }).join(', ');

        // Create the prompt with PDF information
        const prompt = `
${fontTheoryPrompt}

PDF Name: ${pdfName}
Fonts found in PDF: ${fontSummary || 'No specific fonts detected'}
PDF Purpose: This appears to be a ${pdfName.toLowerCase().includes('resume') ? 'resume/CV' : 'document'}.

Please analyze these fonts and provide a cohesive typography system following the guidelines above.
`;

        console.log('Analyzing fonts with OpenAI...');

        // Call OpenAI API
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a typography expert.' },
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
            const fontTheory = JSON.parse(jsonMatch[0]);
            console.log('Successfully analyzed fonts with OpenAI');
            return fontTheory;
          } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            return null;
          }
        } else {
          console.error('No JSON found in OpenAI response');
          return null;
        }
      } catch (error) {
        console.error('Error analyzing fonts with OpenAI:', error);
        return null;
      }
    }

    // Create a font theory object for the GlobalStylesProvider with default fallbacks
    let fontTheory = {
      heading: 'Arial, sans-serif',
      body: 'Georgia, serif',
      mono: 'Courier New, monospace',
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

    // Try to analyze fonts with OpenAI first
    try {
      const openAIFontTheory = await analyzeFontsWithOpenAI(pdfPath, fontFamilies, fontInfo);
      if (openAIFontTheory) {
        console.log('Using OpenAI font analysis');
        fontTheory = { ...openAIFontTheory, allFonts: fontFamilies };
      } else {
        console.log('Falling back to local font theory generation');
      }
    } catch (error) {
      console.log('Error analyzing fonts with OpenAI:', error.message);
      console.log('Falling back to local font theory generation');
    }

    // If OpenAI analysis failed or we need to fill in missing values, use local font theory
    if (!fontTheory.heading || !fontTheory.body) {
      console.log('Using local font theory to generate typography system');

      // Assign fonts based on their characteristics
      // Reuse the previously defined serifFonts and monospaceFonts variables
      const sansSerifFonts = fontFamilies.filter(name => !fontInfo[name].isSerifFont && !fontInfo[name].isMonospace);

      // If no fonts were found in the PDF, create a default font set based on the PDF name
      if (fontFamilies.length === 0) {
        console.log('No fonts found in PDF. Using default font set.');

        // Get the PDF filename without extension
        const pdfName = path.basename(pdfPath, path.extname(pdfPath)).toLowerCase();

        // Use the PDF name to determine a font style
        const isModern = /modern|tech|digital|web|app|software/.test(pdfName);
        const isClassic = /classic|traditional|elegant|formal|resume|cv/.test(pdfName);
        const isCreative = /creative|design|art|portfolio|graphic/.test(pdfName);

        // Set default fonts based on the PDF style
        if (isModern) {
          fontTheory.heading = 'Roboto, "Segoe UI", Arial, sans-serif';
          fontTheory.body = 'Open Sans, "Helvetica Neue", Arial, sans-serif';
          fontTheory.mono = 'Consolas, Monaco, "Courier New", monospace';
          fontTheory.title = 'Roboto, "Segoe UI", Arial, sans-serif';
          fontTheory.subtitle = 'Roboto Light, "Segoe UI Light", Arial, sans-serif';
          fontTheory.button = 'Roboto Medium, "Segoe UI Semibold", Arial, sans-serif';
          fontTheory.nav = 'Roboto, "Segoe UI", Arial, sans-serif';
          fontTheory.code = 'Consolas, Monaco, "Courier New", monospace';
        } else if (isClassic) {
          fontTheory.heading = 'Georgia, "Times New Roman", serif';
          fontTheory.body = 'Garamond, "Times New Roman", serif';
          fontTheory.mono = '"Courier New", Courier, monospace';
          fontTheory.title = 'Georgia, "Times New Roman", serif';
          fontTheory.subtitle = 'Georgia, "Times New Roman", serif';
          fontTheory.button = 'Arial, Helvetica, sans-serif';
          fontTheory.nav = 'Arial, Helvetica, sans-serif';
          fontTheory.code = '"Courier New", Courier, monospace';
        } else if (isCreative) {
          fontTheory.heading = 'Futura, "Century Gothic", Avenir, sans-serif';
          fontTheory.body = 'Avenir, "Century Gothic", Calibri, sans-serif';
          fontTheory.mono = 'Menlo, Consolas, monospace';
          fontTheory.title = 'Futura, "Century Gothic", Avenir, sans-serif';
          fontTheory.subtitle = 'Avenir Light, "Century Gothic", Calibri, sans-serif';
          fontTheory.button = 'Futura Medium, "Century Gothic", Avenir, sans-serif';
          fontTheory.nav = 'Avenir, "Century Gothic", Calibri, sans-serif';
          fontTheory.code = 'Menlo, Consolas, monospace';
        } else {
          // Default professional style
          fontTheory.heading = 'Arial, Helvetica, sans-serif';
          fontTheory.body = 'Helvetica, Arial, sans-serif';
          fontTheory.mono = '"Courier New", monospace';
          fontTheory.title = 'Arial, Helvetica, sans-serif';
          fontTheory.subtitle = 'Arial, Helvetica, sans-serif';
          fontTheory.button = 'Arial, Helvetica, sans-serif';
          fontTheory.nav = 'Arial, Helvetica, sans-serif';
          fontTheory.code = '"Courier New", monospace';
        }
      } else {
        // Only fill in missing values using the font usage information

        // Find fonts by usage
        const headingFonts = Object.keys(fontInfo).filter(name => fontInfo[name].usage === 'heading');
        const bodyFonts = Object.keys(fontInfo).filter(name => fontInfo[name].usage === 'body');
        const emphasisFonts = Object.keys(fontInfo).filter(name => fontInfo[name].usage === 'emphasis');

        console.log(`Found ${headingFonts.length} heading fonts, ${bodyFonts.length} body fonts, ${emphasisFonts.length} emphasis fonts`);

        // Assign heading font (prefer fonts identified as headings)
        if (!fontTheory.heading) {
          if (headingFonts.length > 0) {
            fontTheory.heading = `'${fontInfo[headingFonts[0]].family}', ${fontInfo[headingFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${headingFonts[0]} for headings`);
          } else if (sansSerifFonts.length > 0) {
            fontTheory.heading = `'${fontInfo[sansSerifFonts[0]].family}', sans-serif`;
            console.log(`Using ${sansSerifFonts[0]} for headings (sans-serif)`);
          } else if (serifFonts.length > 0) {
            fontTheory.heading = `'${fontInfo[serifFonts[0]].family}', serif`;
            console.log(`Using ${serifFonts[0]} for headings (serif)`);
          } else if (fontFamilies.length > 0) {
            fontTheory.heading = `'${fontInfo[fontFamilies[0]].family}', sans-serif`;
            console.log(`Using ${fontFamilies[0]} for headings (default)`);
          } else {
            fontTheory.heading = 'Arial, sans-serif';
            console.log('Using Arial for headings (fallback)');
          }
        }

        // Assign body font (prefer fonts identified as body)
        if (!fontTheory.body) {
          if (bodyFonts.length > 0) {
            fontTheory.body = `'${fontInfo[bodyFonts[0]].family}', ${fontInfo[bodyFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${bodyFonts[0]} for body text`);
          } else if (serifFonts.length > 0) {
            fontTheory.body = `'${fontInfo[serifFonts[0]].family}', serif`;
            console.log(`Using ${serifFonts[0]} for body text (serif)`);
          } else if (sansSerifFonts.length > 0) {
            fontTheory.body = `'${fontInfo[sansSerifFonts[0]].family}', sans-serif`;
            console.log(`Using ${sansSerifFonts[0]} for body text (sans-serif)`);
          } else if (fontFamilies.length > 0) {
            fontTheory.body = `'${fontInfo[fontFamilies[0]].family}', sans-serif`;
            console.log(`Using ${fontFamilies[0]} for body text (default)`);
          } else {
            fontTheory.body = 'Helvetica, Arial, sans-serif';
            console.log('Using Helvetica for body text (fallback)');
          }
        }

        // Assign monospace font
        if (!fontTheory.mono) {
          if (monospaceFonts.length > 0) {
            fontTheory.mono = `'${fontInfo[monospaceFonts[0]].family}', monospace`;
            console.log(`Using ${monospaceFonts[0]} for monospace`);
          } else {
            fontTheory.mono = 'Consolas, Monaco, "Courier New", monospace';
            console.log('Using Consolas for monospace (fallback)');
          }
        }

        // Assign title font (prefer heading fonts with bold weight)
        if (!fontTheory.title) {
          const boldHeadingFonts = headingFonts.filter(name => fontInfo[name].weight === 'bold');
          if (boldHeadingFonts.length > 0) {
            fontTheory.title = `'${fontInfo[boldHeadingFonts[0]].family}', ${fontInfo[boldHeadingFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${boldHeadingFonts[0]} for titles`);
          } else if (headingFonts.length > 0) {
            fontTheory.title = `'${fontInfo[headingFonts[0]].family}', ${fontInfo[headingFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${headingFonts[0]} for titles`);
          } else {
            fontTheory.title = fontTheory.heading;
            console.log('Using heading font for titles');
          }
        }

        // Assign subtitle font (prefer heading fonts with light weight)
        if (!fontTheory.subtitle) {
          const lightHeadingFonts = headingFonts.filter(name => fontInfo[name].weight === 'light');
          if (lightHeadingFonts.length > 0) {
            fontTheory.subtitle = `'${fontInfo[lightHeadingFonts[0]].family}', ${fontInfo[lightHeadingFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${lightHeadingFonts[0]} for subtitles`);
          } else if (headingFonts.length > 0) {
            fontTheory.subtitle = `'${fontInfo[headingFonts[0]].family}', ${fontInfo[headingFonts[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${headingFonts[0]} for subtitles`);
          } else {
            fontTheory.subtitle = fontTheory.heading;
            console.log('Using heading font for subtitles');
          }
        }

        // Assign button font (prefer sans-serif with medium or bold weight)
        if (!fontTheory.button) {
          const buttonFonts = sansSerifFonts.filter(name =>
            fontInfo[name].weight === 'medium' || fontInfo[name].weight === 'semibold' || fontInfo[name].weight === 'bold'
          );
          if (buttonFonts.length > 0) {
            fontTheory.button = `'${fontInfo[buttonFonts[0]].family}', sans-serif`;
            console.log(`Using ${buttonFonts[0]} for buttons`);
          } else if (sansSerifFonts.length > 0) {
            fontTheory.button = `'${fontInfo[sansSerifFonts[0]].family}', sans-serif`;
            console.log(`Using ${sansSerifFonts[0]} for buttons`);
          } else {
            fontTheory.button = 'Arial, sans-serif';
            console.log('Using Arial for buttons (fallback)');
          }
        }

        // Assign navigation font (prefer sans-serif)
        if (!fontTheory.nav) {
          if (sansSerifFonts.length > 0) {
            fontTheory.nav = `'${fontInfo[sansSerifFonts[0]].family}', sans-serif`;
            console.log(`Using ${sansSerifFonts[0]} for navigation`);
          } else if (fontFamilies.length > 0) {
            fontTheory.nav = `'${fontInfo[fontFamilies[0]].family}', ${fontInfo[fontFamilies[0]].isSerifFont ? 'serif' : 'sans-serif'}`;
            console.log(`Using ${fontFamilies[0]} for navigation`);
          } else {
            fontTheory.nav = 'Arial, sans-serif';
            console.log('Using Arial for navigation (fallback)');
          }
        }

        // Assign code font (prefer monospace)
        if (!fontTheory.code) {
          if (monospaceFonts.length > 0) {
            fontTheory.code = `'${fontInfo[monospaceFonts[0]].family}', monospace`;
            console.log(`Using ${monospaceFonts[0]} for code`);
          } else {
            fontTheory.code = 'Consolas, Monaco, "Courier New", monospace';
            console.log('Using Consolas for code (fallback)');
          }
        }
      }
    }

    // Save the font theory to a JSON file
    const fontTheoryPath = path.join(path.dirname(pdfPath), 'extracted', 'font_theory.json');
    fs.writeFileSync(fontTheoryPath, JSON.stringify(fontTheory, null, 2));
    console.log(`Font theory saved to: ${fontTheoryPath}`);

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
  pdfPath = path.join(__dirname, '../public/pbradygeorgen_resume.pdf');
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
