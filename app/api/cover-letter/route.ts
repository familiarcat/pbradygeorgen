import { NextResponse } from 'next/server';

/**
 * Simplified cover-letter API route for AWS Amplify build
 */
export async function POST(request: Request) {
  try {
    // Return a mock response
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the cover-letter API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in cover-letter API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
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

    // Return a mock response with actual content
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the cover-letter API route for AWS Amplify build.",
      content: `# P. Brady Georgen - Cover Letter

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
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`,
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in cover-letter API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}