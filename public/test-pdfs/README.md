# PDF Test Suite

This directory contains a comprehensive set of test PDFs designed to evaluate different aspects of our PDF interpretation system.

## Test Categories

### Color Theory Tests (`/color`)

- **monochromatic.pdf**: Single color family with various shades
- **high-contrast.pdf**: Bold contrasting colors with clear separation
- **gradient.pdf**: Multiple gradients throughout the document

### Typography Tests (`/typography`)

- **serif.pdf**: Traditional serif fonts with formal layout
- **sans-serif.pdf**: Clean sans-serif fonts with varied weights
- **mixed-typography.pdf**: Combination of serif, sans-serif, and decorative fonts

### Layout Structure Tests (`/layout`)

- **single-column.pdf**: Classic single-column resume layout
- **multi-column.pdf**: Two or three column layout with sidebar elements
- **infographic.pdf**: Visual elements integrated with text

### Special Elements Tests (`/special`)

- **image-heavy.pdf**: Profile photo and other images
- **table-based.pdf**: Skills or experience presented in tables
- **special-chars.pdf**: International characters and symbols

## Testing Philosophy

These test PDFs embody our three philosophical approaches:

- **Salinger**: Authentic visual interpretation and human-centered design
- **Hesse**: Precise, analytical test cases with predictable outcomes
- **Derrida**: Accounting for the "différance" - the unpredictable variations

## How to Test a PDF Template

1. Place your test PDF in this directory
2. Run the test script:
   ```
   node scripts/test-pdf-template.js ./public/test-pdfs/your-test-file.pdf
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to http://localhost:3000 to see how the application handles the new template

## Restoring the Original PDF

To restore the original PDF after testing:

```
node scripts/restore-original-pdf.js
```

## Tips for Testing

- Try PDFs with different layouts, fonts, and structures
- Check how well the text extraction works
- Verify that the content analysis correctly identifies the document type
- Test how the UI adapts to different content structures

## Adding New Test PDFs

When adding new test PDFs to this directory, consider including a brief description of the template's characteristics, such as:

- Layout style (traditional, modern, creative, etc.)
- Special features (columns, graphics, tables, etc.)
- Expected challenges for the extraction process
