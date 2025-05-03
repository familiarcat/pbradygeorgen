import { NextRequest, NextResponse } from 'next/server';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import path from 'path';
import fs from 'fs';
import { AmplifyStorageService } from '@/utils/amplifyStorageService';
import { ContentStateService } from '@/utils/ContentStateService';

/**
 * Download API Route
 * 
 * This API route handles downloading content in various formats.
 * It leverages the pre-built content from the build process.
 * 
 * Philosophical Framework:
 * - Salinger: Simplifying the interface to focus on content
 * - Hesse: Balancing structure (format options) with flexibility (content types)
 * - Derrida: Deconstructing the content into various formats
 * - Dante: Guiding the content through different download stages
 */
export async function GET(request: NextRequest) {
  const requestStart = Date.now();
  
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'markdown';
    const type = searchParams.get('type') || 'resume';
    const download = searchParams.get('download') === 'true';
    const includeMetadata = searchParams.get('metadata') === 'true';
    
    // Log the request
    console.log(`Download API called with format=${format}, type=${type}, download=${download}, includeMetadata=${includeMetadata}`);
    HesseLogger.summary.start(`Download API called with format=${format}, type=${type}`);
    DanteLogger.success.basic(`Download API called with format=${format}, type=${type}`);
    
    // Get the content state service
    const contentStateService = ContentStateService.getInstance();
    
    // Get the content fingerprint
    const contentFingerprint = contentStateService.getFingerprint();
    
    // Determine the file path based on format and type
    let filePath = '';
    let contentType = '';
    let fileName = '';
    
    // Check if we're running in AWS Amplify
    const isAmplify = !!process.env.AWS_EXECUTION_ENV;
    
    // Get the Amplify storage service
    const amplifyStorageService = AmplifyStorageService.getInstance();
    
    // Check if Amplify Storage is available and should be used
    const useAmplify = amplifyStorageService.isAmplifyStorageReady() && 
                      (isAmplify || process.env.AMPLIFY_USE_STORAGE === 'true');
    
    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [DownloadAPI] isAmplifyStorageReady: ${amplifyStorageService.isAmplifyStorageReady()}`);
      console.log(`🔍 [DownloadAPI] isAmplify: ${isAmplify}`);
      console.log(`🔍 [DownloadAPI] AMPLIFY_USE_STORAGE: ${process.env.AMPLIFY_USE_STORAGE}`);
      console.log(`🔍 [DownloadAPI] useAmplify: ${useAmplify}`);
      console.log(`🔍 [DownloadAPI] contentFingerprint: ${contentFingerprint}`);
    }
    
    // Determine the file path and content type based on format and type
    if (type === 'resume') {
      switch (format) {
        case 'text':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'resume.txt');
          contentType = 'text/plain';
          fileName = 'resume.txt';
          break;
        case 'markdown':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'resume.md');
          contentType = 'text/markdown';
          fileName = 'resume.md';
          break;
        case 'json':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'resume.json');
          contentType = 'application/json';
          fileName = 'resume.json';
          break;
        case 'html':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'resume.html');
          contentType = 'text/html';
          fileName = 'resume.html';
          break;
        case 'pdf':
          filePath = path.join(process.cwd(), 'public', 'default_resume.pdf');
          contentType = 'application/pdf';
          fileName = 'resume.pdf';
          break;
        default:
          filePath = path.join(process.cwd(), 'public', 'downloads', 'resume.md');
          contentType = 'text/markdown';
          fileName = 'resume.md';
      }
    } else if (type === 'cover-letter') {
      switch (format) {
        case 'markdown':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'cover_letter.md');
          contentType = 'text/markdown';
          fileName = 'cover_letter.md';
          break;
        case 'html':
          filePath = path.join(process.cwd(), 'public', 'downloads', 'cover_letter.html');
          contentType = 'text/html';
          fileName = 'cover_letter.html';
          break;
        default:
          filePath = path.join(process.cwd(), 'public', 'downloads', 'cover_letter.md');
          contentType = 'text/markdown';
          fileName = 'cover_letter.md';
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `Invalid content type: ${type}`,
          timestamp: new Date().toISOString(),
          requestDuration: Date.now() - requestStart
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Processing-Time': `${Date.now() - requestStart}ms`
          }
        }
      );
    }
    
    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [DownloadAPI] File path: ${filePath}`);
      console.log(`🔍 [DownloadAPI] Content type: ${contentType}`);
      console.log(`🔍 [DownloadAPI] File name: ${fileName}`);
    }
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `File not found: ${fileName}`,
          timestamp: new Date().toISOString(),
          requestDuration: Date.now() - requestStart
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Processing-Time': `${Date.now() - requestStart}ms`
          }
        }
      );
    }
    
    // Read the file
    const fileContent = fs.readFileSync(filePath);
    
    // Calculate request duration
    const requestDuration = Date.now() - requestStart;
    
    // If download is requested, return the file as an attachment
    if (download) {
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`
        }
      });
    }
    
    // If JSON response is requested, return the file content as JSON
    if (contentType === 'application/json') {
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`
        }
      });
    }
    
    // For other formats, return the file content as text
    const responseData = {
      success: true,
      content: fileContent.toString('utf-8'),
      format,
      type,
      timestamp: new Date().toISOString(),
      requestDuration,
      
      // Include metadata if requested
      ...(includeMetadata ? {
        metadata: {
          contentType,
          fileName,
          fileSize: fileContent.length,
          contentFingerprint
        }
      } : {})
    };
    
    return new NextResponse(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`,
          'X-Content-Type': contentType,
          'X-File-Name': fileName
        }
      }
    );
  } catch (error) {
    console.error('Error in Download API:', error);
    HesseLogger.summary.error(`Error in Download API: ${error}`);
    DanteLogger.error.system('Error in Download API', error);
    
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: `Error in Download API: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
        requestDuration: Date.now() - requestStart
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${Date.now() - requestStart}ms`
        }
      }
    );
  }
}
