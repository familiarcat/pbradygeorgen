/**
 * PreviewModal Component
 *
 * This component displays a preview of content in different formats (PDF, Markdown, Text)
 * and provides download functionality.
 */

class PreviewModal {
  constructor() {
    this.isOpen = false;
    this.content = '';
    this.format = 'markdown';
    this.fileName = '';
    this.position = 'center';
    this.pdfDataUrl = null;
    this.pdfSource = null;
  }

  /**
   * Initialize the modal with configuration
   */
  init(config) {
    this.content = config.content || '';
    this.format = config.format || 'markdown';
    this.fileName = config.fileName || 'document';
    this.position = config.position || 'center';
    this.pdfDataUrl = config.pdfDataUrl || null;
    this.pdfSource = config.pdfSource || null;
    this.onClose = config.onClose || (() => this.close());
    this.onDownload = config.onDownload || (() => this.download());

    // Create modal elements if they don't exist
    if (!document.getElementById('preview-modal-overlay')) {
      this.createModalElements();
    }

    return this;
  }

  /**
   * Create the modal DOM elements
   */
  createModalElements() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'preview-modal-overlay';
    overlay.className = 'preview-modal-overlay';
    overlay.style.display = 'none';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.id = 'preview-modal-content';
    modalContent.className = 'preview-modal-content';

    // Create header
    const header = document.createElement('div');
    header.className = 'preview-modal-header';

    const title = document.createElement('h2');
    title.id = 'preview-modal-title';
    title.className = 'preview-modal-title';

    const closeButton = document.createElement('button');
    closeButton.className = 'preview-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create body
    const body = document.createElement('div');
    body.id = 'preview-modal-body';
    body.className = 'preview-modal-body';

    // Create footer
    const footer = document.createElement('div');
    footer.className = 'preview-modal-footer';

    const downloadButton = document.createElement('button');
    downloadButton.id = 'preview-modal-download';
    downloadButton.className = 'preview-modal-download';
    downloadButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="preview-modal-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span id="preview-modal-download-text">Download</span>
    `;
    downloadButton.onclick = () => this.download();

    const cancelButton = document.createElement('button');
    cancelButton.className = 'preview-modal-cancel';
    cancelButton.textContent = 'Close';
    cancelButton.onclick = () => this.close();

    footer.appendChild(downloadButton);
    footer.appendChild(cancelButton);

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);

    overlay.appendChild(modalContent);
    document.body.appendChild(overlay);

    // Add styles
    this.addStyles();

    // Add event listeners
    this.addEventListeners();
  }

  /**
   * Add CSS styles for the modal
   */
  addStyles() {
    if (document.getElementById('preview-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'preview-modal-styles';
    style.textContent = `
      .preview-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .preview-modal-content {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 80%;
        max-width: 800px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .preview-modal-content.modal-left {
        margin-right: auto;
        margin-left: 5%;
      }

      .preview-modal-content.modal-right {
        margin-left: auto;
        margin-right: 5%;
      }

      .preview-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: rgba(212, 209, 190, 0.95);
        color: #49423D;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .preview-modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .preview-modal-close {
        font-size: 1.5rem;
        cursor: pointer;
        background: none;
        border: none;
        color: #49423D;
        transition: color 0.2s;
      }

      .preview-modal-close:hover {
        color: #000;
      }

      .preview-modal-body {
        padding: 1rem;
        overflow-y: auto;
        flex: 1;
      }

      .preview-modal-markdown {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
      }

      .preview-modal-markdown h1 {
        font-size: 2rem;
        margin-top: 0;
        margin-bottom: 1rem;
      }

      .preview-modal-markdown h2 {
        font-size: 1.5rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }

      .preview-modal-markdown p {
        margin-bottom: 1rem;
      }

