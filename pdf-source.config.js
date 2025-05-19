/**
 * PDF Source Configuration
 *
 * This file specifies which PDF should be used as the source for extraction.
 * It follows the Derrida philosophy of deconstructing hardcoded values
 * and replacing them with configurable options.
 */

module.exports = {
  // The active PDF source to use for extraction
  active: 'high-contrast', // Options: 'default', 'high-contrast', or any other PDF name in source-pdfs

  // Configuration for each PDF source
  sources: {
    // Default PDF in the public directory
    default: {
      path: 'public/resume.pdf', // Generic name, will be copied from the selected PDF
      outputPrefix: 'default_',
      description: 'Default resume PDF'
    },
    // High contrast PDF in the source-pdfs directory
    'high-contrast': {
      path: 'source-pdfs/high-contrast.pdf',
      outputPrefix: 'high_contrast_',
      description: 'High contrast resume PDF with better color extraction'
    }
    // Add more PDF sources as needed
  }
};
