/**
 * SalingerHeader Component
 * 
 * This component implements the header with Salinger-inspired design principles,
 * including the Cover Letter link and download options.
 */

class SalingerHeader {
  constructor() {
    this.initialized = false;
    this.coverLetterCallback = null;
    this.downloadCallbacks = {
      pdf: null,
      markdown: null,
      text: null
    };
  }

  /**
   * Initialize the header with configuration
   */
  init(config = {}) {
    if (this.initialized) return this;
    
    this.coverLetterCallback = config.onCoverLetterClick || null;
    this.downloadCallbacks = {
      pdf: config.onPdfDownload || null,
      markdown: config.onMarkdownDownload || null,
      text: config.onTextDownload || null
    };
    
    // Create header elements
    this.createHeaderElements();
    this.initialized = true;
    
    return this;
  }

  /**
   * Create the header DOM elements
   */
  createHeaderElements() {
    // Create header container
    const header = document.createElement('header');
    header.className = 'salinger-header';
    
    // Create left section with title and cover letter link
    const headerLeft = document.createElement('div');
    headerLeft.className = 'header-left';
    
    const siteTitle = document.createElement('h1');
    siteTitle.className = 'site-title';
    siteTitle.textContent = 'Professional Resume';
    
    const coverLetterLink = document.createElement('a');
    coverLetterLink.href = '#';
    coverLetterLink.className = 'cover-letter-link';
    coverLetterLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      Cover Letter
    `;
    coverLetterLink.onclick = (e) => {
      e.preventDefault();
      if (typeof this.coverLetterCallback === 'function') {
        this.coverLetterCallback();
      }
    };
    
    headerLeft.appendChild(siteTitle);
    headerLeft.appendChild(coverLetterLink);
    
    // Create right section with actions
    const headerActions = document.createElement('div');
    headerActions.className = 'header-actions';
    
    // Download container with dropdown
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'download-container';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = '#';
    downloadLink.className = 'action-link';
    downloadLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Resume
    `;
    downloadLink.onclick = (e) => e.preventDefault();
    
    // Create dropdown menu
    const downloadMenu = document.createElement('div');
    downloadMenu.className = 'download-menu';
    
    // PDF download option
    const pdfOption = document.createElement('a');
    pdfOption.href = '#';
    pdfOption.className = 'download-option';
    pdfOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      PDF Format
    `;
    pdfOption.onclick = (e) => {
      e.preventDefault();
      if (typeof this.downloadCallbacks.pdf === 'function') {
        this.downloadCallbacks.pdf();
      } else {
        this.downloadPdf();
      }
    };
    
    // Markdown download option
    const markdownOption = document.createElement('a');
    markdownOption.href = '#';
    markdownOption.className = 'download-option';
    markdownOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Markdown Format
    `;
    markdownOption.onclick = (e) => {
      e.preventDefault();
      if (typeof this.downloadCallbacks.markdown === 'function') {
        this.downloadCallbacks.markdown();
      } else {
        this.downloadMarkdown();
      }
    };
    
    // Text download option
    const textOption = document.createElement('a');
    textOption.href = '#';
    textOption.className = 'download-option';
    textOption.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Text Format
    `;
    textOption.onclick = (e) => {
      e.preventDefault();
      if (typeof this.downloadCallbacks.text === 'function') {
        this.downloadCallbacks.text();
      } else {
        this.downloadText();
      }
    };
    
    // Add options to menu
    downloadMenu.appendChild(pdfOption);
    downloadMenu.appendChild(markdownOption);
    downloadMenu.appendChild(textOption);
    
    // Add menu to container
    downloadContainer.appendChild(downloadLink);
    downloadContainer.appendChild(downloadMenu);
    
    // Add separator
    const separator = document.createElement('span');
    separator.className = 'action-separator';
    separator.textContent = '•';
    
    // JSON View link
    const jsonViewLink = document.createElement('a');
    jsonViewLink.href = '/json-view';
    jsonViewLink.className = 'action-link';
    jsonViewLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M8 12h8"></path>
        <path d="M8 16h8"></path>
        <path d="M8 20h8"></path>
      </svg>
      View JSON
    `;
    
    // Add another separator
    const separator2 = document.createElement('span');
    separator2.className = 'action-separator';
    separator2.textContent = '•';
    
    // Download Test link
    const downloadTestLink = document.createElement('a');
    downloadTestLink.href = '/download-test';
    downloadTestLink.className = 'action-link';
    downloadTestLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
      Download Test
    `;
    
    // Add all elements to header actions
    headerActions.appendChild(downloadContainer);
    headerActions.appendChild(separator);
    headerActions.appendChild(jsonViewLink);
    headerActions.appendChild(separator2);
    headerActions.appendChild(downloadTestLink);
    
    // Add sections to header
    header.appendChild(headerLeft);
    header.appendChild(headerActions);
    
    // Add header to document
    const targetElement = document.getElementById('salinger-header-container') || document.body;
    targetElement.prepend(header);
    
    // Add styles
    this.addStyles();
  }

  /**
   * Add CSS styles for the header
   */
  addStyles() {
    if (document.getElementById('salinger-header-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'salinger-header-styles';
    style.textContent = `
      /* Salinger-inspired header styles */
      .salinger-header {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.875rem;
        background: rgba(212, 209, 190, 0.95);
        backdrop-filter: blur(5px);
        border-bottom: 1px solid rgba(73, 66, 61, 0.15);
        z-index: 100;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: #49423D;
        transition: all 0.3s ease;
      }
      
      .site-title {
        font-weight: 700;
        font-size: 1.8rem;
        letter-spacing: -0.5px;
        margin: 0;
        color: #49423D;
        font-family: 'Courier New', monospace;
      }
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      
      .cover-letter-link {
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
        background-color: rgba(90, 118, 130, 0.2);
      }
      
      .cover-letter-link:hover {
        color: #FFFFFF;
        background-color: #5A7682;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      /* Download container for dropdown functionality */
      .download-container {
        position: relative;
        display: inline-block;
      }
      
      .action-link {
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
      
      .action-link:hover {
        color: #FFFFFF;
        background-color: #7E6233;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      /* Dropdown menu styling */
      .download-menu {
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
      
      /* Show dropdown on hover */
      .download-container:hover .download-menu {
        display: block;
      }
      
      /* Download options styling */
      .download-option {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: #49423D;
        text-decoration: none;
        transition: all 0.2s ease;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 1rem;
        gap: 0.5rem;
        background-color: rgba(95, 107, 84, 0.15);
      }
      
      .download-option:hover {
        background: #5F6B54;
        color: #FFFFFF;
      }
      
      /* Action icons */
      .action-icon {
        width: 1.25rem;
        height: 1.25rem;
        stroke-width: 2;
      }
      
      /* Download icon */
      .download-icon {
        width: 1.25rem;
        height: 1.25rem;
        stroke-width: 2;
      }
      
      .action-separator {
        color: #8A8151;
        font-size: 0.8rem;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .salinger-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
        }
        
        .site-title {
          font-size: 1.5rem;
        }
        
        .header-left {
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .header-actions {
          width: 100%;
          justify-content: space-between;
        }
      }
      
      /* Print styles - hide header when printing */
      @media print {
        .salinger-header {
          display: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Default download handlers
   */
  downloadPdf() {
    window.location.href = '/extracted/resume_content.pdf';
  }
  
  downloadMarkdown() {
    window.location.href = '/extracted/resume_content.md';
  }
  
  downloadText() {
    window.location.href = '/extracted/resume_content.txt';
  }
}

// Export the SalingerHeader class
window.SalingerHeader = SalingerHeader;
