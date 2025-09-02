"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotFound;
const link_1 = __importDefault(require("next/link"));
function NotFound() {
    return (<div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#D4D1BE' }}>
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <link_1.default href="/" className="px-4 py-2 bg-amber-800 text-white hover:bg-amber-900 rounded-md transition-colors text-sm font-medium shadow-md">
        Return Home
      </link_1.default>
    </div>);
}
//# sourceMappingURL=not-found.js.map