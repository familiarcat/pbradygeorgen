/**
 * CoverLetterModal Component
 * 
 * This component displays a cover letter with download options.
 */

class CoverLetterModal {
  constructor() {
    this.isOpen = false;
    this.content = '';
    this.position = 'left';
    this.isLoading = false;
    this.previewModal = null;
  }

  /**
   * Initialize the modal with configuration
   */
  init(config) {
    this.content = config.content || '';
    this.position = config.position || 'left';
    this.isLoading = config.isLoading || false;
    this.onClose = config.onClose || (() => this.close());
    
    // Initialize preview modal if needed
    if (!this.previewModal && window.PreviewModal) {
      this.previewModal = new window.PreviewModal();
    }
    
    // Create modal elements if they don't exist
    if (!document.getElementById('cover-letter-modal-overlay')) {
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
    overlay.id = 'cover-letter-modal-overlay';
    overlay.className = 'cover-letter-modal-overlay';
    overlay.style.display = 'none';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.id = 'cover-letter-modal-content';
    modalContent.className = 'cover-letter-modal-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'cover-letter-modal-header';
    
    const title = document.createElement('h2');
    title.className = 'cover-letter-modal-title';
    title.textContent = 'Cover Letter';
    
    const headerActions = document.createElement('div');
    headerActions.className = 'cover-letter-modal-header-actions';
    
    // Download dropdown container
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'cover-letter-modal-download-container';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = '#';
    downloadLink.className = 'cover-letter-modal-action-link';
    downloadLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Cover Letter
    `;
    downloadLink.onclick = (e) => e.preventDefault();
    
    // Create dropdown menu
    const downloadMenu = document.createElement('div');
    downloadMenu.className = 'cover-letter-modal-download-menu';
    
    // PDF download option group
    const pdfOptionGroup = document.createElement('div');
    pdfOptionGroup.className = 'cover-letter-modal-download-option-group';
    
    const pdfPreviewButton = document.createElement('a');
    pdfPreviewButton.href = '#';
    pdfPreviewButton.className = 'cover-letter-modal-preview-button';
    pdfPreviewButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      Preview
    `;
    pdfPreviewButton.onclick = (e) => {
      e.preventDefault();
      this.handlePdfPreview();
    };
    
    const pdfDownloadOption = document.createElement('a');
    pdfDownloadOption.href = '#';
    pdfDownloadOption.className = 'cover-letter-modal-download-option';
    pdfDownloadOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      PDF Format
    `;
    pdfDownloadOption.onclick = (e) => {
      e.preventDefault();
      this.handlePdfDownload();
    };
    
    pdfOptionGroup.appendChild(pdfPreviewButton);
    pdfOptionGroup.appendChild(pdfDownloadOption);
    
    // Markdown download option group
    const markdownOptionGroup = document.createElement('div');
    markdownOptionGroup.className = 'cover-letter-modal-download-option-group';
    
    const markdownPreviewButton = document.createElement('a');
    markdownPreviewButton.href = '#';
    markdownPreviewButton.className = 'cover-letter-modal-preview-button';
    markdownPreviewButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      Preview
    `;
    markdownPreviewButton.onclick = (e) => {
      e.preventDefault();
      this.handleMarkdownPreview();
    };
    
    const markdownDownloadOption = document.createElement('a');
    markdownDownloadOption.href = '#';
    markdownDownloadOption.className = 'cover-letter-modal-download-option';
    markdownDownloadOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Markdown Format
    `;
    markdownDownloadOption.onclick = (e) => {
      e.preventDefault();
      this.handleMarkdownDownload();
    };
    
    markdownOptionGroup.appendChild(markdownPreviewButton);
    markdownOptionGroup.appendChild(markdownDownloadOption);
    
    // Text download option group
    const textOptionGroup = document.createElement('div');
    textOptionGroup.className = 'cover-letter-modal-download-option-group';
    
    const textPreviewButton = document.createElement('a');
    textPreviewButton.href = '#';
    textPreviewButton.className = 'cover-letter-modal-preview-button';
    textPreviewButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      Preview
    `;
    textPreviewButton.onclick = (e) => {
      e.preventDefault();
      this.handleTextPreview();
    };
    
    const textDownloadOption = document.createElement('a');
    textDownloadOption.href = '#';
    textDownloadOption.className = 'cover-letter-modal-download-option';
    textDownloadOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="cover-letter-modal-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Text Format
    `;
    textDownloadOption.onclick = (e) => {
      e.preventDefault();
      this.handleTextDownload();
    };
    
    textOptionGroup.appendChild(textPreviewButton);
    textOptionGroup.appendChild(textDownloadOption);
    
    // Add option groups to menu
    downloadMenu.appendChild(pdfOptionGroup);
    downloadMenu.appendChild(markdownOptionGroup);
    downloadMenu.appendChild(textOptionGroup);
    
    // Add menu to container
    downloadContainer.appendChild(downloadLink);
    downloadContainer.appendChild(downloadMenu);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'cover-letter-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => this.close();
    
    // Add elements to header actions
    headerActions.appendChild(downloadContainer);
    headerActions.appendChild(closeButton);
    
    // Add elements to header
    header.appendChild(title);
    header.appendChild(headerActions);
    
    // Create body
    const body = document.createElement('div');
    body.id = 'cover-letter-modal-body';
    body.className = 'cover-letter-modal-body';
    
    // Create loading container
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'cover-letter-modal-loading';
    loadingContainer.className = 'cover-letter-modal-loading';
    loadingContainer.innerHTML = `
      <div class="cover-letter-modal-loading-spinner">
        <svg class="cover-letter-modal-spinner-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div class="cover-letter-modal-loading-text">Generating cover letter...</div>
    `;
    loadingContainer.style.display = 'none';
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'cover-letter-modal-content-container';
    contentContainer.className = 'cover-letter-modal-content-container';
    
    // Add containers to body
    body.appendChild(loadingContainer);
    body.appendChild(contentContainer);
    
    // Add header and body to modal content
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    
    // Add modal content to overlay
    overlay.appendChild(modalContent);
    
    // Add overlay to document
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
    if (document.getElementById('cover-letter-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cover-letter-modal-styles';
    style.textContent = `
      .cover-letter-modal-overlay {
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
      
      .cover-letter-modal-content {
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
      
      .cover-letter-modal-content.modal-left {
        margin-right: auto;
        margin-left: 5%;
      }
      
      .cover-letter-modal-content.modal-right {
        margin-left: auto;
        margin-right: 5%;
      }
      
      .cover-letter-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: rgba(212, 209, 190, 0.95);
        color: #49423D;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .cover-letter-modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      .cover-letter-modal-header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .cover-letter-modal-download-container {
        position: relative;
        display: inline-block;
      }
      
      .cover-letter-modal-action-link {
        color: #49423D;
        text-decoration: none;
        position: relative;
        transition: all 0.3s ease;
        font-size: 1.1rem;
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: rgba(126, 98, 51, 0.2);
      }
      
      .cover-letter-modal-action-link:hover {
        color: #FFFFFF;
        background-color: #7E6233;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .cover-letter-modal-close {
        font-size: 1.5rem;
        cursor: pointer;
        background: none;
        border: none;
        color: #49423D;
        transition: color 0.2s;
      }
      
      .cover-letter-modal-close:hover {
        color: #000;
      }
      
      .cover-letter-modal-download-menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 0.5rem;
        background: rgba(212, 209, 190, 0.95);
        border: 1px solid rgba(73, 66, 61, 0.15);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        min-width: 280px;
        z-index: 100;
        display: none;
      }
      
      .cover-letter-modal-download-container:hover .cover-letter-modal-download-menu {
        display: block;
      }
      
      .cover-letter-modal-download-option-group {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid rgba(73, 66, 61, 0.1);
      }
      
      .cover-letter-modal-download-option-group:last-child {
        border-bottom: none;
      }
      
      .cover-letter-modal-preview-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.75rem 0.5rem;
        color: #49423D;
        text-decoration: none;
        transition: all 0.2s ease;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 0.9rem;
        background-color: rgba(126, 78, 45, 0.2);
        border-right: 1px solid rgba(73, 66, 61, 0.1);
        flex: 0 0 auto;
        width: 90px;
        text-align: center;
      }
      
      .cover-letter-modal-preview-button:hover {
        background: #7E4E2D;
        color: #FFFFFF;
      }
      
      .cover-letter-modal-download-option {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: #49423D;
        text-decoration: none;
        transition: all 0.2s ease;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 1rem;
        flex: 1;
        gap: 0.5rem;
        background-color: rgba(95, 107, 84, 0.15);
      }
      
      .cover-letter-modal-download-option:hover {
        background: #5F6B54;
        color: #FFFFFF;
      }
      
      .cover-letter-modal-action-icon,
      .cover-letter-modal-download-icon {
        width: 1.25rem;
        height: 1.25rem;
        stroke-width: 2;
      }
      
      .cover-letter-modal-preview-icon {
        width: 1rem;
        height: 1rem;
        stroke-width: 2;
      }
      
      .cover-letter-modal-body {
        padding: 1rem;
        overflow-y: auto;
        flex: 1;
      }
      
      .cover-letter-modal-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
      }
      
