import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { escapeApostrophes, processTextArray } from '@/utils/serverTextUtils';
import { analyzeResume } from '@/utils/openaiService';
import { getExtractedContent } from '@/utils/pdfContentRefresher';
import { DanteLogger } from '@/utils/DanteLogger';

// This would be replaced with your actual OpenAI API key in a production environment
// In a real app, you would store this in an environment variable
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { filePath, forceRefresh = false } = data;

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Get content based on file type
    let content = '';

    // Check if we're requesting resume content
    if (filePath.includes('resume_content')) {
      DanteLogger.success.basic('Using enhanced PDF content refresher for resume content');

      // Log the request for content analysis
      console.log(`📊 Analyzing PDF content with forceRefresh=${forceRefresh}`);

      // Get fresh content from the PDF with enhanced logging
      content = await getExtractedContent(forceRefresh);

      if (!content) {
        DanteLogger.error.dataFlow('Failed to get fresh content from PDF');
        return NextResponse.json({
          error: 'Failed to get fresh content from PDF',
          details: 'Check server logs for extraction details'
        }, { status: 500 });
      }

      // Log success with content preview
      console.log(`✅ Retrieved PDF content (${content.length} characters)`);
      console.log(`📄 Content preview: ${content.substring(0, 100)}...`);
    } else {
      // For other files, read directly
      const publicDir = path.join(process.cwd(), 'public');
      const absoluteFilePath = path.join(publicDir, filePath.replace(/^\//, ''));

      // Check if the file exists
      if (!fs.existsSync(absoluteFilePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      // Read the file content
      content = fs.readFileSync(absoluteFilePath, 'utf8');
    }

    // For demonstration purposes, we'll use a mock analysis
    // In a real application, you would call an AI API like OpenAI here
    const analysis = await mockAnalyzeContent(content, forceRefresh);

    // In a real application with OpenAI, you would do something like:
    // const analysis = await analyzeWithOpenAI(content);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing content:', error);

    // Provide more detailed error message for debugging
    const errorMessage = error instanceof Error
      ? `Failed to analyze content: ${error.message}`
      : 'Failed to analyze content';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Function to analyze content with OpenAI or fallback to mock data
async function mockAnalyzeContent(content: string, forceRefresh = false) {
  // Check if we have an OpenAI API key and it's enabled
  const useOpenAI = process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true';

  // Generate mock data for comparison or fallback
  const mockData = {
    summary: escapeApostrophes("I'm a senior software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions."),
    keySkills: [
      "Full Stack Development",
      "JavaScript/TypeScript",
      "React/React Native",
      "AWS",
      "UI/UX Design",
      "Creative Technology"
    ],
    yearsOfExperience: escapeApostrophes("I've been in the industry for over 15 years, continuously learning and evolving with technology"),
    educationLevel: escapeApostrophes("I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving"),
    careerHighlights: processTextArray([
      "I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader",
      "I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard",
      "My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions"
    ]),
    industryExperience: [
      "Business Solutions",
      "Communications",
      "Healthcare/Pharmaceutical",
      "Financial Services"
    ],
    recommendations: processTextArray([
      "I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities",
      "I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision",
      "My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference"
    ])
  };

  try {
    if (useOpenAI) {
      // Hesse-style technical logging
      console.log('🔍 [Hesse] Using OpenAI to analyze resume content...');
      console.log(`🔍 [Hesse] Content length: ${content.length} characters`);
      console.log(`🔍 [Hesse] Content preview: ${content.substring(0, 100)}...`);

      // Use OpenAI to analyze the resume
      console.log(`🔍 [Hesse] Force refresh: ${forceRefresh ? 'Yes' : 'No'}`);
      const startTime = Date.now();
      const analysis = await analyzeResume(content, forceRefresh);
      const endTime = Date.now();

      // Detailed technical logging
      console.log(`✅ [Hesse] OpenAI analysis completed in ${endTime - startTime}ms`);
      console.log(`✅ [Hesse] Fields received: ${Object.keys(analysis).join(', ')}`);

      // Check for unexpected fields that might be causing the issue
      const unexpectedFields = Object.keys(analysis).filter(key =>
        !['summary', 'keySkills', 'yearsOfExperience', 'educationLevel',
          'careerHighlights', 'industryExperience', 'recommendations'].includes(key)
      );

      if (unexpectedFields.length > 0) {
        console.warn(`⚠️ [Hesse] Unexpected fields in OpenAI response: ${unexpectedFields.join(', ')}`);
      }

      // Dante-style comparison between mock and AI data
      console.log('📊 [Dante] Comparing OpenAI analysis with mock data:');

      // Compare summary lengths
      const summaryDiff = Math.abs(analysis.summary.length - mockData.summary.length);
      const summaryPercentDiff = (summaryDiff / mockData.summary.length) * 100;
      console.log(`📊 [Dante] Summary: ${summaryPercentDiff.toFixed(1)}% length difference`);

      // Compare number of skills
      console.log(`📊 [Dante] Skills: OpenAI found ${analysis.keySkills.length} skills vs ${mockData.keySkills.length} in mock`);

      // Compare career highlights
      console.log(`📊 [Dante] Career highlights: OpenAI found ${analysis.careerHighlights.length} highlights vs ${mockData.careerHighlights.length} in mock`);

      // Escape apostrophes for React
      return {
        summary: escapeApostrophes(analysis.summary),
        keySkills: analysis.keySkills,
        yearsOfExperience: escapeApostrophes(analysis.yearsOfExperience),
        educationLevel: escapeApostrophes(analysis.educationLevel),
        careerHighlights: processTextArray(analysis.careerHighlights),
        industryExperience: analysis.industryExperience,
        recommendations: processTextArray(analysis.recommendations)
      };
    } else {
      console.log('⚠️ [Hesse] OpenAI integration is disabled. Using mock data for resume analysis...');
      console.log('ℹ️ [Hesse] To enable OpenAI, set USE_OPENAI=true in .env.local');
      // Fallback to mock data if OpenAI is not available
      return mockData;
    }
  } catch (error) {
    console.error('❌ [Hesse] Error in resume analysis:', error);
    console.log('⚠️ [Dante] Falling back to mock data due to analysis failure');

    if (error instanceof Error) {
      console.log(`❌ [Hesse] Error details: ${error.name}: ${error.message}`);
      if (error.stack) {
        console.log(`❌ [Hesse] Stack trace: ${error.stack.split('\n')[0]}`);
      }
    }

    // If OpenAI fails, fall back to mock data
    return mockData;
  }
}

/*
// Function to analyze content with OpenAI API
// This would be used in a real application with your API key
async function analyzeWithOpenAI(content: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Extract key information and provide insights about the candidate.'
        },
        {
          role: 'user',
          content: `Analyze this resume content and provide a structured analysis including skills, experience level, education, career highlights, and recommendations:\n\n${content}`
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
*/
