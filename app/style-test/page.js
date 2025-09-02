"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StyleTestPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const ClientSideVariables_1 = __importDefault(require("./ClientSideVariables"));
const ScrollFix_1 = __importDefault(require("./ScrollFix"));
const SalingerHeader_1 = __importDefault(require("@/components/SalingerHeader"));
const DynamicThemeProvider_1 = __importDefault(require("@/components/DynamicThemeProvider"));
const DanteLogger_1 = require("@/utils/DanteLogger");
function StyleTestPage() {
    const [pdfUrl, setPdfUrl] = (0, react_1.useState)('/resume_redesign.pdf');
    const [pdfName, setPdfName] = (0, react_1.useState)('resume_redesign.pdf');
    // Load PDF URL from localStorage if available
    (0, react_1.useEffect)(() => {
        const storedPdfUrl = localStorage.getItem('currentPdfUrl');
        const storedPdfName = localStorage.getItem('currentPdfName');
        if (storedPdfUrl) {
            setPdfUrl(storedPdfUrl);
        }
        if (storedPdfName) {
            setPdfName(storedPdfName);
        }
        DanteLogger_1.DanteLogger.success.basic('Style Test Page loaded', { pdfUrl, pdfName });
    }, []);
    // Mock handlers for SalingerHeader
    const handleDownload = () => {
        DanteLogger_1.DanteLogger.success.ux('Download clicked in Style Test');
    };
    const handleViewSummary = () => {
        DanteLogger_1.DanteLogger.success.ux('View Summary clicked in Style Test');
    };
    const handleContact = () => {
        DanteLogger_1.DanteLogger.success.ux('Contact clicked in Style Test');
    };
    const handleUpload = () => {
        DanteLogger_1.DanteLogger.success.ux('Upload clicked in Style Test');
    };
    return (<DynamicThemeProvider_1.default pdfUrl={pdfUrl}>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary, #f6f6f6)' }}>
        <SalingerHeader_1.default onDownload={handleDownload} onViewSummary={handleViewSummary} onContact={handleContact} onUpload={handleUpload} fileName={pdfName}/>

        <div className="p-8 style-test-container">
          <ScrollFix_1.default />
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-color, #333333)', fontFamily: 'var(--font-heading, sans-serif)' }}>
            PDF-Driven Styling Test
          </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--pdf-primary-color, #3a6ea5)', fontFamily: 'var(--font-heading, sans-serif)' }}>
          Typography
        </h2>
        <h1 style={{
            fontFamily: 'var(--pdf-heading-font, sans-serif)',
            color: 'var(--text-color, #333333)',
            marginBottom: '0.5rem'
        }}>
          Heading 1 with PDF Font
        </h1>
        <h2 style={{
            fontFamily: 'var(--pdf-heading-font, sans-serif)',
            color: 'var(--text-color, #333333)',
            marginBottom: '0.5rem'
        }}>
          Heading 2 with PDF Font
        </h2>
        <p style={{
            fontFamily: 'var(--pdf-body-font, serif)',
            color: 'var(--text-color, #333333)',
            marginBottom: '1rem'
        }}>
          This paragraph uses the body font extracted from the PDF.
          The text should be styled according to the PDF's typography.
          All text elements in the application should use these theme variables for consistent styling.
        </p>
        <code style={{
            fontFamily: 'var(--pdf-mono-font, monospace)',
            backgroundColor: 'var(--bg-secondary, #ebebeb)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            color: 'var(--text-color, #333333)'
        }}>
          This code block uses the monospace font from the PDF.
        </code>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--pdf-primary-color, #3a6ea5)', fontFamily: 'var(--font-heading, sans-serif)' }}>
          Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--pdf-primary-color, #3a6ea5)', color: 'var(--pdf-primary-contrast, #ffffff)' }}>
            --pdf-primary-color
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--pdf-secondary-color, #004e98)', color: 'var(--pdf-secondary-contrast, #ffffff)' }}>
            --pdf-secondary-color
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--pdf-accent-color, #ff6700)', color: 'var(--pdf-accent-contrast, #000000)' }}>
            --pdf-accent-color
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--pdf-background-color, #f6f6f6)', color: 'var(--pdf-text-color, #333333)', border: '1px solid var(--pdf-border-color, #dddddd)' }}>
            --pdf-background-color
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--bg-primary, #ffffff)', color: 'var(--text-color, #333333)', border: '1px solid var(--border-color, #dddddd)' }}>
            --text-color
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--bg-primary, #ffffff)', color: 'var(--text-secondary, #666666)', border: '1px solid var(--border-color, #dddddd)' }}>
            --text-secondary
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))', color: 'var(--text-color, #333333)' }}>
            --cta-primary-bg
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--hover-bg, rgba(126, 78, 45, 0.15))', color: 'var(--text-color, #333333)' }}>
            --hover-bg
          </div>
          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: 'var(--active-bg, rgba(126, 78, 45, 0.2))', color: 'var(--text-color, #333333)' }}>
            --active-bg
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--pdf-primary-color, #3a6ea5)', fontFamily: 'var(--font-heading, sans-serif)' }}>
          UI Elements
        </h2>
        <div className="space-y-4">
          <div>
            <button className="mr-2 mb-2 px-4 py-2 rounded transition-all" style={{
            backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))',
            color: 'var(--text-color, #333333)',
            fontFamily: 'var(--font-button, sans-serif)',
            border: '1px solid transparent'
        }}>
              Primary Button (CTA Style)
            </button>
            <button className="mr-2 mb-2 px-4 py-2 rounded transition-all" style={{
            backgroundColor: 'var(--pdf-secondary-color, #004e98)',
            color: 'var(--pdf-secondary-contrast, #ffffff)',
            fontFamily: 'var(--font-button, sans-serif)'
        }}>
              Secondary Button
            </button>
            <button className="mr-2 mb-2 px-4 py-2 rounded transition-all" style={{
            backgroundColor: 'var(--pdf-accent-color, #ff6700)',
            color: 'var(--pdf-accent-contrast, #000000)',
            fontFamily: 'var(--font-button, sans-serif)'
        }}>
              Accent Button
            </button>
          </div>

          <div>
            <input type="text" placeholder="Input with PDF styling" className="mr-2 mb-2 p-2 rounded" style={{
            border: '1px solid var(--pdf-border-color, #dddddd)',
            fontFamily: 'var(--pdf-body-font, serif)',
            color: 'var(--text-color, #333333)',
            backgroundColor: 'var(--bg-primary, #ffffff)'
        }}/>
          </div>

          <div className="p-4 rounded" style={{
            backgroundColor: 'var(--bg-primary, #ffffff)',
            boxShadow: 'var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))',
            border: '1px solid var(--border-color, #dddddd)'
        }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--text-color, #333333)', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Card with PDF Styling
            </h3>
            <p style={{ color: 'var(--text-secondary, #666666)', fontFamily: 'var(--font-body, serif)' }}>
              This card uses background, shadow, and border colors from the PDF.
              All components in the application should use these theme variables for consistent styling.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <link_1.default href="/" className="hover:underline" style={{ color: 'var(--cta-primary, #7E4E2D)' }}>
          Back to Home
        </link_1.default>
      </div>

      <ClientSideVariables_1.default />
        </div>
      </div>
    </DynamicThemeProvider_1.default>);
}
//# sourceMappingURL=page.js.map