      .cover-letter-modal-loading-spinner {
        margin-bottom: 1rem;
      }
      
      .cover-letter-modal-spinner-svg {
        animation: cover-letter-modal-spin 1s linear infinite;
        width: 2.5rem;
        height: 2.5rem;
      }
      
      @keyframes cover-letter-modal-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .cover-letter-modal-loading-text {
        font-size: 1.1rem;
        color: #666;
      }
      
      .cover-letter-modal-content-container {
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }
      
      .cover-letter-modal-content-container h1 {
        font-size: 2rem;
        margin-top: 0;
        margin-bottom: 1rem;
        text-align: center;
        color: #2c3e50;
      }
      
      .cover-letter-modal-content-container h2 {
        font-size: 1.5rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: #3498db;
      }
      
      .cover-letter-modal-content-container p {
        margin-bottom: 1rem;
      }
      
      .cover-letter-modal-content-container ul, .cover-letter-modal-content-container ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
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
    document.getElementById('cover-letter-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('cover-letter-modal-overlay')) {
        this.close();
      }
    });
  }

  /**
   * Open the modal with content
   */
  open() {
    this.isOpen = true;
    
    const overlay = document.getElementById('cover-letter-modal-overlay');
    const content = document.getElementById('cover-letter-modal-content');
    const loadingContainer = document.getElementById('cover-letter-modal-loading');
    const contentContainer = document.getElementById('cover-letter-modal-content-container');
    
    // Set position class
    content.className = 'cover-letter-modal-content';
    if (this.position === 'left') {
      content.classList.add('modal-left');
    } else if (this.position === 'right') {
      content.classList.add('modal-right');
    }
    
    // Show loading or content
    if (this.isLoading) {
      loadingContainer.style.display = 'flex';
      contentContainer.style.display = 'none';
    } else {
      loadingContainer.style.display = 'none';
      contentContainer.style.display = 'block';
      
      // Set content
      contentContainer.innerHTML = this.renderMarkdown(this.content);
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
    
    const overlay = document.getElementById('cover-letter-modal-overlay');
    overlay.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
    
    // Call onClose callback
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /**
   * Simple markdown to HTML renderer
   */
  renderMarkdown(markdown) {
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

  /**
   * Convert markdown to plain text
   */
  markdownToPlainText(markdown) {
    if (!markdown) return '';
    
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/>/g, '') // Remove blockquotes
      .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
  }

  /**
   * Handle PDF preview
   */
  handlePdfPreview() {
    if (!this.previewModal) return;
    
    this.previewModal.init({
      content: '',
      format: 'pdf',
      fileName: 'pbradygeorgen_cover_letter',
      position: 'right',
      pdfDataUrl: '/extracted/cover_letter.pdf',
      onClose: () => {
        console.log('PDF preview closed');
      },
      onDownload: () => {
        this.handlePdfDownload();
      }
    }).open();
  }

  /**
   * Handle PDF download
   */
  handlePdfDownload() {
    window.location.href = '/extracted/cover_letter.pdf';
  }

  /**
   * Handle Markdown preview
   */
  handleMarkdownPreview() {
    if (!this.previewModal) return;
    
    this.previewModal.init({
      content: this.content,
      format: 'markdown',
      fileName: 'pbradygeorgen_cover_letter',
      position: 'right',
      onClose: () => {
        console.log('Markdown preview closed');
      },
      onDownload: () => {
        this.handleMarkdownDownload();
      }
    }).open();
  }

  /**
   * Handle Markdown download
   */
  handleMarkdownDownload() {
    try {
      const blob = new Blob([this.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pbradygeorgen_cover_letter.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Markdown:', error);
      alert('There was an error downloading the file. Please try again.');
    }
  }

  /**
   * Handle Text preview
   */
  handleTextPreview() {
    if (!this.previewModal) return;
    
    const plainText = this.markdownToPlainText(this.content);
    
    this.previewModal.init({
      content: plainText,
      format: 'text',
      fileName: 'pbradygeorgen_cover_letter',
      position: 'right',
      onClose: () => {
        console.log('Text preview closed');
      },
      onDownload: () => {
        this.handleTextDownload();
      }
    }).open();
  }

  /**
   * Handle Text download
   */
  handleTextDownload() {
    try {
      const plainText = this.markdownToPlainText(this.content);
      const blob = new Blob([plainText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pbradygeorgen_cover_letter.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Text:', error);
      alert('There was an error downloading the file. Please try again.');
    }
  }
}

// Export the CoverLetterModal class
window.CoverLetterModal = CoverLetterModal;
