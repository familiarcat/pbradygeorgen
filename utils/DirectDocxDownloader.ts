/**
 * Direct DOCX Downloader
 *
 * A utility for directly downloading DOCX files without complex fallback mechanisms.
 * This ensures that Word documents are always downloaded properly in all browsers.
 *
 * Following philosophies:
 * - Occam's razor: the simplest solution is often the best
 * - Derrida: deconstructing hardcoded implementations
 * - Hesse: mathematical harmony in implementation patterns
 * - Müller-Brockmann: clean, grid-based structure
 * - Dante: methodical logging
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';

/**
 * Download a DOCX file directly from a URL
 *
 * @param docxUrl URL of the DOCX file to download
 * @param fileName Name to use for the downloaded file (without extension)
 * @returns Promise that resolves when download is complete
 */
export const downloadDocxFromUrl = async (docxUrl: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      DanteLogger.success.basic(`Starting direct DOCX download from ${docxUrl}`);

      // Create an iframe to handle the download (works in all browsers)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Set up a load event to track when the iframe has loaded
      iframe.onload = () => {
        // After loading, remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(iframe);
          DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
          resolve();
        }, 1000);
      };

      // Set the iframe source to the DOCX URL with download parameters
      iframe.src = `${docxUrl}?download=1&filename=${fileName}.docx`;

      // Also try the direct download approach as a backup
      setTimeout(() => {
        try {
          // Create a direct download link
          const link = document.createElement('a');
          link.href = docxUrl;
          link.download = `${fileName}.docx`;
          link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          document.body.appendChild(link);
          link.click();

          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        } catch (directError) {
          console.error('Direct download fallback failed:', directError);
          // Don't reject here, as the iframe method might still work
        }
      }, 500);
    } catch (error) {
      DanteLogger.error.runtime(`Error in direct DOCX download: ${error}`);
      reject(error);
    }
  });
};

/**
 * Generate and download a DOCX file
 *
 * @param content Markdown content to convert to DOCX
 * @param fileName Name to use for the downloaded file (without extension)
 * @returns Promise that resolves when download is complete
 */
export const generateAndDownloadDocx = async (content: string, fileName: string): Promise<void> => {
  try {
    HesseLogger.summary.start(`Generating and downloading ${fileName}.docx`);
    DanteLogger.success.basic(`Starting DOCX generation and download for ${fileName}`);

    // First try the direct binary download approach
    try {
      console.log(`[DEBUG] Attempting direct binary download for ${fileName}.docx`);

      // Call the API to generate and directly download the DOCX
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdownContent: content,
          fileName: fileName,
          forceDownload: true // Signal that this is for direct download
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate DOCX: ${response.statusText}`);
      }

      // For direct download, we get the file as a blob
      const blob = await response.blob();
      console.log(`[DEBUG] Received blob: type=${blob.type}, size=${blob.size} bytes`);

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${fileName}.docx`;
      a.setAttribute('type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via direct binary download`);
      HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);
      return;
    } catch (directError) {
      console.error(`[DEBUG] Direct binary download failed: ${directError}. Falling back to URL-based download.`);
      DanteLogger.error.runtime(`Direct binary download failed: ${directError}. Trying fallback.`);
    }

    // Fallback to the URL-based approach
    console.log(`[DEBUG] Using URL-based download fallback for ${fileName}.docx`);

    // Call the API to generate the DOCX (without forceDownload)
    const response = await fetch('/api/generate-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markdownContent: content,
        fileName: fileName,
        // No forceDownload here, so we get a JSON response with a URL
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate DOCX: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Failed to generate DOCX: ${data.error}`);
    }

    // Download the generated file
    await downloadDocxFromUrl(data.docxUrl, fileName);

    DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via URL-based download`);
    HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);
  } catch (error) {
    DanteLogger.error.runtime(`Error generating and downloading DOCX: ${error}`);
    throw error;
  }
};

export default {
  downloadDocxFromUrl,
  generateAndDownloadDocx
};
