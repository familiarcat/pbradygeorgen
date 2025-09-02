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
exports.default = PDFViewerWrapper;
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = require("react");
const actions_1 = require("../../app/actions");
const DanteLogger_1 = require("@/utils/DanteLogger");
// Create a loading component
function Loading() {
    return (<div className="flex justify-center items-center min-h-screen w-full" style={{ backgroundColor: 'var(--bg-primary, rgba(212, 209, 190, 0.95))' }}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-[var(--primary, #A05A35)] border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-color, #49423D)] text-lg font-medium">Loading PDF viewer...</p>
      </div>
    </div>);
}
// Dynamically import the simple PDF viewer component with no SSR
const SimplePDFViewer = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require('@/components/SimplePDFViewer'))), {
    ssr: false,
    loading: Loading,
});
function PDFViewerWrapper() {
    const [refreshTimestamp, setRefreshTimestamp] = (0, react_1.useState)(Date.now());
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(true);
    // Check if PDF content needs to be refreshed on page load
    (0, react_1.useEffect)(() => {
        async function refreshIfNeeded() {
            try {
                setIsRefreshing(true);
                const result = await (0, actions_1.checkAndRefreshPdfContent)();
                if (result.refreshed) {
                    // If content was refreshed, update the timestamp to trigger a re-render
                    setRefreshTimestamp(result.timestamp);
                    console.log('PDF content refreshed automatically:', result.message);
                }
                else {
                    console.log('PDF content check:', result.message);
                }
            }
            catch (error) {
                console.error('Error checking PDF content:', error);
                DanteLogger_1.DanteLogger.error.system('Error in automatic PDF refresh', { error });
            }
            finally {
                setIsRefreshing(false);
            }
        }
        refreshIfNeeded();
    }, []);
    return (<div className="w-full h-screen overflow-hidden">
      <react_1.Suspense fallback={<Loading />}>
        {isRefreshing ? (<Loading />) : (<SimplePDFViewer key={refreshTimestamp}/>)}
      </react_1.Suspense>
    </div>);
}
//# sourceMappingURL=PDFViewerWrapper.js.map