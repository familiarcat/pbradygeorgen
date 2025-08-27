# PDF-Driven Styling Test Guide

This guide will help you test if the PDF-driven styling system is working correctly.

## Step 1: Verify the Required Files

Make sure the following files exist:

1. `utils/GlobalStylesProvider.tsx` - The component that applies the PDF styles globally
2. `styles/pdf-theme.css` - The CSS file with the PDF theme variables
3. `public/extracted/color_theory.json` - The extracted color theory from the PDF
4. `public/extracted/font_theory.json` - The extracted font theory from the PDF

## Step 2: Visit the Style Test Page

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the style test page:
   ```
   http://localhost:3000/style-test
   ```

3. Check if the styles are applied correctly:
   - The typography should use the fonts extracted from the PDF
   - The colors should match the colors extracted from the PDF
   - The UI elements should be styled according to the PDF theme

## Step 3: Test with Different PDFs

1. Replace the source PDF:
   ```bash
   ./scripts/update-pdf.sh /path/to/your/new/resume.pdf
   ```

2. Refresh the style test page to see if the styles update.

## Troubleshooting

If the styles are not applied correctly, try the following:

1. Check the browser console for errors
2. Verify that the color_theory.json and font_theory.json files are valid JSON
3. Restart the development server
4. Clear your browser cache

## Manual Testing

You can also manually test the PDF-driven styling by adding the following CSS to your components:

```css
/* Typography */
font-family: var(--pdf-heading-font);
font-family: var(--pdf-body-font);
font-family: var(--pdf-mono-font);

/* Colors */
color: var(--pdf-text-color);
background-color: var(--pdf-primary-color);
border-color: var(--pdf-border-color);

/* UI Elements */
background-color: var(--pdf-button-bg);
color: var(--pdf-button-text);
```

## Expected Results

When the PDF-driven styling system is working correctly, you should see:

1. The entire application using the colors extracted from the PDF
2. All text using the fonts extracted from the PDF
3. UI elements like buttons, inputs, and cards styled according to the PDF theme

This creates a cohesive, dynamically themed experience where the entire site updates its visual identity based on what we parse from the PDF.
