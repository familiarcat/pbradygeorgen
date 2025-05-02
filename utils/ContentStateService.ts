/**
 * ContentStateService
 *
 * A centralized service to manage the state of PDF content throughout the application.
 *
 * Philosophical Framework:
 *
 * - Hesse's Glass Bead Game (Structure and Balance):
 *   The service creates a harmonious integration between different components,
 *   maintaining balance between structure and flexibility. Like Hesse's Glass Bead Game,
 *   it connects seemingly disparate elements (PDF processing, content analysis, UI rendering)
 *   into a cohesive whole through structured, balanced interfaces.
 *
 * - Salinger's Authenticity:
 *   The service ensures authentic representation of content state, rejecting "phony"
 *   cached data when the underlying content has changed. It maintains the genuine
 *   connection between the source PDF and its derived representations.
 *
 * - Derrida's Deconstruction:
 *   The service deconstructs PDF content into essential properties (fingerprint, metadata,
 *   processing status) to understand and track its state. It examines the spaces between
 *   content states to derive meaning and ensure consistency.
 *
 * - Dante's Divine Comedy (Navigation):
 *   The service guides content through different processing stages, from raw extraction
 *   to analysis to formatting, mirroring Dante's journey through different realms.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { analyzeResumeContent } from './openaiPdfStructureService';

/**
 * ContentState interface
 *
 * Represents the deconstructed state of PDF content (Derrida's philosophy)
 * with a balanced structure (Hesse's philosophy) that authentically
 * represents the content's true nature (Salinger's philosophy).
 */
export interface ContentState {
  lastUpdated: Date;          // When the state was last updated
  fingerprint: string;        // Unique hash representing the content (Derrida's deconstruction)
  isProcessed: boolean;       // Whether the content has been extracted and processed
  isAnalyzed: boolean;        // Whether the content has been analyzed with AI
  pdfPath: string;            // Path to the source PDF file
  pdfSize: number;            // Size of the PDF file in bytes
  pdfLastModified: Date;      // When the PDF file was last modified

  // Additional metadata for enhanced state tracking
  processingStage: 'none' | 'extracted' | 'analyzed' | 'formatted'; // Current stage in Dante's journey
  formatVersions: {           // Tracking of different format versions
    markdown: boolean;        // Whether markdown version exists
    text: boolean;            // Whether text version exists
    coverLetter: boolean;     // Whether cover letter version exists
  };
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
   *
   * Following Hesse's principle of balance, the constructor initializes
   * a well-structured default state while maintaining flexibility through
   * file-based state persistence.
   */
  private constructor() {
    // Initialize with default state (Hesse's balanced structure)
    this.contentState = {
      lastUpdated: new Date(0), // Unix epoch
      fingerprint: '',
      isProcessed: false,
      isAnalyzed: false,
      pdfPath: '',
      pdfSize: 0,
      pdfLastModified: new Date(0),
      // New fields for enhanced state tracking
      processingStage: 'none',
      formatVersions: {
        markdown: false,
        text: false,
        coverLetter: false
      }
    };

    // Set the path to the state file (Derrida's deconstruction of state into persistent form)
    this.stateFilePath = path.join(process.cwd(), 'public', 'extracted', 'content_state.json');

    // Load the state from file if it exists (Salinger's authenticity - use real state if available)
    this.loadState();

    console.log('ContentStateService initialized');
    HesseLogger.summary.start('Content state service initialized');
    DanteLogger.success.architecture('ContentStateService initialized - beginning the journey');
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
      console.log('Starting content freshness check');

      // Use the provided path or default to the default resume
      const filePath = pdfPath || path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        const errorMsg = `PDF file not found at ${filePath}`;
        console.error(errorMsg);
        DanteLogger.error.dataFlow(errorMsg);
        throw new Error(errorMsg);
      }

      // Read the file
      const pdfBuffer = fs.readFileSync(filePath);
      console.log(`Read PDF file: ${filePath} (${pdfBuffer.length} bytes)`);

