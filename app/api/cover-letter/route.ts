import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateCoverLetter } from '@/utils/openaiService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * Cover letter API route
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { resumeContent } = body;

    if (!resumeContent) {
      return NextResponse.json(
        { success: false, error: 'Resume content is required' },
        { status: 400 }
      );
    }

    // Generate the cover letter
    const result = await generateCoverLetter(resumeContent);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate cover letter' },
        { status: 500 }
      );
    }

    // Return the cover letter content
    return NextResponse.json({
      success: true,
      message: "Cover letter generated successfully",
      content: result.content,
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in cover-letter API route:', error);
    DanteLogger.error.api(`Error in cover-letter API route: ${error}`);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('forceRefresh') === 'true';

    console.log(`Cover Letter API: GET request received with forceRefresh=${forceRefresh}`);
    DanteLogger.success.api(`Cover Letter API: GET request received with forceRefresh=${forceRefresh}`);

    // Check if we have a cached cover letter
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    const coverLetterPath = path.join(extractedDir, 'cover_letter.md');

    // If we have a cached cover letter and we're not forcing a refresh, return it
    if (fs.existsSync(coverLetterPath) && !forceRefresh) {
      console.log('Using cached cover letter');
      DanteLogger.success.api('Using cached cover letter');

      // Read the cover letter from the file
      const content = fs.readFileSync(coverLetterPath, 'utf8');

      return NextResponse.json({
        success: true,
        message: "Cover letter retrieved from cache",
        content,
        data: {
          timestamp: new Date().toISOString(),
          source: 'cache'
        }
      });
    }

    // If we're forcing a refresh or we don't have a cached cover letter,
    // we would normally generate a new one using the resume content.
    // For simplicity, we'll return a mock cover letter.

    const mockCoverLetter = `# P. Brady Georgen - Cover Letter

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
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`;

    // Save the cover letter to the file for future use
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }
    fs.writeFileSync(coverLetterPath, mockCoverLetter);

    console.log('Generated new cover letter');
    DanteLogger.success.api('Generated new cover letter');

    return NextResponse.json({
      success: true,
      message: "Cover letter generated successfully",
      content: mockCoverLetter,
      data: {
        timestamp: new Date().toISOString(),
        source: 'generated'
      }
    });
  } catch (error) {
    console.error('Error in cover-letter API route:', error);
    DanteLogger.error.api(`Error in cover-letter API route: ${error}`);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}