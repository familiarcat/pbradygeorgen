import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a Result type for better error handling
type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * API route for analyzing and formatting content
 * This handles both content type detection and formatting in a single API call
 */
export async function POST(request: NextRequest) {
  // Parse the request body
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid JSON in request body'
    }, { status: 400 });
  }

  const { filePath, format } = data;

  if (!filePath) {
    return NextResponse.json({
      success: false,
      error: 'File path is required'
    }, { status: 400 });
  }

  if (!format || !['markdown', 'text'].includes(format)) {
    return NextResponse.json({
      success: false,
      error: 'Valid format (markdown or text) is required'
    }, { status: 400 });
  }

  // Read the file content
  const fullPath = path.join(process.cwd(), 'public', filePath);
  let content;

  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read file'
    }, { status: 500 });
  }

  // Step 1: Analyze content type
  const contentTypeResult = await analyzeContentType(content);
  if (!contentTypeResult.success) {
    return NextResponse.json({
      success: false,
      error: contentTypeResult.error || 'Failed to analyze content type'
    }, { status: 500 });
  }

  // Ensure contentType is always a string
  const contentType = contentTypeResult.data || 'other';
  console.log(`🔍 [Hesse] Content type detected: ${contentType}`);

  // Step 2: Format content based on type and requested format
  let formattedContent;

  if (format === 'markdown') {
    const result = await formatContentAsMarkdown(content, contentType);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to format content as markdown'
      }, { status: 500 });
    }
    formattedContent = result.data;
  } else if (format === 'text') {
    const result = await formatContentAsText(content, contentType);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to format content as text'
      }, { status: 500 });
    }
    formattedContent = result.data;
  }

  return NextResponse.json({
    success: true,
    contentType,
    formattedContent
  });
}

/**
 * Analyze content to determine its type
 * @param content The content to analyze
 * @returns The detected content type
 */
async function analyzeContentType(content: string): Promise<Result<string>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a document analysis expert. Your task is to analyze the provided content and
          determine what type of document it is. Respond with ONLY ONE of the following categories:

          - resume
          - cv
          - cover_letter
          - article
          - blog_post
          - brochure
          - advertisement
          - report
          - academic_paper
          - other

          Return ONLY the category name, nothing else.`
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const contentType = response.choices[0]?.message?.content?.trim().toLowerCase() || 'other';
    return { success: true, data: contentType };
  } catch (error) {
    console.error('Error analyzing content type:', error);
    // Default to 'other' if analysis fails
    return {
      success: true,
      data: 'other',
      error: error instanceof Error ? error.message : 'Unknown error during content analysis'
    };
  }
}

/**
 * Format content as markdown based on content type
 * @param content The content to format
 * @param contentType The type of content
 * @returns Formatted markdown
 */
async function formatContentAsMarkdown(content: string, contentType: string): Promise<Result<string>> {
  // Create a prompt based on the content type
  let systemPrompt = `You are a document formatting expert. Format the provided content as clean, professional markdown.`;

  // Add specific formatting instructions based on content type
  if (contentType === 'resume' || contentType === 'cv') {
    systemPrompt += `
    This is a RESUME. Follow these specific guidelines:

    1. Start with the person's name as a level 1 heading (# Name)
    2. Use level 2 headings (## Heading) for main sections like Education, Experience, Skills, etc.
    3. Use level 3 headings (### Heading) for job titles/organizations
    4. Use bullet points for skills, responsibilities, and achievements
    5. Use bold for dates, job titles, or other important information
    6. Ensure proper spacing between sections
    7. Maintain a clean, professional layout
    8. Preserve all original content
    9. Do not add any new content or commentary

    Return ONLY the formatted markdown, nothing else.`;
  } else if (contentType === 'cover_letter') {
    systemPrompt += `
    This is a COVER LETTER. Follow these specific guidelines:

    1. Start with the person's name as a level 1 heading
    2. Format the date, recipient information, and salutation appropriately
    3. Use paragraphs with proper spacing
    4. Use bold for emphasis on key points
    5. Format the closing and signature appropriately
    6. Maintain a professional layout

    Return ONLY the formatted markdown, nothing else.`;
  } else {
    systemPrompt += `
    Follow these general guidelines:

    1. Use appropriate heading levels (# for title, ## for main sections, etc.)
    2. Use bullet points for lists
    3. Use bold and italic for emphasis
    4. Ensure proper spacing between sections
    5. Maintain a clean, readable layout

    Return ONLY the formatted markdown, nothing else.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please format this content as markdown:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return {
      success: true,
      data: response.choices[0]?.message?.content || content
    };
  } catch (error) {
    console.error('Error formatting content as markdown:', error);
    // Return original content if formatting fails
    return {
      success: false,
      data: content || '',
      error: 'Failed to format content as markdown'
    };
  }
}

/**
 * Format content as plain text based on content type
 * @param content The content to format
 * @param contentType The type of content
 * @returns Formatted text
 */
async function formatContentAsText(content: string, contentType: string): Promise<Result<string>> {
  // Create a prompt based on the content type
  let systemPrompt = `You are a document formatting expert. Format the provided content as clean, professional plain text.`;

  // Add specific formatting instructions based on content type
  if (contentType === 'resume' || contentType === 'cv') {
    systemPrompt += `
    This is a RESUME. Follow these specific guidelines:

    1. Start with the person's name in ALL CAPS
    2. Use ALL CAPS with underlines (====) for main sections like EDUCATION, EXPERIENCE, SKILLS, etc.
    3. Use Title Case with proper indentation for job titles/organizations
    4. Use dashes (-) or asterisks (*) for bullet points
    5. Use proper indentation to show hierarchy (2 spaces for each level)
    6. Use spacing to separate sections (2 blank lines between sections)
    7. Align dates to the right when appropriate
    8. Maintain a clean, professional layout
    9. Preserve all original content
    10. Do not add any new content or commentary

    Return ONLY the formatted plain text, nothing else.`;
  } else if (contentType === 'cover_letter') {
    systemPrompt += `
    This is a COVER LETTER. Follow these specific guidelines:

    1. Format the sender's information at the top
    2. Format the date, recipient information with proper spacing
    3. Use proper paragraph formatting with indentation
    4. Use spacing to separate sections
    5. Format the closing and signature appropriately

    Return ONLY the formatted plain text, nothing else.`;
  } else {
    systemPrompt += `
    Follow these general guidelines:

    1. Use ALL CAPS for titles
    2. Use proper indentation for hierarchy
    3. Use dashes or asterisks for bullet points
    4. Ensure proper spacing between sections
    5. Maintain a clean, readable layout

    Return ONLY the formatted plain text, nothing else.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please format this content as plain text:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return {
      success: true,
      data: response.choices[0]?.message?.content || content
    };
  } catch (error) {
    console.error('Error formatting content as text:', error);
    // Return original content if formatting fails
    return {
      success: false,
      data: content || '',
      error: 'Failed to format content as text'
    };
  }
}
