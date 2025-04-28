import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * API route for retrieving PDF extraction logs
 * This provides visibility into the PDF extraction process
 */
export async function GET(request: NextRequest) {
  try {
    // Get the extraction log file path
    const logFilePath = path.join(process.cwd(), 'public', 'extracted', 'extraction_log.json');
    const summaryFilePath = path.join(process.cwd(), 'public', 'extracted', 'extraction_summary.txt');
    const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');

    // Check if the log file exists
    if (!fs.existsSync(logFilePath)) {
      DanteLogger.warn.deprecated('Extraction log file not found');

      // Check if we have a summary file instead
      if (fs.existsSync(summaryFilePath)) {
        const summaryContent = fs.readFileSync(summaryFilePath, 'utf8');
        return NextResponse.json({
          success: true,
          message: 'Extraction log not found, but summary is available',
          summary: summaryContent,
          logAvailable: false
        });
      }

      // Check if we have build info instead
      if (fs.existsSync(buildInfoPath)) {
        const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
        return NextResponse.json({
          success: true,
          message: 'Extraction log not found, but build info is available',
          buildInfo,
          logAvailable: false
        });
      }

      return NextResponse.json({
        success: false,
        error: 'Extraction log file not found'
      }, { status: 404 });
    }

    // Read the log file
    const logContent = fs.readFileSync(logFilePath, 'utf8');
    const log = JSON.parse(logContent);

    // Get additional information if available
    let summary = '';
    if (fs.existsSync(summaryFilePath)) {
      summary = fs.readFileSync(summaryFilePath, 'utf8');
    }

    // Get the content fingerprint if available
    const fingerprintPath = path.join(process.cwd(), 'public', 'extracted', 'content_fingerprint.txt');
    let contentFingerprint = '';
    if (fs.existsSync(fingerprintPath)) {
      contentFingerprint = fs.readFileSync(fingerprintPath, 'utf8').trim();
    }

    // Get the PDF file information
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    let pdfInfo: any = null;
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      pdfInfo = {
        path: pdfPath,
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        exists: true
      };
    } else {
      pdfInfo = {
        path: pdfPath,
        exists: false
      };
    }

    // Return the log data
    return NextResponse.json({
      success: true,
      log,
      summary,
      contentFingerprint,
      pdfInfo,
      logAvailable: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    DanteLogger.error.dataFlow(`Error retrieving extraction logs: ${error}`);

    return NextResponse.json({
      success: false,
      error: 'Error retrieving extraction logs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
