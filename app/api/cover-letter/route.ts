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
      content: `# Professional Cover Letter

## P. Brady Georgen
Senior Software Developer

---

Dear Hiring Manager,

I am writing to express my interest in the Senior Software Developer position at your company. With over 10 years of experience in full-stack development, JavaScript/TypeScript, UI/UX design, React, and AWS, I believe I would be a valuable addition to your team.

## Professional Experience

Throughout my career, I have demonstrated a strong ability to develop robust, scalable applications that meet business needs while providing exceptional user experiences. My expertise includes:

- Building responsive web applications using modern JavaScript frameworks
- Implementing cloud-native architectures on AWS
- Designing intuitive user interfaces with a focus on accessibility
- Leading development teams and mentoring junior developers
- Optimizing application performance and security

## Technical Skills

- **Languages**: JavaScript, TypeScript, HTML, CSS, Python
- **Frameworks**: React, Next.js, Node.js, Express
- **Cloud Services**: AWS (Lambda, S3, DynamoDB, Amplify)
- **Tools**: Git, Docker, Webpack, Jest
- **Methodologies**: Agile, TDD, CI/CD

## Why I'm Interested

Your company's commitment to innovation and user-centered design aligns perfectly with my professional values. I am particularly impressed by your recent projects in [specific area] and would be excited to contribute to similar initiatives.

I am confident that my technical expertise, problem-solving abilities, and collaborative approach would make me a strong fit for your team. I look forward to the opportunity to discuss how my skills and experience could benefit your organization.

Thank you for considering my application.

Sincerely,
P. Brady Georgen`,
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