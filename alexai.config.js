/**
 * AlexAI Configuration
 *
 * This file contains configuration settings for the AlexAI application.
 * It follows the Derrida philosophy of deconstructing hardcoded values
 * and replacing them with configurable options.
 */

module.exports = {
  paths: {
    public: 'public',
    extracted: 'public/extracted',
    sourcePdfs: 'source-pdfs',
    backup: 'public/backup',
    scripts: 'scripts',
    uploads: 'public/uploads',
    testPdfs: 'public/test-pdfs'
  },
  pdf: {
    defaultPdf: 'public/resume.pdf',
    backupPrefix: 'resume_',
    extractionTimeout: 60000,
    defaultFallbacks: {
      fontHeading: 'Arial, Helvetica, sans-serif',
      fontBody: 'Georgia, "Times New Roman", serif',
      fontMono: '"Courier New", monospace',
      colorPrimary: '#3366CC',
      colorBackground: '#FFFFFF',
      colorText: '#000000'
    }
  },
  openai: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  },
  build: {
    prebuildExtraction: true,
    generateImprovedMarkdown: true,
    backupOriginalPdf: true
  },
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    useEmoji: true,
    useColor: true
  }
};
