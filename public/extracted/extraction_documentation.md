# PDF Extraction Documentation

## Source PDF

- **File**: `resume.pdf`
- **Path**: `/Users/bradygeorgen/Documents/workspace/pbradygeorgen/public/resume.pdf`
- **Extraction Date**: 2025-05-21T03:37:50.148Z

## Text Extraction

- **Status**: ✅ Success
- **Output**: `resume_content.txt`

## Color Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_color_theory.json`

### Color Palette

| Color | Hex | Role |
| --- | --- | --- |
| <div style="width: 20px; height: 20px; background-color: #66BBcc;"></div> | `#66BBcc` | primary |
| <div style="width: 20px; height: 20px; background-color: #444444;"></div> | `#444444` | secondary |
| <div style="width: 20px; height: 20px; background-color: #ccdddd;"></div> | `#ccdddd` | accent |
| <div style="width: 20px; height: 20px; background-color: #111111;"></div> | `#111111` | background |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF;"></div> | `#FFFFFF` | text |
| <div style="width: 20px; height: 20px; background-color: #000000;"></div> | `#000000` | textSecondary |
| <div style="width: 20px; height: 20px; background-color: #884400;"></div> | `#884400` | border |
| <div style="width: 20px; height: 20px; background-color: #777722;"></div> | `#777722` | success |
| <div style="width: 20px; height: 20px; background-color: #783893;"></div> | `#783893` | warning |
| <div style="width: 20px; height: 20px; background-color: #000aaa;"></div> | `#000aaa` | error |
| <div style="width: 20px; height: 20px; background-color: #000000;"></div> | `#000000` | info |

## Font Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_font_theory.json`
- **CSS**: `enhanced_pdf_fonts.css`

### Font System

| Role | Font Family |
| --- | --- |
| heading | `d3_f1, Arial, sans-serif` |
| body | `d3_f2, Georgia, serif` |
| mono | `d3_f2, 'Courier New', monospace` |
| title | `d3_f1` |
| subtitle | `d3_f2` |
| button | `d3_f1` |
| nav | `d3_f2` |
| code | `d3_f2` |

## Unified Style Theme

- **Status**: ✅ Success
- **Output**: `unified_style_theme.json`
- **CSS**: `unified_theme.css`

### Theme Description

A unified style theme extracted from PDF

### Component Styles

#### Button

```css
.theme-button {
  font-family: var(--pdf-button-font);
  background-color: var(--pdf-primary-color);
  color: var(--pdf-background-color);
  border-radius: 0.25rem;
}
```

