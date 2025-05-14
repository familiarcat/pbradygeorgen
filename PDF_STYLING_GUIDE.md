# PDF-Driven Styling Guide for AlexAI

This guide explains how to use the PDF extraction system to apply styles from your PDF to the entire application, creating a cohesive, dynamically themed experience.

## Overview

AlexAI now features a comprehensive system that extracts colors and fonts from your PDF and applies them throughout the application. This means that when you replace the source PDF, the entire application's theme will update to match the visual identity of your PDF.

## How It Works

1. **PDF Extraction**: When you upload a new PDF, the system extracts:
   - Colors used in the PDF
   - Fonts used in the PDF
   - Content structure and layout

2. **Theme Generation**: The system generates:
   - A color theory JSON file with primary, secondary, accent, and other colors
   - A font theory JSON file with heading, body, and monospace fonts
   - CSS variables that are applied globally

3. **Global Application**: These styles are applied to:
   - All buttons and CTAs
   - Background colors
   - Text colors and fonts
   - Form elements
   - Cards and modals
   - Navigation and footer

## Replacing the PDF and Updating Styles

### Step 1: Replace the Source PDF

Use the update-pdf.sh script to replace the PDF and extract styles:

```bash
# Make sure the script is executable
chmod +x scripts/update-pdf.sh

# Run the script with the path to your new PDF
./scripts/update-pdf.sh /path/to/your/new/resume.pdf
```

### Step 2: Verify the Extracted Styles

Check the extracted style files:

```bash
# Check the extracted color theory
cat public/extracted/color_theory.json

# Check the extracted font theory
cat public/extracted/font_theory.json

# Check the extracted CSS
cat public/extracted/pdf_fonts.css
```

### Step 3: Customize the Styles (Optional)

If you want to fine-tune the extracted styles:

```bash
# Edit the color theory
nano public/extracted/color_theory.json

# Edit the font theory
nano public/extracted/font_theory.json
```

### Step 4: Test the Application

Start the development server and test the application:

```bash
npm run dev
```

Visit different pages to see how the styles are applied throughout the application:
- Home page: http://localhost:3000
- PDF Viewer: http://localhost:3000/pdf-viewer
- Summary: http://localhost:3000/summary
- Color Theme: http://localhost:3000/color-theme

## CSS Variables

The following CSS variables are available for use in your custom components:

### Color Variables

```css
--pdf-primary-color      /* Primary color from PDF */
--pdf-secondary-color    /* Secondary color from PDF */
--pdf-accent-color       /* Accent color from PDF */
--pdf-background-color   /* Background color */
--pdf-text-color         /* Main text color */
--pdf-text-secondary     /* Secondary text color */
--pdf-border-color       /* Border color */
--pdf-success-color      /* Success color */
--pdf-warning-color      /* Warning color */
--pdf-error-color        /* Error color */
--pdf-info-color         /* Info color */

/* Contrast colors for accessibility */
--pdf-primary-contrast   /* Contrast color for primary */
--pdf-secondary-contrast /* Contrast color for secondary */
--pdf-accent-contrast    /* Contrast color for accent */

/* UI component variables */
--pdf-button-bg          /* Button background */
--pdf-button-text        /* Button text */
--pdf-button-hover-bg    /* Button hover background */
--pdf-input-border       /* Input border */
--pdf-input-focus-border /* Input focus border */
--pdf-card-bg            /* Card background */
--pdf-card-shadow        /* Card shadow */
--pdf-modal-bg           /* Modal background */
--pdf-modal-overlay      /* Modal overlay */
--pdf-nav-bg             /* Navigation background */
--pdf-nav-text           /* Navigation text */
--pdf-footer-bg          /* Footer background */
--pdf-footer-text        /* Footer text */
```

### Font Variables

```css
--pdf-heading-font       /* Heading font from PDF */
--pdf-body-font          /* Body font from PDF */
--pdf-mono-font          /* Monospace font from PDF */
```

## Using the Variables in Your Components

You can use these variables in your custom components:

```tsx
// Example component using PDF-extracted styles
function CustomButton({ children }) {
  return (
    <button 
      style={{
        backgroundColor: 'var(--pdf-primary-color)',
        color: 'var(--pdf-primary-contrast)',
        fontFamily: 'var(--pdf-body-font)',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.25rem',
      }}
    >
      {children}
    </button>
  );
}
```

## How to Create Custom Themes

You can create custom themes by manually editing the color and font theory files:

### Custom Color Theme

```json
{
  "primary": "#3a6ea5",
  "secondary": "#004e98",
  "accent": "#ff6700",
  "background": "#f6f6f6",
  "text": "#333333",
  "textSecondary": "#666666",
  "border": "#dddddd",
  "success": "#28a745",
  "warning": "#ffc107",
  "error": "#dc3545",
  "info": "#17a2b8",
  "allColors": ["#3a6ea5", "#004e98", "#ff6700"]
}
```

### Custom Font Theme

```json
{
  "heading": "'Arial', sans-serif",
  "body": "'Helvetica', Arial, sans-serif",
  "mono": "monospace",
  "allFonts": ["Arial", "Helvetica"]
}
```

## Troubleshooting

### Issue: Styles Not Updating

If the styles don't update after replacing the PDF:

1. Clear your browser cache
2. Restart the development server
3. Check that the extraction scripts ran successfully
4. Verify that the color and font theory files were created

### Issue: Colors Don't Match the PDF

If the extracted colors don't match the PDF:

1. Try using a PDF with more distinct colors
2. Manually edit the color theory file
3. Use the Color Theme Editor in the application (accessible from the home page in Admin mode)

### Issue: Fonts Not Loading

If the extracted fonts don't load:

1. Check if the fonts are embedded in the PDF
2. Verify that the font theory file was created
3. Manually specify web-safe fonts in the font theory file

## Advanced: Creating a Color Theme Editor

The application includes a Color Theme Editor that allows you to:

1. View the extracted colors
2. Edit individual colors with a color picker
3. Save the changes to the color theory file

To access the Color Theme Editor:

1. Enable Admin mode
2. Navigate to the home page
3. Click on the "Color Theme Editor" link

## Conclusion

By following this guide, you can create a cohesive, dynamically themed experience where the entire application updates its visual identity based on the PDF you provide. This ensures that your application always matches the branding and style of your source PDF.
