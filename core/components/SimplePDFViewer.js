"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimplePDFViewer;
const react_1 = require("react");
const CenteredPDFViewer_1 = __importDefault(require("./CenteredPDFViewer"));
function SimplePDFViewer() {
    // Generate a timestamp for cache-busting
    const timestamp = Date.now();
    // PDF URL state with cache-busting query parameter
    const [pdfUrl, setPdfUrl] = (0, react_1.useState)(`/pbradygeorgen_resume.pdf?v=${timestamp}`);
    const [pdfName, setPdfName] = (0, react_1.useState)('pbradygeorgen_resume');
    return (<CenteredPDFViewer_1.default pdfUrl={pdfUrl} pdfName={pdfName}/>);
}
//# sourceMappingURL=SimplePDFViewer.js.map