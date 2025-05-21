/**
 * DOCX Service
 *
 * This service provides functions for generating and downloading Microsoft Word (.docx) documents.
 * It follows the Müller-Brockmann philosophy of grid-based layouts and clear typography,
 * the Derrida philosophy of deconstructing hardcoded values, and the Hesse philosophy of
 * mathematical harmony in implementation patterns.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';

/**
 * Interface for DOCX download options
 */
export interface DocxDownloadOptions {
  title?: string;
  creator?: string;
  description?: string;
  headingFont?: string;
  bodyFont?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  [key: string]: any;
}

/**
 * Interface for DOCX download result
 */
export interface DocxDownloadResult {
  success: boolean;
  docxUrl?: string;
  fileName?: string;
  isHtml?: boolean;
  error?: string;
}

/**
 * DOCX Service
 */
export const DocxService = {
  /**
   * Check if a pre-generated DOCX file exists
   *
   * @param fileName Base file name without extension
   * @returns Promise that resolves with the DOCX download result
   */
  checkPreGeneratedDocx: async (fileName: string): Promise<DocxDownloadResult> => {
    try {
      HesseLogger.summary.start(`Checking for pre-generated DOCX: ${fileName}`);
      DanteLogger.success.basic(`Checking for pre-generated DOCX: ${fileName}`);

      // Call the API to check if the DOCX file exists
      const response = await fetch(`/api/generate-docx?fileName=${fileName}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get DOCX file');
      }

      DanteLogger.success.basic(`Found pre-generated DOCX: ${data.docxUrl}`);
      return data;
    } catch (error) {
      DanteLogger.error.runtime(`Pre-generated DOCX not found: ${error}`);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Download a DOCX file using a pre-generated URL
   *
   * @param docxUrl URL of the DOCX file
   * @param fileName Base file name without extension
   * @param isHtml Whether the file is HTML (fallback)
   * @returns Promise that resolves when download is complete
   */
  downloadFromUrl: async (
    docxUrl: string,
    fileName: string,
    isHtml: boolean = false
  ): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        HesseLogger.summary.start(`Downloading DOCX from URL: ${docxUrl}`);
        DanteLogger.success.basic(`Downloading DOCX from URL: ${docxUrl}`);

        if (isHtml) {
          // For HTML fallback, we need to open it in a new tab
          // and let the user save it as a Word document
          DanteLogger.success.basic(`Using HTML fallback for DOCX download`);
          window.open(docxUrl, '_blank');
          DanteLogger.success.ux(`Opened ${fileName} in a new tab for saving as Word document`);
          HesseLogger.summary.complete(`${fileName} opened for saving as Word document`);
          resolve();
          return;
        }

        // Create a link to download the file
        const link = document.createElement('a');
        link.href = docxUrl;
        link.download = `${fileName}.docx`;
        link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        document.body.appendChild(link);
        link.click();

        // Small delay before removing the element
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);

        DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
        HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading DOCX from URL: ${error}`);
        HesseLogger.summary.error(`DOCX download from URL failed: ${error}`);
        reject(error);
      }
    });
  },

  /**
   * Generate and download a DOCX file from markdown content
   *
   * @param content Markdown content to convert to DOCX
   * @param fileName Base file name without extension
   * @param options DOCX generation options
   * @returns Promise that resolves when download is complete
   */
  generateDocx: async (
    content: string,
    fileName: string = 'document',
    options: DocxDownloadOptions = {}
  ): Promise<DocxDownloadResult> => {
    try {
      HesseLogger.summary.start(`Generating DOCX for ${fileName}`);
      DanteLogger.success.basic(`Generating DOCX for ${fileName}`);

      // Call the API to generate the DOCX
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdownContent: content,
          fileName: fileName,
          options: options
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate DOCX: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Failed to generate DOCX: ${data.error}`);
      }

      DanteLogger.success.basic(`DOCX generated successfully: ${data.docxUrl}`);
      HesseLogger.summary.complete(`DOCX generated successfully for ${fileName}`);

      return data;
    } catch (error) {
      DanteLogger.error.runtime(`Error generating DOCX: ${error}`);
      HesseLogger.summary.error(`DOCX generation failed: ${error}`);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Download a DOCX file with comprehensive fallback strategy
   *
   * This method first checks for a pre-generated DOCX file, and if not found,
   * generates a new one from the provided content.
   *
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
    return new Promise(async (resolve, reject) => {
      try {
        HesseLogger.summary.start(`Exporting ${fileName} as DOCX`);
        DanteLogger.success.basic(`Starting DOCX download for ${fileName}`);

        // First try to use a pre-generated DOCX file
        try {
          const preGenResult = await DocxService.checkPreGeneratedDocx(fileName);

          if (preGenResult.success && preGenResult.docxUrl) {
            // Download the pre-generated file
            await DocxService.downloadFromUrl(
              preGenResult.docxUrl,
              fileName,
              preGenResult.isHtml || false
            );
            resolve();
            return;
          }
        } catch (preGenError) {
          DanteLogger.error.runtime(`Error using pre-generated DOCX: ${preGenError}`);
          // Continue to fallback
        }

        // Fallback to generating a new DOCX file
        const genResult = await DocxService.generateDocx(content, fileName, options);

        if (genResult.success && genResult.docxUrl) {
          // Download the generated file
          await DocxService.downloadFromUrl(
            genResult.docxUrl,
            fileName,
            genResult.isHtml || false
          );
          resolve();
        } else {
          throw new Error(genResult.error || 'Failed to generate DOCX');
        }
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading DOCX: ${error}`);
        HesseLogger.summary.error(`DOCX download failed: ${error}`);
        reject(error);
      }
    });
  }
};

export default DocxService;
