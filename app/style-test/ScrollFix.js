"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollFix;
const react_1 = require("react");
function ScrollFix() {
    (0, react_1.useEffect)(() => {
        // Force the body to be scrollable
        document.body.style.overflow = 'auto';
        // Force the html element to be scrollable
        document.documentElement.style.overflow = 'auto';
        // Force the style-test container to be scrollable
        const styleTestContainer = document.querySelector('.style-test-container');
        if (styleTestContainer) {
            styleTestContainer.style.overflow = 'auto';
            styleTestContainer.style.height = 'auto';
            styleTestContainer.style.minHeight = '100vh';
        }
        return () => {
            // Clean up when component unmounts
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);
    return null;
}
//# sourceMappingURL=ScrollFix.js.map