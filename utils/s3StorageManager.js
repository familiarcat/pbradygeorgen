/**
 * S3 Storage Manager
 *
 * This service provides a unified interface for storing and retrieving content from AWS S3,
 * establishing it as the single source of truth for the application. It always overwrites
 * content to ensure freshness while maintaining a structure that will support multi-file
 * capabilities in the future.
 *
 * Philosophical Framework:
 * - Hesse: Creating harmonious patterns across different content types
 * - Salinger: Ensuring authentic representation by rejecting caching in favor of truth
 * - Derrida: Deconstructing storage into a clear, consistent structure
 * - Dante: Guiding content through its journey from extraction to presentation
 */

const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// Define the S3 bucket name - this should be configured in your Amplify project
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'alexai-pdf-storage';
const S3_REGION = process.env.S3_REGION || 'us-east-1';

// Define the folder structure in S3
const S3_FOLDERS = {
  PDFS: 'pdfs/',
  EXTRACTED: 'extracted/',
  ANALYZED: 'analyzed/',
  COVER_LETTERS: 'cover-letters/',
  DOWNLOADS: 'downloads/',
  TEMP: 'temp/'
};

// Content types for metadata
const CONTENT_TYPES = {
  PDF: 'application/pdf',
  TEXT: 'text/plain',
  MARKDOWN: 'text/markdown',
  HTML: 'text/html',
  JSON: 'application/json'
};

/**
 * S3 Storage Manager class
 */
class S3StorageManager {
  static instance = null;

  /**
   * Private constructor to enforce singleton pattern
   */
  constructor() {
    this.s3Client = null;
    this.isS3Available = false;

    try {
      // Only initialize S3 client if we're in AWS Amplify or have AWS credentials
      if (this.shouldUseS3()) {
        // Initialize the S3 client
        this.s3Client = new S3Client({
          region: S3_REGION,
          // Credentials will be automatically loaded from the environment in AWS Amplify
        });

        this.isS3Available = true;
        console.log(`S3StorageManager initialized with bucket: ${S3_BUCKET_NAME}, region: ${S3_REGION}`);
      } else {
        this.isS3Available = false;
        console.log('S3StorageManager initialized in local mode (no S3 support)');
      }
    } catch (error) {
      this.isS3Available = false;
      console.error('Failed to initialize S3 client:', error);
      console.log('S3StorageManager initialized in local mode (S3 initialization failed)');
    }
  }

  /**
   * Get the singleton instance of the S3StorageManager
   */
  static getInstance() {
    if (!S3StorageManager.instance) {
      S3StorageManager.instance = new S3StorageManager();
    }
    return S3StorageManager.instance;
  }

  /**
   * Check if the service should use S3
   * - In AWS Amplify environment
   * - Or when AWS credentials are available
   */
  shouldUseS3() {
    // Check if running in AWS Amplify
    const isAmplify = !!process.env.AWS_EXECUTION_ENV;

    // Check if AWS credentials are available
    const hasAwsCredentials =
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      process.env.AWS_PROFILE;

    return isAmplify || hasAwsCredentials;
  }

  /**
   * Check if S3 is available
   */
  isS3Ready() {
    return this.isS3Available && this.s3Client !== null;
  }

  /**
   * Generate a content fingerprint for a file
   */
  generateContentFingerprint(fileBuffer) {
    return crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');
  }

  /**
   * Upload a file to S3 or local file system, always overwriting existing content
   */
  async uploadFile(
    fileBuffer,
    s3Key,
    contentType = 'application/octet-stream',
    metadata = {}
  ) {
    // Generate content fingerprint for tracking
    const contentFingerprint = this.generateContentFingerprint(fileBuffer);

    // Add fingerprint to metadata
    const enhancedMetadata = {
      ...metadata,
      contentFingerprint,
      timestamp: new Date().toISOString()
    };

    // If S3 is not available, save to local file system
    if (!this.isS3Ready()) {
      return this.saveFileLocally(fileBuffer, s3Key, contentType, enhancedMetadata);
    }

    try {
      console.log(`Uploading file to S3: ${s3Key}`);

      // Upload the file to S3
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType,
        Metadata: this.stringifyMetadata(enhancedMetadata)
      });

      if (!this.s3Client) {
        throw new Error('S3 client is not initialized');
      }

      const response = await this.s3Client.send(command);

      const url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;

      console.log(`File uploaded to S3: ${s3Key}`);

