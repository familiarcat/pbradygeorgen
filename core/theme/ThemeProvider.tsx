'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// Theme interface
interface Theme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
        info: string;
        background: {
            primary: string;
            secondary: string;
            tertiary: string;
            card: string;
            overlay: string;
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            inverse: string;
        };
        border: {
            primary: string;
            secondary: string;
            accent: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        glow: string;
    };
    gradients: {
        primary: string;
        secondary: string;
        accent: string;
        success: string;
        warning: string;
        error: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            xxl: string;
            xxxl: string;
        };
        fontWeight: {
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
        lineHeight: {
            tight: string;
            normal: string;
            relaxed: string;
        };
    };
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}

// Default theme
const defaultTheme: Theme = {
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
const ThemeContext = createContext<Theme>(defaultTheme);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook to use theme
export const useTheme = (): Theme => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Utility functions for common styles
export const createCardStyle = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
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

export const createButtonStyle = (
    variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md'
) => {
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

export const createInputStyle = (variant: 'default' | 'focused' | 'error' = 'default') => {
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
        boxSizing: 'border-box' as const,
    };
};

export const createTextStyle = (
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' = 'body',
    color: 'primary' | 'secondary' | 'tertiary' | 'inverse' = 'primary'
) => {
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

export default ThemeProvider;
