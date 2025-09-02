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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientSideVariables;
const react_1 = __importStar(require("react"));
function ClientSideVariables() {
    const [cssVars, setCssVars] = (0, react_1.useState)({
        primary: '',
        secondary: '',
        accent: '',
        background: '',
        text: '',
        textSecondary: '',
        border: '',
        ctaPrimary: '',
        ctaSecondary: '',
        hoverBg: '',
        activeBg: '',
        headingFont: '',
        bodyFont: '',
        monoFont: '',
        buttonFont: '',
    });
    (0, react_1.useEffect)(() => {
        // This code only runs in the browser
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setCssVars({
            primary: computedStyle.getPropertyValue('--pdf-primary-color').trim(),
            secondary: computedStyle.getPropertyValue('--pdf-secondary-color').trim(),
            accent: computedStyle.getPropertyValue('--pdf-accent-color').trim(),
            background: computedStyle.getPropertyValue('--pdf-background-color').trim(),
            text: computedStyle.getPropertyValue('--pdf-text-color').trim(),
            textSecondary: computedStyle.getPropertyValue('--pdf-text-secondary').trim(),
            border: computedStyle.getPropertyValue('--pdf-border-color').trim(),
            ctaPrimary: computedStyle.getPropertyValue('--cta-primary-bg').trim(),
            ctaSecondary: computedStyle.getPropertyValue('--cta-secondary-bg').trim(),
            hoverBg: computedStyle.getPropertyValue('--hover-bg').trim(),
            activeBg: computedStyle.getPropertyValue('--active-bg').trim(),
            headingFont: computedStyle.getPropertyValue('--pdf-heading-font').trim(),
            bodyFont: computedStyle.getPropertyValue('--pdf-body-font').trim(),
            monoFont: computedStyle.getPropertyValue('--pdf-mono-font').trim(),
            buttonFont: computedStyle.getPropertyValue('--font-button').trim(),
        });
    }, []);
    return (<div className="mt-8 p-4 rounded" style={{ backgroundColor: 'var(--pdf-info-color, #17a2b8)', color: '#fff' }}>
      <h3 className="font-bold mb-2">Current CSS Variables</h3>
      <pre className="text-xs overflow-auto" style={{ maxHeight: '300px' }}>
        {`
/* Color Variables */
--pdf-primary-color: ${cssVars.primary}
--pdf-secondary-color: ${cssVars.secondary}
--pdf-accent-color: ${cssVars.accent}
--pdf-background-color: ${cssVars.background}
--pdf-text-color: ${cssVars.text}
--pdf-text-secondary: ${cssVars.textSecondary}
--pdf-border-color: ${cssVars.border}

/* CTA Variables */
--cta-primary-bg: ${cssVars.ctaPrimary}
--cta-secondary-bg: ${cssVars.ctaSecondary}
--hover-bg: ${cssVars.hoverBg}
--active-bg: ${cssVars.activeBg}

/* Font Variables */
--pdf-heading-font: ${cssVars.headingFont}
--pdf-body-font: ${cssVars.bodyFont}
--pdf-mono-font: ${cssVars.monoFont}
--font-button: ${cssVars.buttonFont}
`}
      </pre>
    </div>);
}
//# sourceMappingURL=ClientSideVariables.js.map