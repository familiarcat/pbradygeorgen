/**
 * Enhanced PDF Style Extractor
 *
 * This script serves as a bridge to call the Python-based PDF analyzer
 * which uses PyMuPDF to extract comprehensive style information from PDFs.
 *
 * It extracts fonts, colors, and style hierarchies and saves them in a format
 * that can be used by the AlexAI application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('./core/logger');

// Create a logger
const logger = createLogger('enhanced-pdf-styles');

/**
 * Extract enhanced styles from a PDF file
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Options for extraction
 * @returns {Promise<Object>} - Extraction results
 */
async function extractEnhancedPdfStyles(pdfPath, options = {}) {
  try {
    logger.info(`Extracting enhanced styles from PDF: ${pdfPath}`);

    // Ensure the output directory exists
    const outputDir = options.outputDir || path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if Python and PyMuPDF are installed
    try {
      execSync('python3 -c "import fitz"', { stdio: 'ignore' });
      logger.info('PyMuPDF is installed and ready');
    } catch (error) {
      logger.warning('PyMuPDF is not installed. Attempting to install...');
      try {
        execSync('pip install pymupdf', { stdio: 'inherit' });
        logger.success('PyMuPDF installed successfully');
      } catch (installError) {
        logger.error('Failed to install PyMuPDF. Please install it manually: pip install pymupdf');
        throw new Error('PyMuPDF installation failed');
      }
    }

    // Run the Python script
    const pythonScript = path.join(__dirname, 'enhanced-pdf-analyzer.py');
    logger.info(`Running Python script: ${pythonScript}`);

    const command = `python3 "${pythonScript}" "${pdfPath}" "${outputDir}"`;
    execSync(command, { stdio: 'inherit' });

    // Check if the output files were created
    const fontTheoryPath = path.join(outputDir, 'enhanced_font_theory.json');
    const colorTheoryPath = path.join(outputDir, 'enhanced_color_theory.json');
    const styleHierarchyPath = path.join(outputDir, 'enhanced_style_hierarchy.json');

    if (!fs.existsSync(fontTheoryPath) || !fs.existsSync(colorTheoryPath)) {
      throw new Error('Enhanced style extraction failed: output files not created');
    }

    // Read the extracted data
    const fontTheory = JSON.parse(fs.readFileSync(fontTheoryPath, 'utf8'));
    const colorTheory = JSON.parse(fs.readFileSync(colorTheoryPath, 'utf8'));
    const styleHierarchy = fs.existsSync(styleHierarchyPath)
      ? JSON.parse(fs.readFileSync(styleHierarchyPath, 'utf8'))
      : {};

    // Generate CSS variables for the extracted styles
    const cssContent = generateCssVariables(fontTheory, colorTheory);
    fs.writeFileSync(path.join(outputDir, 'enhanced_pdf_styles.css'), cssContent);

    logger.success('Enhanced style extraction completed successfully');

    return {
      success: true,
      fontTheory,
      colorTheory,
      styleHierarchy,
      outputDir
    };
  } catch (error) {
    logger.error(`Error extracting enhanced styles: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate CSS variables from the extracted font and color theories
 * @param {Object} fontTheory - Font theory data
 * @param {Object} colorTheory - Color theory data
 * @returns {string} - CSS content
 */
function generateCssVariables(fontTheory, colorTheory) {
  let css = '/* Enhanced PDF Styles - Generated CSS Variables */\n\n';
  css += ':root {\n';

  // Add color variables
  css += '  /* Color variables - Derrida principle of deconstructing traditional color roles */\n';
  css += `  --pdf-text-color: ${colorTheory.text} !important;\n`;
  css += `  --pdf-background-color: ${colorTheory.background} !important;\n`;
  css += `  --pdf-accent-color: ${colorTheory.accent} !important;\n`;
  css += `  --pdf-primary-color: ${colorTheory.primary} !important;\n`;
  css += `  --pdf-secondary-color: ${colorTheory.secondary} !important;\n`;
  css += `  --pdf-border-color: ${colorTheory.border} !important;\n`;
  css += `  --pdf-text-on-accent: ${colorTheory.textOnAccent || (colorTheory.accent === '#FFFFFF' ? '#000000' : '#FFFFFF')} !important;\n\n`;

  // Add direct variables for compatibility
  css += '  /* Direct variables for compatibility */\n';
  css += `  --text-color: ${colorTheory.text} !important;\n`;
  css += `  --background: ${colorTheory.background} !important;\n`;
  css += `  --accent: ${colorTheory.accent} !important;\n`;
  css += `  --primary: ${colorTheory.primary} !important;\n`;
  css += `  --secondary: ${colorTheory.secondary} !important;\n`;
  css += `  --border-color: ${colorTheory.border} !important;\n`;
  css += `  --text-on-accent: ${colorTheory.textOnAccent || (colorTheory.accent === '#FFFFFF' ? '#000000' : '#FFFFFF')} !important;\n\n`;

  // Add font variables
  css += '  /* Font variables */\n';
  css += `  --pdf-heading-font: ${fontTheory.heading}, sans-serif !important;\n`;
  css += `  --pdf-body-font: ${fontTheory.body}, serif !important;\n`;
  css += `  --pdf-mono-font: ${fontTheory.mono} !important;\n`;
  css += `  --pdf-button-font: ${fontTheory.button}, sans-serif !important;\n\n`;

  // Add direct font variables for compatibility
  css += '  /* Direct font variables for compatibility */\n';
  css += `  --font-heading: ${fontTheory.heading}, sans-serif !important;\n`;
  css += `  --font-body: ${fontTheory.body}, serif !important;\n`;
  css += `  --font-mono: ${fontTheory.mono} !important;\n`;
  css += `  --font-button: ${fontTheory.button}, sans-serif !important;\n`;

  css += '}\n\n';

  // Add utility classes
  css += '/* Utility classes */\n';
  css += '.pdf-heading-font { font-family: var(--pdf-heading-font); }\n';
  css += '.pdf-body-font { font-family: var(--pdf-body-font); }\n';
  css += '.pdf-mono-font { font-family: var(--pdf-mono-font); }\n';
  css += '.pdf-button-font { font-family: var(--pdf-button-font); }\n\n';

  css += '.pdf-text-color { color: var(--pdf-text-color); }\n';
  css += '.pdf-background-color { background-color: var(--pdf-background-color); }\n';
  css += '.pdf-accent-color { color: var(--pdf-accent-color); }\n';
  css += '.pdf-primary-color { color: var(--pdf-primary-color); }\n';
  css += '.pdf-secondary-color { color: var(--pdf-secondary-color); }\n';

  return css;
}

/**
 * Main function to run the script from the command line
 */
async function main() {
  try {
    // Get the PDF path from command line arguments
    const pdfPath = process.argv[2] || path.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
      logger.error(`Error: PDF file not found at ${pdfPath}`);
      process.exit(1);
    }

    // Extract enhanced styles
    const result = await extractEnhancedPdfStyles(pdfPath);

    if (result.success) {
      logger.success('Enhanced style extraction completed successfully');
    } else {
      logger.error(`Enhanced style extraction failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  extractEnhancedPdfStyles
};
