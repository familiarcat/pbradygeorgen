import { NextResponse } from 'next/server';

/**
 * Simplified get-summary API route for AWS Amplify build
 */
export async function POST(request: Request) {
  try {
    // Return a mock response
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the get-summary API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in get-summary API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Return a mock response with summary data
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the get-summary API route for AWS Amplify build.",
      summary: `# Professional Resume - Summary

## Professional Summary

Experienced software developer with expertise in web development, UI/UX design, and cloud architecture. Passionate about creating intuitive, user-friendly applications that solve real-world problems.

## Key Skills

- JavaScript/TypeScript
- React/Next.js
- Node.js
- AWS Cloud Services
- UI/UX Design
- Responsive Web Development
- API Design and Integration
- Performance Optimization

## Experience

10+ years of professional experience in software development, with a focus on web technologies and cloud solutions.

## Education

Bachelor's Degree in Computer Science with additional certifications in cloud architecture and UI/UX design.

## Career Highlights

- Led development of enterprise web applications serving thousands of users
- Implemented cloud-native architectures for scalable, resilient systems
- Designed responsive UI systems with accessibility as a core principle
- Mentored junior developers and contributed to open-source projects

## Industry Experience

- Technology
- Finance
- Healthcare
- Education

## Recommendations

- Excellent problem-solving skills with a focus on user needs
- Strong communication abilities across technical and non-technical teams
- Collaborative team player who thrives in agile environments
`,
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in get-summary API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}