import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { CONTENT_TYPES } from '@/utils/UnifiedStorageService';

/**
 * API route to handle local storage access
 *
 * This route provides access to files stored in the local file system,
 * simulating S3 storage for local development.
 *
 * It supports both GET and POST methods:
 * - GET: Retrieve a file from local storage
 * - POST: Upload a file to local storage
 */
export async function GET(request: NextRequest) {
  try {
    // Get the file path from the query parameters
    const filePath = request.nextUrl.searchParams.get('path');

    if (!filePath) {
      DanteLogger.error.validation('No file path provided');
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    // Sanitize the file path to prevent directory traversal attacks
    const sanitizedPath = filePath.replace(/\.\./g, '');

    // Get the full path to the file
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath);

    // Check if the file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      DanteLogger.error.system(`File not found: ${sanitizedPath}`, error);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(fullPath);

    // Determine the content type based on the file extension
    const extension = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (extension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.md':
        contentType = 'text/markdown';
        break;
      case '.html':
        contentType = 'text/html';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Check if there's a metadata file
    let metadata = {};
    try {
      const metadataPath = `${fullPath}.metadata.json`;
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    } catch (error) {
      // Metadata file doesn't exist or is invalid, ignore
    }

    // Log the access
    DanteLogger.success.core(`Local storage access: ${sanitizedPath}`);

    // Return the file with the appropriate content type
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'X-Metadata': JSON.stringify(metadata)
      }
    });
  } catch (error) {
    DanteLogger.error.system('Error accessing local storage', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests to upload files to local storage
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string;
    const contentType = formData.get('contentType') as string || CONTENT_TYPES.TEXT;

    if (!file) {
      DanteLogger.error.validation('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get the file path from the form data or the file name
    let filePath = formData.get('path') as string;
    if (!filePath) {
      filePath = file.name;
    }

    // Sanitize the file path to prevent directory traversal attacks
    const sanitizedPath = filePath.replace(/\.\./g, '');

    // Get the full path to the file
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath);

    // Ensure the directory exists
    const directory = path.dirname(fullPath);
    await fs.mkdir(directory, { recursive: true });

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write the file
    await fs.writeFile(fullPath, fileBuffer);

    // Parse and write metadata if provided
    let metadata = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);

        // Write metadata to a separate file
        const metadataPath = `${fullPath}.metadata.json`;
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      } catch (error) {
        DanteLogger.error.validation('Invalid metadata JSON', error);
      }
    }

    // Log the upload
    DanteLogger.success.core(`File uploaded to local storage: ${sanitizedPath}`);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      path: sanitizedPath,
      url: `/api/local-storage?path=${sanitizedPath}`,
      metadata
    });
  } catch (error) {
    DanteLogger.error.system('Error uploading to local storage', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
