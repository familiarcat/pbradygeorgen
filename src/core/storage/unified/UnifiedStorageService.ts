'use client';

import { DanteLogger } from './DanteLogger';
import { unifiedEnvironment } from './UnifiedEnvironment';

// Import S3 client only on the server side
let S3Client: any;
let PutObjectCommand: any;
let GetObjectCommand: any;
let HeadObjectCommand: any;
let fs: any;
let path: any;
let crypto: any;

// Only import Node.js modules on the server side
if (typeof window === 'undefined') {
  // Server-side imports
  import('@aws-sdk/client-s3').then((module) => {
    S3Client = module.S3Client;
    PutObjectCommand = module.PutObjectCommand;
    GetObjectCommand = module.GetObjectCommand;
    HeadObjectCommand = module.HeadObjectCommand;
  });

  import('crypto').then((module) => {
    crypto = module.default;
  });

  import('fs').then((module) => {
    fs = module.default;
  });

  import('path').then((module) => {
    path = module.default;
  });
} else {
  // Client-side fallbacks
  crypto = {
    createHash: () => ({
      update: () => ({
        digest: () => 'client-side-hash'
      })
    })
  };
}

/**
 * UnifiedStorageService.ts
 *
 * A unified storage service that works consistently across local development and AWS Amplify deployment.
 * This service follows the philosophical frameworks of Hesse, Salinger, Derrida, and Dante.
 */

// Define the folder structure
export const STORAGE_FOLDERS = {
  PDFS: 'pdfs/',
  EXTRACTED: 'extracted/',
  ANALYZED: 'analyzed/',
  COVER_LETTERS: 'cover-letters/',
  DOWNLOADS: 'downloads/',
  TEMP: 'temp/'
};

// Define content types
export const CONTENT_TYPES = {
  PDF: 'application/pdf',
  JSON: 'application/json',
  TEXT: 'text/plain',
  MARKDOWN: 'text/markdown',
  HTML: 'text/html'
};

// Storage result interface
export interface StorageResult {
  success: boolean;
  message: string;
  path?: string;
  url?: string;
  contentFingerprint?: string;
  data?: Buffer | string;
  metadata?: Record<string, string>;
}

/**
 * UnifiedStorageService
 *
 * A singleton service that provides a unified interface for storage operations
 * across local development and AWS Amplify deployment.
 */
export class UnifiedStorageService {
  private static instance: UnifiedStorageService;
  private s3Client: S3Client | null = null;
  private isS3Available: boolean = false;
  private localStoragePath: string = '';

  /**
   * Get the singleton instance
   */
  public static getInstance(): UnifiedStorageService {
    if (!UnifiedStorageService.instance) {
      UnifiedStorageService.instance = new UnifiedStorageService();
    }
    return UnifiedStorageService.instance;
  }

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    // Check if we're running in a browser
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
      // In the browser, we can't use S3 directly or access the file system
      this.isS3Available = false;
      this.localStoragePath = '/api/local-storage';

