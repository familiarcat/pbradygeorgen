/**
 * Generate Enhanced DOCX Template
 * 
 * This script generates an enhanced reference.docx template for pandoc
 * that applies PDF-extracted colors and fonts to ensure consistent styling.
 * 
 * It follows the Hesse philosophy of mathematical color theory and
 * the Müller-Brockmann philosophy of grid-based layouts and clear typography.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('./core/logger');

// Create a logger for this module
const logger = createLogger('docx-template');

/**
 * Generate an enhanced reference.docx template
 * 
 * @param {Object} options - Options for template generation
 * @returns {Promise<string>} - Path to the generated template
 */
async function generateEnhancedDocxTemplate(options = {}) {
  try {
    logger.info('Generating enhanced DOCX template');
    
    // Get paths
    const templateDir = path.join(process.cwd(), 'templates');
    const outputPath = path.join(templateDir, options.outputFile || 'reference.docx');
    const tempDir = path.join(process.cwd(), 'temp');
    const tempHtmlPath = path.join(tempDir, 'docx-template.html');
    
    // Ensure directories exist
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Load style data
    const styleData = loadStyleData(options);
    
    // Generate HTML with styles
    const html = generateStyledHtml(styleData);
    
    // Write HTML to temp file
    fs.writeFileSync(tempHtmlPath, html);
    
    // Use pandoc to convert HTML to DOCX
    logger.info(`Converting HTML to DOCX template: ${outputPath}`);
    execSync(`pandoc "${tempHtmlPath}" -o "${outputPath}" --standalone`);
    
    // Clean up temp files
    if (!options.keepTemp) {
      fs.unlinkSync(tempHtmlPath);
    }
    
    logger.success(`Enhanced DOCX template generated: ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error(`Error generating enhanced DOCX template: ${error.message}`);
    throw error;
  }
}

/**
 * Load style data from extracted files
 * 
 * @param {Object} options - Options for loading style data
 * @returns {Object} - Style data
 */
function loadStyleData(options = {}) {
  const extractedDir = path.join(process.cwd(), 'public', 'extracted');
  
  // Load unified style theme if available
  let unifiedStyle = {};
  const unifiedStylePath = path.join(extractedDir, 'unified_style_theme.json');
  if (fs.existsSync(unifiedStylePath)) {
    try {
      unifiedStyle = JSON.parse(fs.readFileSync(unifiedStylePath, 'utf8'));
      logger.info('Loaded unified style theme');
    } catch (error) {
      logger.warn(`Error loading unified style theme: ${error.message}`);
    }
  }
  
  // Load color theory if available
  let colorTheory = {};
  const colorTheoryPath = path.join(extractedDir, 'color_theory.json');
  if (fs.existsSync(colorTheoryPath)) {
    try {
      colorTheory = JSON.parse(fs.readFileSync(colorTheoryPath, 'utf8'));
      logger.info('Loaded color theory');
    } catch (error) {
      logger.warn(`Error loading color theory: ${error.message}`);
    }
  }
  
  // Load font theory if available
  let fontTheory = {};
  const fontTheoryPath = path.join(extractedDir, 'font_theory.json');
  if (fs.existsSync(fontTheoryPath)) {
    try {
      fontTheory = JSON.parse(fs.readFileSync(fontTheoryPath, 'utf8'));
      logger.info('Loaded font theory');
    } catch (error) {
      logger.warn(`Error loading font theory: ${error.message}`);
    }
  }
  
  // Combine style data with priority to unified style
  return {
    colors: unifiedStyle.colors || {
      primary: colorTheory.primary || '#000000',
      secondary: colorTheory.secondary || '#333333',
      accent: colorTheory.accent || '#3366CC',
      background: colorTheory.background || '#FFFFFF',
      text: colorTheory.text || '#000000',
      textSecondary: colorTheory.textSecondary || '#333333',
      border: colorTheory.border || '#CCCCCC'
    },
    typography: unifiedStyle.typography || {
      heading: fontTheory.heading || 'Arial, sans-serif',
      body: fontTheory.body || 'Georgia, serif',
      mono: fontTheory.mono || 'Courier New, monospace'
    },
    spacing: unifiedStyle.spacing || {
      unit: 'rem',
      scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8]
    }
  };
}

/**
 * Generate HTML with styles for pandoc conversion
 * 
 * @param {Object} styleData - Style data
 * @returns {string} - HTML content
 */
function generateStyledHtml(styleData) {
  const { colors, typography, spacing } = styleData;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>DOCX Template</title>
  <style>
    /* Base styles */
    body {
      font-family: ${typography.body};
      color: ${colors.text};
      background-color: ${colors.background};
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    
    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: ${typography.heading};
      color: ${colors.primary};
      margin-top: ${spacing.scale[4]}${spacing.unit};
      margin-bottom: ${spacing.scale[2]}${spacing.unit};
      line-height: 1.2;
    }
    
    h1 {
      font-size: 2.5rem;
      border-bottom: 2px solid ${colors.primary};
      padding-bottom: 0.5rem;
    }
    
    h2 {
      font-size: 2rem;
      border-bottom: 1px solid ${colors.secondary};
      padding-bottom: 0.3rem;
    }
    
    h3 {
      font-size: 1.5rem;
      color: ${colors.secondary};
    }
    
    h4 {
      font-size: 1.25rem;
      color: ${colors.secondary};
    }
    
    h5 {
      font-size: 1rem;
      color: ${colors.secondary};
    }
    
    h6 {
      font-size: 0.875rem;
      color: ${colors.textSecondary};
    }
    
    /* Paragraphs */
    p {
      margin-top: ${spacing.scale[2]}${spacing.unit};
      margin-bottom: ${spacing.scale[2]}${spacing.unit};
    }
    
    /* Lists */
    ul, ol {
      margin-top: ${spacing.scale[2]}${spacing.unit};
      margin-bottom: ${spacing.scale[2]}${spacing.unit};
      padding-left: ${spacing.scale[4]}${spacing.unit};
    }
    
    li {
      margin-bottom: ${spacing.scale[1]}${spacing.unit};
    }
    
    /* Code blocks */
    pre, code {
      font-family: ${typography.mono};
      background-color: #f5f5f5;
      border: 1px solid ${colors.border};
      border-radius: 3px;
    }
    
    code {
      padding: 0.2em 0.4em;
    }
    
    pre {
      padding: ${spacing.scale[2]}${spacing.unit};
      overflow: auto;
    }
    
    pre code {
      background-color: transparent;
      border: none;
      padding: 0;
    }
    
    /* Tables */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: ${spacing.scale[3]}${spacing.unit};
      margin-bottom: ${spacing.scale[3]}${spacing.unit};
    }
    
    th {
      background-color: ${colors.primary};
      color: ${colors.background};
      font-weight: bold;
      text-align: left;
      padding: ${spacing.scale[2]}${spacing.unit};
      border: 1px solid ${colors.border};
    }
    
    td {
      padding: ${spacing.scale[2]}${spacing.unit};
      border: 1px solid ${colors.border};
    }
    
    /* Links */
    a {
      color: ${colors.accent};
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Blockquotes */
    blockquote {
      border-left: 4px solid ${colors.secondary};
      margin-left: 0;
      padding-left: ${spacing.scale[3]}${spacing.unit};
      color: ${colors.textSecondary};
    }
  </style>
</head>
<body>
  <h1>Heading 1</h1>
  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
  
  <h2>Heading 2</h2>
  <p>Another paragraph with a <a href="#">link</a>.</p>
  
  <h3>Heading 3</h3>
  <ul>
    <li>Unordered list item 1</li>
    <li>Unordered list item 2</li>
    <li>Unordered list item 3</li>
  </ul>
  
  <h4>Heading 4</h4>
  <ol>
    <li>Ordered list item 1</li>
    <li>Ordered list item 2</li>
    <li>Ordered list item 3</li>
  </ol>
  
  <h5>Heading 5</h5>
  <blockquote>
    <p>This is a blockquote with a paragraph inside it.</p>
  </blockquote>
  
  <h6>Heading 6</h6>
  <pre><code>// This is a code block
function example() {
  return "Hello, world!";
}</code></pre>
  
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row 1, Cell 1</td>
        <td>Row 1, Cell 2</td>
        <td>Row 1, Cell 3</td>
      </tr>
      <tr>
        <td>Row 2, Cell 1</td>
        <td>Row 2, Cell 2</td>
        <td>Row 2, Cell 3</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
}

// If this script is run directly
if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  const outputFile = args[0] || 'reference.docx';
  
  generateEnhancedDocxTemplate({ outputFile })
    .then((path) => {
      console.log(`Enhanced DOCX template generated: ${path}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
} else {
  // Export for use as a module
  module.exports = {
    generateEnhancedDocxTemplate
  };
}
