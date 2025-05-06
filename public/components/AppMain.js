/**
 * AppMain Component
 *
 * This is the main application script that integrates all components
 * and handles the application state and interactions.
 */

class AppMain {
  constructor() {
    this.initialized = false;
    this.salingerHeader = null;
    this.coverLetterModal = null;
    this.previewModal = null;
    this.pdfColors = null;
    this.pdfFonts = null;
    this.coverLetterContent = '';
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) return this;

    console.log('Initializing AppMain...');

    // Initialize components
    this.initComponents();

    // Load PDF colors and fonts
    await this.loadPdfStyles();

    // Apply PDF styles to the application
    this.applyPdfStyles();

    // Load cover letter content
    await this.loadCoverLetterContent();

    // Set up event listeners
    this.setupEventListeners();

    this.initialized = true;
    console.log('AppMain initialized successfully');

    return this;
  }

  /**
   * Initialize components
   */
  initComponents() {
    // Initialize PreviewModal first
    if (window.PreviewModal) {
      this.previewModal = new window.PreviewModal();
    }

    // Initialize CoverLetterModal
    if (window.CoverLetterModal) {
      this.coverLetterModal = new window.CoverLetterModal();
    }

    // Initialize SalingerHeader
    if (window.SalingerHeader) {
      this.salingerHeader = new window.SalingerHeader();
      this.salingerHeader.init({
        onCoverLetterClick: () => this.showCoverLetter(),
        onPdfDownload: () => this.downloadResumePdf(),
        onMarkdownDownload: () => this.downloadResumeMarkdown(),
        onTextDownload: () => this.downloadResumeText(),
        onPdfPreview: () => this.previewResumePdf(),
        onMarkdownPreview: () => this.previewResumeMarkdown(),
        onTextPreview: () => this.previewResumeText(),
        previewModal: this.previewModal
      });
    }
  }

  /**
   * Load PDF styles (colors and fonts)
   */
  async loadPdfStyles() {
    try {
      // Load colors
      const colorResponse = await fetch('/extracted/color_theme.json');
      if (colorResponse.ok) {
        this.pdfColors = await colorResponse.json();
        console.log('Loaded PDF colors:', this.pdfColors);
      } else {
        console.warn('Failed to load PDF colors');
        // Set default colors
        this.pdfColors = {
          primary: "#b82e63",
          secondary: "#5a9933",
          accent: "#26d994",
          background: "#f4f1f2",
          text: "#2c2125",
          border: "#d6c2ca"
        };
      }

      // Load fonts
      const fontResponse = await fetch('/extracted/font_info.json');
      if (fontResponse.ok) {
        this.pdfFonts = await fontResponse.json();
        console.log('Loaded PDF fonts:', this.pdfFonts);
      } else {
        console.warn('Failed to load PDF fonts');
        // Set default fonts
        this.pdfFonts = {
          primaryFont: "'Source Sans 3', sans-serif",
          secondaryFont: "'Merriweather', serif",
          headingFont: "'Roboto', sans-serif",
          monoFont: "monospace"
        };
      }
    } catch (error) {
      console.error('Error loading PDF styles:', error);
      // Set default values
      this.pdfColors = {
        primary: "#b82e63",
        secondary: "#5a9933",
        accent: "#26d994",
        background: "#f4f1f2",
        text: "#2c2125",
        border: "#d6c2ca"
      };
      this.pdfFonts = {
        primaryFont: "'Source Sans 3', sans-serif",
        secondaryFont: "'Merriweather', serif",
        headingFont: "'Roboto', sans-serif",
        monoFont: "monospace"
      };
    }
  }

  /**
   * Apply PDF styles to the application
   */
  applyPdfStyles() {
    if (!this.pdfColors && !this.pdfFonts) return;

    // Create a style element if it doesn't exist
    let styleElement = document.getElementById('pdf-dynamic-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'pdf-dynamic-styles';
      document.head.appendChild(styleElement);
    }

    // Generate CSS variables
    let cssVariables = ':root {\n';

    // Add color variables
    if (this.pdfColors) {
      cssVariables += `  --pdf-primary-color: ${this.pdfColors.primary};\n`;
      cssVariables += `  --pdf-secondary-color: ${this.pdfColors.secondary};\n`;
      cssVariables += `  --pdf-accent-color: ${this.pdfColors.accent};\n`;
      cssVariables += `  --pdf-background-color: ${this.pdfColors.background};\n`;
      cssVariables += `  --pdf-text-color: ${this.pdfColors.text};\n`;
      cssVariables += `  --pdf-border-color: ${this.pdfColors.border};\n`;

      // Generate additional colors using Hesse method
      const primaryRgb = this.hexToRgb(this.pdfColors.primary);
      if (primaryRgb) {
        // Lighter version (add 20% white)
        cssVariables += `  --pdf-primary-light: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8);\n`;
        // Darker version (add 20% black)
        cssVariables += `  --pdf-primary-dark: rgba(${Math.max(0, primaryRgb.r - 51)}, ${Math.max(0, primaryRgb.g - 51)}, ${Math.max(0, primaryRgb.b - 51)}, 1);\n`;
      }

      // Generate complementary colors
      const secondaryRgb = this.hexToRgb(this.pdfColors.secondary);
      if (secondaryRgb) {
        // Lighter version
        cssVariables += `  --pdf-secondary-light: rgba(${Math.min(255, secondaryRgb.r + 51)}, ${Math.min(255, secondaryRgb.g + 51)}, ${Math.min(255, secondaryRgb.b + 51)}, 1);\n`;
        // Darker version
        cssVariables += `  --pdf-secondary-dark: rgba(${Math.max(0, secondaryRgb.r - 51)}, ${Math.max(0, secondaryRgb.g - 51)}, ${Math.max(0, secondaryRgb.b - 51)}, 1);\n`;
      }
    }

    // Add font variables
    if (this.pdfFonts) {
      cssVariables += `  --pdf-primary-font: ${this.pdfFonts.primaryFont};\n`;
      cssVariables += `  --pdf-secondary-font: ${this.pdfFonts.secondaryFont};\n`;
      cssVariables += `  --pdf-heading-font: ${this.pdfFonts.headingFont};\n`;
      cssVariables += `  --pdf-mono-font: ${this.pdfFonts.monoFont};\n`;
    }

    cssVariables += '}\n\n';

    // Add specific styles
    cssVariables += `
      body {
        background-color: var(--pdf-background-color, #f4f1f2);
        color: var(--pdf-text-color, #2c2125);
        font-family: var(--pdf-primary-font, system-ui, sans-serif);
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--pdf-heading-font, system-ui, sans-serif);
        color: var(--pdf-primary-color, #b82e63);
      }

      a {
        color: var(--pdf-secondary-color, #5a9933);
      }

      /* Salinger Header Styling */
      .salinger-header {
        background-color: var(--pdf-background-color, rgba(212, 209, 190, 0.95)) !important;
        border-bottom-color: var(--pdf-border-color, rgba(73, 66, 61, 0.15)) !important;
      }

      .site-title {
        color: var(--pdf-text-color, #49423D) !important;
        font-family: var(--pdf-heading-font, 'Courier New', monospace) !important;
      }

      .cover-letter-link, .action-link {
        color: var(--pdf-text-color, #49423D) !important;
        font-family: var(--pdf-primary-font, 'Courier New', monospace) !important;
      }

      .cover-letter-link:hover {
        background-color: var(--pdf-secondary-color, #5A7682) !important;
        color: white !important;
      }

      .action-link:hover {
        background-color: var(--pdf-primary-color, #7E6233) !important;
        color: white !important;
      }

      .action-link::after {
        background: var(--pdf-accent-color, #8A8151) !important;
      }

      .preview-button:hover {
        background-color: var(--pdf-primary-color, #7E4E2D) !important;
        color: white !important;
      }

      .download-option {
        font-family: var(--pdf-primary-font, 'Courier New', monospace) !important;
        color: var(--pdf-text-color, #49423D) !important;
      }

      .download-option:hover {
        background-color: var(--pdf-secondary-color, #5F6B54) !important;
        color: white !important;
      }

      .action-separator {
        color: var(--pdf-accent-color, #8A8151) !important;
      }

      /* Preview Modal Styling */
      .preview-modal-overlay {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .preview-modal-content {
        background-color: var(--pdf-background-color, white);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .preview-modal-header {
        background-color: var(--pdf-background-color, rgba(212, 209, 190, 0.95));
        color: var(--pdf-text-color, #49423D);
        border-bottom: 1px solid var(--pdf-border-color, rgba(73, 66, 61, 0.15));
      }

      .preview-modal-title {
        color: var(--pdf-text-color, #49423D);
        font-family: var(--pdf-heading-font, 'Courier New', monospace);
      }

      .preview-modal-close {
        color: var(--pdf-text-color, #49423D);
      }

      .preview-modal-markdown {
        font-family: var(--pdf-primary-font, system-ui, sans-serif);
        color: var(--pdf-text-color, #333);
      }

      .preview-modal-markdown h1, .preview-modal-markdown h2 {
        color: var(--pdf-primary-color, #2c3e50);
        font-family: var(--pdf-heading-font, system-ui, sans-serif);
      }

      .preview-modal-text {
        font-family: var(--pdf-mono-font, monospace);
        color: var(--pdf-text-color, #333);
      }

      .preview-modal-footer {
        border-top: 1px solid var(--pdf-border-color, rgba(0, 0, 0, 0.1));
        background-color: var(--pdf-background-color, #f5f5f5);
      }

      .preview-modal-download {
        background-color: var(--pdf-primary-color, #b82e63);
        color: white;
      }

      .preview-modal-download:hover {
        background-color: var(--pdf-primary-dark, #a02857);
      }

      .preview-modal-cancel {
        background-color: var(--pdf-background-color, #f5f5f5);
        color: var(--pdf-text-color, #333);
        border: 1px solid var(--pdf-border-color, #ddd);
      }

      .preview-modal-cancel:hover {
        background-color: var(--pdf-secondary-light, #e5e5e5);
      }

      /* Cover Letter Modal Styling */
      .cover-letter-modal-overlay {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .cover-letter-modal-content {
        background-color: var(--pdf-background-color, white);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .cover-letter-modal-header {
        background-color: var(--pdf-background-color, rgba(212, 209, 190, 0.95));
        color: var(--pdf-text-color, #49423D);
        border-bottom: 1px solid var(--pdf-border-color, rgba(73, 66, 61, 0.15));
      }

      .cover-letter-modal-title {
        color: var(--pdf-text-color, #49423D);
        font-family: var(--pdf-heading-font, 'Courier New', monospace);
      }

      .cover-letter-modal-close {
        color: var(--pdf-text-color, #49423D);
      }

      .cover-letter-modal-action-link {
        color: var(--pdf-text-color, #49423D);
        background-color: rgba(126, 98, 51, 0.2);
      }

      .cover-letter-modal-action-link:hover {
        color: white;
        background-color: var(--pdf-primary-color, #7E6233);
      }

      .cover-letter-modal-preview-button:hover {
        background-color: var(--pdf-primary-color, #7E4E2D);
        color: white;
      }

      .cover-letter-modal-download-option:hover {
        background-color: var(--pdf-secondary-color, #5F6B54);
        color: white;
      }

      .cover-letter-modal-content-container {
        font-family: var(--pdf-primary-font, 'Georgia', serif);
        color: var(--pdf-text-color, #333);
      }

      .cover-letter-modal-content-container h1 {
        color: var(--pdf-primary-color, #2c3e50);
        font-family: var(--pdf-heading-font, system-ui, sans-serif);
      }

      .cover-letter-modal-content-container h2 {
        color: var(--pdf-secondary-color, #3498db);
        font-family: var(--pdf-heading-font, system-ui, sans-serif);
      }
    `;

    // Set the style content
    styleElement.textContent = cssVariables;

    console.log('Applied PDF styles to the application');
  }

  /**
   * Load cover letter content
   */
  async loadCoverLetterContent() {
    try {
      const response = await fetch('/extracted/cover_letter.md');
      if (response.ok) {
        this.coverLetterContent = await response.text();
        console.log('Loaded cover letter content');
      } else {
        console.warn('Failed to load cover letter content');
        // Set default content
        this.coverLetterContent = `# Cover Letter

Dear Hiring Manager,

## Introduction

I am writing to express my interest in the Senior Software Developer position at Your Company. With my background in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS, I am confident that I would be a valuable addition to your team.

## Professional Background

I am a seasoned software developer specializing in the development of high-performance web applications using JavaScript, React, and Node.js. With strong expertise in AWS and CI/CD pipelines, I excel in creating scalable solutions and improving software delivery processes. A dedicated team player and mentor, I am committed to coding excellence and innovation.

## Why I'm a Great Fit

Throughout my career, I have demonstrated leadership in the development and maintenance of responsive web applications using React and Node.js, improving user engagement by 30%. I am particularly drawn to Your Company because of your reputation for innovation and excellence in the industry.

## Skills and Qualifications

My key qualifications that align with this role include:
- Full-stack development expertise
- JavaScript/TypeScript proficiency
- Strong communication skills

## Closing

I am excited about the opportunity to bring my unique skills and experience to Your Company. I would welcome the chance to discuss how my background and qualifications would be a good match for this position.

Sincerely,

Your Name`;
      }
    } catch (error) {
      console.error('Error loading cover letter content:', error);
      // Set default content
      this.coverLetterContent = `# Cover Letter

Dear Hiring Manager,

## Introduction

I am writing to express my interest in the Senior Software Developer position at Your Company. With my background in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS, I am confident that I would be a valuable addition to your team.

## Professional Background

I am a seasoned software developer specializing in the development of high-performance web applications using JavaScript, React, and Node.js. With strong expertise in AWS and CI/CD pipelines, I excel in creating scalable solutions and improving software delivery processes. A dedicated team player and mentor, I am committed to coding excellence and innovation.

## Why I'm a Great Fit

Throughout my career, I have demonstrated leadership in the development and maintenance of responsive web applications using React and Node.js, improving user engagement by 30%. I am particularly drawn to Your Company because of your reputation for innovation and excellence in the industry.

## Skills and Qualifications

My key qualifications that align with this role include:
- Full-stack development expertise
- JavaScript/TypeScript proficiency
- Strong communication skills

## Closing

I am excited about the opportunity to bring my unique skills and experience to Your Company. I would welcome the chance to discuss how my background and qualifications would be a good match for this position.

Sincerely,

Your Name`;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Add any global event listeners here
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOM fully loaded');
    });
  }

  /**
   * Show cover letter modal
   */
  showCoverLetter() {
    if (!this.coverLetterModal) return;

    this.coverLetterModal.init({
      content: this.coverLetterContent,
      position: 'left',
      isLoading: false,
      onClose: () => {
        console.log('Cover letter modal closed');
      }
    }).open();
  }

  /**
   * Download resume in PDF format
   */
  downloadResumePdf() {
    window.location.href = '/default_resume.pdf';
  }

  /**
   * Download resume in Markdown format
   */
  downloadResumeMarkdown() {
    window.location.href = '/extracted/resume_content.md';
  }

  /**
   * Download resume in Text format
   */
  downloadResumeText() {
    window.location.href = '/extracted/resume_content.txt';
  }

  /**
   * Preview resume in PDF format
   */
  previewResumePdf() {
    if (!this.previewModal) {
      console.error('Preview modal not initialized');
      return;
    }

    this.previewModal.init({
      content: '',
      format: 'pdf',
      fileName: 'resume',
      position: 'right',
      pdfDataUrl: '/default_resume.pdf',
      onClose: () => {
        console.log('PDF preview closed');
      },
      onDownload: () => {
        this.downloadResumePdf();
      }
    }).open();
  }

  /**
   * Preview resume in Markdown format
   */
  previewResumeMarkdown() {
    if (!this.previewModal) {
      console.error('Preview modal not initialized');
      return;
    }

    // Fetch markdown content
    fetch('/extracted/resume_content.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        this.previewModal.init({
          content: content,
          format: 'markdown',
          fileName: 'resume',
          position: 'right',
          onClose: () => {
            console.log('Markdown preview closed');
          },
          onDownload: () => {
            this.downloadResumeMarkdown();
          }
        }).open();
      })
      .catch(error => {
        console.error('Error fetching markdown content:', error);
        alert('Failed to load markdown preview. Please try again.');
      });
  }

  /**
   * Preview resume in Text format
   */
  previewResumeText() {
    if (!this.previewModal) {
      console.error('Preview modal not initialized');
      return;
    }

    // Fetch text content
    fetch('/extracted/resume_content.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch text: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        this.previewModal.init({
          content: content,
          format: 'text',
          fileName: 'resume',
          position: 'right',
          onClose: () => {
            console.log('Text preview closed');
          },
          onDownload: () => {
            this.downloadResumeText();
          }
        }).open();
      })
      .catch(error => {
        console.error('Error fetching text content:', error);
        alert('Failed to load text preview. Please try again.');
      });
  }

  /**
   * Helper function to convert hex color to RGB
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  }
}

// Create and export the AppMain instance
window.appMain = new AppMain();

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.appMain.init();
});
