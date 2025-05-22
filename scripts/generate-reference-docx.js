/**
 * Generate Reference DOCX Template
 *
 * This script generates a reference.docx template that uses the PDF-extracted fonts and colors.
 * It follows:
 * - Hesse philosophy by ensuring mathematical harmony in color theory
 * - Müller-Brockmann philosophy with clean, grid-based structure and typography
 * - Derrida philosophy by deconstructing hardcoded values
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Emoji for logging
const EMOJI = {
  START: '🎨',
  SUCCESS: '✅',
  ERROR: '❌',
  INFO: 'ℹ️',
  FONT: '🔤',
  COLOR: '🎭',
  TEMPLATE: '📄'
};

/**
 * Generate a reference.docx template with the PDF-extracted fonts and colors
 */
async function generateReferenceDocx() {
  try {
    console.log(`${EMOJI.START} Generating reference.docx template with PDF-extracted styles...`);

    // Create the templates directory if it doesn't exist
    const templatesDir = path.join(process.cwd(), 'templates');
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
      console.log(`${EMOJI.INFO} Created templates directory`);
    }

    // Create a backup of the existing reference.docx if it exists
    const referenceDocxPath = path.join(templatesDir, 'reference.docx');
    const backupDir = path.join(templatesDir, 'backup');

    if (fs.existsSync(referenceDocxPath)) {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `reference-${timestamp}.docx`);

      fs.copyFileSync(referenceDocxPath, backupPath);
      console.log(`${EMOJI.INFO} Created backup of existing reference.docx at ${backupPath}`);
    }

    // Load the PDF-extracted fonts and colors
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');

    // Check if the extracted directory exists
    if (!fs.existsSync(extractedDir)) {
      console.log(`${EMOJI.ERROR} Extracted directory not found: ${extractedDir}`);
      return;
    }

    // Load the extracted colors
    let colors = {
      primary: '#00A99D',
      secondary: '#333333',
      text: '#333333',
      background: '#FFFFFF'
    };

    const colorsPath = path.join(extractedDir, 'colors.json');
    if (fs.existsSync(colorsPath)) {
      try {
        const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        colors = {
          ...colors,
          ...colorsData
        };
        console.log(`${EMOJI.COLOR} Loaded PDF-extracted colors: ${JSON.stringify(colors)}`);
      } catch (error) {
        console.log(`${EMOJI.ERROR} Error loading PDF-extracted colors: ${error}`);
      }
    } else {
      console.log(`${EMOJI.INFO} PDF-extracted colors not found, using defaults`);
    }

    // Load the extracted fonts
    let fonts = {
      heading: 'Arial',
      body: 'Times New Roman',
      mono: 'Courier New'
    };

    const fontsPath = path.join(extractedDir, 'fonts.json');
    if (fs.existsSync(fontsPath)) {
      try {
        const fontsData = JSON.parse(fs.readFileSync(fontsPath, 'utf8'));
        fonts = {
          ...fonts,
          ...fontsData
        };
        console.log(`${EMOJI.FONT} Loaded PDF-extracted fonts: ${JSON.stringify(fonts)}`);
      } catch (error) {
        console.log(`${EMOJI.ERROR} Error loading PDF-extracted fonts: ${error}`);
      }
    } else {
      console.log(`${EMOJI.INFO} PDF-extracted fonts not found, using defaults`);
    }

    // Create a temporary markdown file with styles
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempMarkdownPath = path.join(tempDir, 'reference-template.md');

    // Create a markdown file with all the elements we want to style
    const markdownContent = `---
title: Reference Template
author: AlexAI
date: ${new Date().toISOString().split('T')[0]}
---

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

This is a paragraph with **bold text** and *italic text* and \`code\`.

> This is a blockquote.

- This is a bullet point
- Another bullet point
  - Nested bullet point

1. This is a numbered list
2. Another numbered list item
   1. Nested numbered list item

\`\`\`
This is a code block
\`\`\`

[This is a link](https://example.com)

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

    fs.writeFileSync(tempMarkdownPath, markdownContent);
    console.log(`${EMOJI.TEMPLATE} Created temporary markdown file for styling`);

    // Create a reference.docx file with the PDF-extracted fonts and colors
    // We'll use pandoc to convert the markdown to DOCX with custom styling

    // Create a temporary CSS file with the PDF-extracted styles
    const tempCssPath = path.join(tempDir, 'reference-styles.css');

    const cssContent = `
