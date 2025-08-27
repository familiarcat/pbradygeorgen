import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import PdfGenerator from './PdfGenerator';

/**
 * Centralized service for handling all download operations in the application.
 * Follows the Hesse philosophy of harmonizing disparate elements into a cohesive whole.
 */
export const DownloadService = {
  /**
   * Download a PDF file from markdown content
   * @param content Markdown content to convert to PDF
   * @param fileName Base file name without extension
   * @param options PDF generation options
   * @returns Promise that resolves when download is complete
   */
  downloadPdf: async (
    content: string,
    fileName: string = 'document',
    options: any = {}
  ): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        HesseLogger.summary.start(`Exporting ${fileName} as PDF`);
        DanteLogger.success.basic(`Starting PDF download for ${fileName}`);

        // If we have a data URL, use it directly
        if (options.dataUrl) {
          DanteLogger.success.basic('Using provided PDF data URL for download');

          // Create a link to download the PDF from the data URL
          const link = document.createElement('a');
          link.href = options.dataUrl;
          link.download = `${fileName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Generate a new PDF
          DanteLogger.success.basic('Generating new PDF for download');

          // First generate a data URL to ensure consistent styling with preview
          const defaultOptions = {
            title: fileName,
            fileName: `${fileName}.pdf`,
            headerText: fileName,
            footerText: 'Generated with Salinger Design',
            pageSize: 'letter',
            margins: {
              top: 8,
              right: 8,
              bottom: 8,
              left: 8
            },
            ...options
          };

          // Generate a data URL first to ensure consistency with preview
          const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, defaultOptions);

          // Then download using the data URL
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${fileName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        DanteLogger.success.ux(`Downloaded ${fileName}.pdf successfully`);
        HesseLogger.summary.complete(`${fileName}.pdf downloaded successfully`);
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading PDF: ${error}`);
        HesseLogger.summary.error(`PDF download failed: ${error}`);
        reject(error);
      }
    });
  },

  /**
   * Download a Markdown file
   * @param content Markdown content
   * @param fileName Base file name without extension
   * @returns Promise that resolves when download is complete
   */
  downloadMarkdown: async (
    content: string,
    fileName: string = 'document'
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        HesseLogger.summary.start(`Exporting ${fileName} as Markdown`);
        DanteLogger.success.basic(`Starting Markdown download for ${fileName}`);

        // Create and download the file
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux(`Downloaded ${fileName}.md successfully`);
        HesseLogger.summary.complete(`${fileName}.md downloaded successfully`);
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading Markdown: ${error}`);
        HesseLogger.summary.error(`Markdown download failed: ${error}`);
        reject(error);
      }
    });
  },

  /**
   * Download a plain text file
   * @param content Text content
   * @param fileName Base file name without extension
   * @returns Promise that resolves when download is complete
   */
  downloadText: async (
    content: string,
    fileName: string = 'document'
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        HesseLogger.summary.start(`Exporting ${fileName} as Text`);
        DanteLogger.success.basic(`Starting Text download for ${fileName}`);

        // Create and download the file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux(`Downloaded ${fileName}.txt successfully`);
        HesseLogger.summary.complete(`${fileName}.txt downloaded successfully`);
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading Text: ${error}`);
        HesseLogger.summary.error(`Text download failed: ${error}`);
        reject(error);
      }
    });
  },

  /**
   * Convert markdown to plain text by removing markdown syntax
   * @param markdownContent Markdown content to convert
   * @returns Plain text content
   */
  convertMarkdownToText: (markdownContent: string): string => {
    return markdownContent
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/>/g, '') // Remove blockquotes
      .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks
  },

  /**
   * Generate a PDF data URL from markdown content
   * @param content Markdown content
   * @param options PDF generation options
   * @returns Promise that resolves with the PDF data URL
   */
  generatePdfDataUrl: async (
    content: string,
    options: any = {}
  ): Promise<string> => {
    try {
      HesseLogger.summary.start('Generating PDF data URL');
      DanteLogger.success.basic('Starting PDF data URL generation');

      // Default options for PDF generation
      const defaultOptions = {
        title: 'Document',
        fileName: 'document.pdf',
        headerText: 'Document',
        footerText: 'Generated with Salinger Design',
        pageSize: 'letter',
        margins: {
          top: 8,
          right: 8,
          bottom: 8,
          left: 8
        },
        ...options
      };

      // Generate the PDF data URL
      const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, defaultOptions);

      DanteLogger.success.ux('Generated PDF data URL successfully');
      HesseLogger.summary.complete('PDF data URL generated successfully');
      return dataUrl;
    } catch (error) {
      DanteLogger.error.runtime(`Error generating PDF data URL: ${error}`);
      HesseLogger.summary.error(`PDF data URL generation failed: ${error}`);
      throw error;
    }
  }
};

export default DownloadService;
