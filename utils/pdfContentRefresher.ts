/**
 * PDF Content Refresher
 *
 * This utility ensures that we're always using fresh content from the current PDF file.
 * It provides functions to check if content is stale and to force refresh the content.
 *
 * Enhanced with detailed logging and content fingerprinting to track changes.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { PdfExtractionLogger } from './PdfExtractionLogger';
import crypto from 'crypto';

const execAsync = promisify(exec);

interface ContentTimestamps {
  pdfTimestamp: number;
  extractedTimestamp: number;
  pdfSize: number;
  contentFingerprint: string;
  isStale: boolean;
}

/**
 * Check if the extracted content is stale compared to the PDF file
 * @returns Object with timestamps and stale status
 */
export async function checkContentFreshness(): Promise<ContentTimestamps> {
  try {
    HesseLogger.cache.check('Checking PDF content freshness');

    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    const extractedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');
    const fingerprintPath = path.join(process.cwd(), 'public', 'extracted', 'content_fingerprint.txt');

    // Check if files exist
    if (!fs.existsSync(pdfPath)) {
      DanteLogger.error.dataFlow('PDF file not found');
      PdfExtractionLogger.addStep('error', 'PDF file not found', { path: pdfPath });
      return {
        pdfTimestamp: 0,
        extractedTimestamp: 0,
        pdfSize: 0,
        contentFingerprint: '',
        isStale: true
      };
    }

    // Get PDF stats
    const pdfStats = fs.statSync(pdfPath);
    const pdfSize = pdfStats.size;
    const pdfModified = new Date(pdfStats.mtimeMs).toISOString();

    // Generate a content fingerprint based on file size and modification time
    // This helps us track if the PDF has changed
    const contentFingerprint = crypto
      .createHash('sha256')
      .update(`${pdfPath}:${pdfSize}:${pdfModified}`)
      .digest('hex');

    // Log PDF information
    PdfExtractionLogger.addStep('info', 'PDF file information', {
      path: pdfPath,
      size: pdfSize,
      lastModified: pdfModified,
      fingerprint: contentFingerprint
    });

    if (!fs.existsSync(extractedPath)) {
      DanteLogger.warn.deprecated('Extracted content not found');
      PdfExtractionLogger.addStep('warning', 'Extracted content not found', { path: extractedPath });
      return {
        pdfTimestamp: pdfStats.mtimeMs,
        extractedTimestamp: 0,
        pdfSize,
        contentFingerprint,
        isStale: true
      };
    }

    // Get extracted content stats
    const extractedStats = fs.statSync(extractedPath);

    // Check if we have a stored fingerprint
    let storedFingerprint = '';
    if (fs.existsSync(fingerprintPath)) {
      storedFingerprint = fs.readFileSync(fingerprintPath, 'utf8').trim();
      PdfExtractionLogger.addStep('info', 'Found stored content fingerprint', {
        fingerprint: storedFingerprint.substring(0, 8) + '...'
      });
    }

    // Determine if content is stale based on multiple factors:
    // 1. PDF is newer than extracted content
    // 2. Content fingerprint has changed
    const timeStale = pdfStats.mtimeMs > extractedStats.mtimeMs;
    const fingerprintStale = storedFingerprint !== contentFingerprint && storedFingerprint !== '';
    const isStale = timeStale || fingerprintStale || !storedFingerprint;

    if (isStale) {
      if (timeStale) {
        DanteLogger.warn.deprecated('PDF content is stale (timestamp mismatch), needs refresh');
        PdfExtractionLogger.addStep('warning', 'PDF content is stale due to timestamp mismatch', {
          pdfTimestamp: pdfModified,
          extractedTimestamp: new Date(extractedStats.mtimeMs).toISOString()
        });
      }

      if (fingerprintStale) {
        DanteLogger.warn.deprecated('PDF content is stale (fingerprint mismatch), needs refresh');
        PdfExtractionLogger.addStep('warning', 'PDF content is stale due to fingerprint mismatch', {
          currentFingerprint: contentFingerprint.substring(0, 8) + '...',
          storedFingerprint: storedFingerprint.substring(0, 8) + '...'
        });
      }

      if (!storedFingerprint) {
        DanteLogger.warn.deprecated('No content fingerprint found, needs refresh');
        PdfExtractionLogger.addStep('warning', 'No content fingerprint found');
      }
    } else {
      DanteLogger.success.basic('PDF content is fresh');
      PdfExtractionLogger.addStep('success', 'PDF content is fresh');
      HesseLogger.cache.hit('PDF content is fresh and up-to-date');
    }

    return {
      pdfTimestamp: pdfStats.mtimeMs,
      extractedTimestamp: extractedStats.mtimeMs,
      pdfSize,
      contentFingerprint,
      isStale
    };
  } catch (error) {
    DanteLogger.error.dataFlow(`Error checking content freshness: ${error}`);
    PdfExtractionLogger.addStep('error', 'Error checking content freshness', { error });
    return {
      pdfTimestamp: 0,
      extractedTimestamp: 0,
      pdfSize: 0,
      contentFingerprint: '',
      isStale: true
    };
  }
}

