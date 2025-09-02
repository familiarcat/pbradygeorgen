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
exports.default = DynamicPDFViewer;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_2 = require("react");
// Create a loading component
function Loading() {
    // Match the header background color
    const headerBgColor = 'rgba(212, 209, 190, 0.95)'; // Ecru background with transparency
    return (<div className="flex justify-center items-center min-h-screen w-full" style={{ backgroundColor: headerBgColor }}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-[#A05A35] border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-[#49423D] text-lg font-medium">Loading PDF viewer...</p>
      </div>
    </div>);
}
// Dynamically import the centered PDF viewer component with no SSR
const CenteredPDFViewer = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require('@/components/CenteredPDFViewer'))), {
    ssr: false,
    loading: Loading,
});
function DynamicPDFViewer() {
    const [pdfUrl, setPdfUrl] = (0, react_1.useState)(null);
    const [pdfName, setPdfName] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            // Get the PDF URL from localStorage
            const storedPdfUrl = localStorage.getItem('currentPdfUrl');
            const storedPdfName = localStorage.getItem('currentPdfName');
            if (storedPdfUrl) {
                setPdfUrl(storedPdfUrl);
                setPdfName(storedPdfName);
            }
            else {
                // If no PDF URL is found, redirect to the home page
                router.push('/');
            }
        }
    }, [router]);
    // If no PDF URL is available yet, show loading
    if (!pdfUrl) {
        return <Loading />;
    }
    return (<div className="w-full h-screen overflow-hidden">
      <react_2.Suspense fallback={<Loading />}>
        <CenteredPDFViewer pdfUrl={pdfUrl} pdfName={pdfName || 'document.pdf'}/>
      </react_2.Suspense>
    </div>);
}
//# sourceMappingURL=DynamicPDFViewer.js.map