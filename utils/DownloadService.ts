import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import PdfGenerator from './PdfGenerator';
import DocxService, { DocxDownloadOptions } from './DocxService';

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
   * Convert markdown to plain text by removing markdown syntax while preserving structure
   * @param markdownContent Markdown content to convert
   * @returns Plain text content
   */
  convertMarkdownToText: (markdownContent: string): string => {
    if (!markdownContent || markdownContent.trim() === '') {
      console.warn('Empty markdown content provided to convertMarkdownToText');
      return '';
    }

    console.log('Converting markdown to text, length:', markdownContent.length);

    // Remove any triple backticks that might be wrapping the content
    let cleanedContent = markdownContent.trim();
    if (cleanedContent.startsWith('```')) {
      const endBackticks = cleanedContent.lastIndexOf('```');
      if (endBackticks > 3) {
        // Extract content between backticks, skipping the language identifier if present
        const firstLineEnd = cleanedContent.indexOf('\n');
        if (firstLineEnd > 0) {
          cleanedContent = cleanedContent.substring(firstLineEnd + 1, endBackticks).trim();
        } else {
          cleanedContent = cleanedContent.substring(3, endBackticks).trim();
        }
      }
    }

    // Process the content line by line to better preserve structure
    const lines = cleanedContent.split('\n');
    let result = '';
    let inList = false;
    let listIndent = '';
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Skip processing if this is a code block delimiter
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          // Start of code block - add a header
          result += '\n\nCODE BLOCK:\n';
        } else {
          // End of code block - add a separator
          result += '\n--- END CODE BLOCK ---\n\n';
        }
        continue;
      }

      // If we're in a code block, add the line as is with some indentation
      if (inCodeBlock) {
        result += '    ' + line + '\n';
        continue;
      }

      // Handle headers - convert to uppercase with underlines for h1/h2
      if (line.match(/^#{1,6}\s+/)) {
        const level = line.match(/^(#{1,6})\s+/)?.[1].length || 1;
        const text = line.replace(/^#{1,6}\s+/, '').toUpperCase();

        // Add spacing before headers
        if (result !== '') {
          result += '\n\n';
        }

        result += text;

        // Add underlines for h1 and h2
        if (level <= 2) {
          result += '\n' + (level === 1 ? '='.repeat(text.length) : '-'.repeat(text.length));
        }

        result += '\n\n';
        continue;
      }

      // Handle lists
      if (line.match(/^\s*[-*+]\s+/) || line.match(/^\s*\d+\.\s+/)) {
        if (!inList) {
          inList = true;
          result += '\n';
        }

        // Determine list indent level
        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1].length : 0;

        // Format list item
        if (line.match(/^\s*[-*+]\s+/)) {
          // Bullet list
          line = line.replace(/^\s*[-*+]\s+/, '  • ');
        } else {
          // Numbered list
          line = line.replace(/^\s*\d+\.\s+/, '  ' + (i + 1) + '. ');
        }

        // Add additional indentation based on nesting level
        if (indent > 0) {
          line = '  '.repeat(Math.floor(indent / 2)) + line;
        }

        result += line + '\n';
        continue;
      } else if (inList && line.trim() === '') {
        inList = false;
        result += '\n';
        continue;
      }

      // Handle blockquotes
      if (line.match(/^\s*>/)) {
        line = line.replace(/^\s*>\s?/, '  | ');
        result += line + '\n';
        continue;
      }

      // Handle horizontal rules
      if (line.match(/^\s*[-*_]{3,}\s*$/)) {
        result += '\n' + '-'.repeat(40) + '\n\n';
        continue;
      }

      // Handle regular paragraphs
      if (line.trim() !== '') {
        // Remove markdown formatting
        line = line
          .replace(/\*\*/g, '') // Remove bold
          .replace(/\*/g, '') // Remove italic
          .replace(/__/g, '') // Remove underline
          .replace(/_/g, '') // Remove italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
          .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
          .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks

        // Add line to result
        if (result !== '' && !result.endsWith('\n\n')) {
          result += ' '; // Join lines within paragraphs with spaces
        }
        result += line;
      } else if (i > 0 && lines[i-1].trim() !== '' && !result.endsWith('\n\n')) {
        // Add paragraph breaks
        result += '\n\n';
      }
    }

    // Final cleanup
    let finalResult = result
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
      .trim();

    // Log the first few characters to help with debugging
    console.log('Text conversion result (first 50 chars):',
      finalResult.substring(0, 50).replace(/\n/g, '\\n'));

    return finalResult;
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
  },

  /**
   * Download a DOCX file from markdown content
   * Delegates to DocxService to maintain consistency
   * @param content Markdown content to convert to DOCX
   * @param fileName Base file name without extension
   * @param options DOCX generation options
   * @returns Promise that resolves when download is complete
   */
  downloadDocx: async (
    content: string,
    fileName: string = 'document',
    options: DocxDownloadOptions = {}
  ): Promise<void> => {
    try {
      HesseLogger.summary.start(`Exporting ${fileName} as DOCX via DownloadService`);
      DanteLogger.success.basic(`Starting DOCX download for ${fileName} via DownloadService`);
      
      // Delegate to DocxService for actual implementation
      await DocxService.downloadDocx(content, fileName, options);
      
      DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via DownloadService`);
      HesseLogger.summary.complete(`${fileName}.docx downloaded successfully via DownloadService`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading DOCX via DownloadService: ${error}`);
      HesseLogger.summary.error(`DOCX download failed via DownloadService: ${error}`);
      throw error;
    }
  }
};

export default DownloadService;