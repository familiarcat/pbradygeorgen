# PDF Extraction Documentation

## Source PDF

- **File**: `pbradygeorgen_resume.pdf`
- **Path**: `/Users/bradygeorgen/Documents/workspace/pbradygeorgen/public/pbradygeorgen_resume.pdf`
- **Extraction Date**: 2025-05-16T05:44:32.756Z

## Text Extraction

- **Status**: ✅ Success
- **Output**: `resume_content.txt`

## Color Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_color_theory.json`

### Color Palette

| Color | Hex | Role |
| --- | --- | --- |
| <div style="width: 20px; height: 20px; background-color: #333333;"></div> | `#333333` | primary |
| <div style="width: 20px; height: 20px; background-color: #666666;"></div> | `#666666` | secondary |
| <div style="width: 20px; height: 20px; background-color: #7F5FA0;"></div> | `#7F5FA0` | accent |
| <div style="width: 20px; height: 20px; background-color: #FFFFFF;"></div> | `#FFFFFF` | background |
| <div style="width: 20px; height: 20px; background-color: #333333;"></div> | `#333333` | text |
| <div style="width: 20px; height: 20px; background-color: #616161;"></div> | `#616161` | textSecondary |
| <div style="width: 20px; height: 20px; background-color: #4C4C4C;"></div> | `#4C4C4C` | border |
| <div style="width: 20px; height: 20px; background-color: #4B7F52;"></div> | `#4B7F52` | success |
| <div style="width: 20px; height: 20px; background-color: #D06D52;"></div> | `#D06D52` | warning |
| <div style="width: 20px; height: 20px; background-color: #A0695F;"></div> | `#A0695F` | error |
| <div style="width: 20px; height: 20px; background-color: #3A7CA5;"></div> | `#3A7CA5` | info |

## Font Extraction

- **Status**: ✅ Success
- **Output**: `enhanced_font_theory.json`
- **CSS**: `enhanced_pdf_fonts.css`

### Font System

| Role | Font Family |
| --- | --- |
| heading | `d3_f1, Arial, sans-serif` |
| body | `d3_f2, Georgia, serif` |
| mono | `d3_f1, 'Courier New', monospace` |
| title | `d3_f3` |
| subtitle | `d3_f3` |
| button | `d3_f1` |
| nav | `d3_f3` |
| code | `d3_f1` |

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

