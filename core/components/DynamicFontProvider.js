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
exports.useFonts = void 0;
exports.default = DynamicFontProvider;
const react_1 = __importStar(require("react"));
const pdfjs = __importStar(require("pdfjs-dist"));
const google_1 = require("next/font/google");
// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// Define fallback fonts
const inter = (0, google_1.Inter)({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});
const roboto = (0, google_1.Roboto)({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});
const merriweather = (0, google_1.Merriweather)({
    weight: ['300', '400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-merriweather',
});
const sourceSans = (0, google_1.Source_Sans_3)({
    weight: ['300', '400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-source-sans',
});
const defaultFontContext = {
    primaryFont: 'var(--font-source-sans)',
    secondaryFont: 'var(--font-merriweather)',
    headingFont: 'var(--font-roboto)',
    monoFont: 'var(--font-geist-mono)',
    isLoading: false,
};
const FontContext = (0, react_1.createContext)(defaultFontContext);
const useFonts = () => (0, react_1.useContext)(FontContext);
exports.useFonts = useFonts;
function DynamicFontProvider({ children, pdfUrl }) {
    const [fonts, setFonts] = (0, react_1.useState)(defaultFontContext);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!pdfUrl)
            return;
        const extractFontsFromPdf = async () => {
            setIsLoading(true);
            try {
                // Load the PDF document
                const loadingTask = pdfjs.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                // Get the first page
                const page = await pdf.getPage(1);
                // Get the page's font information
                const operatorList = await page.getOperatorList();
                const commonFonts = new Set();
                // Extract font names from the operator list
                for (let i = 0; i < operatorList.fnArray.length; i++) {
                    if (operatorList.fnArray[i] === pdfjs.OPS.setFont) {
                        const fontName = operatorList.argsArray[i][0];
                        if (fontName) {
                            commonFonts.add(fontName);
                        }
                    }
                }
                // Process extracted fonts
                const fontArray = Array.from(commonFonts);
                console.log('Extracted fonts:', fontArray);
                // Map PDF fonts to web fonts
                // This is a simplified mapping - in a real implementation, 
                // you would have a more comprehensive mapping system
                let primaryFont = 'var(--font-source-sans)';
                let secondaryFont = 'var(--font-merriweather)';
                let headingFont = 'var(--font-roboto)';
                // Check for common font families
                const fontString = fontArray.join(' ').toLowerCase();
                if (fontString.includes('arial') || fontString.includes('helvetica')) {
                    primaryFont = 'var(--font-inter)';
                    headingFont = 'var(--font-inter)';
                }
                else if (fontString.includes('times') || fontString.includes('serif')) {
                    primaryFont = 'var(--font-merriweather)';
                    secondaryFont = 'var(--font-source-sans)';
                }
                else if (fontString.includes('calibri') || fontString.includes('segoe')) {
                    primaryFont = 'var(--font-source-sans)';
                }
                // Update the font context
                setFonts({
                    primaryFont,
                    secondaryFont,
                    headingFont,
                    monoFont: 'var(--font-geist-mono)',
                    isLoading: false,
                });
            }
            catch (error) {
                console.error('Error extracting fonts:', error);
                // Fall back to default fonts
                setFonts(defaultFontContext);
            }
            finally {
                setIsLoading(false);
            }
        };
        extractFontsFromPdf();
    }, [pdfUrl]);
    // Apply the fonts to CSS variables
    (0, react_1.useEffect)(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--dynamic-primary-font', fonts.primaryFont);
            document.documentElement.style.setProperty('--dynamic-secondary-font', fonts.secondaryFont);
            document.documentElement.style.setProperty('--dynamic-heading-font', fonts.headingFont);
            document.documentElement.style.setProperty('--dynamic-mono-font', fonts.monoFont);
        }
    }, [fonts]);
    return (<FontContext.Provider value={{ ...fonts, isLoading }}>
      <style jsx global>{`
        :root {
          --font-sans: var(--dynamic-primary-font), ${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          --font-serif: var(--dynamic-secondary-font), ${merriweather.style.fontFamily}, Georgia, Cambria, Times New Roman, Times, serif;
          --font-heading: var(--dynamic-heading-font), ${roboto.style.fontFamily}, var(--font-sans);
          --font-mono: var(--dynamic-mono-font), SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
        }
      `}</style>
      <div className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${sourceSans.variable}`}>
        {children}
      </div>
    </FontContext.Provider>);
}
//# sourceMappingURL=DynamicFontProvider.js.map