"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SamplePage;
const PDFViewerWrapper_1 = __importDefault(require("@/components/PDFViewerWrapper"));
function SamplePage() {
    return (<div className="w-full h-screen overflow-hidden">
      <PDFViewerWrapper_1.default />
    </div>);
}
//# sourceMappingURL=page.js.map