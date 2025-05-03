/**
 * Amplify Storage Service
 *
 * This service provides a wrapper around AWS Amplify Storage for use with our application.
 * It integrates with the existing S3StorageService to provide a seamless experience.
 *
 * Philosophical Framework:
 * - Hesse: Balancing structure (Amplify Storage) with flexibility (custom implementation)
 * - Salinger: Ensuring authentic representation through content versioning
 * - Derrida: Deconstructing content into structured storage paths
 * - Dante: Guiding the content through different processing stages
 */

// Import Storage from aws-amplify
let Storage: any;
try {
  // Dynamic import to avoid issues during build time
  const Amplify = require('aws-amplify');
  Storage = Amplify.Storage;
} catch (error) {
  console.error('Failed to import Storage from aws-amplify:', error);
}

// Import Amplify configuration
import { configureAmplify, getS3BucketName, getS3Region } from './amplifyConfig';
import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Define the folder structure in Amplify Storage
const STORAGE_FOLDERS = {
  PDFS: 'pdfs/',
  EXTRACTED: 'extracted/',
  ANALYZED: 'analyzed/',
  COVER_LETTERS: 'cover-letters/',
  TEMP: 'temp/'
};

/**
 * Amplify Storage Service class
 */
export class AmplifyStorageService {
  private static instance: AmplifyStorageService;
  private isAmplifyAvailable: boolean = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    try {
      // Configure Amplify
      const configResult = configureAmplify();

      // Check if Amplify Storage is available
      if (configResult && typeof Storage !== 'undefined') {
        this.isAmplifyAvailable = true;

        // Get the S3 bucket name and region from the configuration
        const bucketName = getS3BucketName();
        const region = getS3Region();

        DanteLogger.success.basic(`AmplifyStorageService initialized with Amplify Storage support (bucket: ${bucketName}, region: ${region})`);
        console.log(`AmplifyStorageService initialized with Amplify Storage support (bucket: ${bucketName}, region: ${region})`);
      } else {
        this.isAmplifyAvailable = false;
        DanteLogger.warn.deprecated('AmplifyStorageService initialized without Amplify Storage support (local mode)');
        console.log('AmplifyStorageService initialized in local mode (no Amplify Storage support)');
      }
    } catch (error) {
      this.isAmplifyAvailable = false;
      console.error('Failed to initialize Amplify Storage:', error);
      DanteLogger.error.system('Failed to initialize Amplify Storage', error);
      console.log('AmplifyStorageService initialized in local mode (Amplify Storage initialization failed)');
    }
  }

  /**
   * Get the singleton instance of the AmplifyStorageService
   */
  public static getInstance(): AmplifyStorageService {
    if (!AmplifyStorageService.instance) {
      AmplifyStorageService.instance = new AmplifyStorageService();
    }
    return AmplifyStorageService.instance;
  }

  /**
   * Check if the service is running in AWS Amplify
   */
  public isRunningInAmplify(): boolean {
    return !!process.env.AWS_EXECUTION_ENV;
  }

  /**
   * Check if Amplify Storage should be used
   */
  public shouldUseAmplifyStorage(): boolean {
    // If explicitly set to use local storage, don't use Amplify Storage
    if (process.env.AMPLIFY_USE_LOCAL === 'true') {
      return false;
    }

    // If explicitly set to use Amplify Storage, use it
    if (process.env.AMPLIFY_USE_STORAGE === 'true') {
      return true;
    }

    // If running in AWS Amplify, use Amplify Storage
    if (this.isRunningInAmplify()) {
      return true;
    }

    // Default to not using Amplify Storage for local development
    return false;
  }

  /**
   * Check if Amplify Storage is available
   */
  public isAmplifyStorageReady(): boolean {
    return this.isAmplifyAvailable;
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
   * Upload a file to Amplify Storage or local file system
   */
  public async uploadFile(
    fileBuffer: Buffer,
    storageKey: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{ success: boolean; message: string; key?: string; url?: string; localPath?: string }> {
    // If Amplify Storage is not available, save to local file system
    if (!this.isAmplifyStorageReady() || !this.shouldUseAmplifyStorage()) {
      return this.saveFileLocally(fileBuffer, storageKey, contentType);
    }

    try {
      HesseLogger.summary.start(`Uploading file to Amplify Storage: ${storageKey}`);
      DanteLogger.success.basic(`Uploading file to Amplify Storage: ${storageKey}`);

      // Upload the file to Amplify Storage
      const result = await Storage.put(storageKey, fileBuffer, {
        contentType,
        progressCallback: (progress) => {
          console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
        }
      });

      // Get the URL for the uploaded file
      const urlResult = await Storage.get(storageKey);
      const url = typeof urlResult === 'string' ? urlResult : urlResult.toString();

      HesseLogger.summary.complete(`File uploaded to Amplify Storage: ${storageKey}`);
      DanteLogger.success.core(`File uploaded to Amplify Storage: ${storageKey}`);

      return {
        success: true,
        message: 'File uploaded successfully',
        key: storageKey,
        url
      };
    } catch (error) {
      const errorMessage = `Error uploading file to Amplify Storage: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error uploading file to Amplify Storage', error);

      // Try to save locally as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.saveFileLocally(fileBuffer, storageKey, contentType);
    }
  }

  /**
   * Save a file to the local file system
   */
  private async saveFileLocally(
    fileBuffer: Buffer,
    storageKey: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{ success: boolean; message: string; localPath?: string }> {
    try {
      HesseLogger.summary.start(`Saving file locally: ${storageKey}`);
      DanteLogger.success.basic(`Saving file locally: ${storageKey}`);

      // Convert storage key to local path
      const localPath = this.storageKeyToLocalPath(storageKey);

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
   * Convert a storage key to a local file path
   */
  private storageKeyToLocalPath(storageKey: string): string {
    // Base directory for local storage
    const baseDir = path.join(process.cwd(), 'public');

    // Convert storage key to local path
    return path.join(baseDir, storageKey);
  }

  /**
   * Download a file from Amplify Storage or local file system
   */
  public async downloadFile(
    storageKey: string
  ): Promise<{ success: boolean; message: string; data?: Buffer; contentType?: string; localPath?: string }> {
    // If Amplify Storage is not available, read from local file system
    if (!this.isAmplifyStorageReady() || !this.shouldUseAmplifyStorage()) {
      return this.readFileLocally(storageKey);
    }

    try {
      HesseLogger.summary.start(`Downloading file from Amplify Storage: ${storageKey}`);
      DanteLogger.success.basic(`Downloading file from Amplify Storage: ${storageKey}`);

      // Download the file from Amplify Storage
      const result = await Storage.get(storageKey, { download: true });

      if (!result || !result.Body) {
        throw new Error('Response body is empty');
      }

      // Convert the result to a buffer
      const data = Buffer.from(await (result.Body as Blob).arrayBuffer());
      const contentType = result.ContentType || 'application/octet-stream';

      HesseLogger.summary.complete(`File downloaded from Amplify Storage: ${storageKey}`);
      DanteLogger.success.core(`File downloaded from Amplify Storage: ${storageKey}`);

      return {
        success: true,
        message: 'File downloaded successfully',
        data,
        contentType
      };
    } catch (error) {
      const errorMessage = `Error downloading file from Amplify Storage: ${error instanceof Error ? error.message : String(error)}`;
      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system('Error downloading file from Amplify Storage', error);

      // Try to read locally as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.readFileLocally(storageKey);
    }
  }

  /**
   * Read a file from the local file system
   */
  private async readFileLocally(
    storageKey: string
  ): Promise<{ success: boolean; message: string; data?: Buffer; contentType?: string; localPath?: string }> {
    try {
      HesseLogger.summary.start(`Reading file locally: ${storageKey}`);
      DanteLogger.success.basic(`Reading file locally: ${storageKey}`);

      // Convert storage key to local path
      const localPath = this.storageKeyToLocalPath(storageKey);

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
   * Check if a file exists in Amplify Storage or local file system
   */
  public async fileExists(
    storageKey: string
  ): Promise<{ success: boolean; exists: boolean; message: string; metadata?: any; localPath?: string }> {
    // If Amplify Storage is not available, check local file system
    if (!this.isAmplifyStorageReady() || !this.shouldUseAmplifyStorage()) {
      return this.fileExistsLocally(storageKey);
    }

    try {
      DanteLogger.success.basic(`Checking if file exists in Amplify Storage: ${storageKey}`);

      // Check if the file exists in Amplify Storage
      try {
        const result = await Storage.get(storageKey, { validateObjectExistence: true });

        DanteLogger.success.core(`File exists in Amplify Storage: ${storageKey}`);

        return {
          success: true,
          exists: true,
          message: 'File exists in Amplify Storage',
          metadata: {
            url: result
          }
        };
      } catch (headError) {
        if ((headError as any).name === 'NotFound' || (headError as any).message?.includes('does not exist')) {
          DanteLogger.warn.deprecated(`File does not exist in Amplify Storage: ${storageKey}`);

          // Try local file system as a fallback
          return this.fileExistsLocally(storageKey);
        }

        throw headError;
      }
    } catch (error) {
      const errorMessage = `Error checking if file exists in Amplify Storage: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error checking if file exists in Amplify Storage', error);

      // Try local file system as a fallback
      console.log('Falling back to local file system');
      DanteLogger.warn.deprecated('Falling back to local file system');

      return this.fileExistsLocally(storageKey);
    }
  }

  /**
   * Check if a file exists in the local file system
   */
  private fileExistsLocally(
    storageKey: string
  ): { success: boolean; exists: boolean; message: string; localPath?: string; metadata?: any } {
    try {
      DanteLogger.success.basic(`Checking if file exists locally: ${storageKey}`);

      // Convert storage key to local path
      const localPath = this.storageKeyToLocalPath(storageKey);

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
   * Download text content from Amplify Storage or local file system
   */
  public async downloadText(
    storageKey: string
  ): Promise<{ success: boolean; message: string; data?: string; localPath?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.basic(`Downloading text from Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.basic(`Reading text from local file system: ${storageKey}`);
      }

      // Download the file from Amplify Storage or read from local file system
      const downloadResult = await this.downloadFile(storageKey);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(downloadResult.message);
      }

      // Convert the buffer to text
      const textContent = downloadResult.data.toString('utf-8');

      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.core(`Downloaded text from Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.core(`Read text from local file system: ${downloadResult.localPath}`);
      }

      return {
        success: true,
        message: this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Text downloaded successfully' : 'Text read successfully',
        data: textContent,
        localPath: downloadResult.localPath
      };
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error downloading text from Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error reading text from local file system: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error downloading text from Amplify Storage' : 'Error reading text from local file system', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload a PDF file to Amplify Storage or save it locally
   */
  public async uploadPdf(
    pdfPath: string,
    pdfName: string = 'default_resume.pdf'
  ): Promise<{ success: boolean; message: string; key?: string; url?: string; localPath?: string; contentFingerprint?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        HesseLogger.summary.start(`Uploading PDF to Amplify Storage: ${pdfName}`);
        DanteLogger.success.basic(`Uploading PDF to Amplify Storage: ${pdfName}`);
      } else {
        HesseLogger.summary.start(`Saving PDF locally: ${pdfName}`);
        DanteLogger.success.basic(`Saving PDF locally: ${pdfName}`);
      }

      // Read the PDF file
      const fileBuffer = fs.readFileSync(pdfPath);

      // Generate a content fingerprint
      const contentFingerprint = this.generateContentFingerprint(fileBuffer);

      // Create the storage key
      const storageKey = `${STORAGE_FOLDERS.PDFS}${contentFingerprint}/${pdfName}`;

      // Upload the file to Amplify Storage or save it locally
      const uploadResult = await this.uploadFile(fileBuffer, storageKey, 'application/pdf');

      if (!uploadResult.success) {
        throw new Error(uploadResult.message);
      }

      // Also upload a fingerprint file
      const fingerprintBuffer = Buffer.from(contentFingerprint);
      const fingerprintKey = `${STORAGE_FOLDERS.PDFS}${contentFingerprint}/fingerprint.txt`;

      await this.uploadFile(fingerprintBuffer, fingerprintKey, 'text/plain');

      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        HesseLogger.summary.complete(`PDF uploaded to Amplify Storage: ${pdfName}`);
        DanteLogger.success.core(`PDF uploaded to Amplify Storage: ${pdfName}`);
      } else {
        HesseLogger.summary.complete(`PDF saved locally: ${pdfName}`);
        DanteLogger.success.core(`PDF saved locally: ${pdfName}`);
      }

      return {
        ...uploadResult,
        contentFingerprint
      };
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error uploading PDF to Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error saving PDF locally: ${error instanceof Error ? error.message : String(error)}`;

      HesseLogger.summary.error(errorMessage);
      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error uploading PDF to Amplify Storage' : 'Error saving PDF locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload JSON content to Amplify Storage or save it locally
   */
  public async uploadJson(
    content: any,
    storageKey: string
  ): Promise<{ success: boolean; message: string; key?: string; url?: string; localPath?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.basic(`Uploading JSON to Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.basic(`Saving JSON locally: ${storageKey}`);
      }

      // Convert the content to JSON
      const jsonContent = JSON.stringify(content, null, 2);
      const jsonBuffer = Buffer.from(jsonContent);

      // Upload the JSON to Amplify Storage or save it locally
      return await this.uploadFile(jsonBuffer, storageKey, 'application/json');
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error uploading JSON to Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error saving JSON locally: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error uploading JSON to Amplify Storage' : 'Error saving JSON locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload text content to Amplify Storage or save it locally
   */
  public async uploadText(
    content: string,
    storageKey: string
  ): Promise<{ success: boolean; message: string; key?: string; url?: string; localPath?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.basic(`Uploading text to Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.basic(`Saving text locally: ${storageKey}`);
      }

      // Convert the content to a buffer
      const textBuffer = Buffer.from(content);

      // Upload the text to Amplify Storage or save it locally
      return await this.uploadFile(textBuffer, storageKey, 'text/plain');
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error uploading text to Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error saving text locally: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error uploading text to Amplify Storage' : 'Error saving text locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload markdown content to Amplify Storage or save it locally
   */
  public async uploadMarkdown(
    content: string,
    storageKey: string
  ): Promise<{ success: boolean; message: string; key?: string; url?: string; localPath?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.basic(`Uploading markdown to Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.basic(`Saving markdown locally: ${storageKey}`);
      }

      // Convert the content to a buffer
      const markdownBuffer = Buffer.from(content);

      // Upload the markdown to Amplify Storage or save it locally
      return await this.uploadFile(markdownBuffer, storageKey, 'text/markdown');
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error uploading markdown to Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error saving markdown locally: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error uploading markdown to Amplify Storage' : 'Error saving markdown locally', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Download JSON content from Amplify Storage or local file system
   */
  public async downloadJson<T = any>(
    storageKey: string
  ): Promise<{ success: boolean; message: string; data?: T; localPath?: string }> {
    try {
      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.basic(`Downloading JSON from Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.basic(`Reading JSON from local file system: ${storageKey}`);
      }

      // Download the file from Amplify Storage or read from local file system
      const downloadResult = await this.downloadText(storageKey);

      if (!downloadResult.success || !downloadResult.data) {
        throw new Error(downloadResult.message);
      }

      // Parse the JSON
      const data = JSON.parse(downloadResult.data) as T;

      if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
        DanteLogger.success.core(`Downloaded JSON from Amplify Storage: ${storageKey}`);
      } else {
        DanteLogger.success.core(`Read JSON from local file system: ${downloadResult.localPath}`);
      }

      return {
        success: true,
        message: this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'JSON downloaded successfully' : 'JSON read successfully',
        data,
        localPath: downloadResult.localPath
      };
    } catch (error) {
      const errorMessage = this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()
        ? `Error downloading JSON from Amplify Storage: ${error instanceof Error ? error.message : String(error)}`
        : `Error reading JSON from local file system: ${error instanceof Error ? error.message : String(error)}`;

      DanteLogger.error.system(this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage() ? 'Error downloading JSON from Amplify Storage' : 'Error reading JSON from local file system', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get the storage URL for a key
   */
  public async getStorageUrl(storageKey: string): Promise<string> {
    if (this.isAmplifyStorageReady() && this.shouldUseAmplifyStorage()) {
      try {
        const result = await Storage.get(storageKey);
        return typeof result === 'string' ? result : result.toString();
      } catch (error) {
        console.error(`Error getting storage URL: ${error}`);
        return `/public/${storageKey}`;
      }
    } else {
      return `/public/${storageKey}`;
    }
  }

  /**
   * Get the storage key for a PDF file
   */
  public getPdfStorageKey(contentFingerprint: string, pdfName: string = 'default_resume.pdf'): string {
    return `${STORAGE_FOLDERS.PDFS}${contentFingerprint}/${pdfName}`;
  }

  /**
   * Get the storage key for extracted content
   */
  public getExtractedContentStorageKey(contentFingerprint: string, fileName: string): string {
    return `${STORAGE_FOLDERS.EXTRACTED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the storage key for analyzed content
   */
  public getAnalyzedContentStorageKey(contentFingerprint: string, fileName: string): string {
    return `${STORAGE_FOLDERS.ANALYZED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the storage key for a cover letter
   */
  public getCoverLetterStorageKey(contentFingerprint: string, fileName: string = 'cover_letter.md'): string {
    return `${STORAGE_FOLDERS.COVER_LETTERS}${contentFingerprint}/${fileName}`;
  }
}

export default AmplifyStorageService;
