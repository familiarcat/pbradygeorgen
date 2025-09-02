"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextStyle = exports.createInputStyle = exports.createButtonStyle = exports.createCardStyle = exports.useTheme = exports.ThemeProvider = void 0;
const react_1 = __importStar(require("react"));
// Default theme
const defaultTheme = {
    colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#06B6D4',
        background: {
            primary: '#F8FAFC',
            secondary: '#E2E8F0',
            tertiary: '#CBD5E1',
            card: 'rgba(255, 255, 255, 0.95)',
            overlay: 'rgba(0, 0, 0, 0.1)',
        },
        text: {
            primary: '#1F2937',
            secondary: '#4B5563',
            tertiary: '#6B7280',
            inverse: '#FFFFFF',
        },
        border: {
            primary: 'rgba(59, 130, 246, 0.2)',
            secondary: 'rgba(229, 231, 235, 0.8)',
            accent: 'rgba(139, 92, 246, 0.2)',
        },
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },
    borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '50%',
    },
    shadows: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
        xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    },
    gradients: {
        primary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        secondary: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        accent: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            xxl: '24px',
            xxxl: '32px',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.7',
        },
    },
    transitions: {
        fast: 'all 0.15s ease',
        normal: 'all 0.3s ease',
        slow: 'all 0.5s ease',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },
};
// Theme context
const ThemeContext = (0, react_1.createContext)(defaultTheme);
// Theme provider component
const ThemeProvider = ({ children }) => {
    return (<ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
// Hook to use theme
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
exports.useTheme = useTheme;
// Utility functions for common styles
const createCardStyle = (variant = 'primary') => {
    const theme = defaultTheme;
    const borderColor = variant === 'primary' ? theme.colors.border.primary :
        variant === 'secondary' ? theme.colors.border.accent :
            theme.colors.border.secondary;
    return {
        background: theme.colors.background.card,
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${borderColor}`,
        boxShadow: theme.shadows.xl,
        padding: theme.spacing.xl,
        backdropFilter: 'blur(8px)',
        transition: theme.transitions.normal,
    };
};
exports.createCardStyle = createCardStyle;
const createButtonStyle = (variant = 'primary', size = 'md') => {
    const theme = defaultTheme;
    const gradient = theme.gradients[variant];
    const padding = size === 'sm' ? `${theme.spacing.sm} ${theme.spacing.md}` :
        size === 'md' ? `${theme.spacing.md} ${theme.spacing.lg}` :
            `${theme.spacing.lg} ${theme.spacing.xl}`;
    return {
        background: gradient,
        color: theme.colors.text.inverse,
        padding,
        borderRadius: theme.borderRadius.lg,
        border: 'none',
        cursor: 'pointer',
        fontWeight: theme.typography.fontWeight.semibold,
        fontSize: size === 'sm' ? theme.typography.fontSize.sm : theme.typography.fontSize.md,
        transition: theme.transitions.normal,
        boxShadow: theme.shadows.md,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    };
};
exports.createButtonStyle = createButtonStyle;
const createInputStyle = (variant = 'default') => {
    const theme = defaultTheme;
    const borderColor = variant === 'focused' ? theme.colors.primary :
        variant === 'error' ? theme.colors.error :
            theme.colors.border.secondary;
    return {
        background: theme.colors.background.card,
        border: `1px solid ${borderColor}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        outline: 'none',
        transition: theme.transitions.normal,
        width: '100%',
        boxSizing: 'border-box',
    };
};
exports.createInputStyle = createInputStyle;
const createTextStyle = (variant = 'body', color = 'primary') => {
    const theme = defaultTheme;
    const fontSize = variant === 'h1' ? theme.typography.fontSize.xxxl :
        variant === 'h2' ? theme.typography.fontSize.xxl :
            variant === 'h3' ? theme.typography.fontSize.xl :
                variant === 'h4' ? theme.typography.fontSize.lg :
                    variant === 'body' ? theme.typography.fontSize.md :
                        theme.typography.fontSize.sm;
    const fontWeight = variant.startsWith('h') ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal;
    return {
        fontSize,
        fontWeight,
        color: theme.colors.text[color],
        lineHeight: theme.typography.lineHeight.normal,
        margin: 0,
    };
};
exports.createTextStyle = createTextStyle;
exports.default = exports.ThemeProvider;
//# sourceMappingURL=ThemeProvider.js.map