/**
 * ContentStateService
 *
 * A centralized service to manage the state of PDF content throughout the application.
 * Follows Hesse's principle of balance between structure and flexibility,
 * Salinger's authenticity in representing the true state of content,
 * Derrida's deconstruction of content into its essential properties,
 * and Dante's framework for navigating through different states of content.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { analyzeResumeContent } from './openaiPdfStructureService';

// Define the content state interface
export interface ContentState {
  lastUpdated: Date;
  fingerprint: string;
  isProcessed: boolean;
  isAnalyzed: boolean;
  pdfPath: string;
  pdfSize: number;
  pdfLastModified: Date;
}

// Define the change listener type
type ContentStateChangeListener = (newState: ContentState) => void;

/**
 * ContentStateService - Singleton service to manage PDF content state
 */
export class ContentStateService {
  private static instance: ContentStateService;
  private contentState: ContentState;
  private changeListeners: ContentStateChangeListener[] = [];
  private stateFilePath: string;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    // Initialize with default state
    this.contentState = {
      lastUpdated: new Date(0), // Unix epoch
      fingerprint: '',
      isProcessed: false,
      isAnalyzed: false,
      pdfPath: '',
      pdfSize: 0,
      pdfLastModified: new Date(0)
    };

    // Set the path to the state file
    this.stateFilePath = path.join(process.cwd(), 'public', 'extracted', 'content_state.json');

    // Load the state from file if it exists
    this.loadState();

    console.log('ContentStateService initialized');
    HesseLogger.summary.start('Content state service initialized');
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ContentStateService {
    if (!ContentStateService.instance) {
      ContentStateService.instance = new ContentStateService();
    }
    return ContentStateService.instance;
  }

  /**
   * Get the current content state
   */
  public getState(): ContentState {
    return { ...this.contentState }; // Return a copy to prevent direct mutation
  }

  /**
   * Get the content fingerprint
   */
  public getFingerprint(): string {
    return this.contentState.fingerprint;
  }

  /**
   * Check if the content has been processed
   */
  public isContentProcessed(): boolean {
    return this.contentState.isProcessed;
  }

  /**
   * Check if the content has been analyzed
   */
  public isContentAnalyzed(): boolean {
    return this.contentState.isAnalyzed;
  }

  /**
   * Update the content state
   */
  public updateState(newState: Partial<ContentState>): void {
    // Update the state
    this.contentState = {
      ...this.contentState,
      ...newState,
      lastUpdated: new Date()
    };

    // Save the state to file
    this.saveState();

    // Notify listeners
    this.notifyListeners();

    console.log('Content state updated');
    HesseLogger.summary.progress('Content state updated');
  }

  /**
   * Register a change listener
   */
  public onChange(listener: ContentStateChangeListener): () => void {
    this.changeListeners.push(listener);

    // Return a function to unregister the listener
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  /**
   * Generate a content fingerprint from a PDF buffer
   */
  public static generateContentFingerprint(pdfBuffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(pdfBuffer);
    return hash.digest('hex');
  }

  /**
   * Check if the content is stale based on a new fingerprint
   */
  public isContentStale(newFingerprint: string): boolean {
    return this.contentState.fingerprint !== newFingerprint;
  }

  /**
   * Check content freshness
   *
   * @param pdfPath Optional path to the PDF file
   * @returns Object containing the freshness check result
   */
  public async checkContentFreshness(pdfPath?: string): Promise<{
    isStale: boolean;
    reason?: string;
    currentFingerprint?: string;
    storedFingerprint?: string;
    lastUpdated?: Date;
  }> {
    try {
      HesseLogger.summary.start('Checking content freshness');

      // Use the provided path or default to the default resume
      const filePath = pdfPath || path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`PDF file not found at ${filePath}`);
      }

      // Read the file
      const pdfBuffer = fs.readFileSync(filePath);

      // Generate the fingerprint
      const currentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);

      // Get the stored fingerprint from the content state
      const storedFingerprint = this.contentState.fingerprint;
      const lastUpdated = this.contentState.lastUpdated;

      // Check if the content is processed and analyzed
      const isProcessed = this.contentState.isProcessed;
      const isAnalyzed = this.contentState.isAnalyzed;

      // Determine if the content is stale
      const isStale = currentFingerprint !== storedFingerprint || !isProcessed || !isAnalyzed;

      // Determine the reason
      let reason: string | undefined;
      if (currentFingerprint !== storedFingerprint) {
        reason = 'PDF content has changed';
        console.warn('PDF content has changed, refresh needed');
      } else if (!isProcessed) {
        reason = 'Content has not been processed';
        console.warn('Content has not been processed, processing needed');
      } else if (!isAnalyzed) {
        reason = 'Content has not been analyzed';
        console.warn('Content has not been analyzed, analysis needed');
      }

