import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import PdfGenerator from './PdfGenerator';

/**
 * DownloadService
 *
 * A centralized service for handling all download operations in the application.
 *
 * Philosophical Framework:
 *
 * - Hesse's Glass Bead Game (Structure and Balance):
 *   The service creates a harmonious integration between different download formats,
 *   maintaining balance between consistency and format-specific requirements.
 *   Like Hesse's Glass Bead Game, it connects seemingly disparate elements (PDF, Markdown, Text)
 *   into a cohesive whole through structured, balanced interfaces.
 *
 * - Salinger's Authenticity:
 *   The service ensures authentic representation of content across different formats,
 *   preserving the genuine essence of the content regardless of the output format.
 *   It rejects "phony" representations by validating content and providing meaningful fallbacks.
 *
 * - Derrida's Deconstruction:
 *   The service deconstructs content into different formats while preserving its essential meaning.
 *   It examines the spaces between formats to ensure consistent representation and handles
 *   the transformation between formats with careful attention to content integrity.
 *
 * - Dante's Divine Comedy (Navigation):
 *   The service guides content through different stages of the download process,
 *   from validation to transformation to delivery, with clear error handling and recovery paths.
 *   The logging system provides emotional context for technical processes, humanizing the journey.
 */
export const DownloadService = {
  /**
   * Download content of any type in any format
   *
   * This unified method handles downloading content of any type in any format.
   * It uses the server actions to get the content from the ContentStateService.
   *
   * @param contentType The type of content ('resume' or 'cover_letter')
   * @param format The format to download ('pdf', 'markdown', or 'text')
   * @param fileName Optional file name (defaults to contentType)
   * @param options Additional options for the download
   * @returns Promise that resolves when download is complete
   */
  downloadContent: async (
    contentType: 'resume' | 'cover_letter',
    format: 'pdf' | 'markdown' | 'text',
    fileName?: string,
    options: any = {}
  ): Promise<void> => {
    // Begin the journey (Dante's navigation)
    const startTime = Date.now();
    HesseLogger.summary.start(`Downloading ${contentType} as ${format}`);
    DanteLogger.success.basic(`Starting ${contentType} download as ${format}`);
    console.log(`Starting downloadContent with contentType = ${contentType}, format = ${format}`);

    // Use the provided file name or default to the content type
    const defaultFileName = fileName || contentType;

    try {
      // Import the server action dynamically to avoid server/client mismatch
      const { getFormattedContent } = await import('@/app/actions/contentActions');

      // Get the content from the ContentStateService via server action
      console.log(`[DEBUG] Calling getFormattedContent for ${contentType} in ${format} format`);
      const result = await getFormattedContent(contentType, format);
      console.log(`[DEBUG] getFormattedContent result:`, {
        success: result.success,
        hasData: !!result.data,
        dataLength: result.data ? result.data.length : 0,
        error: result.error,
        metadata: result.metadata
      });

      if (!result.success) {
        const errorMsg = result.error || `Failed to get ${contentType} content in ${format} format`;
        console.error(`[DEBUG] Download error:`, errorMsg);
        DanteLogger.error.runtime(errorMsg);
        throw new Error(errorMsg);
      }

      // Validate that we have content data
      if (!result.data && format !== 'pdf') {
        const errorMsg = `No content data returned for ${contentType} in ${format} format`;
        console.error(`[DEBUG] Download error:`, errorMsg);
        DanteLogger.error.runtime(errorMsg);
        throw new Error(errorMsg);
      }

      // Use the appropriate download method based on the format
      if (format === 'pdf') {
        if (contentType === 'resume') {
          // For resume PDF, we just download the default PDF file
          await DownloadService.downloadFile(`/default_resume.pdf?v=${Date.now()}`, `${defaultFileName}.pdf`);
          console.log(`Downloaded ${defaultFileName}.pdf`);
          DanteLogger.success.ux(`Downloaded ${defaultFileName}.pdf`);
          HesseLogger.summary.complete(`${defaultFileName}.pdf downloaded successfully`);
        } else {
          // For cover letter PDF, we need to generate it from the markdown content
          if (!result.data) {
            throw new Error('Cover letter content is empty');
          }

          // Check if the result data is already a data URL (starts with "data:")
          if (result.data.startsWith('data:')) {
            console.log(`[DEBUG] Result data appears to be a data URL, using directly`);
            await DownloadService.downloadFile(result.data, `${defaultFileName}.pdf`);
          } else {
            // Generate a PDF from the markdown content
            console.log(`[DEBUG] Generating PDF for cover letter from markdown content (${result.data.length} chars)`);

            // Generate a data URL for the PDF
            const dataUrl = await DownloadService.generatePdfDataUrl(result.data, {
              title: 'Cover Letter',
              fileName: `${defaultFileName}.pdf`,
              headerText: 'Cover Letter',
              footerText: 'Generated with Salinger Design',
              isDarkTheme: true, // Cover letters use dark theme
              ...options
            });

            // Download the PDF using the data URL
            await DownloadService.downloadFile(dataUrl, `${defaultFileName}.pdf`);
          }
        }
      } else if (format === 'markdown') {
        await DownloadService.downloadMarkdown(
          result.data,
          defaultFileName,
          {
            useServerFormatting: false, // Already formatted by server action
            contentType,
            addTimestamp: true,
            fallbackToText: true,
            ...options
          }
        );
      } else if (format === 'text') {
        await DownloadService.downloadText(result.data, defaultFileName);
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error(`Error downloading ${contentType} as ${format}:`, error);
      DanteLogger.error.runtime(`Error downloading ${contentType} as ${format}: ${error}`);
      HesseLogger.summary.error(`Error downloading ${contentType} as ${format}: ${error}`);

      // Try to provide a fallback download if possible
      if (format !== 'text') {
        try {
          console.log(`[DEBUG] Attempting fallback to text download for ${contentType}`);
          DanteLogger.warn.deprecated(`Falling back to text download for ${contentType}`);

          // Get plain text content
          const { getFormattedContent } = await import('@/app/actions/contentActions');
          const textResult = await getFormattedContent(contentType, 'text');

          if (textResult.success && textResult.data) {
            await DownloadService.downloadText(textResult.data, defaultFileName);
            console.log(`[DEBUG] Fallback text download completed successfully`);
            return; // Success with fallback
          }
        } catch (fallbackError) {
          console.error(`[DEBUG] Fallback text download also failed:`, fallbackError);
          throw error; // Throw the original error
        }
      }

      // If we get here, both the original download and fallback failed
      throw error;
    }
  },

  /**
   * Helper function to download a file from a URL
   * @param url The URL of the file to download
   * @param fileName The name to save the file as
   * @returns Promise that resolves when download is complete
   */
  downloadFile: async (url: string, fileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
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
        console.log(`[DEBUG] Starting PDF download for ${fileName}`, {
          contentLength: content?.length,
          contentType: typeof content,
          hasDataUrl: !!options.dataUrl,
          dataUrlLength: options.dataUrl ? options.dataUrl.length : 0,
          options: JSON.stringify(options)
        });

        // Validate content if we're not using a data URL
        if (!options.dataUrl && (!content || content.trim() === '')) {
          const errorMsg = 'Cannot generate PDF: Content is empty';
          console.error(errorMsg);
          DanteLogger.error.runtime(errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        // If we have a data URL, use it directly
        if (options.dataUrl) {
          console.log(`[DEBUG] Using provided PDF data URL for download (${options.dataUrl.length} chars)`);
          DanteLogger.success.basic('Using provided PDF data URL for download');

          // Validate the data URL
          if (!options.dataUrl.startsWith('data:')) {
            console.error(`[DEBUG] Invalid data URL format, doesn't start with 'data:'`);
            throw new Error('Invalid data URL format');
          }

          try {
            // Create a link to download the PDF from the data URL
            console.log(`[DEBUG] Creating download link for PDF data URL`);
            const link = document.createElement('a');
            link.href = options.dataUrl;
            link.download = `${fileName}.pdf`;
            document.body.appendChild(link);
            console.log(`[DEBUG] Triggering download click for data URL`);
            link.click();
            document.body.removeChild(link);
            console.log(`[DEBUG] PDF download link clicked`);
          } catch (linkError) {
            console.error(`[DEBUG] Error creating download link:`, linkError);
            throw linkError;
          }
        } else {
          // Generate a new PDF
          console.log(`[DEBUG] No data URL provided, generating new PDF for download`);
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

          try {
            console.log(`[DEBUG] Generating PDF data URL from markdown content (${content.length} chars)`);

            // Generate a data URL first to ensure consistency with preview
            const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, defaultOptions);
            console.log(`[DEBUG] PDF data URL generated successfully (${dataUrl.length} chars)`);

            if (!dataUrl || dataUrl.length < 100) {
              throw new Error(`Generated PDF data URL is invalid or too short: ${dataUrl}`);
            }

            // Then download using the data URL
            console.log(`[DEBUG] Creating download link for PDF`);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${fileName}.pdf`;
            document.body.appendChild(link);
            console.log(`[DEBUG] Triggering download click`);
            link.click();
            document.body.removeChild(link);
            console.log(`[DEBUG] PDF download link clicked`);
          } catch (pdfError) {
            const errorMessage = pdfError instanceof Error ? pdfError.message : String(pdfError);
            DanteLogger.error.runtime(`Error generating PDF: ${errorMessage}`);
            console.error(`[DEBUG] Error generating PDF:`, pdfError);
            console.error(`[DEBUG] Error details:`, {
              errorType: typeof pdfError,
              errorMessage,
              errorStack: pdfError instanceof Error ? pdfError.stack : 'No stack trace',
              contentLength: content?.length || 0
            });

            // Fallback to simple text download if PDF generation fails
            DanteLogger.warn.deprecated('Falling back to text download due to PDF generation failure');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Still resolve the promise since we provided a fallback
            resolve();
            return;
          }
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
   *
   * This method embodies all four philosophical approaches:
   * - Hesse: Balancing structure (markdown format) with flexibility (content adaptation)
   * - Salinger: Ensuring authentic representation of the content in markdown format
   * - Derrida: Deconstructing content into markdown syntax while preserving meaning
   * - Dante: Guiding the content through the journey from raw data to downloaded file
   *
   * @param content Markdown content
   * @param fileName Base file name without extension
   * @param options Additional options for markdown formatting
   * @returns Promise that resolves when download is complete
   */
  downloadMarkdown: async (
    content: string,
    fileName: string = 'document',
    options: {
      useServerFormatting?: boolean;
      contentType?: string;
      addTimestamp?: boolean;
      fallbackToText?: boolean;
    } = {}
  ): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Begin the journey (Dante's navigation)
        const startTime = Date.now();
        HesseLogger.summary.start(`Exporting ${fileName} as Markdown`);
        DanteLogger.success.basic(`Starting Markdown download for ${fileName}`);
        console.log(`Starting Markdown download for ${fileName}`, {
          contentLength: content?.length,
          useServerFormatting: options.useServerFormatting,
          contentType: options.contentType
        });

        // Validate content (Salinger's authenticity principle)
        if (!content || content.trim() === '') {
          const errorMsg = 'Cannot download markdown: Content is empty';
          console.error(errorMsg);
          DanteLogger.error.runtime(errorMsg);

          // Create a minimal markdown file with an error message (Salinger's authentic fallback)
          content = `# Error: Empty Content\n\nThe markdown content was empty. This is a placeholder file.\n\nGenerated on: ${new Date().toLocaleString()}`;
          console.log('Content is empty, using placeholder content');
          DanteLogger.warn.deprecated('Content is empty, using placeholder content');
        }

        // Use server-side formatting if requested (Hesse's balanced approach)
        if (options.useServerFormatting && options.contentType) {
          try {
            DanteLogger.success.basic('Using server-side formatting for markdown content');
            console.log('Requesting server-side formatting for markdown content');

            // Import dynamically to avoid server/client mismatch
            const { formatContentAsMarkdown } = await import('@/app/actions/formatContentActions');
            const result = await formatContentAsMarkdown(content, options.contentType);

            if (result.success) {
              DanteLogger.success.ux('Server-side formatting successful');
              content = result.data;
            } else {
              DanteLogger.warn.deprecated(`Server-side formatting failed: ${result.error}`);
              console.warn('Server-side formatting failed, using original content');
            }
          } catch (formattingError) {
            DanteLogger.error.runtime(`Error in server-side formatting: ${formattingError}`);
            console.error('Error in server-side formatting:', formattingError);
            // Continue with original content
          }
        }

        // Add timestamp if requested (Derrida's deconstruction of time into content)
        if (options.addTimestamp) {
          const timestamp = new Date().toLocaleString();
          content += `\n\n---\n\n*Generated on: ${timestamp}*`;
        }

        // Create and download the file (Salinger's authentic delivery)
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Calculate download time (Dante's journey metrics)
        const downloadTime = Date.now() - startTime;

        console.log(`Downloaded ${fileName}.md successfully in ${downloadTime}ms`);
        DanteLogger.success.ux(`Downloaded ${fileName}.md successfully in ${downloadTime}ms`);
        HesseLogger.summary.complete(`${fileName}.md downloaded successfully`);
        resolve();
      } catch (error) {
        console.error('Error downloading Markdown:', error);
        DanteLogger.error.runtime(`Error downloading Markdown: ${error}`);
        HesseLogger.summary.error(`Markdown download failed: ${error}`);

        // Only fallback to text if option is enabled or not specified (default behavior)
        if (options.fallbackToText !== false) {
          try {
            // Dante's journey through Purgatorio (recovery from failure)
            console.log('Markdown download failed, falling back to text download');
            DanteLogger.warn.deprecated('Markdown download failed, falling back to text download');

            // Convert content to plain text or use a fallback message (Derrida's deconstruction)
            const textContent = content
              ? DownloadService.convertMarkdownToText(content)
              : `Markdown download failed. This is a fallback text file.\n\nGenerated on: ${new Date().toLocaleString()}`;

            // Add a header explaining the fallback (Salinger's authenticity)
            const fallbackContent =
              `FALLBACK TEXT VERSION\n` +
              `===================\n\n` +
              `Note: This is a plain text version created because the markdown download failed.\n\n` +
              `${textContent}`;

            // Create and download as text (Hesse's balanced fallback)
            const blob = new Blob([fallbackContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Calculate fallback time (Dante's journey metrics)
            const fallbackTime = Date.now() - startTime;

            console.log(`Fallback: Downloaded ${fileName}.txt successfully in ${fallbackTime}ms`);
            DanteLogger.success.ux(`Fallback: Downloaded ${fileName}.txt successfully in ${fallbackTime}ms`);

            // Still resolve the promise since we provided a fallback
            resolve();
          } catch (fallbackError) {
            console.error('Fallback text download also failed:', fallbackError);
            DanteLogger.error.system('Both markdown and fallback text downloads failed');
            reject(error); // Reject with the original error
          }
        } else {
          // No fallback requested, reject with the original error
          DanteLogger.error.runtime('Markdown download failed and fallback was disabled');
          reject(error);
        }
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
   *
   * This method embodies Derrida's deconstruction philosophy by breaking down
   * markdown syntax into its essential textual meaning, preserving the content
   * while removing the structural elements.
   *
   * @param markdownContent Markdown content to convert
   * @returns Plain text content
   */
  convertMarkdownToText: (markdownContent: string): string => {
    if (!markdownContent) return '';

    // Derrida's deconstruction of markdown into plain text
    return markdownContent
      // Structure elements
      .replace(/#{1,6}\s+(.+)$/gm, '$1\n') // Convert headers to text with line break
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/__(.+?)__/g, '$1') // Remove underline
      .replace(/_(.+?)_/g, '$1') // Remove italic with underscore

      // Link elements
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text

      // Code elements
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks

      // Block elements
      .replace(/>/g, '') // Remove blockquotes
      .replace(/- /g, '• ') // Convert dashes in lists to bullets
      .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks

      // Table elements
      .replace(/\|/g, ' ') // Replace table separators with spaces
      .replace(/^[- |:]+$/gm, '') // Remove table formatting lines

      // Final cleanup
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .trim(); // Trim extra whitespace
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
      console.log(`[DEBUG] Starting PDF data URL generation with content (${content?.length || 0} chars)`, {
        contentType: typeof content,
        contentFirstChars: content ? content.substring(0, 50) + '...' : 'N/A',
        options: JSON.stringify(options)
      });

      // Validate content
      if (!content || content.trim() === '') {
        const errorMsg = 'Cannot generate PDF data URL: Content is empty';
        console.error(`[DEBUG] ${errorMsg}`);
        DanteLogger.error.runtime(errorMsg);
        throw new Error(errorMsg);
      }

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

      console.log(`[DEBUG] PDF generation options:`, defaultOptions);

      // Generate the PDF data URL
      console.log(`[DEBUG] Calling PdfGenerator.generatePdfDataUrlFromMarkdown`);
      const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(content, defaultOptions);

      if (!dataUrl || dataUrl.length < 100) {
        const errorMsg = `Generated PDF data URL is invalid or too short: ${dataUrl}`;
        console.error(`[DEBUG] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log(`[DEBUG] PDF data URL generated successfully (${dataUrl.length} chars)`);
      DanteLogger.success.ux('Generated PDF data URL successfully');
      HesseLogger.summary.complete('PDF data URL generated successfully');
      return dataUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[DEBUG] Error generating PDF data URL:`, error);
      console.error(`[DEBUG] Error details:`, {
        errorType: typeof error,
        errorMessage,
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        contentLength: content?.length || 0
      });
      DanteLogger.error.runtime(`Error generating PDF data URL: ${errorMessage}`);
      HesseLogger.summary.error(`PDF data URL generation failed: ${errorMessage}`);
      throw error;
    }
  }
};

export default DownloadService;
