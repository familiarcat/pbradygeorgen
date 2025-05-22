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
      console.log(`[DEBUG] Checking for pre-generated DOCX: ${fileName}`);
      HesseLogger.summary.start(`Checking for pre-generated DOCX: ${fileName}`);
      DanteLogger.success.basic(`Checking for pre-generated DOCX: ${fileName}`);

      // Call the API to check if the DOCX file exists
      const apiUrl = `/api/generate-docx?fileName=${fileName}`;
      console.log(`[DEBUG] Making API request to: ${apiUrl}`);
      const response = await fetch(apiUrl);

      console.log(`[DEBUG] API response status: ${response.status}`);
      if (!response.ok) {
        console.error(`[DEBUG] API error: ${response.status} ${response.statusText}`);
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[DEBUG] API response data:`, data);

      if (!data.success) {
        console.error(`[DEBUG] API returned error: ${data.error || 'Unknown error'}`);
        throw new Error(data.error || 'Failed to get DOCX file');
      }

      console.log(`[DEBUG] Found pre-generated DOCX: ${data.docxUrl}, isHtml: ${data.isHtml || false}`);
      DanteLogger.success.basic(`Found pre-generated DOCX: ${data.docxUrl}`);
      return data;
    } catch (error) {
      console.error(`[DEBUG] Error checking pre-generated DOCX: ${error}`);
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
        console.log(`[DEBUG] Downloading DOCX from URL: ${docxUrl}, fileName: ${fileName}, isHtml: ${isHtml}`);
        HesseLogger.summary.start(`Downloading DOCX from URL: ${docxUrl}`);
        DanteLogger.success.basic(`Downloading DOCX from URL: ${docxUrl}`);

        if (isHtml) {
          // For HTML fallback, we need to open it in a new tab
          // and let the user save it as a Word document
          console.log(`[DEBUG] Using HTML fallback for DOCX download`);
          DanteLogger.success.basic(`Using HTML fallback for DOCX download`);
          window.open(docxUrl, '_blank');
          DanteLogger.success.ux(`Opened ${fileName} in a new tab for saving as Word document`);
          HesseLogger.summary.complete(`${fileName} opened for saving as Word document`);
          resolve();
          return;
        }

        // The most reliable method: Using fetch and blob
        console.log(`[DEBUG] Using fetch and blob method for DOCX download`);

        try {
          // Fetch the file
          const response = await fetch(docxUrl);
          console.log(`[DEBUG] Fetch response status: ${response.status}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }

          // Convert to blob
          const blob = await response.blob();
          console.log(`[DEBUG] Blob created, size: ${blob.size}, type: ${blob.type}`);

          // Create a blob URL
          const blobUrl = URL.createObjectURL(blob);

          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `${fileName}.docx`;
          downloadLink.style.display = 'none';

          // Add to document, click, and remove
          document.body.appendChild(downloadLink);
          downloadLink.click();

          // Clean up
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
          }, 100);

          console.log(`[DEBUG] DOCX download initiated successfully`);
          DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
          HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);
          resolve();
        } catch (fetchError) {
          console.error(`[DEBUG] Error in fetch and blob method: ${fetchError}`);

          // Fallback to opening in a new tab
          console.log(`[DEBUG] Falling back to opening in a new tab`);
          window.open(docxUrl, '_blank');

          DanteLogger.success.ux(`Opened ${fileName}.docx in a new tab`);
          HesseLogger.summary.complete(`${fileName}.docx opened in a new tab`);
          resolve();
        }
      } catch (error) {
        console.error(`[DEBUG] Error downloading DOCX from URL: ${error}`);
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
