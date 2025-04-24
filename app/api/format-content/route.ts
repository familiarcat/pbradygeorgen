import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import {
  FormatContentRequestSchema,
  FormatContentResponseSchema,
  ContentTypeSchema,
  ResultSchema
} from '@/types/schemas';
import { DanteLogger } from '@/utils/DanteLogger';

// Initialize OpenAI client with fallback for build-time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build-time',
});

// Function to check if OpenAI API key is available
function isOpenAIKeyAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

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
    // "Kneel before Zod!" - Return a properly formatted error response
    const errorResponse = {
      success: false,
      error: 'Invalid JSON in request body'
    };

    try {
      // 👑🧎 "Kneel before Zod!" - Validate our error response format
      FormatContentResponseSchema.parse(errorResponse);
    } catch (validationError) {
      // Even Zod has failed us! Log the validation error but continue
      if (validationError instanceof Error) {
        console.error('👑🧎 [Zod] Error response validation failed:', validationError.message);
      }
    }

    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Validate request against our schema
  const parseResult = FormatContentRequestSchema.safeParse(data);

  if (!parseResult.success) {
    // Extract validation errors from Zod
    const errorMessage = parseResult.error.errors.map(err =>
      `${err.path.join('.')}: ${err.message}`
    ).join(', ');

    const errorResponse = {
      success: false,
      error: `Invalid request: ${errorMessage}`
    };

    try {
      // 👑🧎 "Kneel before Zod!" - Validate our error response format
      FormatContentResponseSchema.parse(errorResponse);
    } catch (validationError) {
      // Even Zod has failed us! Log the validation error but continue
      if (validationError instanceof Error) {
        DanteLogger.error.validation(`Validation failed: ${validationError.message}`);
      }
    }

    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Extract validated data
  const { filePath, format } = parseResult.data;

  // Read the file content
  const fullPath = path.join(process.cwd(), 'public', filePath);
  let content;

  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);

    const errorResponse = {
      success: false,
      error: 'Failed to read file'
    };

    try {
      // 👑🧎 "Kneel before Zod!" - Validate our error response format
      FormatContentResponseSchema.parse(errorResponse);
    } catch (validationError) {
      // Even Zod has failed us! Log the validation error but continue
      if (validationError instanceof Error) {
        DanteLogger.error.dataFlow(`Validation failed: ${validationError.message}`);
      }
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }

  // Step 1: Analyze content type
  const contentTypeResult = await analyzeContentType(content);
  if (!contentTypeResult.success) {
    const errorResponse = {
      success: false,
      error: contentTypeResult.error || 'Failed to analyze content type'
    };

    try {
      // 👑🧎 "Kneel before Zod!" - Validate our error response format
      FormatContentResponseSchema.parse(errorResponse);
    } catch (validationError) {
      // Even Zod has failed us! Log the validation error but continue
      if (validationError instanceof Error) {
        console.error('👑🍿 [Zod/Dante:Circle3] Kneel Before Zod! Validation failed:', validationError.message);
      }
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }

  // Ensure contentType is always a string
  const contentType = contentTypeResult.data || 'other';
  DanteLogger.success.basic(`Content type detected: ${contentType}`);

  // Step 2: Format content based on type and requested format
  let formattedContent;

  if (format === 'markdown') {
    const result = await formatContentAsMarkdown(content, contentType);
    if (!result.success) {
      const errorResponse = {
        success: false,
        error: result.error || 'Failed to format content as markdown'
      };

      try {
        // 👑🧎 "Kneel before Zod!" - Validate our error response format
        FormatContentResponseSchema.parse(errorResponse);
      } catch (validationError) {
        // Even Zod has failed us! Log the validation error but continue
        if (validationError instanceof Error) {
          console.error('👑💰 [Zod/Dante:Circle4] Kneel Before Zod! Validation failed:', validationError.message);
        }
      }

      return NextResponse.json(errorResponse, { status: 500 });
    }
    formattedContent = result.data;
    DanteLogger.success.ux(`Content formatted as markdown successfully`);
  } else if (format === 'text') {
    const result = await formatContentAsText(content, contentType);
    if (!result.success) {
      const errorResponse = {
        success: false,
        error: result.error || 'Failed to format content as text'
      };

      try {
        // 👑🧎 "Kneel before Zod!" - Validate our error response format
        FormatContentResponseSchema.parse(errorResponse);
      } catch (validationError) {
        // Even Zod has failed us! Log the validation error but continue
        if (validationError instanceof Error) {
          console.error('👑💢 [Zod/Dante:Circle5] Kneel Before Zod! Validation failed:', validationError.message);
        }
      }

      return NextResponse.json(errorResponse, { status: 500 });
    }
    formattedContent = result.data;
    DanteLogger.success.ux(`Content formatted as text successfully`);
  }

  // Prepare the success response
  const successResponse = {
    success: true,
    contentType,
    formattedContent
  };

  try {
    // Validate our response format
    FormatContentResponseSchema.parse(successResponse);

    DanteLogger.success.perfection(`Content formatting completed successfully for ${format} format`);
    return NextResponse.json(successResponse);
  } catch (error) {
    // Handle Zod validation errors with Salinger-inspired lightheartedness
    if (error instanceof Error && error.name === 'ZodError') {
      DanteLogger.error.config(`Response validation failed: ${error.message}`);
    } else {
      DanteLogger.error.system('Error validating response format', error);
    }
    // Return the response anyway, but log the error
    return NextResponse.json(successResponse);
  }
}

