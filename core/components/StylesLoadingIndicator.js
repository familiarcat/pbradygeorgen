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
exports.default = StylesLoadingIndicator;
const react_1 = __importStar(require("react"));
function StylesLoadingIndicator({ message = 'Loading PDF styles...' }) {
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        // Check if styles are already loaded
        if (document.body.classList.contains('pdf-styles-loaded')) {
            setIsVisible(false);
            return;
        }
        // Listen for the styles loaded event
        const handleStylesLoaded = () => {
            // Add a small delay for the animation
            setTimeout(() => {
                setIsVisible(false);
            }, 500);
        };
        document.addEventListener('pdf-styles-loaded', handleStylesLoaded);
        return () => {
            document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
        };
    }, []);
    if (!isVisible)
        return null;
    return (<div className="styles-loading-indicator">
      <div className="spinner"></div>
      <p>{message}</p>
      <style jsx>{`
        .styles-loading-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.9);
          z-index: 9999;
          transition: opacity 0.5s ease;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: var(--pdf-primary-color, #3a6ea5);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        p {
          font-family: var(--pdf-body-font, Arial, sans-serif);
          color: var(--pdf-text-color, #333333);
          font-size: 1rem;
          margin: 0;
        }
      `}</style>
    </div>);
}
//# sourceMappingURL=StylesLoadingIndicator.js.map