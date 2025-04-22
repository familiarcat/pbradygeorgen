import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      DanteLogger.error.validation('No PDF file provided in upload request');
      return NextResponse.json({ success: false, error: 'No PDF file provided' }, { status: 400 });
    }

    // Validate file type
    if (!pdfFile.type.includes('pdf')) {
      DanteLogger.error.validation('Invalid file type uploaded', { type: pdfFile.type });
      return NextResponse.json({ success: false, error: 'File must be a PDF' }, { status: 400 });
    }

    // Create a safe filename
    const originalName = pdfFile.name;
    const safeFileName = originalName
      .replace(/[^a-zA-Z0-9_.-]/g, '_')
      .toLowerCase();

    // Create the uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${safeFileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Convert the file to a Buffer and write it to disk
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(filePath, buffer);

    DanteLogger.success.basic('PDF file saved successfully', { path: filePath });

    // Create a URL for the uploaded file
    const pdfUrl = `/uploads/${uniqueFileName}`;

    // Process the PDF to extract content
    try {
      // Create the extracted directory if it doesn't exist
      const extractedDir = path.join(process.cwd(), 'public', 'extracted');
      if (!existsSync(extractedDir)) {
        await mkdir(extractedDir, { recursive: true });
      }

      // Run the extraction script
      await execAsync(`node scripts/extract-pdf-text-improved.js "${filePath}"`);
      DanteLogger.success.core('PDF content extracted successfully');

      // Generate improved markdown
      await execAsync('node scripts/generate-improved-markdown.js');
      DanteLogger.success.core('Improved markdown generated successfully');
    } catch (error) {
      // Log the error but don't fail the upload
      DanteLogger.error.dataFlow('Error processing PDF content', { error });
      console.error('Error processing PDF content:', error);
    }

    return NextResponse.json({
      success: true,
      pdfUrl,
      fileName: uniqueFileName,
      originalName
    });
  } catch (error) {
    console.error('Error handling PDF upload:', error);
    DanteLogger.error.system('Error handling PDF upload', { error });
    return NextResponse.json(
      { success: false, error: 'Failed to process PDF upload' },
      { status: 500 }
    );
  }
}
