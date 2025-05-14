# AlexAI Theme Variables Reference

This document provides a comprehensive reference for all theme variables available in the AlexAI application. These variables are set based on the colors and fonts extracted from the PDF file.

## Philosophy

AlexAI follows four philosophical frameworks:
- **Salinger**: Intuitive UX with consistent visual language
- **Hesse**: Mathematical approach to color theory
- **Derrida**: Deconstructing hardcoded values with CSS variables
- **Dante**: Methodical logging and organization

## CSS Variables

### Primary Color Variables

These variables are set directly from the extracted PDF colors:

```css
--pdf-primary-color      /* Primary color from PDF */
--pdf-secondary-color    /* Secondary color from PDF */
--pdf-accent-color       /* Accent color from PDF */
--pdf-background-color   /* Background color from PDF */
--pdf-text-color         /* Text color from PDF */
--pdf-text-secondary     /* Secondary text color from PDF */
--pdf-border-color       /* Border color from PDF */
```

### RGB Versions for RGBA Usage

```css
--pdf-primary-color-rgb   /* RGB values of primary color */
--pdf-secondary-color-rgb /* RGB values of secondary color */
--pdf-accent-color-rgb    /* RGB values of accent color */
--pdf-text-color-rgb      /* RGB values of text color */
--pdf-border-color-rgb    /* RGB values of border color */
```

### Font Variables

```css
--pdf-heading-font       /* Heading font from PDF */
--pdf-body-font          /* Body font from PDF */
--pdf-mono-font          /* Monospace font from PDF */
--pdf-title-font         /* Title font from PDF */
--pdf-subtitle-font      /* Subtitle font from PDF */
--pdf-button-font        /* Button font from PDF */
--pdf-nav-font           /* Navigation font from PDF */
--pdf-code-font          /* Code font from PDF */
```

### Simplified Font Variables

```css
--font-heading           /* Alias for --pdf-heading-font */
--font-body              /* Alias for --pdf-body-font */
--font-mono              /* Alias for --pdf-mono-font */
--font-title             /* Alias for --pdf-title-font */
--font-subtitle          /* Alias for --pdf-subtitle-font */
--font-button            /* Alias for --pdf-button-font */
--font-nav               /* Alias for --pdf-nav-font */
--font-code              /* Alias for --pdf-code-font */
```

### UI Component Variables

```css
--pdf-button-bg          /* Button background color */
--pdf-button-text        /* Button text color */
--pdf-button-hover-bg    /* Button hover background color */
--pdf-input-border       /* Input border color */
--pdf-input-focus-border /* Input focus border color */
--pdf-card-bg            /* Card background color */
--pdf-card-shadow        /* Card shadow */
--pdf-modal-bg           /* Modal background color */
--pdf-modal-overlay      /* Modal overlay color */
--pdf-nav-bg             /* Navigation background color */
--pdf-nav-text           /* Navigation text color */
--pdf-footer-bg          /* Footer background color */
--pdf-footer-text        /* Footer text color */
```

### Contrast Variables

```css
--pdf-primary-contrast   /* Contrast color for primary (white or black) */
--pdf-secondary-contrast /* Contrast color for secondary (white or black) */
--pdf-accent-contrast    /* Contrast color for accent (white or black) */
```

### General UI Variables

```css
--bg-primary             /* Primary background color */
--bg-secondary           /* Secondary background color (slightly darker) */
--bg-tertiary            /* Tertiary background color (even darker) */
--text-color             /* Primary text color */
--text-secondary         /* Secondary text color */
--text-tertiary          /* Tertiary text color */
--border-color           /* Border color */
--border-light           /* Light border color */
--border-dark            /* Dark border color */
```

### CTA Variables

```css
--cta-primary            /* Primary CTA color */
--cta-secondary          /* Secondary CTA color */
--cta-tertiary           /* Tertiary CTA color */
--cta-primary-hover      /* Primary CTA hover color */
--cta-secondary-hover    /* Secondary CTA hover color */
--cta-tertiary-hover     /* Tertiary CTA hover color */
--cta-primary-bg         /* Primary CTA background color */
--cta-secondary-bg       /* Secondary CTA background color */
--cta-tertiary-bg        /* Tertiary CTA background color */
```

### Interaction Variables

```css
--hover-bg               /* Hover background color */
--active-bg              /* Active background color */
--focus-ring             /* Focus ring color */
--dropdown-hover-bg      /* Dropdown hover background color */
```

## Usage Guidelines

### For Components

1. **Always use CSS variables instead of hardcoded colors**
   ```css
   /* ❌ Don't do this */
   color: #49423D;
   
   /* ✅ Do this instead */
   color: var(--text-color, #49423D);
   ```

2. **Include fallback values for all CSS variables**
   ```css
   background-color: var(--bg-primary, #ffffff);
   ```

3. **Use the appropriate variable for each context**
   - For text, use `--text-color`, `--text-secondary`, etc.
   - For backgrounds, use `--bg-primary`, `--bg-secondary`, etc.
   - For CTAs, use `--cta-primary`, `--cta-secondary`, etc.

4. **For inline styles in React components**
   ```jsx
   <div style={{ 
     backgroundColor: 'var(--bg-primary, #ffffff)',
     color: 'var(--text-color, #000000)'
   }}>
     Content
   </div>
   ```

### For CSS Modules

```css
.myComponent {
  background-color: var(--bg-primary, #ffffff);
  color: var(--text-color, #000000);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  font-family: var(--font-body, 'Helvetica', sans-serif);
}

.myComponent:hover {
  background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
}
```

## Testing Theme Variables

You can test if the theme variables are working correctly by visiting:
```
http://localhost:3000/style-test
```

This page displays all the theme variables and how they are applied to different UI elements.