/**
 * Analyze content to determine its type
 * @param content The content to analyze
 * @returns The detected content type
 */
async function analyzeContentType(content: string): Promise<Result<string>> {
  try {
    // Check if OpenAI API key is available
    if (!isOpenAIKeyAvailable()) {
      DanteLogger.warn.deprecated('OpenAI API key is not available, using default content type');
      return { success: true, data: 'resume' };
    }

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

    // Extract the content type from the response
    const rawContentType = response.choices[0]?.message?.content?.trim().toLowerCase() || 'other';

    // Validate against our schema - "Kneel before Zod!"
    const contentType = ContentTypeSchema.parse(rawContentType);

    DanteLogger.success.core(`Content type validated by Zod: ${contentType}`);

    return { success: true, data: contentType };
  } catch (error) {
    DanteLogger.error.corruption('Error analyzing content type', error);

    // If it's a Zod error, we got an invalid content type from OpenAI
    if (error instanceof Error && error.name === 'ZodError') {
      DanteLogger.error.validation('Invalid content type received from OpenAI, defaulting to "other"');
      return {
        success: true,
        data: 'other',
        error: `Invalid content type: ${error.message}`
      };
    }

    // Default to 'other' for any other errors
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
    This is a RESUME. Follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name as a level 1 heading (# Name) - make it stand out but feel personal
    2. Use level 2 headings (## Heading) for main sections like Education, Experience, Skills, etc.
    3. Use level 3 headings (### Heading) for job titles/organizations
    4. Use bullet points for skills, responsibilities, and achievements - keep them concise and meaningful
    5. Use bold for dates, job titles, or other important information
    6. Ensure generous spacing between sections for better readability
    7. Maintain a clean, professional layout with a personal touch
    8. Preserve all original content
    9. Do not add any new content or commentary
    10. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted markdown, nothing else.`;
  } else if (contentType === 'cover_letter') {
    systemPrompt += `
    This is a COVER LETTER. Follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name as a level 1 heading - make it stand out but feel personal
    2. Format the date, recipient information, and salutation appropriately
    3. Use paragraphs with generous spacing for better readability
    4. Use bold for emphasis on key points
    5. Format the closing and signature appropriately
    6. Maintain a professional layout with a personal touch
    7. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted markdown, nothing else.`;
  } else {
    systemPrompt += `
    Follow these general guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Use appropriate heading levels (# for title, ## for main sections, etc.)
    2. Use bullet points for lists - keep them concise and meaningful
    3. Use bold and italic for emphasis
    4. Ensure generous spacing between sections for better readability
    5. Maintain a clean, readable layout with a personal touch
    6. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted markdown, nothing else.`;
  }

  try {
    // Check if OpenAI API key is available
    if (!isOpenAIKeyAvailable()) {
      DanteLogger.warn.deprecated('OpenAI API key is not available, returning default markdown');

      // Create a more structured fallback markdown with Salinger-inspired formatting
      const lines = content.split('\n').filter(line => line.trim() !== '');
      let formattedContent = '# P. Brady Georgen\n\n';
      formattedContent += '## Professional Summary\n\n';
      formattedContent += 'Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n';

      // Add experience section
      formattedContent += '## Experience\n\n';

      // Add education section
      formattedContent += '## Education\n\n';
      formattedContent += '### BFA Graphic Design\n\n';
      formattedContent += '**Webster University** (2001-2005)\n\n';
      formattedContent += '### BA Philosophy\n\n';
      formattedContent += '**Webster University** (2001-2005)\n\n';

      // Add remaining content
      formattedContent += '## Additional Information\n\n';
      formattedContent += lines.join('\n\n');

      return {
        success: true,
        data: formattedContent
      };
    }

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
    This is a RESUME. Follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name in ALL CAPS - make it stand out but feel personal
    2. Use ALL CAPS with underlines (====) for main sections like EDUCATION, EXPERIENCE, SKILLS, etc.
    3. Use Title Case with proper indentation for job titles/organizations
    4. Use dashes (-) or asterisks (*) for bullet points - keep them concise and meaningful
    5. Use proper indentation to show hierarchy (2 spaces for each level)
    6. Ensure generous spacing between sections (2-3 blank lines) for better readability
    7. Use spacing and alignment to create a clean, professional layout with a personal touch
    8. Preserve all original content
    9. Do not add any new content or commentary
    10. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted plain text, nothing else.`;
  } else if (contentType === 'cover_letter') {
    systemPrompt += `
    This is a COVER LETTER. Follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Format the sender's information at the top - make it stand out but feel personal
    2. Format the date, recipient information with proper spacing
    3. Use proper paragraph formatting with indentation
    4. Ensure generous spacing between sections for better readability
    5. Format the closing and signature appropriately
    6. Use spacing and alignment to create a clean, professional layout with a personal touch
    7. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted plain text, nothing else.`;
  } else {
    systemPrompt += `
    Follow these general guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Use ALL CAPS for titles - make them stand out but feel personal
    2. Use proper indentation for hierarchy (2 spaces for each level)
    3. Use dashes (-) or asterisks (*) for bullet points - keep them concise and meaningful
    4. Ensure generous spacing between sections (2-3 blank lines) for better readability
    5. Use spacing and alignment to create a clean, professional layout with a personal touch
    6. DO NOT add any footer text, metadata, or generation information at the end

    Return ONLY the formatted plain text, nothing else.`;
  }

  try {
    // Check if OpenAI API key is available
    if (!isOpenAIKeyAvailable()) {
      DanteLogger.warn.deprecated('OpenAI API key is not available, returning default text');

      // Create a more structured fallback text with Salinger-inspired formatting
      const lines = content.split('\n').filter(line => line.trim() !== '');
      let formattedContent = 'P. BRADY GEORGEN\n';
      formattedContent += '=================\n\n\n';

      formattedContent += 'PROFESSIONAL SUMMARY\n';
      formattedContent += '--------------------\n\n';
      formattedContent += 'Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n\n';

      // Add experience section
      formattedContent += 'EXPERIENCE\n';
      formattedContent += '----------\n\n';
      formattedContent += '  Daugherty Business Solutions (2014-2023)\n';
      formattedContent += '  Sr. Software Developer (III)\n\n';

      // Add education section
      formattedContent += 'EDUCATION\n';
      formattedContent += '---------\n\n';
      formattedContent += '  BFA Graphic Design\n';
      formattedContent += '  Webster University (2001-2005)\n\n';
      formattedContent += '  BA Philosophy\n';
      formattedContent += '  Webster University (2001-2005)\n\n';

      // Add remaining content
      formattedContent += 'ADDITIONAL INFORMATION\n';
      formattedContent += '---------------------\n\n';
      formattedContent += lines.join('\n\n');

      return {
        success: true,
        data: formattedContent
      };
    }

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
