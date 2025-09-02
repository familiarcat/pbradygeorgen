"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePdfTheme;
const react_1 = require("react");
const SimplePDFColorExtractor_1 = require("@/utils/SimplePDFColorExtractor");
function usePdfTheme(pdfUrl) {
    const [colorTheme, setColorTheme] = (0, react_1.useState)({
        ...SimplePDFColorExtractor_1.defaultColorTheme,
        isLoading: true
    });
    (0, react_1.useEffect)(() => {
        if (!pdfUrl)
            return;
        const extractColors = async () => {
            try {
                // Extract colors from the PDF
                const extractedTheme = await (0, SimplePDFColorExtractor_1.extractColorsFromPDF)(pdfUrl);
                setColorTheme(extractedTheme);
            }
            catch (error) {
                console.error('Error in usePdfTheme:', error);
                setColorTheme({ ...SimplePDFColorExtractor_1.defaultColorTheme, isLoading: false });
            }
        };
        extractColors();
    }, [pdfUrl]);
    return colorTheme;
}
//# sourceMappingURL=usePdfTheme.js.map