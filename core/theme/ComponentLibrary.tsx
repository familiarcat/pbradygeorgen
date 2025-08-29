'use client';

import React from 'react';
import { useTheme, createCardStyle, createButtonStyle, createInputStyle, createTextStyle } from './ThemeProvider';

// Themed Button Component
interface ThemedButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    className = '',
    style = {},
}) => {
    const theme = useTheme();
    const baseStyle = createButtonStyle(variant, size);

    const buttonStyle: React.CSSProperties = {
        ...baseStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
};

// Themed Card Component
interface ThemedCardProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
    children,
    variant = 'primary',
    className = '',
    style = {},
}) => {
    const baseStyle = createCardStyle(variant);

    return (
        <div style={{ ...baseStyle, ...style }} className={className}>
            {children}
        </div>
    );
};

// Themed Input Component
interface ThemedInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    variant?: 'default' | 'focused' | 'error';
    type?: 'text' | 'email' | 'password' | 'textarea';
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
    value,
    onChange,
    placeholder = '',
    variant = 'default',
    type = 'text',
    rows = 1,
    className = '',
    style = {},
}) => {
    const baseStyle = createInputStyle(variant);

    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                style={{ ...baseStyle, resize: 'vertical', ...style }}
                className={className}
            />
        );
    }

    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ ...baseStyle, ...style }}
            className={className}
        />
    );
};

// Themed Text Component
interface ThemedTextProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
    color?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
    children,
    variant = 'body',
    color = 'primary',
    className = '',
    style = {},
}) => {
    const baseStyle = createTextStyle(variant, color);

    const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

    return (
        <Component style={{ ...baseStyle, ...style }} className={className}>
            {children}
        </Component>
    );
};

// Themed Grid Component
interface ThemedGridProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedGrid: React.FC<ThemedGridProps> = ({
    children,
    columns = 1,
    gap = '16px',
    className = '',
    style = {},
}) => {
    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style,
    };

    return (
        <div style={gridStyle} className={className}>
            {children}
        </div>
    );
};

// Themed Flex Component
interface ThemedFlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    gap?: string;
    wrap?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedFlex: React.FC<ThemedFlexProps> = ({
    children,
    direction = 'row',
    align = 'start',
    justify = 'start',
    gap = '0px',
    wrap = false,
    className = '',
    style = {},
}) => {
    const flexStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
    };

    return (
        <div style={flexStyle} className={className}>
            {children}
        </div>
    );
};

// Themed Badge Component
interface ThemedBadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedBadge: React.FC<ThemedBadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    style = {},
}) => {
    const theme = useTheme();
    const gradient = theme.gradients[variant];
    const padding = size === 'sm' ? '4px 8px' : size === 'md' ? '6px 12px' : '8px 16px';
    const fontSize = size === 'sm' ? theme.typography.fontSize.xs :
        size === 'md' ? theme.typography.fontSize.sm :
            theme.typography.fontSize.md;

    const badgeStyle: React.CSSProperties = {
        background: gradient,
        color: theme.colors.text.inverse,
        padding,
        fontSize,
        fontWeight: theme.typography.fontWeight.medium,
        borderRadius: theme.borderRadius.full,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };

    return (
        <span style={badgeStyle} className={className}>
            {children}
        </span>
    );
};

// Themed Icon Component
interface ThemedIconProps {
    icon: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'inherit';
    className?: string;
    style?: React.CSSProperties;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
    icon,
    size = 'md',
    color = 'inherit',
    className = '',
    style = {},
}) => {
    const theme = useTheme();
    const iconSize = size === 'sm' ? '16px' :
        size === 'md' ? '20px' :
            size === 'lg' ? '24px' : '32px';

    const iconColor = color === 'inherit' ? 'currentColor' : theme.colors[color];

    const iconStyle: React.CSSProperties = {
        fontSize: iconSize,
        color: iconColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };

    return (
        <span style={iconStyle} className={className}>
            {icon}
        </span>
    );
};

// Export all components
export {
    ThemedButton as Button,
    ThemedCard as Card,
    ThemedInput as Input,
    ThemedText as Text,
    ThemedGrid as Grid,
    ThemedFlex as Flex,
    ThemedBadge as Badge,
    ThemedIcon as Icon,
};
