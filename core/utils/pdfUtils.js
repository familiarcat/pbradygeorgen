"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdfLastModifiedTime = getPdfLastModifiedTime;
exports.getExtractedContentLastModifiedTime = getExtractedContentLastModifiedTime;
exports.isPdfContentStale = isPdfContentStale;
exports.refreshPdfContent = refreshPdfContent;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const DanteLogger_1 = require("./DanteLogger");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Get the last modified time of the default PDF file
 * @returns The last modified time as a Date object
 */
function getPdfLastModifiedTime() {
    try {
        const pdfPath = path_1.default.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
        const stats = fs_1.default.statSync(pdfPath);
        return stats.mtime;
    }
    catch (error) {
        console.error('Error getting PDF last modified time:', error);
        return null;
    }
}
/**
 * Get the last modified time of the extracted content
 * @returns The last modified time as a Date object
 */
function getExtractedContentLastModifiedTime() {
    try {
        const extractedPath = path_1.default.join(process.cwd(), 'public', 'extracted', 'resume_content.md');
        if (!fs_1.default.existsSync(extractedPath)) {
            return null;
        }
        const stats = fs_1.default.statSync(extractedPath);
        return stats.mtime;
    }
    catch (error) {
        console.error('Error getting extracted content last modified time:', error);
        return null;
    }
}
/**
 * Check if the PDF content needs to be refreshed
 * @returns True if the PDF is newer than the extracted content, false otherwise
 */
function isPdfContentStale() {
    const pdfTime = getPdfLastModifiedTime();
    const extractedTime = getExtractedContentLastModifiedTime();
    if (!pdfTime) {
        return false; // Can't determine PDF time, assume it's not stale
    }
    if (!extractedTime) {
        return true; // No extracted content, need to extract
    }
    // Compare timestamps - if PDF is newer, content is stale
    return pdfTime > extractedTime;
}
/**
 * Refresh the PDF content by extracting it again
 * @returns A promise that resolves when the extraction is complete
 */
async function refreshPdfContent() {
    try {
        const pdfPath = path_1.default.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
        // Create the extracted directory if it doesn't exist
        const extractedDir = path_1.default.join(process.cwd(), 'public', 'extracted');
        if (!fs_1.default.existsSync(extractedDir)) {
            fs_1.default.mkdirSync(extractedDir, { recursive: true });
        }
        // Run the extraction script
        await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);
        DanteLogger_1.DanteLogger.success.core('PDF content refreshed automatically');
        return true;
    }
    catch (error) {
        console.error('Error refreshing PDF content:', error);
        DanteLogger_1.DanteLogger.error.system('Error refreshing PDF content', { error });
        return false;
    }
}
//# sourceMappingURL=pdfUtils.js.map