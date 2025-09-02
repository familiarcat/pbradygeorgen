"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndRefreshPdfContent = checkAndRefreshPdfContent;
const pdfUtils_1 = require("@/utils/pdfUtils");
const DanteLogger_1 = require("@/utils/DanteLogger");
/**
 * Server action to check if the PDF content needs to be refreshed and refresh it if necessary
 * @returns An object with the refresh status and timestamp
 */
async function checkAndRefreshPdfContent() {
    try {
        const isStale = (0, pdfUtils_1.isPdfContentStale)();
        if (isStale) {
            DanteLogger_1.DanteLogger.success.basic('PDF content is stale, refreshing...');
            const success = await (0, pdfUtils_1.refreshPdfContent)();
            return {
                refreshed: success,
                timestamp: Date.now(),
                message: success ? 'PDF content refreshed successfully' : 'Failed to refresh PDF content'
            };
        }
        else {
            DanteLogger_1.DanteLogger.success.basic('PDF content is up to date');
            return {
                refreshed: false,
                timestamp: Date.now(),
                message: 'PDF content is already up to date'
            };
        }
    }
    catch (error) {
        console.error('Error in checkAndRefreshPdfContent:', error);
        DanteLogger_1.DanteLogger.error.system('Error checking/refreshing PDF content', { error });
        return {
            refreshed: false,
            timestamp: Date.now(),
            message: 'Error checking/refreshing PDF content',
            error: String(error)
        };
    }
}
//# sourceMappingURL=actions.js.map