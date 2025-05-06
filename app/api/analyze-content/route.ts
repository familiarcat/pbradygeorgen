import { NextResponse } from 'next/server';

/**
 * Simplified analyze-content API route for AWS Amplify build
 */
export async function POST(request: Request) {
  try {
    // Return a mock response with analysis data
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the analyze-content API route for AWS Amplify build.",
      analysis: {
        summary: "Professional with expertise in web development, UI/UX design, and cloud architecture.",
        keySkills: ["JavaScript/TypeScript", "React", "Node.js", "AWS", "UI/UX Design"],
        yearsOfExperience: "10+ years of professional experience",
        educationLevel: "Bachelor's Degree in Computer Science",
        careerHighlights: [
          "Led development of enterprise web applications",
          "Implemented cloud-native architectures",
          "Designed responsive UI systems"
        ],
        industryExperience: ["Technology", "Finance", "Healthcare", "Education"],
        recommendations: [
          "Excellent problem-solving skills",
          "Strong communication abilities",
          "Collaborative team player"
        ]
      },
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in analyze-content API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Return a mock response
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the analyze-content API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in analyze-content API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}