/**
 * Force refresh the extracted content from the PDF file
 * @returns Promise that resolves when the refresh is complete
 */
export async function forceRefreshContent(): Promise<boolean> {
  try {
    console.log(`🔄 Starting forced content refresh`);
    DanteLogger.success.basic('PDF content is stale, refreshing...');
    HesseLogger.cache.invalidate('Forcing PDF content refresh');

    // Get PDF information for logging
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    console.log(`📄 Processing PDF file: ${pdfPath}`);

    if (!fs.existsSync(pdfPath)) {
      DanteLogger.error.dataFlow('PDF file not found for refresh');
      PdfExtractionLogger.addStep('error', 'PDF file not found for refresh', { path: pdfPath });
      return false;
    }

    // Get PDF stats
    const pdfStats = fs.statSync(pdfPath);
    const pdfSize = pdfStats.size;
    const pdfModified = new Date(pdfStats.mtimeMs).toISOString();

    console.log(`📊 PDF size: ${pdfSize} bytes`);
    console.log(`⏱️ PDF last modified: ${pdfModified}`);

    // Generate a content fingerprint
    const contentFingerprint = crypto
      .createHash('sha256')
      .update(`${pdfPath}:${pdfSize}:${pdfModified}`)
      .digest('hex');

    console.log(`🔑 Generated content fingerprint: ${contentFingerprint.substring(0, 8)}...`);

    // Initialize the extraction logger
    PdfExtractionLogger.init(pdfPath, pdfSize, pdfModified, contentFingerprint);
    PdfExtractionLogger.addStep('info', 'Starting PDF content refresh');

    // Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // Save the content fingerprint
    const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
    fs.writeFileSync(fingerprintPath, contentFingerprint);
    PdfExtractionLogger.addStep('info', 'Saved content fingerprint', {
      fingerprint: contentFingerprint.substring(0, 8) + '...'
    });

    // Run the extract-pdf-text-improved.js script
    const scriptPath = path.join(process.cwd(), 'scripts', 'extract-pdf-text-improved.js');

    // Execute the script with the PDF path
    console.log(`🔍 Running text extraction script: ${scriptPath}`);
    PdfExtractionLogger.addStep('info', 'Running text extraction script', { script: scriptPath });

    const extractionStart = Date.now();
    const { stdout, stderr } = await execAsync(`node ${scriptPath} ${pdfPath}`);
    const extractionTime = Date.now() - extractionStart;

    console.log(`⏱️ Text extraction completed in ${extractionTime}ms`);

    if (stderr) {
      DanteLogger.error.dataFlow(`Error refreshing content: ${stderr}`);
      PdfExtractionLogger.addStep('error', 'Text extraction failed', { error: stderr });
      return false;
    }

    // Check if the extraction was successful
    const textPath = path.join(extractedDir, 'resume_content.txt');
    const markdownPath = path.join(extractedDir, 'resume_content.md');

    if (fs.existsSync(textPath)) {
      PdfExtractionLogger.updateStatus('text', true);

      // Log a preview of the extracted text
      const textContent = fs.readFileSync(textPath, 'utf8');
      const textPreview = textContent.substring(0, 200) + '...';
      console.log(`✅ Text extraction successful (${textContent.length} characters)`);
      console.log(`📝 Text preview: "${textPreview}"`);
      PdfExtractionLogger.addStep('success', 'Text extraction successful', {
        preview: textPreview,
        length: textContent.length
      });
    } else {
      console.error(`❌ Text file not found after extraction: ${textPath}`);
      PdfExtractionLogger.updateStatus('text', false);
      PdfExtractionLogger.addStep('error', 'Text file not found after extraction');
    }

    if (fs.existsSync(markdownPath)) {
      PdfExtractionLogger.updateStatus('markdown', true);

      // Log a preview of the markdown
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      const markdownPreview = markdownContent.substring(0, 200) + '...';
      console.log(`✅ Markdown generation successful (${markdownContent.length} characters)`);
      console.log(`📝 Markdown preview: "${markdownPreview}"`);
      PdfExtractionLogger.addStep('success', 'Markdown generation successful', {
        preview: markdownPreview,
        length: markdownContent.length
      });
    } else {
      console.error(`❌ Markdown file not found after extraction: ${markdownPath}`);
      PdfExtractionLogger.updateStatus('markdown', false);
      PdfExtractionLogger.addStep('error', 'Markdown file not found after extraction');
    }

    // Extract font information
    try {
      PdfExtractionLogger.addStep('info', 'Extracting font information');
      const fontScriptPath = path.join(process.cwd(), 'scripts', 'extract-pdf-fonts.js');
      await execAsync(`node ${fontScriptPath} ${pdfPath}`);

      const fontInfoPath = path.join(extractedDir, 'font_info.json');
      if (fs.existsSync(fontInfoPath)) {
        PdfExtractionLogger.updateStatus('fonts', true);
        PdfExtractionLogger.addStep('success', 'Font extraction successful');
      } else {
        PdfExtractionLogger.updateStatus('fonts', false);
        PdfExtractionLogger.addStep('warning', 'Font info file not found after extraction');
      }
    } catch (fontError) {
      PdfExtractionLogger.updateStatus('fonts', false);
      PdfExtractionLogger.addStep('error', 'Font extraction failed', { error: fontError });
    }

    // Extract color information
    try {
      PdfExtractionLogger.addStep('info', 'Extracting color information');
      const colorScriptPath = path.join(process.cwd(), 'scripts', 'extract-pdf-colors.js');
      await execAsync(`node ${colorScriptPath} ${pdfPath}`);

      const colorThemePath = path.join(extractedDir, 'color_theme.json');
      if (fs.existsSync(colorThemePath)) {
        PdfExtractionLogger.updateStatus('colors', true);

        // Log a preview of the color theme
        const colorTheme = JSON.parse(fs.readFileSync(colorThemePath, 'utf8'));
        PdfExtractionLogger.addStep('success', 'Color extraction successful', {
          theme: {
            primary: colorTheme.primary,
            secondary: colorTheme.secondary,
            accent: colorTheme.accent
          }
        });
      } else {
        PdfExtractionLogger.updateStatus('colors', false);
        PdfExtractionLogger.addStep('warning', 'Color theme file not found after extraction');
      }
    } catch (colorError) {
      PdfExtractionLogger.updateStatus('colors', false);
      PdfExtractionLogger.addStep('error', 'Color extraction failed', { error: colorError });
    }

    // Create a build info file
    const buildInfoPath = path.join(extractedDir, 'build_info.json');
    const buildInfo = {
      buildTimestamp: new Date().toISOString(),
      pdfInfo: {
        path: pdfPath,
        size: pdfSize,
        lastModified: pdfModified,
        contentFingerprint: contentFingerprint
      },
      extractionStatus: {
        textExtracted: fs.existsSync(textPath),
        markdownExtracted: fs.existsSync(markdownPath),
        fontsExtracted: fs.existsSync(path.join(extractedDir, 'font_info.json')),
        colorsExtracted: fs.existsSync(path.join(extractedDir, 'color_theme.json')),
        chatGptAnalyzed: fs.existsSync(path.join(extractedDir, 'resume_content_analyzed.json'))
      }
    };

    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    PdfExtractionLogger.addStep('info', 'Saved build info file');

    // Print a summary of the extraction
    PdfExtractionLogger.printSummary();

    console.log(`✅ PDF content refresh completed successfully`);
    console.log(`📄 Text file: ${path.join(extractedDir, 'resume_content.txt')}`);
    console.log(`📄 Markdown file: ${path.join(extractedDir, 'resume_content.md')}`);
    console.log(`📄 Font info file: ${path.join(extractedDir, 'font_info.json')}`);
    console.log(`📄 Color theme file: ${path.join(extractedDir, 'color_theme.json')}`);
    console.log(`📄 Build info file: ${path.join(extractedDir, 'build_info.json')}`);
    console.log(`📄 Content fingerprint file: ${path.join(extractedDir, 'content_fingerprint.txt')}`);

    DanteLogger.success.core('PDF content refreshed successfully');
    return true;
  } catch (error) {
    DanteLogger.error.dataFlow(`Error refreshing content: ${error}`);
    PdfExtractionLogger.addStep('error', 'Content refresh failed', { error });
    return false;
  }
}

