import { NextResponse } from 'next/server';

/**
 * Simplified validate-content API route for AWS Amplify build
 */
export async function POST(request: Request) {
  try {
    // Return a mock response
    return NextResponse.json({
      success: true,
      message: "This is a simplified version of the validate-content API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in validate-content API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Return a mock response with the valid property
    return NextResponse.json({
      success: true,
      valid: true,
      message: "This is a simplified version of the validate-content API route for AWS Amplify build.",
      data: {
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in validate-content API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}