/**
 * S3 Storage Service
 *
 * This service handles interactions with AWS S3 for storing and retrieving
 * PDF files and their processed content. It's designed to work with AWS Amplify's
 * serverless architecture and avoid read-only file system limitations.
 *
 * Philosophical Framework:
 * - Hesse: Balancing structure (S3 organization) with flexibility (dynamic content)
 * - Salinger: Ensuring authentic representation through content versioning
 * - Derrida: Deconstructing content into structured storage paths
 * - Dante: Guiding the content through different processing stages
 */

import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Define the S3 bucket name - this should be configured in your Amplify project
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'alexai-pdf-storage';
const S3_REGION = process.env.S3_REGION || 'us-east-1';

// Define the folder structure in S3
const S3_FOLDERS = {
  PDFS: 'pdfs/',
  EXTRACTED: 'extracted/',
  ANALYZED: 'analyzed/',
  COVER_LETTERS: 'cover-letters/',
  TEMP: 'temp/'
};

/**
 * Convert a stream to a buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * S3 Storage Service class
 */
export class S3StorageService {
  private s3Client: S3Client | null = null;
  private static instance: S3StorageService;
  private isS3Available: boolean = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    try {
      // Only initialize S3 client if we're in AWS Amplify or have AWS credentials
      if (this.shouldUseS3()) {
        // Initialize the S3 client
        this.s3Client = new S3Client({
          region: S3_REGION,
          // Credentials will be automatically loaded from the environment in AWS Amplify
        });

        this.isS3Available = true;
        DanteLogger.success.basic('S3StorageService initialized with S3 support');
        console.log(`S3StorageService initialized with bucket: ${S3_BUCKET_NAME}, region: ${S3_REGION}`);
      } else {
        this.isS3Available = false;
        DanteLogger.warn.deprecated('S3StorageService initialized without S3 support (local mode)');
        console.log('S3StorageService initialized in local mode (no S3 support)');
      }
    } catch (error) {
      this.isS3Available = false;
      console.error('Failed to initialize S3 client:', error);
      DanteLogger.error.system('Failed to initialize S3 client', error);
      console.log('S3StorageService initialized in local mode (S3 initialization failed)');
    }
  }

  /**
   * Get the singleton instance of the S3StorageService
   */
  public static getInstance(): S3StorageService {
    if (!S3StorageService.instance) {
      S3StorageService.instance = new S3StorageService();
    }
    return S3StorageService.instance;
  }

  /**
   * Check if the service is running in AWS Amplify
   */
  public isRunningInAmplify(): boolean {
    return !!process.env.AWS_EXECUTION_ENV;
  }

  /**
   * Check if S3 should be used
   * This is determined by:
   * 1. Running in AWS Amplify
   * 2. Having AWS credentials
   * 3. Having the S3_USE_LOCAL environment variable set to 'false'
   */
  public shouldUseS3(): boolean {
    // If explicitly set to use local storage, don't use S3
    if (process.env.S3_USE_LOCAL === 'true') {
      return false;
    }

    // If explicitly set to use S3, use it
    if (process.env.S3_USE_S3 === 'true') {
      return true;
    }

    // If running in AWS Amplify, use S3
    if (this.isRunningInAmplify()) {
      return true;
    }

    // If S3 bucket name and region are set, use S3
    if (process.env.S3_BUCKET_NAME && process.env.S3_REGION) {
      return true;
    }

    // Default to not using S3 for local development
    return false;
  }

  /**
   * Check if S3 is available
   */
  public isS3Ready(): boolean {
    return this.isS3Available && this.s3Client !== null;
  }

  /**
   * Generate a content fingerprint for a file
   */
  public generateContentFingerprint(fileBuffer: Buffer): string {
    return crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');
  }

  /**
   * Upload a file to S3 or local file system
   */
  public async uploadFile(
    fileBuffer: Buffer,
    s3Key: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{ success: boolean; message: string; s3Key?: string; url?: string; localPath?: string }> {
    // If S3 is not available, save to local file system
    if (!this.isS3Ready()) {
      return this.saveFileLocally(fileBuffer, s3Key, contentType);
    }

    try {
      HesseLogger.summary.start(`Uploading file to S3: ${s3Key}`);
      DanteLogger.success.basic(`Uploading file to S3: ${s3Key}`);

      // Upload the file to S3
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType
      });

      if (!this.s3Client) {
        throw new Error('S3 client is not initialized');
      }

      const response = await this.s3Client.send(command);

      const url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;

      HesseLogger.summary.complete(`File uploaded to S3: ${s3Key}`);
      DanteLogger.success.core(`File uploaded to S3: ${s3Key}`);

      return {
        success: true,
        message: 'File uploaded successfully',
        s3Key,
        url
      };
    } catch (error) {
      const errorMessage = `Error uploading file to S3: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error uploading file to S3', error);

      // Try to save locally as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.saveFileLocally(fileBuffer, s3Key, contentType);
    }
  }

  /**
   * Save a file to the local file system
   */
  private async saveFileLocally(
    fileBuffer: Buffer,
    s3Key: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{ success: boolean; message: string; localPath?: string }> {
    try {
      HesseLogger.summary.start(`Saving file locally: ${s3Key}`);
      DanteLogger.success.basic(`Saving file locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Create directory if it doesn't exist
      const directory = path.dirname(localPath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(localPath, fileBuffer);

      HesseLogger.summary.complete(`File saved locally: ${localPath}`);
      DanteLogger.success.core(`File saved locally: ${localPath}`);

      return {
        success: true,
        message: 'File saved locally',
        localPath
      };
    } catch (error) {
      const errorMessage = `Error saving file locally: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error saving file locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Convert an S3 key to a local file path
   */
  private s3KeyToLocalPath(s3Key: string): string {
    // Base directory for local storage
    const baseDir = path.join(process.cwd(), 'public');

    // Convert S3 key to local path
    return path.join(baseDir, s3Key);
  }

  /**
   * Download a file from S3 or local file system
   */
  public async downloadFile(
    s3Key: string
  ): Promise<{ success: boolean; message: string; data?: Buffer; contentType?: string; localPath?: string }> {
    // If S3 is not available, read from local file system
    if (!this.isS3Ready()) {
      return this.readFileLocally(s3Key);
    }

    try {
      HesseLogger.summary.start(`Downloading file from S3: ${s3Key}`);
      DanteLogger.success.basic(`Downloading file from S3: ${s3Key}`);

      if (!this.s3Client) {
        throw new Error('S3 client is not initialized');
      }

      // Download the file from S3
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key
      });

      const response = await this.s3Client.send(command);

      // Convert the stream to a buffer
      if (!response.Body) {
        throw new Error('Response body is empty');
      }

      const data = await streamToBuffer(response.Body as Readable);
      const contentType = response.ContentType || 'application/octet-stream';

      HesseLogger.summary.complete(`File downloaded from S3: ${s3Key}`);
      DanteLogger.success.core(`File downloaded from S3: ${s3Key}`);

      return {
        success: true,
        message: 'File downloaded successfully',
        data,
        contentType
      };
    } catch (error) {
      const errorMessage = `Error downloading file from S3: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error downloading file from S3', error);

      // Try to read locally as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.readFileLocally(s3Key);
    }
  }

  /**
   * Read a file from the local file system
   */
  private async readFileLocally(
    s3Key: string
  ): Promise<{ success: boolean; message: string; data?: Buffer; contentType?: string; localPath?: string }> {
    try {
      HesseLogger.summary.start(`Reading file locally: ${s3Key}`);
      DanteLogger.success.basic(`Reading file locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Check if the file exists
      if (!fs.existsSync(localPath)) {
        throw new Error(`File not found: ${localPath}`);
      }

      // Read the file
      const data = fs.readFileSync(localPath);

      // Determine content type based on file extension
      const extension = path.extname(localPath).toLowerCase();
      let contentType = 'application/octet-stream';

      switch (extension) {
        case '.json':
          contentType = 'application/json';
          break;
        case '.txt':
          contentType = 'text/plain';
          break;
        case '.md':
          contentType = 'text/markdown';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.html':
          contentType = 'text/html';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.js':
          contentType = 'application/javascript';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
      }

      HesseLogger.summary.complete(`File read locally: ${localPath}`);
      DanteLogger.success.core(`File read locally: ${localPath}`);

      return {
        success: true,
        message: 'File read locally',
        data,
        contentType,
        localPath
      };
    } catch (error) {
      const errorMessage = `Error reading file locally: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error reading file locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Check if a file exists in S3 or local file system
   */
  public async fileExists(
    s3Key: string
  ): Promise<{ success: boolean; exists: boolean; message: string; metadata?: any; localPath?: string }> {
    // If S3 is not available, check local file system
    if (!this.isS3Ready()) {
      return this.fileExistsLocally(s3Key);
    }

    try {
      DanteLogger.success.basic(`Checking if file exists in S3: ${s3Key}`);

      if (!this.s3Client) {
        throw new Error('S3 client is not initialized');
      }

      // Check if the file exists in S3
      const command = new HeadObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key
      });

      try {
        const response = await this.s3Client.send(command);

        DanteLogger.success.core(`File exists in S3: ${s3Key}`);

        return {
          success: true,
          exists: true,
          message: 'File exists in S3',
          metadata: {
            contentType: response.ContentType,
            contentLength: response.ContentLength,
            lastModified: response.LastModified,
            eTag: response.ETag
          }
        };
      } catch (headError) {
        if ((headError as any).name === 'NotFound') {
          DanteLogger.warn.deprecated(`File does not exist in S3: ${s3Key}`);

          // Try local file system as a fallback
          return this.fileExistsLocally(s3Key);
        }

        throw headError;
      }
    } catch (error) {
      const errorMessage = `Error checking if file exists in S3: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error checking if file exists in S3', error);

      // Try local file system as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.fileExistsLocally(s3Key);
    }
  }

  /**
   * Check if a file exists in the local file system
   */
  private fileExistsLocally(
    s3Key: string
  ): { success: boolean; exists: boolean; message: string; localPath?: string; metadata?: any } {
    try {
      DanteLogger.success.basic(`Checking if file exists locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Check if the file exists
      const exists = fs.existsSync(localPath);

      if (exists) {
        DanteLogger.success.core(`File exists locally: ${localPath}`);

        // Get file stats
        const stats = fs.statSync(localPath);

        return {
          success: true,
          exists: true,
          message: 'File exists locally',
          localPath,
          metadata: {
            contentLength: stats.size,
            lastModified: stats.mtime
          }
        };
      } else {
        DanteLogger.warn.deprecated(`File does not exist locally: ${localPath}`);

        return {
          success: true,
          exists: false,
          message: 'File does not exist locally',
          localPath
        };
      }
    } catch (error) {
      const errorMessage = `Error checking if file exists locally: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error checking if file exists locally', error);

      return {
        success: false,
        exists: false,
        message: errorMessage
      };
    }
  }

  /**
   * List files in an S3 folder
   */
  public async listFiles(
    prefix: string
  ): Promise<{ success: boolean; message: string; files?: { key: string; size: number; lastModified: Date }[] }> {
    try {
      DanteLogger.success.basic(`Listing files in S3 folder: ${prefix}`);

      // List files in the S3 folder
      const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        Prefix: prefix
      });

      const response = await this.s3Client.send(command);

      if (!response.Contents) {
        return {
          success: true,
          message: 'No files found in the folder',
          files: []
        };
      }

      const files = response.Contents.map(item => ({
        key: item.Key || '',
        size: item.Size || 0,
        lastModified: item.LastModified || new Date()
      }));

      DanteLogger.success.core(`Listed ${files.length} files in S3 folder: ${prefix}`);

      return {
        success: true,
        message: `Listed ${files.length} files in the folder`,
        files
      };
    } catch (error) {
      const errorMessage = `Error listing files in S3 folder: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error listing files in S3 folder', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload a PDF file to S3 or save it locally
   */
  public async uploadPdf(
    pdfPath: string,
    pdfName: string = 'default_resume.pdf'
  ): Promise<{ success: boolean; message: string; s3Key?: string; url?: string; localPath?: string; contentFingerprint?: string }> {
    try {
      if (this.isS3Ready()) {
        HesseLogger.summary.start(`Uploading PDF to S3: ${pdfName}`);
        DanteLogger.success.basic(`Uploading PDF to S3: ${pdfName}`);
      } else {
        HesseLogger.summary.start(`Saving PDF locally: ${pdfName}`);
        DanteLogger.success.basic(`Saving PDF locally: ${pdfName}`);
      }

      // Read the PDF file
      const fileBuffer = fs.readFileSync(pdfPath);

      // Generate a content fingerprint
      const contentFingerprint = this.generateContentFingerprint(fileBuffer);

      // Create the S3 key
      const s3Key = `${S3_FOLDERS.PDFS}${contentFingerprint}/${pdfName}`;

      // Upload the file to S3 or save it locally
      const uploadResult = await this.uploadFile(fileBuffer, s3Key, 'application/pdf');

      if (!uploadResult.success) {
        throw new Error(uploadResult.message);
      }

      // Also upload a fingerprint file
      const fingerprintBuffer = Buffer.from(contentFingerprint);
      const fingerprintKey = `${S3_FOLDERS.PDFS}${contentFingerprint}/fingerprint.txt`;

      await this.uploadFile(fingerprintBuffer, fingerprintKey, 'text/plain');

      if (this.isS3Ready()) {
        HesseLogger.summary.complete(`PDF uploaded to S3: ${pdfName}`);
        DanteLogger.success.core(`PDF uploaded to S3: ${pdfName}`);
      } else {
        HesseLogger.summary.complete(`PDF saved locally: ${pdfName}`);
        DanteLogger.success.core(`PDF saved locally: ${pdfName}`);
      }

      return {
        ...uploadResult,
        contentFingerprint
      };
    } catch (error) {
      const errorMessage = this.isS3Ready()
        ? `Error uploading PDF to S3: ${error instanceof Error ? error.message : String(error)}`
        : `Error saving PDF locally: ${error instanceof Error ? error.message : String(error)}`;

      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system(this.isS3Ready() ? 'Error uploading PDF to S3' : 'Error saving PDF locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload JSON content to S3
   */
  public async uploadJson(
    content: any,
    s3Key: string
  ): Promise<{ success: boolean; message: string; s3Key?: string; url?: string }> {
    try {
      DanteLogger.success.basic(`Uploading JSON to S3: ${s3Key}`);

      // Convert the content to JSON
      const jsonContent = JSON.stringify(content, null, 2);
      const jsonBuffer = Buffer.from(jsonContent);

      // Upload the JSON to S3
      return await this.uploadFile(jsonBuffer, s3Key, 'application/json');
    } catch (error) {
      const errorMessage = `Error uploading JSON to S3: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error uploading JSON to S3', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload text content to S3
   */
  public async uploadText(
    content: string,
    s3Key: string
  ): Promise<{ success: boolean; message: string; s3Key?: string; url?: string }> {
    try {
      DanteLogger.success.basic(`Uploading text to S3: ${s3Key}`);

      // Convert the content to a buffer
      const textBuffer = Buffer.from(content);

      // Upload the text to S3
      return await this.uploadFile(textBuffer, s3Key, 'text/plain');
    } catch (error) {
      const errorMessage = `Error uploading text to S3: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error uploading text to S3', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload markdown content to S3
   */
  public async uploadMarkdown(
    content: string,
    s3Key: string
  ): Promise<{ success: boolean; message: string; s3Key?: string; url?: string }> {
    try {
      DanteLogger.success.basic(`Uploading markdown to S3: ${s3Key}`);

      // Convert the content to a buffer
      const markdownBuffer = Buffer.from(content);

      // Upload the markdown to S3
      return await this.uploadFile(markdownBuffer, s3Key, 'text/markdown');
    } catch (error) {
      const errorMessage = `Error uploading markdown to S3: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error uploading markdown to S3', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Download JSON content from S3
   */
  public async downloadJson<T = any>(
    s3Key: string
  ): Promise<{ success: boolean; message: string; data?: T }> {
    try {
      DanteLogger.success.basic(`Downloading JSON from S3: ${s3Key}`);

      // Download the file from S3
      const downloadResult = await this.downloadFile(s3Key);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(downloadResult.message);
      }

      // Parse the JSON
      const jsonContent = downloadResult.data.toString('utf-8');
      const data = JSON.parse(jsonContent) as T;

      DanteLogger.success.core(`Downloaded JSON from S3: ${s3Key}`);

      return {
        success: true,
        message: 'JSON downloaded successfully',
        data
      };
    } catch (error) {
      const errorMessage = `Error downloading JSON from S3: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error downloading JSON from S3', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Download text content from S3 or local file system
   */
  public async downloadText(
    s3Key: string
  ): Promise<{ success: boolean; message: string; data?: string; localPath?: string }> {
    try {
      if (this.isS3Ready()) {
        DanteLogger.success.basic(`Downloading text from S3: ${s3Key}`);
      } else {
        DanteLogger.success.basic(`Reading text from local file system: ${s3Key}`);
      }

      // Download the file from S3 or read from local file system
      const downloadResult = await this.downloadFile(s3Key);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(downloadResult.message);
      }

      // Convert the buffer to text
      const textContent = downloadResult.data.toString('utf-8');

      if (this.isS3Ready()) {
        DanteLogger.success.core(`Downloaded text from S3: ${s3Key}`);
      } else {
        DanteLogger.success.core(`Read text from local file system: ${downloadResult.localPath}`);
      }

      return {
        success: true,
        message: this.isS3Ready() ? 'Text downloaded successfully' : 'Text read successfully',
        data: textContent,
        localPath: downloadResult.localPath
      };
    } catch (error) {
      const errorMessage = this.isS3Ready()
        ? `Error downloading text from S3: ${error instanceof Error ? error.message : String(error)}`
        : `Error reading text from local file system: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isS3Ready() ? 'Error downloading text from S3' : 'Error reading text from local file system', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get the S3 URL for a key
   */
  public getS3Url(s3Key: string): string {
    return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;
  }

  /**
   * Get the S3 key for a PDF file
   */
  public getPdfS3Key(contentFingerprint: string, pdfName: string = 'default_resume.pdf'): string {
    return `${S3_FOLDERS.PDFS}${contentFingerprint}/${pdfName}`;
  }

  /**
   * Get the S3 key for extracted content
   */
  public getExtractedContentS3Key(contentFingerprint: string, fileName: string): string {
    return `${S3_FOLDERS.EXTRACTED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the S3 key for analyzed content
   */
  public getAnalyzedContentS3Key(contentFingerprint: string, fileName: string): string {
    return `${S3_FOLDERS.ANALYZED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the S3 key for a cover letter
   */
  public getCoverLetterS3Key(contentFingerprint: string, fileName: string = 'cover_letter.md'): string {
    return `${S3_FOLDERS.COVER_LETTERS}${contentFingerprint}/${fileName}`;
  }
}

export default S3StorageService;
