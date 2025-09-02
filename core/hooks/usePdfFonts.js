"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePdfFonts;
const react_1 = require("react");
function usePdfFonts(pdfUrl) {
    const [fonts, setFonts] = (0, react_1.useState)({
        primaryFont: 'var(--font-source-sans)',
        secondaryFont: 'var(--font-merriweather)',
        headingFont: 'var(--font-roboto)',
        monoFont: 'var(--font-geist-mono)',
        isLoading: true,
    });
    (0, react_1.useEffect)(() => {
        // In a real implementation, this would use PDF.js to extract fonts
        // For now, we'll simulate font detection based on the PDF URL
        const detectFonts = async () => {
            try {
                // Simulate API call to analyze PDF
                await new Promise(resolve => setTimeout(resolve, 500));
                // For demo purposes, we'll use different fonts based on the PDF filename
                const filename = pdfUrl.split('/').pop()?.toLowerCase() || '';
                let primaryFont = 'var(--font-source-sans)';
                let secondaryFont = 'var(--font-merriweather)';
                let headingFont = 'var(--font-roboto)';
                if (filename.includes('resume')) {
                    // Resume-like documents often use clean sans-serif fonts
                    primaryFont = 'var(--font-source-sans)';
                    headingFont = 'var(--font-roboto)';
                }
                else if (filename.includes('report') || filename.includes('paper')) {
                    // Academic papers often use serif fonts
                    primaryFont = 'var(--font-merriweather)';
                    secondaryFont = 'var(--font-source-sans)';
                }
                else if (filename.includes('presentation')) {
                    // Presentations often use modern sans-serif fonts
                    primaryFont = 'var(--font-inter)';
                    headingFont = 'var(--font-inter)';
                }
                setFonts({
                    primaryFont,
                    secondaryFont,
                    headingFont,
                    monoFont: 'var(--font-geist-mono)',
                    isLoading: false,
                });
            }
            catch (error) {
                console.error('Error detecting fonts:', error);
                setFonts(prev => ({ ...prev, isLoading: false }));
            }
        };
        detectFonts();
    }, [pdfUrl]);
    return fonts;
}
//# sourceMappingURL=usePdfFonts.js.map