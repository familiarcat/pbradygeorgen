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
exports.usePdfThemeContext = void 0;
exports.default = DynamicThemeProvider;
const react_1 = __importStar(require("react"));
const usePdfTheme_1 = __importDefault(require("@/hooks/usePdfTheme"));
const usePdfFonts_1 = __importDefault(require("@/hooks/usePdfFonts"));
const SimplePDFColorExtractor_1 = require("@/utils/SimplePDFColorExtractor");
const defaultThemeContext = {
    colorTheme: SimplePDFColorExtractor_1.defaultColorTheme,
    primaryFont: 'var(--font-source-sans)',
    secondaryFont: 'var(--font-merriweather)',
    headingFont: 'var(--font-roboto)',
    isLoading: false
};
const ThemeContext = (0, react_1.createContext)(defaultThemeContext);
const usePdfThemeContext = () => (0, react_1.useContext)(ThemeContext);
exports.usePdfThemeContext = usePdfThemeContext;
function DynamicThemeProvider({ children, pdfUrl }) {
    // Extract colors and fonts from the PDF
    const colorTheme = (0, usePdfTheme_1.default)(pdfUrl);
    const { primaryFont, secondaryFont, headingFont, isLoading: fontsLoading } = (0, usePdfFonts_1.default)(pdfUrl);
    const isLoading = colorTheme.isLoading || fontsLoading;
    // Apply the theme to CSS variables
    (0, react_1.useEffect)(() => {
        if (typeof document !== 'undefined') {
            // Apply colors
            document.documentElement.style.setProperty('--dynamic-primary', colorTheme.primary);
            document.documentElement.style.setProperty('--dynamic-secondary', colorTheme.secondary);
            document.documentElement.style.setProperty('--dynamic-accent', colorTheme.accent);
            document.documentElement.style.setProperty('--dynamic-background', colorTheme.background);
            document.documentElement.style.setProperty('--dynamic-text', colorTheme.text);
            document.documentElement.style.setProperty('--dynamic-border', colorTheme.border);
            // Apply CTA colors if available
            if (colorTheme.ctaColors) {
                // Primary CTA
                document.documentElement.style.setProperty('--cta-primary', colorTheme.ctaColors.primary.base);
                document.documentElement.style.setProperty('--cta-primary-hover', colorTheme.ctaColors.primary.hover);
                document.documentElement.style.setProperty('--cta-primary-active', colorTheme.ctaColors.primary.active);
                document.documentElement.style.setProperty('--cta-primary-bg', `color-mix(in srgb, ${colorTheme.ctaColors.primary.base} 10%, ${colorTheme.background} 90%)`);
                // Secondary CTA
                document.documentElement.style.setProperty('--cta-secondary', colorTheme.ctaColors.secondary.base);
                document.documentElement.style.setProperty('--cta-secondary-hover', colorTheme.ctaColors.secondary.hover);
                document.documentElement.style.setProperty('--cta-secondary-active', colorTheme.ctaColors.secondary.active);
                document.documentElement.style.setProperty('--cta-secondary-bg', `color-mix(in srgb, ${colorTheme.ctaColors.secondary.base} 10%, ${colorTheme.background} 90%)`);
                // Tertiary CTA
                document.documentElement.style.setProperty('--cta-tertiary', colorTheme.ctaColors.tertiary.base);
                document.documentElement.style.setProperty('--cta-tertiary-hover', colorTheme.ctaColors.tertiary.hover);
                document.documentElement.style.setProperty('--cta-tertiary-active', colorTheme.ctaColors.tertiary.active);
                document.documentElement.style.setProperty('--cta-tertiary-bg', `color-mix(in srgb, ${colorTheme.ctaColors.tertiary.base} 10%, ${colorTheme.background} 90%)`);
            }
            // Apply fonts
            document.documentElement.style.setProperty('--dynamic-primary-font', primaryFont);
            document.documentElement.style.setProperty('--dynamic-secondary-font', secondaryFont);
            document.documentElement.style.setProperty('--dynamic-heading-font', headingFont);
            // Add consistent font variables for all components
            document.documentElement.style.setProperty('--font-body', primaryFont);
            document.documentElement.style.setProperty('--font-mono', secondaryFont);
            document.documentElement.style.setProperty('--font-heading', headingFont);
            document.documentElement.style.setProperty('--font-button', primaryFont);
            // Set theme mode
            if (colorTheme.isDark) {
                document.documentElement.classList.add('pdf-dark-theme');
                document.documentElement.classList.remove('pdf-light-theme');
            }
            else {
                document.documentElement.classList.add('pdf-light-theme');
                document.documentElement.classList.remove('pdf-dark-theme');
            }
            // Set loading state
            if (!isLoading) {
                document.body.classList.add('theme-loaded');
            }
            else {
                document.body.classList.remove('theme-loaded');
            }
        }
    }, [colorTheme, primaryFont, secondaryFont, headingFont, isLoading]);
    // Provide the theme context
    const themeContext = {
        colorTheme,
        primaryFont,
        secondaryFont,
        headingFont,
        isLoading
    };
    return (<ThemeContext.Provider value={themeContext}>
      <div className="theme-transition-container">
        {children}
      </div>
    </ThemeContext.Provider>);
}
//# sourceMappingURL=DynamicThemeProvider.js.map