# PDF Extraction Documentation

## Source PDF

- **File**: `high-contrast.pdf`
- **Path**: `/Users/bradygeorgen/Documents/workspace/pbradygeorgen/source-pdfs/high-contrast.pdf`
- **Extraction Date**: 2025-05-16T05:44:55.229Z

## Text Extraction

- **Status**: ✅ Success
- **Output**: `resume_content.txt`

## Color Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_color_theory.json`

### Color Palette

| Color | Hex | Role |
| --- | --- | --- |
| <div style="width: 20px; height: 20px; background-color: #3366CC;"></div> | `#3366CC` | primary |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF;"></div> | `#FFFFFF` | secondary |
| <div style="width: 20px; height: 20px; background-color: #3366CC;"></div> | `#3366CC` | accent |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF;"></div> | `#FFFFFF` | background |
| <div style="width: 20px; height: 20px; background-color: #000000;"></div> | `#000000` | text |
| <div style="width: 20px; height: 20px; background-color: #3366CC;"></div> | `#3366CC` | textSecondary |
| <div style="width: 20px; height: 20px; background-color: #000000;"></div> | `#000000` | border |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF;"></div> | `#FFFFFF` | success |
| <div style="width: 20px; height: 20px; background-color: #3366CC;"></div> | `#3366CC` | warning |
| <div style="width: 20px; height: 20px; background-color: #000000;"></div> | `#000000` | error |
| <div style="width: 20px; height: 20px; background-color: #3366CC;"></div> | `#3366CC` | info |

## Font Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_font_theory.json`
- **CSS**: `enhanced_pdf_fonts.css`

### Font System

| Role | Font Family |
| --- | --- |
| heading | `d7_f1, Arial, sans-serif` |
| body | `d7_f2, Georgia, serif` |
| mono | `d7_f1, 'Courier New', monospace` |
| title | `d7_f3` |
| subtitle | `d7_f4` |
| button | `d7_f5` |
| nav | `d7_f2` |
| code | `d7_f1` |

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

