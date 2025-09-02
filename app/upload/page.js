"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UploadPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const PDFUploader_1 = __importDefault(require("@/components/PDFUploader"));
const link_1 = __importDefault(require("next/link"));
const StylesLoadingIndicator_1 = __importDefault(require("@/components/StylesLoadingIndicator"));
const Navigation_1 = __importDefault(require("@/components/Navigation"));
function UploadPage() {
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const [uploadSuccess, setUploadSuccess] = (0, react_1.useState)(false);
    const [pdfUrl, setPdfUrl] = (0, react_1.useState)(null);
    const router = (0, navigation_1.useRouter)();
    const handlePdfUploaded = (url, fileName) => {
        setPdfUrl(url);
        setUploadSuccess(true);
        // Store the PDF URL in localStorage for use in the viewer
        localStorage.setItem('currentPdfUrl', url);
        localStorage.setItem('currentPdfName', fileName);
        // Redirect to the viewer after a short delay
        setTimeout(() => {
            router.push('/view');
        }, 1500);
    };
    return (<div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary, #f5f5f5)]">
      <Navigation_1.default />
      <StylesLoadingIndicator_1.default />
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-primary, #333)]">
          Upload Your Resume PDF
        </h1>

        <p className="mb-8 text-center text-[var(--text-secondary, #666)]">
          Upload a resume PDF to analyze its content and generate downloadable formats.
        </p>

        {!uploadSuccess ? (<PDFUploader_1.default onPdfUploaded={handlePdfUploaded} className="mb-6"/>) : (<div className="text-center p-6 bg-[var(--state-success-light, #e6f7e6)] rounded-lg mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--state-success, #28a745)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-lg font-medium text-[var(--text-primary, #333)]">
              PDF uploaded successfully!
            </p>
            <p className="text-[var(--text-secondary, #666)] mt-2">
              Redirecting to viewer...
            </p>
          </div>)}

        <div className="flex justify-center space-x-4">
          <link_1.default href="/" className="px-4 py-2 text-[var(--text-tertiary, #999)] hover:text-[var(--text-secondary, #666)] transition-colors">
            Back to Home
          </link_1.default>

          {pdfUrl && (<link_1.default href="/view" className="px-4 py-2 bg-[var(--cta-primary, #0070f3)] text-white rounded hover:bg-[var(--cta-primary-dark, #0051a8)] transition-colors">
              View PDF
            </link_1.default>)}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map