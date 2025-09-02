"use strict";
/**
 * PDF Colors API Route
 *
 * This API route returns the color theme extracted from a PDF.
 *
 * Philosophical Framework:
 * - Dante: Methodical logging of the API process
 * - Hesse: Mathematical precision in color extraction
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
const defaultColorTheme = {
    primary: '#3a6ea5',
    secondary: '#004e98',
    accent: '#ff6700',
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#333333',
    border: '#dddddd',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    isLoading: false
};
async function GET(request) {
    try {
        // Get the PDF URL from the query parameters
        const { searchParams } = new URL(request.url);
        const pdfUrl = searchParams.get('pdfUrl');
        if (!pdfUrl) {
            DanteLogger_1.DanteLogger.error.validation('No PDF URL provided in colors request');
            return server_1.NextResponse.json({ success: false, error: 'No PDF URL provided' }, { status: 400 });
        }
        // Extract the PDF filename from the URL
        const pdfFilename = pdfUrl.split('/').pop();
        // Try to load the color theme from the extracted directory
        const colorTheoryPath = path_1.default.join(process.cwd(), 'public', 'extracted', 'color_theory.json');
        if ((0, fs_1.existsSync)(colorTheoryPath)) {
            try {
                // Read the color theory file
                const colorTheoryData = await promises_1.default.readFile(colorTheoryPath, 'utf8');
                const colorTheme = JSON.parse(colorTheoryData);
                DanteLogger_1.DanteLogger.success.basic('Color theme loaded from file');
                return server_1.NextResponse.json({
                    success: true,
                    ...colorTheme,
                    isLoading: false
                });
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.dataFlow('Error reading color theory file', { error });
            }
        }
        // If we couldn't load the color theme, return the default
        DanteLogger_1.DanteLogger.success.basic('Color theme not found, using default');
        return server_1.NextResponse.json({
            success: true,
            ...defaultColorTheme,
            isLoading: false
        });
    }
    catch (error) {
        DanteLogger_1.DanteLogger.error.system('Error in PDF colors API', { error });
        return server_1.NextResponse.json({ success: false, error: 'Failed to get PDF colors' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map