/**
 * Enhanced PDF Extraction Module
 *
 * This module provides a unified interface for extracting enhanced information from PDF files.
 * It combines the enhanced color and font extraction modules to create a comprehensive style theme.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('../core/logger');
const config = require('../core/config');
const utils = require('../core/utils');
const { extractText, generateImprovedMarkdown } = require('./text');
const { extractEnhancedColors } = require('./enhanced-colors');
const { extractEnhancedFonts } = require('./enhanced-fonts');
const { OpenAI } = require('openai');

// Initialize OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const logger = createLogger('enhanced-extractor');

/**
 * Extract enhanced information from a PDF file
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extraction results
 */
async function extractEnhanced(pdfPath, options = {}) {
  logger.info(`Starting enhanced extraction for ${pdfPath}`);
  
  try {
    // Create output directory
    const outputDir = options.outputDir || path.join(path.dirname(pdfPath), 'extracted');
    utils.ensureDir(outputDir);
    
    // Backup the original PDF if requested
    if (options.backup !== false && config.build.backupOriginalPdf) {
      const backupDir = path.join(process.cwd(), config.paths.backup);
      utils.backupFile(pdfPath, backupDir);
    }
    
    // Extract text
    logger.info('Extracting text...');
    const textResult = await extractText(pdfPath, { outputDir });
    
    // Extract enhanced colors
    logger.info('Extracting enhanced colors...');
    const colorResult = await extractEnhancedColors(pdfPath, { outputDir });
    
    // Extract enhanced fonts
    logger.info('Extracting enhanced fonts...');
    const fontResult = await extractEnhancedFonts(pdfPath, { outputDir });
    
    // Generate improved markdown if text was extracted successfully
    let markdownResult = null;
    if (textResult.success && (options.generateMarkdown !== false && config.build.generateImprovedMarkdown)) {
      logger.info('Generating improved markdown...');
      markdownResult = await generateImprovedMarkdown(textResult.outputPath, { outputDir });
    }
    
    // Generate a unified style theme
    logger.info('Generating unified style theme...');
    const styleTheme = await generateUnifiedStyleTheme(colorResult, fontResult, outputDir);
    
    // Generate documentation
    if (options.generateDocs !== false) {
      logger.info('Generating extraction documentation...');
      await generateExtractionDocs(pdfPath, {
        text: textResult,
        colors: colorResult,
        fonts: fontResult,
        markdown: markdownResult,
        styleTheme
      }, outputDir);
    }
    
    // Summarize the results
    const results = {
      success: textResult.success || colorResult.success || fontResult.success,
      text: textResult,
      colors: colorResult,
      fonts: fontResult,
      markdown: markdownResult,
      styleTheme,
      outputDir
    };
    
    // Log the results
    if (results.success) {
      logger.success(`Enhanced PDF extraction completed successfully. Files saved to ${outputDir}`);
    } else {
      logger.warning('Enhanced PDF extraction completed with some errors.');
    }
    
    return results;
  } catch (error) {
    logger.error(`Error extracting PDF: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a unified style theme from color and font extraction results
 *
 * @param {Object} colorResult - Color extraction results
 * @param {Object} fontResult - Font extraction results
 * @param {string} outputDir - Output directory
 * @returns {Promise<Object>} - Unified style theme
 */
async function generateUnifiedStyleTheme(colorResult, fontResult, outputDir) {
  try {
    logger.info('Generating unified style theme...');
    
    // Get color and font data
    const colorTheme = colorResult.success ? colorResult.colors : null;
    const fontSystem = fontResult.success ? fontResult.fontSystem : null;
    
    // If OpenAI is available, use it to generate a unified theme
    if (openai && colorTheme && fontSystem) {
      try {
        logger.info('Generating unified style theme with OpenAI...');
        
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a design system expert. Create a unified style theme from the provided color and font information."
            },
            {
              role: "user",
              content: `Create a unified style theme from these extracted colors and fonts:
              
              Colors:
              ${JSON.stringify(colorTheme, null, 2)}
              
              Fonts:
              ${JSON.stringify(fontSystem, null, 2)}
              
              Return a JSON object with the following structure:
              {
                "name": "PDF-Extracted Theme",
                "version": "1.0.0",
                "description": "A unified style theme extracted from PDF",
                "colors": {
                  // Include all color properties from colorTheme
                },
                "typography": {
                  // Include all font properties from fontSystem
                },
                "spacing": {
                  "unit": "rem",
                  "scale": [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8]
                },
                "breakpoints": {
                  "sm": "640px",
                  "md": "768px",
                  "lg": "1024px",
                  "xl": "1280px"
                },
                "components": {
                  "button": {
                    "borderRadius": "0.25rem",
                    "fontFamily": "var(--pdf-button-font)",
                    "backgroundColor": "var(--pdf-primary-color)",
                    "textColor": "var(--pdf-background-color)"
                  },
                  "card": {
                    "borderRadius": "0.5rem",
                    "backgroundColor": "var(--pdf-background-color)",
                    "borderColor": "var(--pdf-border-color)"
                  },
                  "input": {
                    "borderRadius": "0.25rem",
                    "borderColor": "var(--pdf-border-color)",
                    "backgroundColor": "var(--pdf-background-color)"
                  }
                }
              }`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        });
        
        logger.success('Successfully generated unified style theme with OpenAI');
        
        // Parse the response
        const styleTheme = JSON.parse(response.choices[0].message.content);
        
        // Save the unified style theme
        const themePath = path.join(outputDir, 'unified_style_theme.json');
        utils.saveJson(themePath, styleTheme);
        
        // Generate CSS variables
        const cssContent = generateThemeCss(styleTheme);
        const cssPath = path.join(outputDir, 'unified_theme.css');
        utils.saveText(cssPath, cssContent);
        
        logger.success(`Unified style theme saved to ${themePath}`);
        logger.success(`Unified theme CSS saved to ${cssPath}`);
        
        return {
          success: true,
          theme: styleTheme,
          themePath,
          cssPath
        };
      } catch (error) {
        logger.error(`Error generating unified style theme with OpenAI: ${error.message}`);
        // Fall back to manual generation
      }
    }
    
    // Manual generation if OpenAI is not available or fails
    return generateManualStyleTheme(colorTheme, fontSystem, outputDir);
  } catch (error) {
    logger.error(`Error generating unified style theme: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a unified style theme manually
 *
 * @param {Object} colorTheme - Color theme
 * @param {Object} fontSystem - Font system
 * @param {string} outputDir - Output directory
 * @returns {Object} - Unified style theme
 */
function generateManualStyleTheme(colorTheme, fontSystem, outputDir) {
  // Default theme
  const defaultTheme = {
    name: "PDF-Extracted Theme",
    version: "1.0.0",
    description: "A unified style theme extracted from PDF",
    colors: colorTheme || {
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
      info: '#17a2b8'
    },
    typography: fontSystem || {
      heading: 'Arial, Helvetica, sans-serif',
      body: 'Georgia, "Times New Roman", serif',
      mono: '"Courier New", monospace',
      title: 'Arial, Helvetica, sans-serif',
      subtitle: 'Georgia, "Times New Roman", serif',
      button: 'Arial, Helvetica, sans-serif',
      nav: 'Arial, Helvetica, sans-serif',
      code: '"Courier New", monospace'
    },
    spacing: {
      unit: "rem",
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8]
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    },
    components: {
      button: {
        borderRadius: "0.25rem",
        fontFamily: "var(--pdf-button-font)",
        backgroundColor: "var(--pdf-primary-color)",
        textColor: "var(--pdf-background-color)"
      },
      card: {
        borderRadius: "0.5rem",
        backgroundColor: "var(--pdf-background-color)",
        borderColor: "var(--pdf-border-color)"
      },
      input: {
        borderRadius: "0.25rem",
        borderColor: "var(--pdf-border-color)",
        backgroundColor: "var(--pdf-background-color)"
      }
    }
  };
  
  // Save the unified style theme
  const themePath = path.join(outputDir, 'unified_style_theme.json');
  utils.saveJson(themePath, defaultTheme);
  
  // Generate CSS variables
  const cssContent = generateThemeCss(defaultTheme);
  const cssPath = path.join(outputDir, 'unified_theme.css');
  utils.saveText(cssPath, cssContent);
  
  logger.success(`Unified style theme saved to ${themePath}`);
  logger.success(`Unified theme CSS saved to ${cssPath}`);
  
  return {
    success: true,
    theme: defaultTheme,
    themePath,
    cssPath
  };
}

/**
 * Generate CSS variables from a style theme
 *
 * @param {Object} theme - Style theme
 * @returns {string} - CSS content
 */
function generateThemeCss(theme) {
  let cssContent = '/* Unified Theme CSS - Generated from PDF extraction */\n\n';
  cssContent += ':root {\n';
  
  // Add color variables
  cssContent += '  /* Color variables */\n';
  for (const [key, value] of Object.entries(theme.colors)) {
    if (typeof value === 'string') {
      cssContent += `  --theme-color-${key}: ${value};\n`;
    }
  }
  cssContent += '\n';
  
  // Add typography variables
  cssContent += '  /* Typography variables */\n';
  for (const [key, value] of Object.entries(theme.typography)) {
    if (typeof value === 'string') {
      cssContent += `  --theme-font-${key}: ${value};\n`;
    }
  }
  cssContent += '\n';
  
  // Add spacing variables
  cssContent += '  /* Spacing variables */\n';
  theme.spacing.scale.forEach((value, index) => {
    cssContent += `  --theme-spacing-${index}: ${value}${theme.spacing.unit};\n`;
  });
  cssContent += '\n';
  
  // Add breakpoint variables
  cssContent += '  /* Breakpoint variables */\n';
  for (const [key, value] of Object.entries(theme.breakpoints)) {
    cssContent += `  --theme-breakpoint-${key}: ${value};\n`;
  }
  cssContent += '\n';
  
  // Add component variables
  cssContent += '  /* Component variables */\n';
  for (const [component, props] of Object.entries(theme.components)) {
    for (const [prop, value] of Object.entries(props)) {
      cssContent += `  --theme-component-${component}-${prop}: ${value};\n`;
    }
  }
  
  cssContent += '}\n\n';
  
  // Add utility classes
  cssContent += '/* Utility classes */\n';
  
  // Typography classes
  cssContent += '.theme-heading {\n';
  cssContent += '  font-family: var(--theme-font-heading);\n';
  cssContent += '}\n\n';
  
  cssContent += '.theme-body {\n';
  cssContent += '  font-family: var(--theme-font-body);\n';
  cssContent += '}\n\n';
  
  // Button class
  cssContent += '.theme-button {\n';
  cssContent += '  font-family: var(--theme-component-button-fontFamily);\n';
  cssContent += '  background-color: var(--theme-component-button-backgroundColor);\n';
  cssContent += '  color: var(--theme-component-button-textColor);\n';
  cssContent += '  border-radius: var(--theme-component-button-borderRadius);\n';
  cssContent += '}\n\n';
  
  // Card class
  cssContent += '.theme-card {\n';
  cssContent += '  background-color: var(--theme-component-card-backgroundColor);\n';
  cssContent += '  border-color: var(--theme-component-card-borderColor);\n';
  cssContent += '  border-radius: var(--theme-component-card-borderRadius);\n';
  cssContent += '}\n\n';
  
  return cssContent;
}

/**
 * Generate documentation for the extraction process
 *
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} results - Extraction results
 * @param {string} outputDir - Output directory
 * @returns {Promise<Object>} - Documentation results
 */
async function generateExtractionDocs(pdfPath, results, outputDir) {
  try {
    logger.info('Generating extraction documentation...');
    
    // Create a markdown document
    let markdown = `# PDF Extraction Documentation\n\n`;
    markdown += `## Source PDF\n\n`;
    markdown += `- **File**: \`${path.basename(pdfPath)}\`\n`;
    markdown += `- **Path**: \`${pdfPath}\`\n`;
    markdown += `- **Extraction Date**: ${new Date().toISOString()}\n\n`;
    
    // Add text extraction results
    markdown += `## Text Extraction\n\n`;
    if (results.text.success) {
      markdown += `- **Status**: ✅ Success\n`;
      markdown += `- **Output**: \`${path.basename(results.text.outputPath)}\`\n`;
    } else {
      markdown += `- **Status**: ❌ Failed\n`;
      if (results.text.error) {
        markdown += `- **Error**: ${results.text.error}\n`;
      }
    }
    markdown += '\n';
    
    // Add color extraction results
    markdown += `## Color Extraction\n\n`;
    if (results.colors.success) {
      markdown += `- **Status**: ✅ Success\n`;
      markdown += `- **Output**: \`${path.basename(results.colors.outputPath)}\`\n`;
      
      // Add color swatches
      markdown += `\n### Color Palette\n\n`;
      markdown += `| Color | Hex | Role |\n`;
      markdown += `| --- | --- | --- |\n`;
      
      const colorTheme = results.colors.colors;
      for (const [key, value] of Object.entries(colorTheme)) {
        if (typeof value === 'string' && value.startsWith('#')) {
          markdown += `| <div style="width: 20px; height: 20px; background-color: ${value};"></div> | \`${value}\` | ${key} |\n`;
        }
      }
    } else {
      markdown += `- **Status**: ❌ Failed\n`;
      if (results.colors.error) {
        markdown += `- **Error**: ${results.colors.error}\n`;
      }
    }
    markdown += '\n';
    
    // Add font extraction results
    markdown += `## Font Extraction\n\n`;
    if (results.fonts.success) {
      markdown += `- **Status**: ✅ Success\n`;
      markdown += `- **Output**: \`${path.basename(results.fonts.fontTheoryPath)}\`\n`;
      markdown += `- **CSS**: \`${path.basename(results.fonts.cssPath)}\`\n`;
      
      // Add font samples
      markdown += `\n### Font System\n\n`;
      markdown += `| Role | Font Family |\n`;
      markdown += `| --- | --- |\n`;
      
      const fontSystem = results.fonts.fontSystem;
      for (const [key, value] of Object.entries(fontSystem)) {
        if (typeof value === 'string') {
          markdown += `| ${key} | \`${value}\` |\n`;
        }
      }
    } else {
      markdown += `- **Status**: ❌ Failed\n`;
      if (results.fonts.error) {
        markdown += `- **Error**: ${results.fonts.error}\n`;
      }
    }
    markdown += '\n';
    
    // Add unified style theme
    markdown += `## Unified Style Theme\n\n`;
    if (results.styleTheme.success) {
      markdown += `- **Status**: ✅ Success\n`;
      markdown += `- **Output**: \`${path.basename(results.styleTheme.themePath)}\`\n`;
      markdown += `- **CSS**: \`${path.basename(results.styleTheme.cssPath)}\`\n`;
      
      // Add theme description
      markdown += `\n### Theme Description\n\n`;
      markdown += `${results.styleTheme.theme.description}\n\n`;
      
      // Add component examples
      markdown += `### Component Styles\n\n`;
      markdown += `#### Button\n\n`;
      markdown += `\`\`\`css\n`;
      markdown += `.theme-button {\n`;
      markdown += `  font-family: ${results.styleTheme.theme.components.button.fontFamily};\n`;
      markdown += `  background-color: ${results.styleTheme.theme.components.button.backgroundColor};\n`;
      markdown += `  color: ${results.styleTheme.theme.components.button.textColor};\n`;
      markdown += `  border-radius: ${results.styleTheme.theme.components.button.borderRadius};\n`;
      markdown += `}\n`;
      markdown += `\`\`\`\n\n`;
    } else {
      markdown += `- **Status**: ❌ Failed\n`;
      if (results.styleTheme.error) {
        markdown += `- **Error**: ${results.styleTheme.error}\n`;
      }
    }
    
    // Save the documentation
    const docsPath = path.join(outputDir, 'extraction_documentation.md');
    utils.saveText(docsPath, markdown);
    
    logger.success(`Extraction documentation saved to ${docsPath}`);
    
    return {
      success: true,
      docsPath
    };
  } catch (error) {
    logger.error(`Error generating extraction documentation: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  extractEnhanced,
  generateUnifiedStyleTheme,
  generateThemeCss,
  generateExtractionDocs
};
