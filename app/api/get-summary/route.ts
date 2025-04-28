import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { analyzeResume, formatSummaryContent } from '@/utils/openaiService';
import { getExtractedContent } from '@/utils/pdfContentRefresher';

export async function GET(request: NextRequest) {
  try {
    console.log(`🔄 GET /api/get-summary - Request received`);
    DanteLogger.success.basic('Summary API called');

    // Always force refresh to ensure we're using fresh content
    const searchParams = request.nextUrl.searchParams;
    const timestampParam = searchParams.has('t'); // If timestamp is present, it's an additional signal to force refresh
    const timestamp = searchParams.get('t');
    const forceRefresh = true; // Always force refresh

    console.log(`🔄 Timestamp parameter: ${timestamp}`);
    console.log(`🔄 Force refresh: ${forceRefresh ? 'Yes' : 'No'}`);

    DanteLogger.success.basic('Forcing PDF content refresh to ensure fresh content');

    // Get fresh content from the PDF
    DanteLogger.success.basic('Using PDF content refresher for resume content');

    // Log the current PDF file being used
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const pdfPath = path.join(publicDir, 'default_resume.pdf');

      if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        console.log(`📄 Using PDF file: ${pdfPath}`);
        console.log(`📊 Size: ${stats.size} bytes`);
        console.log(`⏱️ Last modified: ${new Date(stats.mtimeMs).toISOString()}`);
      } else {
        console.log(`⚠️ PDF file not found: ${pdfPath}`);
      }
    } catch (error) {
      console.error('Error checking PDF file:', error);
    }

    // Try to get fresh content with a timeout
    let content: string | null = null;
    let contentError: any = null;

    try {
      // Set a timeout for content extraction to prevent hanging
      const contentPromise = getExtractedContent(forceRefresh);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('PDF content extraction timed out after 10 seconds')), 10000);
      });

      content = await Promise.race([contentPromise, timeoutPromise]) as string;

      if (content) {
        console.log(`✅ Successfully extracted fresh content from PDF (${content.length} characters)`);
        console.log(`📝 Content starts with: "${content.substring(0, 50)}..."`);
      }
    } catch (error) {
      contentError = error;
      console.error('Error extracting content from PDF:', error);
      DanteLogger.error.runtime(`Failed to get fresh content from PDF: ${error}`);
    }

    // If content extraction failed, return an error message in the cover letter
    if (!content) {
      DanteLogger.error.runtime('Failed to get fresh content from PDF, using error fallback');

      return NextResponse.json({
        success: true, // Still return success to show the error message in the UI
        summary: `# PDF Content Extraction Error

## ⚠️ Error Extracting Content

There was an error extracting content from the current PDF file. This could be due to:

- The PDF file may be corrupted or in an unsupported format
- The PDF extraction process timed out
- There may be an issue with the server-side PDF processing

### Technical Details

${contentError ? `Error: ${contentError.message || 'Unknown error'}` : 'No content was extracted from the PDF'}

### Next Steps

- Try uploading a different PDF file
- Check the extraction logs for more details
- Contact the administrator if the problem persists

*This error message is shown instead of reverting to outdated content from a previous PDF file.*
`
      });
    }

    // Check if we have an OpenAI API key and it's enabled
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true';

    if (useOpenAI) {
      try {
        HesseLogger.summary.start('Starting summary generation with OpenAI');

        // First, try to format the content directly using our optimized prompt
        try {
          const startTime = Date.now();
          const formattedSummary = await formatSummaryContent(content);
          const endTime = Date.now();

          HesseLogger.summary.complete(`Summary formatted in ${endTime - startTime}ms`);

          return NextResponse.json({
            success: true,
            summary: formattedSummary
          });
        } catch (formatError) {
          HesseLogger.summary.error(`Error formatting summary: ${formatError}`);
          DanteLogger.warn.deprecated('Falling back to analysis-based summary generation');

          // If direct formatting fails, fall back to the analysis approach
          const startTime = Date.now();
          const analysis = await analyzeResume(content, false);
          const endTime = Date.now();

          DanteLogger.success.core(`OpenAI summary generated in ${endTime - startTime}ms`);

          // Extract name from the content (first line or use a default)
          const nameMatch = content.match(/^#\s*(.*?)(?:\s*-|\n|$)/);
          const name = nameMatch ? nameMatch[1].trim() : 'Professional';

          // Convert the analysis to markdown format for a cover letter
          const markdown = `# ${name} - Cover Letter

## Summary

${analysis.summary}

## My Skills

${analysis.keySkills.map(skill => `- ${skill}`).join('\n')}

## Industries I've Worked In

${analysis.industryExperience.map(industry => `- ${industry}`).join('\n')}

## My Career Journey

I've been in the industry for over ${analysis.yearsOfExperience.replace(/^I've been in the industry for over /, '')}. During this time, I've had the privilege of working with major clients and growing both technically and as a leader. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

${analysis.careerHighlights.slice(0, 2).map(highlight => highlight).join(' ')}

## My Education

${analysis.educationLevel}

## What I'm Looking For

${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
`;

          return NextResponse.json({
            success: true,
            summary: markdown
          });
        }
      } catch (error) {
        DanteLogger.error.runtime(`Error generating summary with OpenAI: ${error}`);
        HesseLogger.summary.error(`Summary generation failed: ${error}`);

        // Fall back to a basic cover letter if OpenAI fails
        // Extract name from the content (first line or use a default)
        const nameMatch = content.match(/^#\s*(.*?)(?:\s*-|\n|$)/);
        const name = nameMatch ? nameMatch[1].trim() : 'Professional';

        return NextResponse.json({
          success: true,
          summary: `# ${name} - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference
`
        });
      }
    } else {
      DanteLogger.warn.performance('OpenAI integration is disabled. Using fallback summary');
      HesseLogger.ai.warning('OpenAI integration is disabled. Using fallback summary');

      // Extract name from the content (first line or use a default)
      const nameMatch = content.match(/^#\s*(.*?)(?:\s*-|\n|$)/);
      const name = nameMatch ? nameMatch[1].trim() : 'Professional';

      // Return a basic cover letter if OpenAI is not available
      return NextResponse.json({
        success: true,
        summary: `# ${name} - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference
`
      });
    }
  } catch (error) {
    console.error(`❌ Error in get-summary API:`, error);
    console.error(`❌ Error details:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack trace');

    DanteLogger.error.runtime(`Error in get-summary API: ${error}`);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
