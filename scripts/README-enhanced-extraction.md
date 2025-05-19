# Enhanced PDF Extraction

This document explains the enhanced PDF extraction process used in AlexAI to extract fonts, colors, and style hierarchies from PDF files.

## Overview

The enhanced PDF extraction process uses PyMuPDF (a Python binding for MuPDF) to extract detailed information from PDF files. This information is then used to create a more accurate representation of the PDF's visual style, which is applied to the AlexAI application.

## Requirements

- Python 3.7 or higher
- PyMuPDF (`pip install pymupdf`)
- Node.js 14 or higher

You can install the required Python dependencies using:

```bash
pip install -r scripts/requirements.txt
```

## Extraction Process

The enhanced PDF extraction process consists of the following steps:

1. **Text Extraction**: Extract text content from the PDF, including formatting information.
2. **Font Extraction**: Extract font information, including font names, styles, and usage patterns.
3. **Color Extraction**: Extract color information, including text colors, background colors, and accent colors.
4. **Style Hierarchy**: Extract style hierarchy information, including headings, paragraphs, and other structural elements.

## Output Files

The enhanced PDF extraction process generates the following output files:

- `enhanced_font_theory.json`: Contains detailed information about the fonts used in the PDF.
- `enhanced_color_theory.json`: Contains detailed information about the colors used in the PDF.
- `enhanced_style_hierarchy.json`: Contains information about the style hierarchy in the PDF.
- `enhanced_pdf_styles.css`: Contains CSS variables and utility classes based on the extracted information.
- `pdf_analysis.json`: Contains a comprehensive analysis of the PDF, including all extracted information.

## Usage

### Command Line

You can run the enhanced PDF extraction process from the command line:

```bash
node scripts/extract-enhanced-pdf-styles.js [pdf_path]
```

If no PDF path is provided, the script will use the default PDF path specified in the configuration.

### Programmatic Usage

You can also use the enhanced PDF extraction process programmatically:

```javascript
const { extractEnhancedPdfStyles } = require('./scripts/extract-enhanced-pdf-styles');

async function extractStyles() {
  const result = await extractEnhancedPdfStyles('path/to/pdf');
  if (result.success) {
    console.log('Extraction successful!');
    console.log('Font theory:', result.fontTheory);
    console.log('Color theory:', result.colorTheory);
  } else {
    console.error('Extraction failed:', result.error);
  }
}

extractStyles();
```

## Integration with Build Process

The enhanced PDF extraction process is integrated with the build process through the `extract-all-pdf-styles.js` script. This script runs both the traditional and enhanced extraction processes, and uses the enhanced results if available.

## Troubleshooting

### PyMuPDF Installation Issues

If you encounter issues installing PyMuPDF, you can try the following:

1. Ensure you have Python 3.7 or higher installed.
2. Try installing PyMuPDF with pip: `pip install pymupdf`
3. If that fails, you may need to install additional dependencies. See the [PyMuPDF documentation](https://pymupdf.readthedocs.io/en/latest/installation.html) for more information.

### Extraction Issues

If the enhanced extraction process fails, the system will fall back to the traditional extraction process. You can check the logs for more information about the failure.

## Philosophical Approach

The enhanced PDF extraction process follows the combined principles of Hesse (mathematical color theory) and Salinger (intuitive UX with consistent visual language):

- **Hesse Principle**: The extraction process uses mathematical analysis to identify color relationships and create a harmonious color palette.
- **Salinger Principle**: The extracted styles are applied in a way that creates a consistent, intuitive user experience.

This approach ensures that the extracted styles are both mathematically sound and visually appealing, creating a cohesive and harmonious user interface.

## Future Improvements

- Add support for extracting more detailed style information, such as line spacing and paragraph spacing.
- Improve color extraction to better identify primary, secondary, and accent colors.
- Add support for extracting and applying custom CSS properties from the PDF.
- Implement machine learning to better identify the purpose of different styles in the PDF.
