"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewPage;
const DynamicPDFViewer_1 = __importDefault(require("@/components/DynamicPDFViewer"));
function ViewPage() {
    return (<div className="w-full h-screen overflow-hidden">
      <DynamicPDFViewer_1.default />
    </div>);
}
//# sourceMappingURL=page.js.map