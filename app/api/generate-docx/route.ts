/**
 * API Route: /api/generate-docx
 *
 * This API route generates a proper Microsoft Word (.docx) document from markdown content.
 * It uses a server-side approach to create a true DOCX file without extra metadata or containers.
 */

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import UserInfoService from '@/utils/UserInfoService';

// Promisify exec
const execAsync = promisify(exec);

/**
 * Generate a DOCX document from markdown content
 *
 * @param req The request object
 * @returns The response object
 */
export async function POST(req: NextRequest) {
  try {
    DanteLogger.success.basic('Generating DOCX document');

    // Get the request body
    const body = await req.json();
    const { markdownContent, fileName } = body;

    // Validate the request
    if (!markdownContent) {
      DanteLogger.error.dataFlow('Missing markdown content');
      return NextResponse.json({ success: false, error: 'Missing markdown content' }, { status: 400 });
    }

    // Get user information
    const userInfo = await UserInfoService.loadUserInfo();

    // Create a temporary file for the markdown content
    const tempDir = path.join(process.cwd(), 'public', 'extracted');

    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create a temporary markdown file
    const tempMarkdownPath = path.join(tempDir, `${fileName || 'document'}_temp.md`);
    fs.writeFileSync(tempMarkdownPath, markdownContent);

    // Generate the output file name
    const outputFileName = fileName || userInfo.filePrefix || 'document';
    const outputPath = path.join(tempDir, `${outputFileName}.docx`);

    // Use pandoc to convert markdown to DOCX
    try {
      // Log the command for debugging
      const pandocCommand = `pandoc "${tempMarkdownPath}" -o "${outputPath}" --reference-doc=templates/reference.docx`;
      DanteLogger.success.basic(`Running pandoc command: ${pandocCommand}`);

      // Execute pandoc with proper options
      await execAsync(pandocCommand);

      // Verify the file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error(`Pandoc did not create the output file: ${outputPath}`);
      }

      // Log file size for debugging
      const stats = fs.statSync(outputPath);
      DanteLogger.success.basic(`Generated DOCX file size: ${stats.size} bytes`);

      if (stats.size < 100) {
        throw new Error(`Generated DOCX file is too small (${stats.size} bytes), likely invalid`);
      }
    } catch (error) {
      // If pandoc fails or is not installed, try a simpler approach
      DanteLogger.error.dataFlow(`Pandoc failed: ${error}. Trying alternative approach.`);

      // Create a simple HTML file that can be opened in Word
      const simpleHtml = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${outputFileName}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            /* Default styles */
            body {
              font-family: 'Calibri', sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              margin: 1in;
            }
            h1 { font-size: 16pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 3pt; }
            p { margin-top: 0pt; margin-bottom: 8pt; }
            ul, ol { margin-top: 0pt; margin-bottom: 8pt; }
            li { margin-bottom: 4pt; }
          </style>
        </head>
        <body>
          ${markdownContent
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')}
        </body>
        </html>
      `;

      // Write the HTML file
      const simpleHtmlPath = path.join(tempDir, `${outputFileName}.html`);
      fs.writeFileSync(simpleHtmlPath, simpleHtml);

      // Return the HTML path instead
      return NextResponse.json({
        success: true,
        docxUrl: `/extracted/${outputFileName}.html`,
        fileName: `${outputFileName}.docx`,
        isHtml: true
      });
    }

    // Clean up the temporary markdown file
    fs.unlinkSync(tempMarkdownPath);

    // Return the path to the generated DOCX file
    const docxUrl = `/extracted/${outputFileName}.docx`;
    DanteLogger.success.basic(`DOCX document generated: ${docxUrl}`);

    return NextResponse.json({
      success: true,
      docxUrl,
      fileName: `${outputFileName}.docx`
    });
  } catch (error) {
    DanteLogger.error.dataFlow(`Error generating DOCX document: ${error}`);
    return NextResponse.json({ success: false, error: 'Failed to generate DOCX document' }, { status: 500 });
  }
}

/**
 * Handle GET requests
 *
 * @param req The request object
 * @returns The response object
 */
export async function GET(req: NextRequest) {
  try {
    // Get the file name from the query parameters
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName') || 'resume';

    // Check if the DOCX file exists
    const docxPath = path.join(process.cwd(), 'public', 'extracted', `${fileName}.docx`);

    if (fs.existsSync(docxPath)) {
      // Return the path to the DOCX file
      const docxUrl = `/extracted/${fileName}.docx`;
      DanteLogger.success.basic(`DOCX document found: ${docxUrl}`);

      return NextResponse.json({
        success: true,
        docxUrl,
        fileName: `${fileName}.docx`
      });
    }

    // If DOCX doesn't exist, check for HTML fallback
    const htmlPath = path.join(process.cwd(), 'public', 'extracted', `${fileName}.html`);

    if (fs.existsSync(htmlPath)) {
      // Return the path to the HTML file
      const docxUrl = `/extracted/${fileName}.html`;
      DanteLogger.success.basic(`DOCX-compatible HTML document found: ${docxUrl}`);

      return NextResponse.json({
        success: true,
        docxUrl,
        fileName: `${fileName}.docx`,
        isHtml: true
      });
    }

    // Neither file exists
    DanteLogger.error.dataFlow(`DOCX file not found: ${docxPath}`);
    return NextResponse.json({ success: false, error: 'DOCX file not found' }, { status: 404 });
  } catch (error) {
    DanteLogger.error.dataFlow(`Error retrieving DOCX document: ${error}`);
    return NextResponse.json({ success: false, error: 'Failed to retrieve DOCX document' }, { status: 500 });
  }
}
