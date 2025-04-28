/**
 * PDF Extraction Logger
 * 
 * A specialized logger for PDF extraction processes with detailed information
 * about what's being extracted and the status of the extraction.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import fs from 'fs';
import path from 'path';

export class PdfExtractionLogger {
  private static logFilePath = path.join(process.cwd(), 'public', 'extracted', 'extraction_log.json');
  private static extractionLog: ExtractionLog = {
    timestamp: new Date().toISOString(),
    pdfInfo: {
      path: '',
      size: 0,
      lastModified: '',
      contentFingerprint: ''
    },
    extractionSteps: [],
    extractedContent: {
      text: false,
      markdown: false,
      fonts: false,
      colors: false
    }
  };

  /**
   * Initialize the logger with PDF information
   */
  static init(pdfPath: string, pdfSize: number, pdfModified: string, contentFingerprint: string) {
    this.extractionLog = {
      timestamp: new Date().toISOString(),
      pdfInfo: {
        path: pdfPath,
        size: pdfSize,
        lastModified: pdfModified,
        contentFingerprint: contentFingerprint
      },
      extractionSteps: [],
      extractedContent: {
        text: false,
        markdown: false,
        fonts: false,
        colors: false
      }
    };

    // Log initialization
    DanteLogger.success.basic(`PDF Extraction Logger initialized for ${path.basename(pdfPath)}`);
    this.addStep('init', 'PDF Extraction Logger initialized');
    this.saveLog();
  }

  /**
   * Add a step to the extraction log
   */
  static addStep(type: string, message: string, details?: any) {
    const step = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details: details || {}
    };

    this.extractionLog.extractionSteps.push(step);
    this.saveLog();

    // Also log to console
    if (type === 'error') {
      DanteLogger.error.dataFlow(`PDF Extraction: ${message}`);
      console.error(`PDF Extraction Error: ${message}`, details || '');
    } else if (type === 'warning') {
      DanteLogger.warn.deprecated(`PDF Extraction: ${message}`);
      console.warn(`PDF Extraction Warning: ${message}`, details || '');
    } else {
      DanteLogger.success.basic(`PDF Extraction: ${message}`);
      console.log(`PDF Extraction: ${message}`, details ? JSON.stringify(details).substring(0, 100) + '...' : '');
    }
  }

  /**
   * Update the extraction status
   */
  static updateStatus(contentType: 'text' | 'markdown' | 'fonts' | 'colors', extracted: boolean) {
    this.extractionLog.extractedContent[contentType] = extracted;
    this.saveLog();

    // Log the status update
    if (extracted) {
      DanteLogger.success.basic(`PDF Extraction: ${contentType} extracted successfully`);
    } else {
      DanteLogger.warn.deprecated(`PDF Extraction: ${contentType} extraction failed`);
    }
  }

  /**
   * Save the extraction log to a file
   */
  static saveLog() {
    try {
      const extractedDir = path.dirname(this.logFilePath);
      if (!fs.existsSync(extractedDir)) {
        fs.mkdirSync(extractedDir, { recursive: true });
      }

      fs.writeFileSync(this.logFilePath, JSON.stringify(this.extractionLog, null, 2));
    } catch (error) {
      console.error('Error saving extraction log:', error);
    }
  }

  /**
   * Get the extraction log
   */
  static getLog(): ExtractionLog {
    return this.extractionLog;
  }

  /**
   * Load the extraction log from a file
   */
  static loadLog(): ExtractionLog | null {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const logData = fs.readFileSync(this.logFilePath, 'utf8');
        return JSON.parse(logData);
      }
    } catch (error) {
      console.error('Error loading extraction log:', error);
    }
    return null;
  }

  /**
   * Print a summary of the extraction
   */
  static printSummary() {
    const log = this.extractionLog;
    
    console.log('\n📋 PDF EXTRACTION SUMMARY');
    console.log('=======================');
    console.log(`📄 PDF: ${path.basename(log.pdfInfo.path)}`);
    console.log(`📊 Size: ${log.pdfInfo.size} bytes`);
    console.log(`⏱️ Last Modified: ${log.pdfInfo.lastModified}`);
    console.log(`🔑 Content Fingerprint: ${log.pdfInfo.contentFingerprint.substring(0, 8)}...`);
    console.log('\n📦 EXTRACTED CONTENT:');
    console.log(`📝 Text: ${log.extractedContent.text ? '✅' : '❌'}`);
    console.log(`📄 Markdown: ${log.extractedContent.markdown ? '✅' : '❌'}`);
    console.log(`🔤 Fonts: ${log.extractedContent.fonts ? '✅' : '❌'}`);
    console.log(`🎨 Colors: ${log.extractedContent.colors ? '✅' : '❌'}`);
    console.log('\n⏱️ EXTRACTION TIMELINE:');
    
    log.extractionSteps.forEach((step, index) => {
      const icon = step.type === 'error' ? '❌' : step.type === 'warning' ? '⚠️' : '✅';
      console.log(`${icon} ${new Date(step.timestamp).toLocaleTimeString()}: ${step.message}`);
    });
    
    console.log('\n=======================');
    
    // Also log to Dante
    HesseLogger.summary.start('PDF Extraction Summary');
    DanteLogger.success.basic(`PDF Extraction completed with ${log.extractionSteps.length} steps`);
    
    if (log.extractedContent.text && log.extractedContent.markdown && 
        log.extractedContent.fonts && log.extractedContent.colors) {
      DanteLogger.success.core('All content extracted successfully');
    } else {
      DanteLogger.warn.deprecated('Some content extraction failed');
    }
  }
}

// Types
interface ExtractionLog {
  timestamp: string;
  pdfInfo: {
    path: string;
    size: number;
    lastModified: string;
    contentFingerprint: string;
  };
  extractionSteps: {
    timestamp: string;
    type: string;
    message: string;
    details?: any;
  }[];
  extractedContent: {
    text: boolean;
    markdown: boolean;
    fonts: boolean;
    colors: boolean;
  };
}

export default PdfExtractionLogger;