      .preview-modal-markdown ul, .preview-modal-markdown ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
      }

      .preview-modal-text {
        font-family: monospace;
        white-space: pre-wrap;
        line-height: 1.5;
      }

      .preview-modal-pdf {
        width: 100%;
        height: 100%;
        min-height: 500px;
      }

      .preview-modal-pdf iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .preview-modal-footer {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        background-color: #f5f5f5;
      }

      .preview-modal-download {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #b82e63;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
      }

      .preview-modal-download:hover {
        background-color: #a02857;
      }

      .preview-modal-download-icon {
        width: 1rem;
        height: 1rem;
      }

      .preview-modal-cancel {
        padding: 0.5rem 1rem;
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
      }

      .preview-modal-cancel:hover {
        background-color: #e5e5e5;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Add event listeners for the modal
   */
  addEventListeners() {
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on outside click
    document.getElementById('preview-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('preview-modal-overlay')) {
        this.close();
      }
    });
  }

  /**
   * Open the modal with content
   */
  open() {
    this.isOpen = true;

    const overlay = document.getElementById('preview-modal-overlay');
    const content = document.getElementById('preview-modal-content');
    const title = document.getElementById('preview-modal-title');
    const body = document.getElementById('preview-modal-body');
    const downloadText = document.getElementById('preview-modal-download-text');

    // Set position class
    content.className = 'preview-modal-content';
    if (this.position === 'left') {
      content.classList.add('modal-left');
    } else if (this.position === 'right') {
      content.classList.add('modal-right');
    }

    // Set title based on format
    title.textContent = this.format === 'markdown'
      ? 'Markdown Preview'
      : this.format === 'pdf'
        ? 'PDF Preview'
        : 'Text Preview';

    // Set download button text
    downloadText.textContent = `Download ${this.format === 'markdown'
      ? 'Markdown'
      : this.format === 'pdf'
        ? 'PDF'
        : 'Text'
      } File`;

    // Clear previous content
    body.innerHTML = '';

    // Add content based on format
    if (this.format === 'markdown') {
      const markdownDiv = document.createElement('div');
      markdownDiv.className = 'preview-modal-markdown';

      // Simple markdown rendering (in a real app, use a proper markdown library)
      const html = this.simpleMarkdownToHtml(this.content);
      markdownDiv.innerHTML = html;

      body.appendChild(markdownDiv);
    } else if (this.format === 'pdf') {
      const pdfDiv = document.createElement('div');
      pdfDiv.className = 'preview-modal-pdf';

      const iframe = document.createElement('iframe');
      if (this.pdfDataUrl) {
        iframe.src = this.pdfDataUrl;
      } else if (this.pdfSource) {
        iframe.src = `${this.pdfSource}?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
      } else {
        iframe.src = `/default_resume.pdf?v=${Date.now()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
      }
      iframe.title = 'PDF Preview';

      pdfDiv.appendChild(iframe);
      body.appendChild(pdfDiv);
    } else {
      const preElement = document.createElement('pre');
      preElement.className = 'preview-modal-text';
      preElement.textContent = this.content;

      body.appendChild(preElement);
    }

    // Show the modal
    overlay.style.display = 'flex';

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the modal
   */
  close() {
    this.isOpen = false;

    const overlay = document.getElementById('preview-modal-overlay');
    overlay.style.display = 'none';

    // Restore body scrolling
    document.body.style.overflow = 'auto';

    // Call onClose callback
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Download the content
   */
  download() {
    if (typeof this.onDownload === 'function') {
      this.onDownload();
      return;
    }

    try {
      let fileExtension, mimeType, fileContent;

      if (this.format === 'markdown') {
        fileExtension = 'md';
        mimeType = 'text/markdown';
        fileContent = this.content;
      } else if (this.format === 'text') {
        fileExtension = 'txt';
        mimeType = 'text/plain';
        fileContent = this.content;
      } else if (this.format === 'pdf' && this.pdfDataUrl) {
        // For PDF with data URL, create a direct download link
        const link = document.createElement('a');
        link.href = this.pdfDataUrl;
        link.download = `${this.fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } else {
        console.error('Unsupported format or missing data URL for PDF');
        return;
      }

      // Create blob and download
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.fileName}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Downloaded ${this.fileName}.${fileExtension}`);
    } catch (error) {
      console.error('Error during download:', error);
      alert('There was an error downloading the file. Please try again.');
    }
  }

  /**
   * Simple markdown to HTML converter
   * Note: In a real app, use a proper markdown library
   */
  simpleMarkdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

      // Lists
      .replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>')
      .replace(/^\* (.*)/gm, '<li>$1</li>')
      .replace(/^\s*\n- (.*)/gm, '<ul>\n<li>$1</li>')
      .replace(/^- (.*)/gm, '<li>$1</li>')

      // Paragraphs
      .replace(/^\s*\n\s*\n/gm, '</p><p>')

      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Wrap with paragraph tags
    html = '<p>' + html + '</p>';

    // Fix lists
    html = html.replace(/<\/ul><p><li>/g, '<li>');
    html = html.replace(/<\/li><\/p><ul>/g, '</li>');

    return html;
  }
}

// Export the PreviewModal class
window.PreviewModal = PreviewModal;
