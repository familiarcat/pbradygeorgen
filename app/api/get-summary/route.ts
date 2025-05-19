import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { analyzeResume, formatSummaryContent } from '@/utils/openaiService';

export async function GET(request: NextRequest) {
  try {
    DanteLogger.success.basic('Summary API called');

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    if (forceRefresh) {
      DanteLogger.warn.deprecated('Force refresh requested for summary');
    }

    // Get the resume content from the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const resumeFilePath = path.join(publicDir, 'extracted/resume_content.md');

    // Check if the file exists
    if (!fs.existsSync(resumeFilePath)) {
      DanteLogger.error.runtime('Resume content file not found');
      return NextResponse.json({
        success: false,
        error: 'Resume content file not found'
      }, { status: 404 });
    }

    // Read the file content
    const content = fs.readFileSync(resumeFilePath, 'utf8');

    // Check if we have an OpenAI API key and it's enabled
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true';

    if (useOpenAI) {
      try {
        HesseLogger.summary.start('Starting summary generation with OpenAI');

        // First, try to format the content directly using our optimized prompt
        try {
          const startTime = Date.now();
          const formattedSummary = await formatSummaryContent(content, forceRefresh);
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
          const analysis = await analyzeResume(content, forceRefresh);
          const endTime = Date.now();

          DanteLogger.success.core(`OpenAI summary generated in ${endTime - startTime}ms`);

          // Convert the analysis to markdown format for an introduction
          const markdown = `# P. Brady Georgen - Introduction

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

        // Fall back to a basic introduction if OpenAI fails
        return NextResponse.json({
          success: true,
          summary: `# P. Brady Georgen - Introduction

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

      // Return a basic introduction if OpenAI is not available
      return NextResponse.json({
        success: true,
        summary: `# P. Brady Georgen - Introduction

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
    DanteLogger.error.runtime(`Error in get-summary API: ${error}`);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
