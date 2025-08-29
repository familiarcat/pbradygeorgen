# 🎨 Universal Theme System

## Overview

The Universal Theme System provides consistent, maintainable styling across the entire application. It replaces the previous approach of mixing inline styles and Tailwind classes with a centralized, type-safe theme provider.

## 🏗️ Architecture

### Core Components

1. **ThemeProvider** (`core/theme/ThemeProvider.tsx`)
   - Central theme context provider
   - Defines all design tokens (colors, spacing, typography, etc.)
   - Provides utility functions for common styles

2. **ComponentLibrary** (`core/theme/ComponentLibrary.tsx`)
   - Pre-built themed components
   - Consistent styling across all UI elements
   - Type-safe props and variants

3. **Theme Context**
   - React Context for theme values
   - `useTheme()` hook for accessing theme
   - Automatic theme propagation

## 🎯 Key Benefits

### ✅ **Universal Consistency**
- All components use the same design tokens
- No more style mismatches between components
- Centralized color palette and spacing

### ✅ **Maintainability**
- Change colors/spacing in one place
- Easy to update entire application theme
- No scattered inline styles

### ✅ **Developer Experience**
- Type-safe theme values
- IntelliSense support
- Consistent component API

### ✅ **Performance**
- No CSS-in-JS runtime overhead
- Efficient style calculations
- Minimal bundle size impact

## 🚀 Usage

### Basic Component Usage

```tsx
import { Card, Button, Text, useTheme } from '@/core/theme/ComponentLibrary';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Card variant="primary">
      <Text variant="h2" color="primary">Hello World</Text>
      <Button variant="accent" size="lg">
        Click Me
      </Button>
    </Card>
  );
}
```

### Accessing Theme Values

```tsx
import { useTheme } from '@/core/theme/ThemeProvider';

function CustomComponent() {
  const theme = useTheme();
  
  return (
    <div style={{
      background: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.md,
    }}>
      Custom styled content
    </div>
  );
}
```

### Utility Functions

```tsx
import { createCardStyle, createButtonStyle } from '@/core/theme/ThemeProvider';

const cardStyle = createCardStyle('primary');
const buttonStyle = createButtonStyle('accent', 'lg');
```

## 🎨 Available Components

### Layout Components
- **Card** - Container with consistent styling
- **Grid** - CSS Grid layout wrapper
- **Flex** - Flexbox layout wrapper

### Interactive Components
- **Button** - Multiple variants and sizes
- **Input** - Text, textarea, email inputs
- **Badge** - Status indicators and labels

### Typography Components
- **Text** - All heading levels and body text
- **Icon** - Emoji and icon display

## 🌈 Theme Variants

### Color Variants
- `primary` - Main brand color (#3B82F6)
- `secondary` - Secondary brand color (#8B5CF6)
- `accent` - Accent color (#F59E0B)
- `success` - Success states (#10B981)
- `warning` - Warning states (#F59E0B)
- `error` - Error states (#EF4444)

### Size Variants
- `sm` - Small components
- `md` - Medium components (default)
- `lg` - Large components

### Card Variants
- `primary` - Main content cards
- `secondary` - Secondary content cards
- `accent` - Highlighted content cards

## 🔧 Customization

### Adding New Theme Values

```tsx
// In ThemeProvider.tsx
interface Theme {
  // ... existing properties
  customProperty: {
    value1: string;
    value2: string;
  };
}

const defaultTheme: Theme = {
  // ... existing values
  customProperty: {
    value1: '#FF0000',
    value2: '#00FF00',
  },
};
```

### Creating Custom Components

```tsx
import { useTheme } from '@/core/theme/ThemeProvider';

export const CustomComponent: React.FC = ({ children }) => {
  const theme = useTheme();
  
  return (
    <div style={{
      background: theme.colors.background.card,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    }}>
      {children}
    </div>
  );
};
```

## 📱 Responsive Design

The theme system includes breakpoint definitions:

```tsx
const theme = useTheme();

// Responsive styling
const responsiveStyle = {
  gridTemplateColumns: window.innerWidth > parseInt(theme.breakpoints.lg) 
    ? 'repeat(3, 1fr)' 
    : 'repeat(1, 1fr)',
};
```

## 🎭 Dark Mode Support

The theme system is designed to support dark mode (future enhancement):

```tsx
// Future implementation
const theme = useTheme();
const isDarkMode = theme.mode === 'dark';

const dynamicStyle = {
  background: isDarkMode ? theme.colors.background.dark : theme.colors.background.light,
};
```

## 📋 Migration Guide

### From Inline Styles

**Before:**
```tsx
<div style={{
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}}>
```

**After:**
```tsx
<Card variant="primary">
```

### From Tailwind Classes

**Before:**
```tsx
<div className="bg-white rounded-lg p-6 shadow-md">
```

**After:**
```tsx
<Card variant="primary">
```

### From Mixed Approaches

**Before:**
```tsx
<div className="bg-white rounded-lg" style={{ padding: '24px' }}>
```

**After:**
```tsx
<Card variant="primary" style={{ padding: '24px' }}>
```

## 🧪 Testing

Visit `/theme-demo` to see all components in action and test the theme system.

## 🔮 Future Enhancements

1. **Dark Mode Support** - Automatic theme switching
2. **Theme Presets** - Multiple theme options
3. **Dynamic Theming** - Runtime theme changes
4. **CSS Variables** - CSS custom properties for advanced use cases
5. **Animation System** - Consistent motion design
6. **Accessibility** - High contrast and focus indicators

## 📚 Best Practices

1. **Always use themed components** for common UI elements
2. **Access theme values** through `useTheme()` hook
3. **Extend the theme** rather than creating custom styles
4. **Use utility functions** for complex style combinations
5. **Maintain consistency** by following established patterns
6. **Test across components** to ensure theme propagation

## 🐛 Troubleshooting

### Common Issues

1. **Theme not available** - Ensure component is wrapped in `ThemeProvider`
2. **Styles not applying** - Check component variant and size props
3. **Type errors** - Verify theme interface matches usage
4. **Performance issues** - Avoid creating styles in render functions

### Debug Mode

```tsx
const theme = useTheme();
console.log('Current theme:', theme);
```

## 📖 Examples

See the following files for complete examples:
- `app/theme-demo/page.tsx` - Theme system showcase
- `core/components/TestCrewMember.tsx` - Refactored component
- `core/theme/ComponentLibrary.tsx` - All available components

---

**The Universal Theme System ensures your application looks professional, consistent, and maintainable across all components and pages.**
