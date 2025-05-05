import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { DanteLogger } from '@/utils/DanteLogger';

const execAsync = promisify(exec);

export async function POST() {
  try {
    DanteLogger.success.basic('Processing PDF via API');

    // Get the path to the default PDF
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

    // Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      DanteLogger.error.validation('PDF file not found', { path: pdfPath });
      return NextResponse.json({ success: false, error: 'PDF file not found' }, { status: 404 });
    }

    // Process the PDF
    try {
      // First try with OpenAI
      DanteLogger.success.basic('Attempting to process PDF with OpenAI');
      await execAsync(`node scripts/process-pdf-with-openai.js "${pdfPath}"`);
      DanteLogger.success.core('PDF processed successfully with OpenAI');
    } catch (error) {
      DanteLogger.warn.resources('OpenAI processing failed, falling back to basic extraction', { error });

      // Fall back to basic extraction
      await execAsync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`);

      // Generate improved markdown
      const extractedTextPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.txt');
      await execAsync(`node scripts/generate-improved-markdown.js "${extractedTextPath}"`);
    }

    // Update the download test report
    const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Read the extracted content
    const extractedContentPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');
    let extractedContent: Record<string, unknown> = {};

    if (fs.existsSync(extractedContentPath)) {
      try {
        extractedContent = JSON.parse(fs.readFileSync(extractedContentPath, 'utf8'));
      } catch (error) {
        DanteLogger.error.dataFlow('Failed to parse extracted content JSON', { error });
      }
    }

    // Create preview content
    const previewContent = {
      title: extractedContent?.title || 'Resume',
      summary: extractedContent?.summary || 'Resume content preview',
      sections: Array.isArray(extractedContent?.sections) ? extractedContent.sections : [
        {
          title: 'Summary',
          content: extractedContent?.summary || 'Resume content preview'
        },
        {
          title: 'Skills',
          content: extractedContent?.skills || ['JavaScript', 'TypeScript', 'React', 'Next.js', 'AWS']
        },
        {
          title: 'Experience',
          content: extractedContent?.experience || 'Professional experience information'
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Create download test report
    const downloadTestReport = {
      pdfSource: 'default_resume.pdf',
      formats: [
        {
          name: 'Plain Text',
          description: 'Simple text format',
          path: '/extracted/resume_content.txt',
          icon: '📄'
        },
        {
          name: 'Markdown',
          description: 'Formatted markdown',
          path: '/extracted/resume_content.md',
          icon: '📝'
        },
        {
          name: 'JSON',
          description: 'Structured data',
          path: '/extracted/resume_content.json',
          icon: '📊'
        },
        {
          name: 'Original PDF',
          description: 'Original PDF file',
          path: '/default_resume.pdf',
          icon: '📎'
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Write the files
    const previewContentPath = path.join(downloadsDir, 'preview_content.json');
    const downloadTestReportPath = path.join(process.cwd(), 'public', 'download_test_report.json');

    fs.writeFileSync(previewContentPath, JSON.stringify(previewContent, null, 2));
    fs.writeFileSync(downloadTestReportPath, JSON.stringify(downloadTestReport, null, 2));

    DanteLogger.success.core('PDF processing completed via API');

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error processing PDF';
    DanteLogger.error.system('Error processing PDF via API', { error });
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