      if (isStale) {
        HesseLogger.summary.progress('Content is stale and needs refresh');
      } else {
        HesseLogger.summary.progress('Content is fresh and up-to-date');
      }

      return {
        isStale,
        reason,
        currentFingerprint,
        storedFingerprint,
        lastUpdated
      };
    } catch (error) {
      console.error('Error checking content freshness:', error);

      // If there's an error, assume the content is stale to be safe
      return {
        isStale: true,
        reason: `Error checking freshness: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Process PDF content
   *
   * @param pdfPath Path to the PDF file
   * @param forceRefresh Whether to force a refresh of the content
   * @returns Object containing the processing results
   */
  public async processPdfContent(pdfPath: string, forceRefresh: boolean = false): Promise<{
    success: boolean;
    message: string;
    contentFingerprint?: string;
    extractedContent?: any;
    analyzedContent?: any;
    isStale?: boolean;
  }> {
    try {
      HesseLogger.summary.start('Processing PDF content');

      // Check if the file exists
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found at ${pdfPath}`);
      }

      // Check if we need to refresh the content
      let needsRefresh = forceRefresh;

      if (!needsRefresh) {
        // Check if the content is stale
        const freshnessResult = await this.checkContentFreshness(pdfPath);
        if (freshnessResult.isStale) {
          console.log(`PDF content is stale: ${freshnessResult.reason}`);
          needsRefresh = true;
        }
      }

      // Get PDF metadata
      const stats = fs.statSync(pdfPath);
      const pdfSize = stats.size;
      const pdfModified = stats.mtime;
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Generate content fingerprint
      const contentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);

      // Update the content state with the new fingerprint
      this.updateState({
        fingerprint: contentFingerprint,
        pdfPath,
        pdfSize,
        pdfLastModified: pdfModified,
        isProcessed: false,
        isAnalyzed: false
      });

      // Create the extracted directory if it doesn't exist
      const extractedDir = path.join(process.cwd(), 'public', 'extracted');
      if (!fs.existsSync(extractedDir)) {
        fs.mkdirSync(extractedDir, { recursive: true });
      }

      // Extract content from the PDF if needed
      let extractedContent;
      const jsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');

      if (needsRefresh) {
        console.log('Extracting content from PDF');
        HesseLogger.summary.progress('Extracting content from PDF');

        // Run the extraction script
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        const extractionStart = Date.now();
        const { stdout, stderr } = await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);
        const extractionTime = Date.now() - extractionStart;

        if (stderr) {
          console.error(`Error extracting content: ${stderr}`);
          return { success: false, message: 'Error extracting content', isStale: true };
        }

        console.log(`Content extracted in ${extractionTime}ms`);
        HesseLogger.summary.progress(`Content extracted in ${extractionTime}ms`);

        // Update the content state to indicate processing is complete
        this.updateState({
          isProcessed: true
        });
      } else {
        console.log('Using cached content extraction');
        HesseLogger.summary.progress('Using cached content extraction');
      }

      // Read the extracted content
      if (!fs.existsSync(jsonPath)) {
        const error = 'Extracted content not found';
        console.error(error);
        return { success: false, message: error, isStale: true };
      }

      extractedContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Analyze the content with ChatGPT if needed
      let analyzedContent;
      const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

      if (needsRefresh || !fs.existsSync(analyzedPath) || !this.contentState.isAnalyzed) {
        console.log('Analyzing content with ChatGPT');
        HesseLogger.ai.start('Analyzing content with ChatGPT');

        const rawText = extractedContent.rawText;
        const analysisStart = Date.now();
        analyzedContent = await analyzeResumeContent(rawText);
        const analysisTime = Date.now() - analysisStart;

        console.log(`Content analyzed in ${analysisTime}ms`);
        HesseLogger.ai.success(`Content analyzed in ${analysisTime}ms`);

        // Save the analyzed content
        fs.writeFileSync(analyzedPath, JSON.stringify(analyzedContent, null, 2));

        // Update the content state to indicate analysis is complete
        this.updateState({
          isAnalyzed: true
        });
      } else {
        console.log('Using cached content analysis');
        HesseLogger.summary.progress('Using cached content analysis');

        // Read the cached analyzed content
        analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
      }

      // Update the build info
      const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');
      const buildInfo = {
        buildTimestamp: new Date().toISOString(),
        pdfInfo: {
          path: pdfPath,
          size: pdfSize,
          lastModified: pdfModified.toISOString(),
          contentFingerprint
        },
        extractionStatus: {
          textExtracted: true,
          markdownExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'resume_content.md')),
          fontsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'font_info.json')),
          colorsExtracted: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'color_theme.json')),
          chatGptAnalyzed: true
        },
        contentState: this.getState()
      };

      fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

      console.log('PDF processing completed successfully');
      HesseLogger.summary.complete('PDF processing completed successfully');

      return {
        success: true,
        message: 'PDF processed successfully',
        contentFingerprint,
        extractedContent,
        analyzedContent,
        isStale: false
      };
    } catch (error) {
      console.error('Error processing PDF content:', error);
      HesseLogger.summary.error(`Error processing PDF content: ${error}`);

      return {
        success: false,
        message: 'Error processing PDF content',
        isStale: true
      };
    }
  }

  /**
   * Format content for Cover Letter
   *
   * @param forceRefresh Whether to force a refresh of the content
   * @returns Formatted Cover Letter content
   */
  public async formatCoverLetterContent(forceRefresh: boolean = false): Promise<{
    success: boolean;
    content?: string;
    message?: string;
    isStale?: boolean;
  }> {
    try {
      HesseLogger.summary.start('Formatting Cover Letter content');

      // Process the PDF content
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
      const processResult = await this.processPdfContent(pdfPath, forceRefresh);

      if (!processResult.success) {
        return {
          success: false,
          message: processResult.message,
          isStale: processResult.isStale
        };
      }

      // Get the analyzed content
      const analyzedContent = processResult.analyzedContent;

      // Format the content for Cover Letter
      // This would typically call the OpenAI service to format the content
      // For now, we'll create a simple markdown template

      const name = analyzedContent.structuredContent.name || 'Applicant';
      const summary = analyzedContent.structuredContent.summary || '';
      const skills = analyzedContent.structuredContent.skills || [];
      const experience = analyzedContent.structuredContent.experience || [];

      let coverLetterContent = `# Cover Letter for ${name}\n\n`;

      // Add summary
      if (summary) {
        coverLetterContent += `## Summary\n\n${summary}\n\n`;
      }

      // Add skills section
      if (skills.length > 0) {
        coverLetterContent += `## Skills\n\n`;
        skills.forEach((skill: any) => {
          coverLetterContent += `- ${skill.text}\n`;
        });
        coverLetterContent += '\n';
      }

      // Add experience section
      if (experience.length > 0) {
        coverLetterContent += `## Experience\n\n`;
        experience.slice(0, 3).forEach((exp: any) => {
          coverLetterContent += `### ${exp.title} at ${exp.company}\n`;
          coverLetterContent += `*${exp.period}*\n\n`;
          if (exp.description) {
            coverLetterContent += `${exp.description}\n\n`;
          }
        });
      }

      // Add closing
      coverLetterContent += `## Closing\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nSincerely,\n\n${name}`;

      console.log('Cover Letter content formatted successfully');
      HesseLogger.summary.complete('Cover Letter content formatted successfully');

      return {
        success: true,
        content: coverLetterContent,
        isStale: false
      };
    } catch (error) {
      console.error('Error formatting Cover Letter content:', error);
      HesseLogger.summary.error(`Error formatting Cover Letter content: ${error}`);

      return {
        success: false,
        message: `Error formatting Cover Letter content: ${error instanceof Error ? error.message : String(error)}`,
        isStale: true
      };
    }
  }

  /**
   * Save the state to a file
   */
  private saveState(): void {
    try {
      // Ensure the directory exists
      const dir = path.dirname(this.stateFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the state to file
      fs.writeFileSync(
        this.stateFilePath,
        JSON.stringify(this.contentState, null, 2)
      );

      console.log('Content state saved to file');
    } catch (error) {
      console.error('Error saving content state to file:', error);
    }
  }

  /**
   * Load the state from a file
   */
  private loadState(): void {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const stateJson = fs.readFileSync(this.stateFilePath, 'utf8');
        const state = JSON.parse(stateJson);

        // Convert string dates back to Date objects
        state.lastUpdated = new Date(state.lastUpdated);
        state.pdfLastModified = new Date(state.pdfLastModified);

        this.contentState = state;

        console.log('Content state loaded from file');
        HesseLogger.summary.progress('Content state loaded from file');
      }
    } catch (error) {
      console.error('Error loading content state from file:', error);
    }
  }

  /**
   * Notify all listeners of a state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.changeListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in content state change listener:', error);
      }
    });
  }
}