      DanteLogger.success.basic('UnifiedStorageService initialized for browser environment');
      console.log('📦 Storage: Browser API');
      return;
    }

    // Server-side initialization
    // Initialize based on the unified environment
    if (unifiedEnvironment.useS3) {
      try {
        // Initialize the S3 client
        if (S3Client) {
          this.s3Client = new S3Client({
            region: unifiedEnvironment.s3Region
          });

          this.isS3Available = true;
          DanteLogger.success.basic('UnifiedStorageService initialized with S3 support');
          console.log(`📦 Storage: S3 (${unifiedEnvironment.s3BucketName})`);
        } else {
          this.isS3Available = false;
          DanteLogger.error.system('S3Client not available');
          console.error('❌ S3Client not available');
        }
      } catch (error) {
        this.isS3Available = false;
        DanteLogger.error.system('Failed to initialize S3 client', error);
        console.error('❌ Failed to initialize S3 client:', error);
      }
    } else {
      // Initialize local storage
      this.isS3Available = false;

      // Determine local storage path
      if (typeof process !== 'undefined' && process.cwd && path) {
        this.localStoragePath = path.join(process.cwd(), 'public');
      } else {
        this.localStoragePath = './public';
      }

      DanteLogger.success.basic('UnifiedStorageService initialized with local storage');
      console.log(`📦 Storage: Local (${this.localStoragePath})`);
    }
  }

  /**
   * Generate a content fingerprint for a file
   */
  public generateContentFingerprint(fileBuffer: Buffer): string {
    // Check if we're running in a browser
    if (typeof window !== 'undefined') {
      // In the browser, we can't use crypto directly
      // Return a simple hash based on the buffer length and timestamp
      const timestamp = new Date().getTime();
      const simpleHash = `browser-${fileBuffer.length}-${timestamp}`;
      return simpleHash;
    }

    // Server-side hashing
    if (crypto && crypto.createHash) {
      return crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
    }

    // Fallback if crypto is not available
    return `fallback-${fileBuffer.length}-${Date.now()}`;
  }

  /**
   * Upload a file to storage
   */
  public async uploadFile(
    fileBuffer: Buffer,
    filePath: string,
    contentType: string = CONTENT_TYPES.TEXT,
    metadata: Record<string, string> = {}
  ): Promise<StorageResult> {
    // Generate content fingerprint
    const contentFingerprint = this.generateContentFingerprint(fileBuffer);

    // Add fingerprint to metadata
    const enhancedMetadata = {
      ...metadata,
      contentFingerprint,
      timestamp: new Date().toISOString()
    };

    // Check if we're running in a browser
    if (typeof window !== 'undefined') {
      // In the browser, we can't use S3 or the file system directly
      // Instead, we'll use the local-storage API endpoint
      try {
        DanteLogger.success.basic(`Uploading file via browser API: ${filePath}`);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', new Blob([fileBuffer]), filePath);
        formData.append('metadata', JSON.stringify(enhancedMetadata));
        formData.append('contentType', contentType);

        // Use the fetch API to upload the file
        const response = await fetch('/api/local-storage', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        DanteLogger.success.core(`File uploaded via browser API: ${filePath}`);

        return {
          success: true,
          message: 'File uploaded successfully via browser API',
          path: filePath,
          url: `/api/local-storage?path=${filePath}`,
          contentFingerprint
        };
      } catch (error) {
        const errorMessage = `Error uploading file via browser API: ${error instanceof Error ? error.message : String(error)}`;
        DanteLogger.error.system('Error uploading file via browser API', error);

        return {
          success: false,
          message: errorMessage
        };
      }
    }

    try {
      // Server-side storage
      // Use S3 if available
      if (this.isS3Available && this.s3Client && PutObjectCommand) {
        DanteLogger.success.basic(`Uploading file to S3: ${filePath}`);

        // Upload the file to S3
        const command = new PutObjectCommand({
          Bucket: unifiedEnvironment.s3BucketName,
          Key: filePath,
          Body: fileBuffer,
          ContentType: contentType,
          Metadata: this.stringifyMetadata(enhancedMetadata)
        });

        await this.s3Client.send(command);

        const url = `https://${unifiedEnvironment.s3BucketName}.s3.${unifiedEnvironment.s3Region}.amazonaws.com/${filePath}`;

        DanteLogger.success.core(`File uploaded to S3: ${filePath}`);

        return {
          success: true,
          message: 'File uploaded successfully to S3',
          path: filePath,
          url,
          contentFingerprint
        };
      } else if (fs && path) {
        // Use local storage
        DanteLogger.success.basic(`Uploading file to local storage: ${filePath}`);

        // Ensure the directory exists
        const fullPath = path.join(this.localStoragePath, filePath);
        const directory = path.dirname(fullPath);

        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        // Write the file
        fs.writeFileSync(fullPath, fileBuffer);

        // Write metadata to a separate file
        const metadataPath = `${fullPath}.metadata.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(enhancedMetadata, null, 2));

        DanteLogger.success.core(`File uploaded to local storage: ${filePath}`);

        return {
          success: true,
          message: 'File uploaded successfully to local storage',
          path: filePath,
          url: `/api/local-storage?path=${filePath}`,
          contentFingerprint
        };
      } else {
        return {
          success: false,
          message: 'No storage method available'
        };
      }
    } catch (error) {
      const errorMessage = `Error uploading file: ${error instanceof Error ? error.message : String(error)}`;
      DanteLogger.error.system('Error uploading file', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Upload text content to storage
   */
  public async uploadText(
    content: string,
    filePath: string,
    metadata: Record<string, string> = {}
  ): Promise<StorageResult> {
    return this.uploadFile(Buffer.from(content), filePath, CONTENT_TYPES.TEXT, metadata);
  }

  /**
   * Upload JSON content to storage
   */
  public async uploadJson(
    content: any,
    filePath: string,
    metadata: Record<string, string> = {}
  ): Promise<StorageResult> {
    const jsonContent = JSON.stringify(content, null, 2);
    return this.uploadFile(Buffer.from(jsonContent), filePath, CONTENT_TYPES.JSON, metadata);
  }

  /**
   * Helper method to stringify metadata for S3
   */
  private stringifyMetadata(metadata: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(metadata)) {
      if (value !== undefined && value !== null) {
        result[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
      }
    }

    return result;
  }
}

// Export a singleton instance
export const unifiedStorage = UnifiedStorageService.getInstance();