/* Base document styles */
body {
  font-family: "${fonts.body}", serif;
  font-size: 11pt;
  line-height: 1.5;
  color: ${colors.text};
  background-color: ${colors.background};
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: "${fonts.heading}", sans-serif;
  color: ${colors.primary};
  margin-top: 12pt;
  margin-bottom: 6pt;
  line-height: 1.2;
}

h1 { font-size: 18pt; }
h2 { font-size: 16pt; }
h3 { font-size: 14pt; }
h4 { font-size: 12pt; }

/* Links */
a {
  color: ${colors.primary};
  text-decoration: underline;
}

/* Lists */
ul, ol {
  margin-top: 0;
  margin-bottom: 10pt;
}

li {
  margin-bottom: 4pt;
}

/* Code */
code {
  font-family: "${fonts.mono}", monospace;
  background-color: #f5f5f5;
  padding: 2pt;
  border-radius: 3pt;
}

pre {
  font-family: "${fonts.mono}", monospace;
  background-color: #f5f5f5;
  padding: 8pt;
  border-radius: 5pt;
  margin-bottom: 10pt;
}

/* Blockquotes */
blockquote {
  border-left: 4pt solid ${colors.primary};
  padding-left: 10pt;
  margin-left: 0;
  color: #666666;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 10pt;
}

th {
  background-color: ${colors.primary};
  color: white;
  font-weight: bold;
  text-align: left;
  padding: 5pt;
}

td {
  border: 1pt solid #dddddd;
  padding: 5pt;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
`;

    fs.writeFileSync(tempCssPath, cssContent);
    console.log(`${EMOJI.COLOR} Created temporary CSS file with PDF-extracted styles`);

    // Use pandoc to convert the markdown to DOCX with the custom CSS
    const pandocCommand = `pandoc "${tempMarkdownPath}" -o "${referenceDocxPath}" --css="${tempCssPath}" --reference-doc="${path.join(templatesDir, 'backup', 'reference-template.docx')}"`;

    try {
      // First, check if we have a backup reference template
      const backupTemplatePath = path.join(templatesDir, 'backup', 'reference-template.docx');

      if (!fs.existsSync(backupTemplatePath)) {
        // If not, create a simple one first
        console.log(`${EMOJI.INFO} Creating initial reference template...`);
        const initialPandocCommand = `pandoc "${tempMarkdownPath}" -o "${backupTemplatePath}"`;
        execSync(initialPandocCommand);
      }

      // Now create our styled reference.docx
      console.log(`${EMOJI.INFO} Running pandoc command: ${pandocCommand}`);
      execSync(pandocCommand);

      console.log(`${EMOJI.SUCCESS} Successfully generated reference.docx template with PDF-extracted styles`);
    } catch (error) {
      console.log(`${EMOJI.ERROR} Error running pandoc command: ${error}`);

      // If pandoc fails, copy a default reference.docx
      const defaultReferencePath = path.join(__dirname, '..', 'templates', 'backup', 'reference-template.docx');

      if (fs.existsSync(defaultReferencePath)) {
        fs.copyFileSync(defaultReferencePath, referenceDocxPath);
        console.log(`${EMOJI.INFO} Copied default reference.docx template`);
      } else {
        console.log(`${EMOJI.ERROR} Default reference.docx template not found`);
      }
    }

    // Clean up temporary files
    try {
      fs.unlinkSync(tempMarkdownPath);
      fs.unlinkSync(tempCssPath);
      console.log(`${EMOJI.INFO} Cleaned up temporary files`);
    } catch (error) {
      console.log(`${EMOJI.ERROR} Error cleaning up temporary files: ${error}`);
    }

  } catch (error) {
    console.log(`${EMOJI.ERROR} Error generating reference.docx template: ${error}`);
  }
}

// Run the script
generateReferenceDocx();
