import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { escapeApostrophes, processTextArray } from '@/utils/serverTextUtils';
import { analyzeResume } from '@/utils/openaiService';

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

    const { filePath } = data;

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Get the absolute path to the file
    const publicDir = path.join(process.cwd(), 'public');
    const absoluteFilePath = path.join(publicDir, filePath.replace(/^\//, ''));

    // Check if the file exists
    if (!fs.existsSync(absoluteFilePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file content
    const content = fs.readFileSync(absoluteFilePath, 'utf8');

    // For demonstration purposes, we'll use a mock analysis
    // In a real application, you would call an AI API like OpenAI here
    const analysis = await mockAnalyzeContent(content);

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
async function mockAnalyzeContent(content: string) {
  // Check if we have an OpenAI API key
  const useOpenAI = process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true';

  try {
    if (useOpenAI) {
      // Use OpenAI to analyze the resume
      console.log('Using OpenAI to analyze resume...');
      const analysis = await analyzeResume(content);

      console.log('OpenAI analysis received:', Object.keys(analysis));

      // Check for unexpected fields that might be causing the issue
      const unexpectedFields = Object.keys(analysis).filter(key =>
        !['summary', 'keySkills', 'yearsOfExperience', 'educationLevel',
          'careerHighlights', 'industryExperience', 'recommendations'].includes(key)
      );

      if (unexpectedFields.length > 0) {
        console.warn('Unexpected fields in OpenAI response:', unexpectedFields);
      }

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
      console.log('Using mock data for resume analysis...');
      // Fallback to mock data if OpenAI is not available
      return {
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
    }
  } catch (error) {
    console.error('Error in resume analysis:', error);
    // If OpenAI fails, fall back to mock data
    return {
      summary: escapeApostrophes("I'm a senior software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology."),
      keySkills: [
        "Full Stack Development",
        "JavaScript/TypeScript",
        "React/React Native",
        "AWS",
        "UI/UX Design"
      ],
      yearsOfExperience: escapeApostrophes("I've been in the industry for over 15 years"),
      educationLevel: escapeApostrophes("I hold dual Bachelor's degrees in Graphic Design and Philosophy"),
      careerHighlights: processTextArray([
        "I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions",
        "I've worked with major clients including Cox Communications, Bayer, and Mastercard"
      ]),
      industryExperience: [
        "Business Solutions",
        "Communications",
        "Healthcare/Pharmaceutical"
      ],
      recommendations: processTextArray([
        "I'm looking for opportunities that combine technical leadership with creative direction",
        "I thrive in cross-functional teams"
      ])
    };
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
