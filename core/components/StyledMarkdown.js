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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const DynamicThemeProvider_1 = require("./DynamicThemeProvider");
const DanteLogger_1 = require("@/utils/DanteLogger");
/**
 * StyledMarkdown component that applies PDF-extracted styles to markdown content
 *
 * This component wraps ReactMarkdown and applies PDF-extracted styles to all elements
 * rendered by ReactMarkdown, ensuring consistent styling throughout the application.
 *
 * This component has been enhanced to ensure PDF-extracted styles are properly applied
 * with high specificity and improved spacing to prevent text overlap.
 */
const StyledMarkdown = ({ children, className }) => {
    // Access the PDF theme context to get extracted styles
    const themeContext = (0, DynamicThemeProvider_1.usePdfThemeContext)();
    const [stylesLoaded, setStylesLoaded] = (0, react_1.useState)(false);
    // Check if PDF styles are loaded
    (0, react_1.useEffect)(() => {
        const checkStylesLoaded = () => {
            const pdfStylesLoaded = document.documentElement.getAttribute('data-pdf-styles-loaded') === 'true';
            setStylesLoaded(pdfStylesLoaded);
            if (pdfStylesLoaded) {
                DanteLogger_1.DanteLogger.success.basic('StyledMarkdown: PDF styles detected and will be applied');
            }
            else {
                DanteLogger_1.DanteLogger.error.runtime('StyledMarkdown: PDF styles not detected, using fallbacks');
            }
        };
        // Check immediately
        checkStylesLoaded();
        // Also listen for the custom event when styles are loaded
        const handleStylesLoaded = () => {
            DanteLogger_1.DanteLogger.success.basic('StyledMarkdown: PDF styles loaded event received');
            setStylesLoaded(true);
        };
        document.addEventListener('pdf-styles-loaded', handleStylesLoaded);
        return () => {
            document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
        };
    }, []);
    // Define components with PDF-extracted styles with higher specificity
    const components = {
        h1: ({ node, ...props }) => (<h1 style={{
                fontFamily: 'var(--pdf-heading-font, var(--font-heading, var(--dynamic-heading-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                fontSize: '1.8rem',
                marginTop: '0.5rem',
                marginBottom: '1.5rem', // Increased for better spacing
                fontWeight: 400,
                letterSpacing: '-0.5px',
                textAlign: 'left',
                lineHeight: '1.4', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        h2: ({ node, ...props }) => (<h2 style={{
                fontFamily: 'var(--pdf-heading-font, var(--font-heading, var(--dynamic-heading-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                fontSize: '1.5rem',
                marginTop: '2rem', // Increased for better spacing
                marginBottom: '1rem', // Increased for better spacing
                fontWeight: 400,
                borderBottom: '1px solid var(--pdf-border-color, var(--border-color, var(--dynamic-border, rgba(73, 66, 61, 0.1))))' + ' !important',
                paddingBottom: '0.5rem',
                textAlign: 'left',
                lineHeight: '1.4', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        h3: ({ node, ...props }) => (<h3 style={{
                fontFamily: 'var(--pdf-heading-font, var(--font-heading, var(--dynamic-heading-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                fontSize: '1.25rem',
                marginTop: '1.75rem', // Increased for better spacing
                marginBottom: '0.75rem', // Increased for better spacing
                fontWeight: 400,
                textAlign: 'left',
                lineHeight: '1.4', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        h4: ({ node, ...props }) => (<h4 style={{
                fontFamily: 'var(--pdf-heading-font, var(--font-heading, var(--dynamic-heading-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                fontSize: '1.1rem',
                marginTop: '1.5rem', // Increased for better spacing
                marginBottom: '0.75rem', // Increased for better spacing
                fontWeight: 400,
                fontStyle: 'italic',
                textAlign: 'left',
                lineHeight: '1.4', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        p: ({ node, ...props }) => (<p style={{
                fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                marginBottom: '1.25rem', // Increased for better spacing
                lineHeight: '1.8', // Increased for better readability and to prevent overlap
                textAlign: 'left',
                display: 'block', // Ensures proper block formatting
                width: '100%', // Ensures full width
                marginTop: '0.5rem' // Added for consistent spacing
            }} {...props}/>),
        ul: ({ node, ...props }) => (<ul style={{
                marginBottom: '1.25rem', // Increased for better spacing
                paddingLeft: '2rem', // Increased for better indentation
                listStylePosition: 'outside', // Ensures bullets are outside the text
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        ol: ({ node, ...props }) => (<ol style={{
                marginBottom: '1.25rem', // Increased for better spacing
                paddingLeft: '2rem', // Increased for better indentation
                listStylePosition: 'outside', // Ensures numbers are outside the text
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        li: ({ node, ...props }) => (<li style={{
                fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, serif)))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
                marginBottom: '0.5rem', // Increased for better spacing
                textAlign: 'left',
                lineHeight: '1.6', // Added for consistent spacing
                paddingLeft: '0.25rem', // Added for better readability
                display: 'list-item' // Ensures proper list item formatting
            }} {...props}/>),
        a: ({ node, ...props }) => (<a style={{
                color: 'var(--pdf-primary-color, var(--primary, var(--dynamic-primary, #5A7682)))' + ' !important',
                textDecoration: 'none',
                fontWeight: 500, // Added for better visibility
                borderBottom: '1px dotted var(--pdf-primary-color, var(--primary, var(--dynamic-primary, #5A7682)))' // Added for better visibility
            }} {...props}/>),
        code: ({ node, inline, ...props }) => (<code style={{
                fontFamily: 'var(--pdf-mono-font, var(--font-mono, var(--dynamic-mono-font, monospace)))' + ' !important',
                backgroundColor: inline ? 'var(--code-bg, rgba(73, 66, 61, 0.05))' : 'transparent',
                padding: inline ? '0.2rem 0.4rem' : '0',
                borderRadius: '3px',
                fontSize: '0.9em',
                lineHeight: inline ? 'inherit' : '1.6', // Added for consistent spacing
                display: inline ? 'inline' : 'block' // Ensures proper formatting
            }} {...props}/>),
        pre: ({ node, ...props }) => (<pre style={{
                backgroundColor: 'var(--code-bg, rgba(73, 66, 61, 0.05))',
                padding: '1rem',
                borderRadius: '4px',
                overflowX: 'auto',
                marginBottom: '1.25rem', // Increased for better spacing
                marginTop: '1rem', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        blockquote: ({ node, ...props }) => (<blockquote style={{
                borderLeft: '4px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
                paddingLeft: '1.5rem', // Increased for better spacing
                marginLeft: '0',
                marginRight: '0',
                marginTop: '1rem', // Added for consistent spacing
                marginBottom: '1.25rem', // Increased for better spacing
                fontStyle: 'italic',
                color: 'var(--pdf-text-secondary, var(--text-secondary, #666666))' + ' !important',
                display: 'block', // Ensures proper block formatting
                width: '100%', // Ensures full width
                lineHeight: '1.6' // Added for consistent spacing
            }} {...props}/>),
        table: ({ node, ...props }) => (<table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1.25rem', // Increased for better spacing
                marginTop: '1rem', // Added for consistent spacing
                display: 'block', // Ensures proper block formatting
                overflowX: 'auto' // Added for better handling of wide tables
            }} {...props}/>),
        th: ({ node, ...props }) => (<th style={{
                fontFamily: 'var(--pdf-heading-font, var(--font-heading, serif))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
                fontWeight: 'bold',
                padding: '0.75rem', // Increased for better spacing
                borderBottom: '2px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
                textAlign: 'left'
            }} {...props}/>),
        td: ({ node, ...props }) => (<td style={{
                fontFamily: 'var(--pdf-body-font, var(--font-body, serif))' + ' !important',
                color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
                padding: '0.75rem', // Increased for better spacing
                borderBottom: '1px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
                lineHeight: '1.4' // Added for consistent spacing
            }} {...props}/>),
        hr: ({ node, ...props }) => (<hr style={{
                border: 'none',
                borderTop: '1px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
                margin: '2rem 0', // Increased for better spacing
                display: 'block', // Ensures proper block formatting
                width: '100%' // Ensures full width
            }} {...props}/>),
        img: ({ node, ...props }) => (<img style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '4px',
                display: 'block', // Ensures proper block formatting
                marginTop: '1rem', // Added for consistent spacing
                marginBottom: '1.25rem' // Increased for better spacing
            }} {...props}/>)
    };
    // Log when rendering with PDF styles
    (0, react_1.useEffect)(() => {
        if (stylesLoaded) {
            DanteLogger_1.DanteLogger.success.ux('StyledMarkdown: Rendering with PDF-extracted styles');
        }
    }, [stylesLoaded]);
    return (<div className={`${className} pdf-styled-markdown`} style={{
            // Apply PDF-extracted styles to the container
            fontFamily: 'var(--pdf-body-font, var(--font-body, var(--dynamic-primary-font, serif)))' + ' !important',
            color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
            backgroundColor: 'var(--pdf-background-color, var(--background, var(--dynamic-background, #ffffff)))' + ' !important',
            padding: '1rem',
            width: '100%',
            maxWidth: '100%',
            overflowWrap: 'break-word', // Prevents text from overflowing
            wordWrap: 'break-word', // Ensures words break properly
            wordBreak: 'normal', // Ensures words break properly
            hyphens: 'auto', // Adds hyphens when breaking words
            textAlign: 'left' // Ensures left alignment
        }} data-pdf-styles-loaded={stylesLoaded ? 'true' : 'false'} // Add data attribute for CSS targeting
    >
      <react_markdown_1.default components={components}>
        {children}
      </react_markdown_1.default>
    </div>);
};
exports.default = StyledMarkdown;
//# sourceMappingURL=StyledMarkdown.js.map