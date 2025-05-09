import { NextResponse } from 'next/server';

/**
 * Simplified format-content API route for AWS Amplify build
 */
export async function POST(request: Request) {
  try {
    // Return a mock response
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the format-content API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in format-content API route:', error);
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
      message: "This is a simplified version of the format-content API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in format-content API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}