      // Generate the fingerprint
      const currentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);

      // Get the stored fingerprint from the content state
      const storedFingerprint = this.contentState.fingerprint;
      const lastUpdated = this.contentState.lastUpdated;

      console.log('Fingerprint comparison:', {
        currentFingerprint: currentFingerprint.substring(0, 8) + '...',
        storedFingerprint: storedFingerprint ? storedFingerprint.substring(0, 8) + '...' : 'none'
      });

      // Check if the content is processed and analyzed
      const isProcessed = this.contentState.isProcessed;
      const isAnalyzed = this.contentState.isAnalyzed;

      // Determine if the content is stale
      const fingerprintChanged = currentFingerprint !== storedFingerprint;
      const isStale = fingerprintChanged || !isProcessed || !isAnalyzed;

      // Log detailed information about the freshness check
      console.log('Content freshness check details:', {
        fingerprintChanged,
        isProcessed,
        isAnalyzed,
        isStale,
        lastUpdated: lastUpdated ? lastUpdated.toISOString() : 'none'
      });

      // Determine the reason
      let reason: string | undefined;
      if (fingerprintChanged) {
        reason = 'PDF content has changed';
        console.warn('PDF content has changed, refresh needed');
        DanteLogger.warn.deprecated('PDF content has changed, refresh needed');
      } else if (!isProcessed) {
        reason = 'Content has not been processed';
        console.warn('Content has not been processed, processing needed');
        DanteLogger.warn.deprecated('Content has not been processed, processing needed');
      } else if (!isAnalyzed) {
        reason = 'Content has not been analyzed';
        console.warn('Content has not been analyzed, analysis needed');
        DanteLogger.warn.deprecated('Content has not been analyzed, analysis needed');
      }

      if (isStale) {
        HesseLogger.summary.progress('Content is stale and needs refresh');
        DanteLogger.warn.deprecated('Content is stale and needs refresh');
      } else {
        HesseLogger.summary.progress('Content is fresh and up-to-date');
        DanteLogger.success.basic('Content is fresh and up-to-date');
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
      DanteLogger.error.dataFlow(`Error checking content freshness: ${error}`);

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
   * Get formatted Resume content
   *
   * This method retrieves and formats the Resume content based on the requested format.
   * It follows the same philosophical approach as the Cover Letter formatting.
   *
   * @param format The format to return the content in ('markdown' or 'text')
   * @param forceRefresh Whether to force a refresh of the content
   * @returns Formatted Resume content with metadata
   */
  public async getResumeContent(
    format: 'markdown' | 'text' = 'markdown',
    forceRefresh: boolean = false
  ): Promise<{
    success: boolean;
    content?: string;
    message?: string;
    isStale?: boolean;
    metadata?: {
      generationTime: number;
      contentFingerprint: string;
      sections: string[];
    };
  }> {
    try {
      // Begin the journey (Dante's navigation)
      const startTime = Date.now();
      HesseLogger.summary.start(`Getting Resume content in ${format} format`);
      DanteLogger.success.basic(`Starting Resume content retrieval in ${format} format`);
      console.log(`Starting getResumeContent with format = ${format}, forceRefresh = ${forceRefresh}`);

      // Always check content freshness first (Salinger's authenticity)
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Verify the PDF file exists
      if (!fs.existsSync(pdfPath)) {
        const errorMsg = 'PDF file not found';
        console.error(errorMsg);
        DanteLogger.error.dataFlow(errorMsg);
        return {
          success: false,
          message: errorMsg,
          isStale: true
        };
      }

      // Process the PDF content if needed
      const processResult = await this.processPdfContent(pdfPath, forceRefresh);

      if (!processResult.success) {
        console.error('PDF processing failed:', processResult.message);
        return {
          success: false,
          message: processResult.message,
          isStale: processResult.isStale
        };
      }

      // Get the analyzed content
      let analyzedContent;
      const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

      if (fs.existsSync(analyzedPath)) {
        try {
          console.log(`Loading analyzed content from ${analyzedPath}`);
          const fileContent = fs.readFileSync(analyzedPath, 'utf8');
          analyzedContent = JSON.parse(fileContent);
          console.log('Successfully loaded analyzed content from file');
          DanteLogger.success.basic('Loaded analyzed content from file');
        } catch (parseError) {
          console.error('Error parsing analyzed content:', parseError);
          DanteLogger.error.dataFlow(`Error parsing analyzed content: ${parseError}`);
          return {
            success: false,
            message: `Error parsing analyzed content: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
            isStale: true
          };
        }
      } else {
        // If we don't have analyzed content, try to use the raw content file
        const resumePath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

        // Check if the file exists
        if (!fs.existsSync(resumePath)) {
          const errorMsg = 'Resume content file not found';
          console.error(errorMsg);
          DanteLogger.error.dataFlow(errorMsg);
          return {
            success: false,
            message: errorMsg,
            isStale: true
          };
        }
      }

      // Format the resume content from analyzed data
      let resumeContent;

      if (analyzedContent && analyzedContent.structuredContent) {
        // Use the analyzed content to create a rich markdown resume
        const structuredContent = analyzedContent.structuredContent;
        const name = structuredContent.name || 'Professional Resume';
        const summary = structuredContent.summary || '';
        const skills = structuredContent.skills || [];
        const experience = structuredContent.experience || [];
        const education = structuredContent.education || [];

        // Build the markdown content
        resumeContent = `# ${name}\n\n`;

        // Add summary
        if (summary) {
          resumeContent += `## Summary\n\n${summary}\n\n`;
        }

        // Add skills section
        if (skills.length > 0) {
          resumeContent += `## Skills\n\n`;
          skills.forEach((skill: any) => {
            resumeContent += `- ${skill.text || skill}\n`;
          });
          resumeContent += '\n';
        }

        // Add experience section
        if (experience.length > 0) {
          resumeContent += `## Experience\n\n`;
          experience.forEach((exp: any) => {
            resumeContent += `### ${exp.title || exp.position || 'Position'} at ${exp.company || exp.organization || 'Company'}\n`;
            resumeContent += `*${exp.period || exp.date || 'Period'}*\n\n`;
            if (exp.description) {
              resumeContent += `${exp.description}\n\n`;
            }
          });
        }

        // Add education section
        if (education.length > 0) {
          resumeContent += `## Education\n\n`;
          education.forEach((edu: any) => {
            resumeContent += `### ${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}\n`;
            resumeContent += `*${edu.period || edu.date || 'Period'}*\n\n`;
            if (edu.description) {
              resumeContent += `${edu.description}\n\n`;
            }
          });
        }

        // Add footer
        resumeContent += `\n\n---\n\nThis document was automatically extracted from a PDF resume. Generated on: ${new Date().toLocaleDateString()}`;
      } else {
        // Fallback to the raw content file if available
        const resumePath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

        if (fs.existsSync(resumePath)) {
          // Read the resume content
          resumeContent = fs.readFileSync(resumePath, 'utf8');
        } else {
          // Create a minimal default resume if no content is available
          resumeContent = `# Professional Resume\nThis document was automatically extracted from a PDF resume. Generated on: ${new Date().toLocaleDateString()}`;
        }
      }

      // Convert to text format if requested
      if (format === 'text') {
        // Simple markdown to text conversion
        resumeContent = resumeContent
          .replace(/#{1,6}\s+(.+)$/gm, '$1\n') // Convert headers to text with line break
          .replace(/\*\*/g, '') // Remove bold
          .replace(/\*/g, '') // Remove italic
          .replace(/__(.+?)__/g, '$1') // Remove underline
          .replace(/_(.+?)_/g, '$1') // Remove italic with underscore
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
          .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
          .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove inline code
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/>/g, '') // Remove blockquotes
          .replace(/- /g, '• ') // Convert dashes in lists to bullets
          .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
          .replace(/\|/g, ' ') // Replace table separators with spaces
          .replace(/^[- |:]+$/gm, '') // Remove table formatting lines
          .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
          .trim(); // Trim extra whitespace
      }

      // Extract section titles for metadata (Derrida's deconstruction)
      const sectionMatches = resumeContent.match(/^#{1,6}\s+(.+)$/gm) || [];
      const sections = sectionMatches.map(match => match.replace(/^#{1,6}\s+/, ''));

      // Calculate generation time (Dante's journey completion)
      const generationTime = Date.now() - startTime;

      console.log(`Resume content retrieved successfully (${resumeContent.length} characters) in ${generationTime}ms`);
      DanteLogger.success.perfection('Resume content retrieved successfully');
      HesseLogger.summary.complete('Resume content retrieved successfully');

      // Return the result with rich metadata (Hesse's structured response)
      return {
        success: true,
        content: resumeContent,
        isStale: false,
        metadata: {
          generationTime,
          contentFingerprint: this.getFingerprint() || '',
          sections
        }
      };
    } catch (error) {
      console.error('Error getting Resume content:', error);
      DanteLogger.error.dataFlow(`Error getting Resume content: ${error}`);
      HesseLogger.summary.error(`Error getting Resume content: ${error}`);

      return {
        success: false,
        message: `Error getting Resume content: ${error instanceof Error ? error.message : String(error)}`,
        isStale: true
      };
    }
  }

  /**
   * Get formatted content for any content type and format
   *
   * This unified method retrieves and formats content based on the requested type and format.
   * It serves as a single entry point for all content retrieval operations.
   *
   * @param contentType The type of content to retrieve ('resume' or 'cover_letter')
   * @param format The format to return the content in ('markdown', 'text', or 'pdf')
   * @param forceRefresh Whether to force a refresh of the content
   * @returns Formatted content with metadata
   */
  public async getFormattedContent(
    contentType: 'resume' | 'cover_letter',
    format: 'markdown' | 'text' | 'pdf' = 'markdown',
    forceRefresh: boolean = false
  ): Promise<{
    success: boolean;
    content?: string;
    dataUrl?: string; // For PDF format
    message?: string;
    isStale?: boolean;
    metadata?: {
      generationTime: number;
      contentFingerprint: string;
      sections: string[];
      format: string;
      contentType: string;
    };
  }> {
    try {
      // Begin the journey (Dante's navigation)
      const startTime = Date.now();
      HesseLogger.summary.start(`Getting ${contentType} content in ${format} format`);
      DanteLogger.success.basic(`Starting ${contentType} content retrieval in ${format} format`);
      console.log(`Starting getFormattedContent with contentType = ${contentType}, format = ${format}, forceRefresh = ${forceRefresh}`);

      // For PDF format, we need to handle it differently
      if (format === 'pdf') {
        // For resume PDF, we just return the path to the default PDF
        if (contentType === 'resume') {
          return {
            success: true,
            content: '/default_resume.pdf',
            isStale: false,
            metadata: {
              generationTime: Date.now() - startTime,
              contentFingerprint: this.getFingerprint() || '',
              sections: [],
              format,
              contentType
            }
          };
        }

        // For cover letter PDF, we need to get the markdown content first
        // and then it will be converted to PDF by the client
        const coverLetterResult = await this.formatCoverLetterContent(forceRefresh);

        if (!coverLetterResult.success) {
          return {
            success: false,
            message: coverLetterResult.message,
            isStale: coverLetterResult.isStale
          };
        }

        return {
          success: true,
          content: coverLetterResult.content,
          isStale: coverLetterResult.isStale,
          metadata: {
            generationTime: Date.now() - startTime,
            contentFingerprint: coverLetterResult.metadata?.contentFingerprint || '',
            sections: coverLetterResult.metadata?.sections || [],
            format,
            contentType
          }
        };
      }

      // For text and markdown formats
      if (contentType === 'resume') {
        return await this.getResumeContent(format as 'markdown' | 'text', forceRefresh);
      } else {
        const coverLetterResult = await this.formatCoverLetterContent(forceRefresh);

        if (!coverLetterResult.success) {
          return {
            success: false,
            message: coverLetterResult.message,
            isStale: coverLetterResult.isStale
          };
        }

        let content = coverLetterResult.content || '';

        // Convert to text format if requested
        if (format === 'text') {
          // Simple markdown to text conversion
          content = content
            .replace(/#{1,6}\s+(.+)$/gm, '$1\n') // Convert headers to text with line break
            .replace(/\*\*/g, '') // Remove bold
            .replace(/\*/g, '') // Remove italic
            .replace(/__(.+?)__/g, '$1') // Remove underline
            .replace(/_(.+?)_/g, '$1') // Remove italic with underscore
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
            .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
            .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove inline code
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/>/g, '') // Remove blockquotes
            .replace(/- /g, '• ') // Convert dashes in lists to bullets
            .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
            .replace(/\|/g, ' ') // Replace table separators with spaces
            .replace(/^[- |:]+$/gm, '') // Remove table formatting lines
            .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
            .trim(); // Trim extra whitespace
        }

        return {
          success: true,
          content,
          isStale: coverLetterResult.isStale,
          metadata: {
            generationTime: Date.now() - startTime,
            contentFingerprint: coverLetterResult.metadata?.contentFingerprint || '',
            sections: coverLetterResult.metadata?.sections || [],
            format,
            contentType
          }
        };
      }
    } catch (error) {
      console.error(`Error getting ${contentType} content in ${format} format:`, error);
      DanteLogger.error.dataFlow(`Error getting ${contentType} content in ${format} format: ${error}`);
      HesseLogger.summary.error(`Error getting ${contentType} content in ${format} format: ${error}`);

      return {
        success: false,
        message: `Error getting ${contentType} content in ${format} format: ${error instanceof Error ? error.message : String(error)}`,
        isStale: true
      };
    }
  }

  /**
   * Format content for Cover Letter
   *
   * This method embodies all four philosophical approaches:
   * - Hesse: Balancing structure (formatted content) with flexibility (dynamic generation)
   * - Salinger: Ensuring authentic representation of the resume content
   * - Derrida: Deconstructing content into meaningful sections
   * - Dante: Guiding the content through the journey from raw data to formatted letter
   *
   * @param forceRefresh Whether to force a refresh of the content
   * @returns Formatted Cover Letter content with metadata
   */
  public async formatCoverLetterContent(forceRefresh: boolean = false): Promise<{
    success: boolean;
    content?: string;
    message?: string;
    isStale?: boolean;
    metadata?: {
      generationTime: number;
      contentFingerprint: string;
      sections: string[];
    };
  }> {
    try {
      // Begin the journey (Dante's navigation)
      const startTime = Date.now();
      HesseLogger.summary.start('Formatting Cover Letter content');
      DanteLogger.success.basic('Starting Cover Letter content formatting');
      console.log(`Starting formatCoverLetterContent with forceRefresh = ${forceRefresh}`);

      // Always check content freshness first (Salinger's authenticity)
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

      // Verify the PDF file exists
      if (!fs.existsSync(pdfPath)) {
        const errorMsg = 'PDF file not found';
        console.error(errorMsg);
        DanteLogger.error.dataFlow(errorMsg);
        return {
          success: false,
          message: errorMsg,
          isStale: true
        };
      }

      // Read the PDF file to get its current fingerprint (Derrida's deconstruction)
      const pdfBuffer = fs.readFileSync(pdfPath);
      console.log(`Read PDF file: ${pdfPath} (${pdfBuffer.length} bytes)`);

      const currentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);
      const storedFingerprint = this.getFingerprint();

      console.log('Cover Letter fingerprint comparison:', {
        currentFingerprint: currentFingerprint.substring(0, 8) + '...',
        storedFingerprint: storedFingerprint ? storedFingerprint.substring(0, 8) + '...' : 'none'
      });

      // Check if content is processed and analyzed (Hesse's structured approach)
      const isProcessed = this.isContentProcessed();
      const isAnalyzed = this.isContentAnalyzed();
      const hasCoverLetter = this.contentState.formatVersions?.coverLetter || false;

      // Determine if content is stale based on fingerprint (Salinger's rejection of phoniness)
      const fingerprintChanged = currentFingerprint !== storedFingerprint;
      const isContentStale = fingerprintChanged || !isProcessed || !isAnalyzed || !hasCoverLetter;

      console.log('Cover Letter content freshness check:', {
        fingerprintChanged,
        isProcessed,
        isAnalyzed,
        hasCoverLetter,
        isContentStale
      });

      // Force refresh if content is stale (Salinger's authenticity principle)
      const shouldRefresh = forceRefresh || isContentStale;

      if (shouldRefresh) {
        const reason = fingerprintChanged
          ? 'PDF content has changed'
          : !isProcessed
            ? 'Content has not been processed'
            : !isAnalyzed
              ? 'Content has not been analyzed'
              : 'Force refresh requested';

        console.log(`Cover Letter content needs refresh: ${reason}`);
        DanteLogger.warn.deprecated(`Cover Letter content needs refresh: ${reason}`);
      } else {
        console.log('Cover Letter content is fresh, using cached content');
        DanteLogger.success.basic('Cover Letter content is fresh, using cached content');
      }

      // Process the PDF content if needed
      console.log(`Calling processPdfContent with shouldRefresh = ${shouldRefresh}`);
      const processResult = await this.processPdfContent(pdfPath, shouldRefresh);
      console.log('processPdfContent result:', {
        success: processResult.success,
        isStale: processResult.isStale,
        hasExtractedContent: !!processResult.extractedContent,
        hasAnalyzedContent: !!processResult.analyzedContent
      });

      if (!processResult.success) {
        console.error('PDF processing failed:', processResult.message);
        return {
          success: false,
          message: processResult.message,
          isStale: processResult.isStale
        };
      }

      // Get the analyzed content
      let analyzedContent;
      const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

      if (fs.existsSync(analyzedPath)) {
        try {
          console.log(`Loading analyzed content from ${analyzedPath}`);
          const fileContent = fs.readFileSync(analyzedPath, 'utf8');
          analyzedContent = JSON.parse(fileContent);
          console.log('Successfully loaded analyzed content from file');
          DanteLogger.success.basic('Loaded analyzed content from file');
        } catch (parseError) {
          console.error('Error parsing analyzed content:', parseError);
          DanteLogger.error.dataFlow(`Error parsing analyzed content: ${parseError}`);
          return {
            success: false,
            message: `Error parsing analyzed content: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
            isStale: true
          };
        }
      } else {
        // If we don't have analyzed content, use the result from processing
        console.log('Analyzed content file not found, using result from processing');
        analyzedContent = processResult.analyzedContent;

        if (!analyzedContent) {
          const errorMsg = 'Analyzed content not available';
          console.error(errorMsg);
          DanteLogger.error.dataFlow(errorMsg);
          return {
            success: false,
            message: errorMsg,
            isStale: true
          };
        }
      }

      // Validate analyzed content structure
      if (!analyzedContent.structuredContent) {
        const errorMsg = 'Analyzed content is missing structuredContent property';
        console.error(errorMsg);
        DanteLogger.error.dataFlow(errorMsg);
        return {
          success: false,
          message: errorMsg,
          isStale: true
        };
      }

      console.log('Formatting Cover Letter content from analyzed data');

      // Format the content for Cover Letter
      const name = analyzedContent.structuredContent?.name || 'Applicant';
      const summary = analyzedContent.structuredContent?.summary || '';
      const skills = analyzedContent.structuredContent?.skills || [];
      const experience = analyzedContent.structuredContent?.experience || [];

      let coverLetterContent = `# Cover Letter for ${name}\n\n`;

      // Add summary
      if (summary) {
        coverLetterContent += `## Summary\n\n${summary}\n\n`;
      }

      // Add skills section
      if (skills.length > 0) {
        coverLetterContent += `## Skills\n\n`;
        skills.forEach((skill: any) => {
          coverLetterContent += `- ${skill.text || skill}\n`;
        });
        coverLetterContent += '\n';
      }

      // Add experience section
      if (experience.length > 0) {
        coverLetterContent += `## Experience\n\n`;
        experience.slice(0, 3).forEach((exp: any) => {
          coverLetterContent += `### ${exp.title || exp.position || 'Position'} at ${exp.company || exp.organization || 'Company'}\n`;
          coverLetterContent += `*${exp.period || exp.date || 'Period'}*\n\n`;
          if (exp.description) {
            coverLetterContent += `${exp.description}\n\n`;
          }
        });
      }

      // Add closing
      coverLetterContent += `## Closing\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nSincerely,\n\n${name}`;

      // Validate the generated content
      if (!coverLetterContent || coverLetterContent.trim() === '') {
        const errorMsg = 'Generated Cover Letter content is empty';
        console.error(errorMsg);
        DanteLogger.error.dataFlow(errorMsg);
        return {
          success: false,
          message: errorMsg,
          isStale: true
        };
      }

      // Save the formatted cover letter to a file for caching (Derrida's persistence of deconstructed content)
      const coverLetterPath = path.join(process.cwd(), 'public', 'extracted', 'cover_letter.md');
      console.log(`Saving Cover Letter content to ${coverLetterPath}`);
      fs.writeFileSync(coverLetterPath, coverLetterContent);

      // Update the content state to indicate cover letter is available (Hesse's balanced state management)
      this.updateState({
        processingStage: 'formatted',
        formatVersions: {
          ...this.contentState.formatVersions,
          coverLetter: true
        }
      });

      // Calculate generation time (Dante's journey completion)
      const generationTime = Date.now() - startTime;

      // Extract section titles for metadata (Derrida's deconstruction)
      const sectionMatches = coverLetterContent.match(/^## (.+)$/gm) || [];
      const sections = sectionMatches.map(match => match.replace('## ', ''));

      console.log(`Cover Letter content formatted successfully (${coverLetterContent.length} characters) in ${generationTime}ms`);
      DanteLogger.success.perfection('Cover Letter content formatted successfully');
      HesseLogger.summary.complete('Cover Letter content formatted successfully');

      // Return the result with rich metadata (Hesse's structured response)
      return {
        success: true,
        content: coverLetterContent,
        isStale: isContentStale,
        metadata: {
          generationTime,
          contentFingerprint: currentFingerprint,
          sections
        }
      };
    } catch (error) {
      console.error('Error formatting Cover Letter content:', error);
      DanteLogger.error.dataFlow(`Error formatting Cover Letter content: ${error}`);
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
