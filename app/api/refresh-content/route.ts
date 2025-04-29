import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import fs from 'fs';
import path from 'path';

// Promisify exec
const execAsync = promisify(exec);

/**
 * API route to force content refresh
 * This will run the content extraction and analysis scripts
 */
export async function POST(request: NextRequest) {
  try {
    DanteLogger.success.core('Starting content refresh process');
    HesseLogger.ai.start('Content refresh requested');

    // Get the current timestamp
    const timestamp = new Date().toISOString();

    // Log the request
    console.log(`🔄 Content refresh requested at ${timestamp}`);

    // Create a log entry
    const logEntry = {
      timestamp,
      action: 'content-refresh-requested',
      source: 'api',
      details: {
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    };

    // Save the log entry
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(
      path.join(logsDir, 'content-refresh.log'),
      JSON.stringify(logEntry) + '\n'
    );

    // Run the content extraction script
    console.log('🔄 Running content extraction script...');
    const { stdout, stderr } = await execAsync('./amplify-dynamic-pdf.sh');

    // Log the output
    console.log('📋 Script output:');
    console.log(stdout);

    if (stderr) {
      console.error('⚠️ Script errors:');
      console.error(stderr);
    }

    // Check if the extraction was successful
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    const extractionSuccessful = fs.existsSync(analyzedPath);

    if (!extractionSuccessful) {
      throw new Error('Content extraction failed - analyzed content file not found');
    }

    // Read the analyzed content to verify it
    const analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));

    // Create a response with the refresh details
    const response = {
      success: true,
      timestamp,
      message: 'Content refreshed successfully',
      contentPreview: {
        name: analyzedContent.structuredContent.name,
        sections: Object.keys(analyzedContent.sections),
        timestamp: new Date().toISOString()
      }
    };

    DanteLogger.success.perfection('Content refresh completed successfully');
    HesseLogger.ai.success('Content refresh completed');

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error refreshing content:', error);
    DanteLogger.error.system('Content refresh failed', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * API route to get the current content status
 */
export async function GET(request: NextRequest) {
  try {
    // Get the build info
    const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');

    if (!fs.existsSync(buildInfoPath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Build info not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));

    // Get the analyzed content info
    const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    let analyzedInfo: {
      name: string;
      sections: string[];
      structuredSections: string[];
    } | null = null;

    if (fs.existsSync(analyzedPath)) {
      const analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
      analyzedInfo = {
        name: analyzedContent.structuredContent.name,
        sections: Object.keys(analyzedContent.sections),
        structuredSections: Object.keys(analyzedContent.structuredContent)
      };
    }

    // Create a response with the content status
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      buildInfo,
      analyzedInfo,
      filesExist: {
        buildInfo: fs.existsSync(buildInfoPath),
        analyzedContent: fs.existsSync(analyzedPath),
        textContent: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'resume_content.txt')),
        markdownContent: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'resume_content.md')),
        fontInfo: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'font_info.json')),
        colorTheme: fs.existsSync(path.join(process.cwd(), 'public', 'extracted', 'color_theme.json'))
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error getting content status:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
