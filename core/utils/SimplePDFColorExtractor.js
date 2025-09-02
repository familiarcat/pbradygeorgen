"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultColorTheme = void 0;
exports.extractColorsFromPDF = extractColorsFromPDF;
const DanteLogger_1 = require("./DanteLogger");
const HesseColorTheory_1 = __importDefault(require("./HesseColorTheory"));
// Default color theme (our Salinger-inspired earth tones)
exports.defaultColorTheme = {
    primary: '#7E6233', // coyote
    secondary: '#5F6B54', // ebony
    accent: '#7E4E2D', // terracotta
    background: '#F5F1E0', // parchment
    text: '#3A4535', // dark forest
    border: '#D5CDB5', // light border
    isDark: false,
    isLoading: false,
    rawColors: []
};
// Extract colors from PDF and apply Hesse color theory
async function extractColorsFromPDF(pdfUrl) {
    try {
        // This is a simplified version that just returns the default theme
        // In production, we would use PDF.js to extract colors
        DanteLogger_1.DanteLogger.success.basic(`Extracting colors from PDF: ${pdfUrl}`);
        // Generate CTA colors using Hesse's mathematical approach
        const ctaColors = HesseColorTheory_1.default.generateSalingerCtaColors(exports.defaultColorTheme.primary);
        // Analyze and log color contrast information using Dante
        HesseColorTheory_1.default.analyzeColorContrast(ctaColors);
        // Return the theme with CTA colors
        return {
            ...exports.defaultColorTheme,
            isLoading: false,
            ctaColors
        };
    }
    catch (error) {
        DanteLogger_1.DanteLogger.error.runtime(`Failed to extract colors from PDF: ${error}`);
        return { ...exports.defaultColorTheme, isLoading: false };
    }
}
//# sourceMappingURL=SimplePDFColorExtractor.js.map