/**
 * Get the extracted content from the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns The extracted content
 */
export async function getExtractedContent(forceRefresh = false): Promise<string> {
  try {
    HesseLogger.cache.check('Getting extracted PDF content');

    // Always force refresh for API calls to ensure we're using fresh content
    // This ensures we're not using cached content that might be from a previous PDF
    const alwaysForceRefresh = true; // Changed to always force refresh

    // Log the PDF file information
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const pdfPath = path.join(publicDir, 'default_resume.pdf');

      if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        console.log(`📄 PDF file being processed: ${pdfPath}`);
        console.log(`📊 PDF size: ${stats.size} bytes`);
        console.log(`⏱️ PDF last modified: ${new Date(stats.mtimeMs).toISOString()}`);

        PdfExtractionLogger.addStep('info', 'PDF file information', {
          path: pdfPath,
          size: stats.size,
          lastModified: new Date(stats.mtimeMs).toISOString()
        });
      } else {
        console.log(`⚠️ PDF file not found: ${pdfPath}`);
        PdfExtractionLogger.addStep('error', 'PDF file not found', { path: pdfPath });
        throw new Error(`PDF file not found: ${pdfPath}`);
      }
    } catch (error) {
      console.error('Error checking PDF file:', error);
      PdfExtractionLogger.addStep('error', 'Error checking PDF file', { error: String(error) });
    }

    // Check if content is stale
    const freshness = await checkContentFreshness();
    const { isStale, contentFingerprint } = freshness;

    // Log the content fingerprint
    if (contentFingerprint) {
      console.log(`🔑 Content fingerprint: ${contentFingerprint.substring(0, 8)}...`);
      console.log(`🔄 Content is stale: ${isStale ? 'Yes' : 'No'}`);
      console.log(`🔄 Force refresh requested: ${forceRefresh ? 'Yes' : 'No'}`);
      console.log(`🔄 Always force refresh: ${alwaysForceRefresh ? 'Yes' : 'No'}`);

      PdfExtractionLogger.addStep('info', 'Content fingerprint check', {
        fingerprint: contentFingerprint.substring(0, 8) + '...',
        isStale,
        forceRefresh: alwaysForceRefresh || forceRefresh
      });
    } else {
      console.log(`⚠️ No content fingerprint available`);
      PdfExtractionLogger.addStep('warning', 'No content fingerprint available');
    }

    // Force refresh if needed or always refresh for API calls
    if (isStale || alwaysForceRefresh || forceRefresh) {
      console.log(`🔄 Refreshing PDF content: ${isStale ? 'content is stale' : 'force refresh requested'}`);
      DanteLogger.warn.deprecated(`PDF content refresh: ${isStale ? 'content is stale' : 'force refresh requested'}`);
      PdfExtractionLogger.addStep('info', 'Forcing content refresh to ensure fresh data');

      const refreshSuccess = await forceRefreshContent();

      if (!refreshSuccess) {
        console.error(`❌ Failed to refresh PDF content`);
        DanteLogger.error.dataFlow('Failed to refresh PDF content');
        PdfExtractionLogger.addStep('error', 'Failed to refresh PDF content');
        throw new Error('Failed to refresh PDF content');
      } else {
        console.log(`✅ Successfully refreshed PDF content`);
      }
    } else {
      console.log(`✅ Using cached PDF content (still fresh)`);
      DanteLogger.success.basic('Using cached PDF content (still fresh)');
      PdfExtractionLogger.addStep('info', 'Using cached PDF content (still fresh)');
      HesseLogger.cache.hit('Using cached PDF content');
    }

    // Read the extracted content
    const extractedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

    if (!fs.existsSync(extractedPath)) {
      DanteLogger.error.dataFlow('Extracted content not found after refresh');
      PdfExtractionLogger.addStep('error', 'Extracted content not found after refresh', { path: extractedPath });
      return '';
    }

    // Read the content
    const content = fs.readFileSync(extractedPath, 'utf8');

    // Log a preview of the content
    const contentPreview = content.substring(0, 100) + '...';
    PdfExtractionLogger.addStep('success', 'Retrieved extracted content', { preview: contentPreview });

    return content;
  } catch (error) {
    DanteLogger.error.dataFlow(`Error getting extracted content: ${error}`);
    PdfExtractionLogger.addStep('error', 'Error getting extracted content', { error });
    return '';
  }
}

export default {
  checkContentFreshness,
  forceRefreshContent,
  getExtractedContent
};
