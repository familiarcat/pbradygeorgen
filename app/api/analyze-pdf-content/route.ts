import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { analyzeResumeContent } from '@/utils/openaiPdfStructureService';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    HesseLogger.ai.start('Analyzing PDF content with ChatGPT');
    
    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    
    // Path to the JSON file
    const jsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');
    const analyzedJsonPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    
    // Check if we need to refresh the JSON content
    if (forceRefresh) {
      HesseLogger.ai.progress('Force refresh requested, extracting PDF content to JSON');
      
      // Path to the default PDF
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
      
      // Run the extraction script
      await execAsync(`node scripts/extract-pdf-to-json.js "${pdfPath}"`);
      DanteLogger.success.core('PDF content extracted to JSON successfully');
    }
    
    // Check if the JSON file exists
    try {
      await fs.access(jsonPath);
    } catch (error) {
      // If the file doesn't exist, extract the content
      HesseLogger.ai.progress('JSON file not found, extracting PDF content');
      
      // Path to the default PDF
      const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
      
      // Run the extraction script
      await execAsync(`node scripts/extract-pdf-to-json.js "${pdfPath}"`);
      DanteLogger.success.core('PDF content extracted to JSON successfully');
    }
    
    // Read the JSON file
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    
    // Parse the JSON content
    const content = JSON.parse(jsonContent);
    
    // Check if we need to analyze the content
    let analyzedContent;
    let needsAnalysis = forceRefresh;
    
    if (!needsAnalysis) {
      try {
        // Check if the analyzed JSON file exists and is newer than the source JSON
        const jsonStats = await fs.stat(jsonPath);
        try {
          const analyzedStats = await fs.stat(analyzedJsonPath);
          // If the analyzed file is older than the source, we need to analyze again
          if (analyzedStats.mtime < jsonStats.mtime) {
            needsAnalysis = true;
          }
        } catch (error) {
          // If the analyzed file doesn't exist, we need to analyze
          needsAnalysis = true;
        }
      } catch (error) {
        // If we can't check the stats, assume we need to analyze
        needsAnalysis = true;
      }
    }
    
    if (needsAnalysis) {
      HesseLogger.ai.progress('Analyzing PDF content with ChatGPT');
      
      // Get the raw text from the JSON content
      const rawText = content.rawText;
      
      // Analyze the content with ChatGPT
      analyzedContent = await analyzeResumeContent(rawText);
      
      // Save the analyzed content to a file
      await fs.writeFile(analyzedJsonPath, JSON.stringify(analyzedContent, null, 2));
      
      DanteLogger.success.core('PDF content analyzed with ChatGPT successfully');
    } else {
      // Read the analyzed JSON file
      const analyzedJsonContent = await fs.readFile(analyzedJsonPath, 'utf-8');
      
      // Parse the analyzed JSON content
      analyzedContent = JSON.parse(analyzedJsonContent);
      
      HesseLogger.ai.progress('Using cached ChatGPT analysis');
    }
    
    HesseLogger.ai.success('PDF content analysis retrieved successfully');
    
    // Return the JSON content and the analyzed content
    return NextResponse.json({
      success: true,
      originalContent: content,
      analyzedContent
    });
  } catch (error) {
    console.error('Error analyzing PDF content:', error);
    HesseLogger.ai.error(`Error analyzing PDF content: ${error}`);
    DanteLogger.error.dataFlow('Error analyzing PDF content', { error });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze PDF content',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
