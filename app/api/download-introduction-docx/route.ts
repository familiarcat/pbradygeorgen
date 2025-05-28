/**
 * API Route: /api/download-introduction-docx
 * 
 * A dedicated API endpoint for downloading the Introduction DOCX file.
 * This ensures that the Introduction DOCX file is always available and properly downloaded.
 * 
 * Following philosophies:
 * - Occam's razor: the simplest solution is often the best
 * - Derrida: deconstructing hardcoded implementations
 * - Hesse: mathematical harmony in implementation patterns
 * - Müller-Brockmann: clean, grid-based structure
 * - Dante: methodical logging
 */

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import UserInfoService from '@/utils/UserInfoService';

// Promisify exec
const execAsync = util.promisify(exec);

export async function GET(req: NextRequest) {
  try {
    DanteLogger.success.basic('Downloading Introduction DOCX document');
    HesseLogger.summary.start('Downloading Introduction DOCX document');

    // Get user information
    const userInfo = await UserInfoService.loadUserInfo();
    
    // Determine the file name
    const fileName = userInfo.introductionFileName || 'introduction';
    
    // Check if the file exists
    const filePath = path.join(process.cwd(), 'public', 'extracted', `${fileName}.docx`);
    
    if (!fs.existsSync(filePath)) {
      DanteLogger.error.dataFlow(`Introduction DOCX file not found: ${filePath}`);
      HesseLogger.summary.error(`Introduction DOCX file not found: ${filePath}`);
      
      // Get the introduction content
      const introductionPath = path.join(process.cwd(), 'public', 'extracted', `${fileName}.md`);
      
      if (!fs.existsSync(introductionPath)) {
        DanteLogger.error.dataFlow(`Introduction markdown file not found: ${introductionPath}`);
        return NextResponse.json({ 
          success: false, 
          error: 'Introduction files not found' 
        }, { status: 404 });
      }
      
      // Read the introduction content
      const introductionContent = fs.readFileSync(introductionPath, 'utf-8');
      
      // Create a temporary markdown file
      const tempDir = path.join(process.cwd(), 'public', 'extracted');
      const tempMarkdownPath = path.join(tempDir, `${fileName}_temp.md`);
      fs.writeFileSync(tempMarkdownPath, introductionContent);
      
      // Generate the DOCX file using pandoc
      try {
        // Check if reference.docx exists
        const referenceDocxPath = path.join(process.cwd(), 'templates', 'reference.docx');
        let referenceDocxOption = '';
        
        if (fs.existsSync(referenceDocxPath)) {
          referenceDocxOption = `--reference-doc="${referenceDocxPath}"`;
          DanteLogger.success.basic(`Using reference.docx template: ${referenceDocxPath}`);
        } else {
          DanteLogger.error.dataFlow(`Reference DOCX template not found: ${referenceDocxPath}`);
        }
        
        // Log the command for debugging
        const pandocCommand = `pandoc "${tempMarkdownPath}" -o "${filePath}" ${referenceDocxOption} -f markdown -t docx`;
        DanteLogger.success.basic(`Running pandoc command: ${pandocCommand}`);

        // Execute pandoc with proper options
        await execAsync(pandocCommand);

        // Verify the file was created
        if (!fs.existsSync(filePath)) {
          throw new Error(`Pandoc did not create the output file: ${filePath}`);
        }

        // Log file size for debugging
        const stats = fs.statSync(filePath);
        DanteLogger.success.basic(`Generated DOCX file size: ${stats.size} bytes`);

        if (stats.size < 100) {
          throw new Error(`Generated DOCX file is too small (${stats.size} bytes), likely invalid`);
        }
        
        // Set proper file permissions to ensure it's readable
        fs.chmodSync(filePath, 0o644);
        
        DanteLogger.success.basic(`Introduction DOCX file created: ${filePath}`);
      } catch (pandocError) {
        DanteLogger.error.dataFlow(`Failed to generate Introduction DOCX file: ${pandocError}`);
        return NextResponse.json({ 
          success: false, 
          error: `Failed to generate Introduction DOCX file: ${pandocError}` 
        }, { status: 500 });
      }
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create a response with the file content and appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}.docx"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
    DanteLogger.success.basic(`Introduction DOCX document downloaded: ${fileName}.docx`);
    HesseLogger.summary.complete(`Introduction DOCX document downloaded: ${fileName}.docx`);
    
    return response;
  } catch (error) {
    DanteLogger.error.runtime(`Error downloading Introduction DOCX document: ${error}`);
    HesseLogger.summary.error(`Error downloading Introduction DOCX document: ${error}`);
    
    return NextResponse.json({ 
      success: false, 
      error: `Error downloading Introduction DOCX document: ${error}` 
    }, { status: 500 });
  }
}
