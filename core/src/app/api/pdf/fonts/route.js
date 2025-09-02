"use strict";
/**
 * PDF Fonts API Route
 *
 * This API route returns the font theme extracted from a PDF.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the API process
 * - Hesse: Mathematical precision in font extraction
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const DanteLogger_1 = require("@/utils/DanteLogger");
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const defaultFontTheme = {
    heading: "'Arial', sans-serif",
    body: "'Helvetica', Arial, sans-serif",
    mono: "'Courier New', monospace",
    allFonts: ['Arial', 'Helvetica', 'Courier New']
};
async function GET(request) {
    try {
        // Get the PDF URL from the query parameters
        const { searchParams } = new URL(request.url);
        const pdfUrl = searchParams.get('pdfUrl');
        if (!pdfUrl) {
            DanteLogger_1.DanteLogger.error.validation('No PDF URL provided in fonts request');
            return server_1.NextResponse.json({ success: false, error: 'No PDF URL provided' }, { status: 400 });
        }
        // Extract the PDF filename from the URL
        const pdfFilename = pdfUrl.split('/').pop();
        // Try to load the font theme from the extracted directory
        const fontTheoryPath = path_1.default.join(process.cwd(), 'public', 'extracted', 'font_theory.json');
        if ((0, fs_1.existsSync)(fontTheoryPath)) {
            try {
                // Read the font theory file
                const fontTheoryData = await promises_1.default.readFile(fontTheoryPath, 'utf8');
                const fontTheme = JSON.parse(fontTheoryData);
                DanteLogger_1.DanteLogger.success.basic('Font theme loaded from file');
                return server_1.NextResponse.json({
                    success: true,
                    ...fontTheme
                });
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.dataFlow('Error reading font theory file', { error });
            }
        }
        // If we couldn't load the font theme, return the default
        DanteLogger_1.DanteLogger.success.basic('Font theme not found, using default');
        return server_1.NextResponse.json({
            success: true,
            ...defaultFontTheme
        });
    }
    catch (error) {
        DanteLogger_1.DanteLogger.error.system('Error in PDF fonts API', { error });
        return server_1.NextResponse.json({ success: false, error: 'Failed to get PDF fonts' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map