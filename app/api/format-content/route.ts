import { NextRequest, NextResponse } from 'next/server';
import { HesseLogger } from '@/utils/HesseLogger';
import { formatContentAsMarkdown, formatContentAsText } from '@/app/actions/formatContentActions';

/**
 * API route handler for formatting content
 *
 * This is a compatibility layer that uses the server actions for formatting.
 * It's maintained for backward compatibility with existing client code.
 * New client components should use the server actions directly.
 */

/**
 * API route handler for formatting content
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { content, contentType, format } = body;

    // Validate input
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!contentType) {
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 });
    }

    if (!format || (format !== 'markdown' && format !== 'text')) {
      return NextResponse.json({ error: 'Format must be either "markdown" or "text"' }, { status: 400 });
    }

    // Format content based on requested format
    let result;
    if (format === 'markdown') {
      result = await formatContentAsMarkdown(content, contentType);
    } else {
      result = await formatContentAsText(content, contentType);
    }

    // Return formatted content
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in format-content API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to format content' },
      { status: 500 }
    );
  }
}