      return {
        success: true,
        message: 'File uploaded successfully',
        s3Key,
        url,
        contentFingerprint
      };
    } catch (error) {
      const errorMessage = `Error uploading file to S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      // Try to save locally as a fallback
      console.log('Falling back to local file system');

      return this.saveFileLocally(fileBuffer, s3Key, contentType, enhancedMetadata);
    }
  }

  /**
   * Convert metadata object to string values for S3
   */
  stringifyMetadata(metadata) {
    const result = {};
    for (const [key, value] of Object.entries(metadata)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  /**
   * Save a file to the local file system
   */
  async saveFileLocally(
    fileBuffer,
    s3Key,
    contentType = 'application/octet-stream',
    metadata = {}
  ) {
    try {
      console.log(`Saving file locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Ensure the directory exists
      const directory = path.dirname(localPath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(localPath, fileBuffer);

      // Save metadata to a separate file
      const metadataPath = `${localPath}.metadata.json`;
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`File saved locally: ${localPath}`);

      return {
        success: true,
        message: 'File saved locally',
        localPath,
        contentFingerprint: metadata.contentFingerprint
      };
    } catch (error) {
      const errorMessage = `Error saving file locally: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage,
        localPath: ''
      };
    }
  }

  /**
   * Convert an S3 key to a local file path
   */
  s3KeyToLocalPath(s3Key) {
    // Base directory for local storage
    const baseDir = path.join(process.cwd(), 'public');

    // Convert S3 key to local path
    return path.join(baseDir, s3Key);
  }

  /**
   * Download a file from S3 or local file system
   */
  async downloadFile(s3Key) {
    // If S3 is not available, read from local file system
    if (!this.isS3Ready()) {
      return this.readFileLocally(s3Key);
    }

    try {
      console.log(`Downloading file from S3: ${s3Key}`);

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
      const chunks = [];
      if (response.Body instanceof Readable) {
        for await (const chunk of response.Body) {
          chunks.push(Buffer.from(chunk));
        }
      } else {
        throw new Error('Response body is not a readable stream');
      }

      const data = Buffer.concat(chunks);
      const contentType = response.ContentType || 'application/octet-stream';

      // Parse metadata
      const metadata = {};
      if (response.Metadata) {
        for (const [key, value] of Object.entries(response.Metadata)) {
          try {
            metadata[key] = JSON.parse(value);
          } catch {
            metadata[key] = value;
          }
        }
      }

      console.log(`File downloaded from S3: ${s3Key}`);

      return {
        success: true,
        message: 'File downloaded successfully',
        data,
        contentType,
        metadata
      };
    } catch (error) {
      const errorMessage = `Error downloading file from S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      // Try to read locally as a fallback
      console.log('Falling back to local file system');

      return this.readFileLocally(s3Key);
    }
  }

  /**
   * Read a file from the local file system
   */
  async readFileLocally(s3Key) {
    try {
      console.log(`Reading file locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Check if the file exists
      if (!fs.existsSync(localPath)) {
        const errorMessage = `File not found locally: ${localPath}`;
        console.error(errorMessage);

        return {
          success: false,
          message: errorMessage,
          localPath
        };
      }

      // Read the file
      const data = fs.readFileSync(localPath);

      // Determine content type based on file extension
      const extension = path.extname(localPath).toLowerCase();
      let contentType = 'application/octet-stream';
      if (extension === '.pdf') contentType = CONTENT_TYPES.PDF;
      else if (extension === '.txt') contentType = CONTENT_TYPES.TEXT;
      else if (extension === '.md') contentType = CONTENT_TYPES.MARKDOWN;
      else if (extension === '.html') contentType = CONTENT_TYPES.HTML;
      else if (extension === '.json') contentType = CONTENT_TYPES.JSON;

      // Read metadata if it exists
      let metadata = {};
      const metadataPath = `${localPath}.metadata.json`;
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          metadata = JSON.parse(metadataContent);
        } catch (metadataError) {
          console.warn(`Error reading metadata for ${localPath}:`, metadataError);
        }
      }

      console.log(`File read locally: ${localPath}`);

      return {
        success: true,
        message: 'File read successfully',
        data,
        contentType,
        metadata,
        localPath
      };
    } catch (error) {
      const errorMessage = `Error reading file locally: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage,
        localPath: this.s3KeyToLocalPath(s3Key)
      };
    }
  }

  /**
   * Check if a file exists in S3 or local file system
   */
  async fileExists(s3Key) {
    // If S3 is not available, check local file system
    if (!this.isS3Ready()) {
      return this.fileExistsLocally(s3Key);
    }

    try {
      console.log(`Checking if file exists in S3: ${s3Key}`);

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

        // Parse metadata
        const metadata = {};
        if (response.Metadata) {
          for (const [key, value] of Object.entries(response.Metadata)) {
            try {
              metadata[key] = JSON.parse(value);
            } catch {
              metadata[key] = value;
            }
          }
        }

        console.log(`File exists in S3: ${s3Key}`);

        return {
          success: true,
          exists: true,
          message: 'File exists in S3',
          metadata
        };
      } catch (headError) {
        // If the error is a 404, the file doesn't exist
        if (headError.name === 'NotFound') {
          console.log(`File does not exist in S3: ${s3Key}`);

          return {
            success: true,
            exists: false,
            message: 'File does not exist in S3'
          };
        }

        // For other errors, throw to be caught by the outer try/catch
        throw headError;
      }
    } catch (error) {
      const errorMessage = `Error checking if file exists in S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      // Try to check locally as a fallback
      console.log('Falling back to local file system');

      return this.fileExistsLocally(s3Key);
    }
  }

  /**
   * Check if a file exists in the local file system
   */
  async fileExistsLocally(s3Key) {
    try {
      console.log(`Checking if file exists locally: ${s3Key}`);

      // Convert S3 key to local path
      const localPath = this.s3KeyToLocalPath(s3Key);

      // Check if the file exists
      const exists = fs.existsSync(localPath);

      // Read metadata if it exists
      let metadata = {};
      if (exists) {
        const metadataPath = `${localPath}.metadata.json`;
        if (fs.existsSync(metadataPath)) {
          try {
            const metadataContent = fs.readFileSync(metadataPath, 'utf8');
            metadata = JSON.parse(metadataContent);
          } catch (metadataError) {
            console.warn(`Error reading metadata for ${localPath}:`, metadataError);
          }
        }
      }

      console.log(`File ${exists ? 'exists' : 'does not exist'} locally: ${localPath}`);

      return {
        success: true,
        exists,
        message: exists ? 'File exists locally' : 'File does not exist locally',
        metadata: exists ? metadata : undefined,
        localPath
      };
    } catch (error) {
      const errorMessage = `Error checking if file exists locally: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        exists: false,
        message: errorMessage,
        localPath: this.s3KeyToLocalPath(s3Key)
      };
    }
  }

  /**
   * Upload text content to S3 or local file system
   */
  async uploadText(content, s3Key, metadata = {}) {
    try {
      console.log(`Uploading text to S3: ${s3Key}`);

      // Convert the content to a buffer
      const textBuffer = Buffer.from(content);

      // Upload the text to S3
      return await this.uploadFile(textBuffer, s3Key, CONTENT_TYPES.TEXT, metadata);
    } catch (error) {
      const errorMessage = `Error uploading text to S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload markdown content to S3 or local file system
   */
  async uploadMarkdown(content, s3Key, metadata = {}) {
    try {
      console.log(`Uploading markdown to S3: ${s3Key}`);

      // Convert the content to a buffer
      const markdownBuffer = Buffer.from(content);

      // Upload the markdown to S3
      return await this.uploadFile(markdownBuffer, s3Key, CONTENT_TYPES.MARKDOWN, metadata);
    } catch (error) {
      const errorMessage = `Error uploading markdown to S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload HTML content to S3 or local file system
   */
  async uploadHtml(content, s3Key, metadata = {}) {
    try {
      console.log(`Uploading HTML to S3: ${s3Key}`);

      // Convert the content to a buffer
      const htmlBuffer = Buffer.from(content);

      // Upload the HTML to S3
      return await this.uploadFile(htmlBuffer, s3Key, CONTENT_TYPES.HTML, metadata);
    } catch (error) {
      const errorMessage = `Error uploading HTML to S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload JSON content to S3 or local file system
   */
  async uploadJson(content, s3Key, metadata = {}) {
    try {
      console.log(`Uploading JSON to S3: ${s3Key}`);

      // Convert the content to a JSON string
      const jsonString = JSON.stringify(content, null, 2);

      // Convert the JSON string to a buffer
      const jsonBuffer = Buffer.from(jsonString);

      // Upload the JSON to S3
      return await this.uploadFile(jsonBuffer, s3Key, CONTENT_TYPES.JSON, metadata);
    } catch (error) {
      const errorMessage = `Error uploading JSON to S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Download text content from S3 or local file system
   */
  async downloadText(s3Key) {
    try {
      console.log(`Downloading text from S3: ${s3Key}`);

      // Download the file
      const result = await this.downloadFile(s3Key);

      if (!result.success || !result.data) {
        return {
          success: false,
          message: result.message,
          localPath: result.localPath
        };
      }

      // Convert the buffer to a string
      const content = result.data.toString('utf8');

      return {
        success: true,
        message: 'Text downloaded successfully',
        content,
        metadata: result.metadata,
        localPath: result.localPath
      };
    } catch (error) {
      const errorMessage = `Error downloading text from S3: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get the S3 URL for a key
   */
  getS3Url(s3Key) {
    return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;
  }

  /**
   * Get the S3 key for a PDF file
   */
  getPdfS3Key(contentFingerprint, pdfName = 'default_resume.pdf') {
    return `${S3_FOLDERS.PDFS}${contentFingerprint}/${pdfName}`;
  }

  /**
   * Get the S3 key for extracted content
   */
  getExtractedContentS3Key(contentFingerprint, fileName) {
    return `${S3_FOLDERS.EXTRACTED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the S3 key for analyzed content
   */
  getAnalyzedContentS3Key(contentFingerprint, fileName) {
    return `${S3_FOLDERS.ANALYZED}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the S3 key for a cover letter
   */
  getCoverLetterS3Key(contentFingerprint, fileName) {
    return `${S3_FOLDERS.COVER_LETTERS}${contentFingerprint}/${fileName}`;
  }

  /**
   * Get the S3 key for a download file
   */
  getDownloadS3Key(contentFingerprint, fileName) {
    return `${S3_FOLDERS.DOWNLOADS}${contentFingerprint}/${fileName}`;
  }
}

module.exports = { S3StorageManager };
