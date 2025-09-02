"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceSans = exports.merriweather = exports.roboto = exports.inter = void 0;
const google_1 = require("next/font/google");
// Main sans-serif font for UI elements
exports.inter = (0, google_1.Inter)({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});
// Primary font for headings
exports.roboto = (0, google_1.Roboto)({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});
// Serif font for content (similar to PDF content)
exports.merriweather = (0, google_1.Merriweather)({
    weight: ['300', '400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-merriweather',
});
// Sans-serif font for resume content (similar to PDF content)
exports.sourceSans = (0, google_1.Source_Sans_3)({
    weight: ['300', '400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-source-sans',
});
//# sourceMappingURL=fonts.js.map