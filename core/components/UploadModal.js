"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UploadModal;
const react_1 = require("react");
const DanteLogger_1 = require("@/utils/DanteLogger");
function UploadModal({ isOpen, onClose, onPdfUploaded }) {
    const [uploadSuccess, setUploadSuccess] = (0, react_1.useState)(false);
    const modalRef = (0, react_1.useRef)(null);
    // Handle click outside to close the modal
    (0, react_1.useEffect)(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Restore scrolling when modal is closed
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);
    // Handle escape key to close the modal
    (0, react_1.useEffect)(() => {
        function handleEscapeKey(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);
    const handlePdfUploaded = (url, fileName) => {
        setUploadSuccess(true);
        DanteLogger_1.DanteLogger.success.ux('PDF uploaded successfully', { fileName });
        // Call the parent callback
        onPdfUploaded(url, fileName);
        // Close the modal after a short delay
        setTimeout(() => {
            onClose();
            // Reset the success state after the modal is closed
            setTimeout(() => setUploadSuccess(false), 300);
        }, 1500);
    };
    // Feature temporarily disabled
    return null;
    /* Original implementation updated with theme variables:
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
           style={{ backgroundColor: 'var(--pdf-modal-overlay, rgba(0, 0, 0, 0.5))' }}>
        <div
          ref={modalRef}
          className="rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-primary, #ffffff)',
            color: 'var(--text-color, #333333)',
            border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))',
            boxShadow: 'var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        */
}
//# sourceMappingURL=UploadModal.js.map