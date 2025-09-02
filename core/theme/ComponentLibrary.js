"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = exports.Badge = exports.Flex = exports.Grid = exports.Text = exports.Input = exports.Card = exports.Button = exports.ThemedIcon = exports.ThemedBadge = exports.ThemedFlex = exports.ThemedGrid = exports.ThemedText = exports.ThemedInput = exports.ThemedCard = exports.ThemedButton = void 0;
const react_1 = __importDefault(require("react"));
const ThemeProvider_1 = require("./ThemeProvider");
const ThemedButton = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '', style = {}, }) => {
    const theme = (0, ThemeProvider_1.useTheme)();
    const baseStyle = (0, ThemeProvider_1.createButtonStyle)(variant, size);
    const buttonStyle = {
        ...baseStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
    };
    return (<button style={buttonStyle} onClick={onClick} disabled={disabled} className={className}>
            {children}
        </button>);
};
exports.ThemedButton = ThemedButton;
exports.Button = exports.ThemedButton;
const ThemedCard = ({ children, variant = 'primary', className = '', style = {}, }) => {
    const baseStyle = (0, ThemeProvider_1.createCardStyle)(variant);
    return (<div style={{ ...baseStyle, ...style }} className={className}>
            {children}
        </div>);
};
exports.ThemedCard = ThemedCard;
exports.Card = exports.ThemedCard;
const ThemedInput = ({ value, onChange, placeholder = '', variant = 'default', type = 'text', rows = 1, className = '', style = {}, }) => {
    const baseStyle = (0, ThemeProvider_1.createInputStyle)(variant);
    if (type === 'textarea') {
        return (<textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...baseStyle, resize: 'vertical', ...style }} className={className}/>);
    }
    return (<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...baseStyle, ...style }} className={className}/>);
};
exports.ThemedInput = ThemedInput;
exports.Input = exports.ThemedInput;
const ThemedText = ({ children, variant = 'body', color = 'primary', className = '', style = {}, }) => {
    const baseStyle = (0, ThemeProvider_1.createTextStyle)(variant, color);
    const Component = variant.startsWith('h') ? variant : 'p';
    return (<Component style={{ ...baseStyle, ...style }} className={className}>
            {children}
        </Component>);
};
exports.ThemedText = ThemedText;
exports.Text = exports.ThemedText;
const ThemedGrid = ({ children, columns = 1, gap = '16px', className = '', style = {}, }) => {
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style,
    };
    return (<div style={gridStyle} className={className}>
            {children}
        </div>);
};
exports.ThemedGrid = ThemedGrid;
exports.Grid = exports.ThemedGrid;
const ThemedFlex = ({ children, direction = 'row', align = 'start', justify = 'start', gap = '0px', wrap = false, className = '', style = {}, }) => {
    const flexStyle = {
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
    };
    return (<div style={flexStyle} className={className}>
            {children}
        </div>);
};
exports.ThemedFlex = ThemedFlex;
exports.Flex = exports.ThemedFlex;
const ThemedBadge = ({ children, variant = 'primary', size = 'md', className = '', style = {}, }) => {
    const theme = (0, ThemeProvider_1.useTheme)();
    const gradient = theme.gradients[variant];
    const padding = size === 'sm' ? '4px 8px' : size === 'md' ? '6px 12px' : '8px 16px';
    const fontSize = size === 'sm' ? theme.typography.fontSize.xs :
        size === 'md' ? theme.typography.fontSize.sm :
            theme.typography.fontSize.md;
    const badgeStyle = {
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
    return (<span style={badgeStyle} className={className}>
            {children}
        </span>);
};
exports.ThemedBadge = ThemedBadge;
exports.Badge = exports.ThemedBadge;
const ThemedIcon = ({ icon, size = 'md', color = 'inherit', className = '', style = {}, }) => {
    const theme = (0, ThemeProvider_1.useTheme)();
    const iconSize = size === 'sm' ? '16px' :
        size === 'md' ? '20px' :
            size === 'lg' ? '24px' : '32px';
    const iconColor = color === 'inherit' ? 'currentColor' : theme.colors[color];
    const iconStyle = {
        fontSize: iconSize,
        color: iconColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };
    return (<span style={iconStyle} className={className}>
            {icon}
        </span>);
};
exports.ThemedIcon = ThemedIcon;
exports.Icon = exports.ThemedIcon;
//# sourceMappingURL=ComponentLibrary.js.map