"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const StyleDebugger_1 = __importDefault(require("@/components/StyleDebugger"));
const DanteLogger_1 = require("@/utils/DanteLogger");
/**
 * StyleDebugPage
 *
 * This page displays the StyleDebugger component, which shows all CSS variables
 * currently set on the :root element. It's useful for debugging styling issues
 * and ensuring that all variables are being set correctly.
 */
const StyleDebugPage = () => {
    // Log that the page is being accessed
    react_1.default.useEffect(() => {
        DanteLogger_1.DanteLogger.success.basic('Style Debug Page accessed');
    }, []);
    return (<div style={{ padding: '20px' }}>
      <h1 style={{
            fontFamily: 'var(--font-heading, sans-serif)',
            marginBottom: '20px',
            color: 'var(--text-color, #333)'
        }}>
        AlexAI Style Debugging
      </h1>
      
      <p style={{
            fontFamily: 'var(--font-body, sans-serif)',
            marginBottom: '20px',
            color: 'var(--text-color, #333)',
            maxWidth: '800px',
            lineHeight: '1.6'
        }}>
        This page shows all CSS variables currently set on the :root element, grouped by category.
        It helps debug styling issues by showing which variables are being set and what their values are.
        If PDF-extracted styles are not applying correctly, you can use this page to see if the variables
        are being set correctly.
      </p>
      
      <div style={{
            padding: '15px',
            backgroundColor: 'var(--bg-secondary, #f5f5f5)',
            borderRadius: '4px',
            marginBottom: '30px',
            border: '1px solid var(--border-color, #ddd)'
        }}>
        <h2 style={{
            fontFamily: 'var(--font-heading, sans-serif)',
            marginBottom: '10px',
            color: 'var(--text-color, #333)',
            fontSize: '1.2rem'
        }}>
          How to use this page
        </h2>
        
        <ul style={{
            fontFamily: 'var(--font-body, sans-serif)',
            color: 'var(--text-color, #333)',
            paddingLeft: '20px',
            lineHeight: '1.6'
        }}>
          <li>Look for variables with empty or unexpected values</li>
          <li>Check if variables with multiple naming conventions (--pdf-*, --dynamic-*, etc.) have consistent values</li>
          <li>Use the filter to search for specific variables</li>
          <li>Color variables show a color preview swatch</li>
        </ul>
      </div>
      
      <StyleDebugger_1.default />
    </div>);
};
exports.default = StyleDebugPage;
//# sourceMappingURL=page.js.map