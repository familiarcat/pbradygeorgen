# Testing Different PDF Templates

This directory contains test PDFs for evaluating how the application handles different resume templates and formats.

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
