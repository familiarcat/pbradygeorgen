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
    This is a RESUME. First, carefully analyze the content to understand its structure and hierarchy. Pay special attention to the chronology and organizational relationships. Then, follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name (P. Brady Georgen) as a level 1 heading (# Name) - make it stand out but feel personal

    2. Create a clean, logical hierarchy with these main sections (as level 2 headings):
       - ## Professional Summary (create a brief summary from available information if not explicitly provided)
       - ## Contact Information (extract from the About Me section)
       - ## Experience (organize ALL work experience strictly chronologically, most recent first)
       - ## Skills & Technologies (combine all skills and technologies into one cohesive section)
       - ## Education (organize all education chronologically, most recent first)

    3. For the Experience section, CRITICALLY IMPORTANT:
       - Organize ALL entries by date (most recent first)
       - Use level 3 headings (### Company Name) for organizations
       - Format job titles in bold (**Job Title**)
       - Format date ranges on the same line as job titles, e.g., **Job Title** (2020 - Present)
       - For Daugherty Business Solutions specifically:
         * List client work (Cox, Bayer, Charter, Mastercard) as level 4 headings (#### Client Name) UNDER Daugherty
         * Each client project should be nested under Daugherty, not as separate main entries
         * Format client work descriptions as bullet points under each client heading
       - For all other companies, list responsibilities and achievements as bullet points directly under the job

    4. For Education entries:
       - Use level 3 headings (### Degree)
       - Format institution and date range on the next line, e.g., **Institution** (Year-Year)
       - Organize chronologically (most recent first)

    5. For Skills & Technologies:
       - Group related skills together
       - Use bullet points for each skill or skill group
       - Highlight key skills with bold formatting

    6. Ensure the visual hierarchy is clear through consistent formatting:
       - Level 1 (# Heading): Name
       - Level 2 (## Heading): Main sections (Summary, Contact, Experience, Skills, Education)
       - Level 3 (### Heading): Companies, Degrees
       - Level 4 (#### Heading): Clients (under Daugherty)
       - Bold text: Job titles, important skills
       - Bullet points: Responsibilities, achievements, skills

    7. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

    8. Preserve all original content but reorganize it into a logical, hierarchical structure based on chronology and organizational relationships

    9. DO NOT add any footer text, metadata, or generation information at the end

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

      // Add professional summary
      formattedContent += '## Professional Summary\n\n';
      formattedContent += 'Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n';

      // Add contact information
      formattedContent += '## Contact Information\n\n';
      formattedContent += '4350 A De Tonty St  \n';
      formattedContent += 'St. Louis, MO  \n';
      formattedContent += '(314) 580-0608  \n';
      formattedContent += 'pbradygeorgen.com  \n';
      formattedContent += 'brady@pbradygeorgen.com\n\n';

      // Add experience section
      formattedContent += '## Experience\n\n';

      // Daugherty (most recent with client work nested)
      formattedContent += '### Daugherty Business Solutions\n\n';
      formattedContent += '**Sr. Software Developer (III)** (2014 - 2023)\n\n';
      formattedContent += '- Led development of enterprise applications\n';
      formattedContent += '- Implemented solutions using modern web technologies\n\n';

      // Client work nested under Daugherty
      formattedContent += '#### Bayer\n\n';
      formattedContent += '- Architected, developed, migrated, and maintained various enterprise scale applications utilizing React, AWS, and SOA architectures\n';
      formattedContent += '- Upheld Agile best practices throughout development lifecycle\n\n';

      formattedContent += '#### Charter Communications\n\n';
      formattedContent += '- Engineered interactive call center solutions empowering representatives to provide enhanced customer service capabilities\n\n';

      formattedContent += '#### Mastercard\n\n';
      formattedContent += '- Developed comprehensive onboarding documentation, sample code, and API integration\n';
      formattedContent += '- Supported the MasterPass online purchasing initiative\n\n';

      formattedContent += '#### Cox Communications\n\n';
      formattedContent += '- Implemented scaffolding framework for modular React applications\n';
      formattedContent += '- Integrated with Adobe Content Manager\n\n';

      // Digital Ronan
      formattedContent += '### Digital Ronan (freelance)\n\n';
      formattedContent += '**Consultant & Creative Technologist** (2022 - Present)\n\n';
      formattedContent += '- Providing strategic digital consultancy for local businesses\n';
      formattedContent += '- Applying skills in web development, networking, and design\n\n';

      // Add other experience entries chronologically
      formattedContent += '### Deliveries on Demand\n\n';
      formattedContent += '**Lead Software Developer** (2011 - 2013)\n\n';

      formattedContent += '### Infuze\n\n';
      formattedContent += '**Sr. Developer/Asst. Art Director** (2009 - 2011)\n\n';

      formattedContent += '### Touchwood Creative\n\n';
      formattedContent += '**Lead Software Developer** (2008 - 2009)\n\n';

      formattedContent += '### ThinkTank (freelance)\n\n';
      formattedContent += '**Software and Creative Director** (2005 - 2008)\n\n';

      formattedContent += '### Asynchrony Solutions\n\n';
      formattedContent += '**Designer/Developer/Marketing Asst.** (2005)\n\n';

      // Add skills section
      formattedContent += '## Skills & Technologies\n\n';
      formattedContent += '- **Full Stack Development**\n';
      formattedContent += '- **JavaScript/TypeScript**\n';
      formattedContent += '- **Graphic Design & UI/UX**\n';
      formattedContent += '- **React & React Native**\n';
      formattedContent += '- Illustration\n';
      formattedContent += '- Creative/Technical writing\n\n';
      formattedContent += '**Technologies:** AWS, AWS Amplify, SOA, CI/CD, MongoDB, SQL, Docker, Terraform, Jenkins, Node, Ruby, Java, Adobe CS, UI/UX Prototyping\n\n';

      // Add education section
      formattedContent += '## Education\n\n';
      formattedContent += '### BFA Graphic Design\n\n';
      formattedContent += '**Webster University** (2001-2005)\n\n';
      formattedContent += '### BA Philosophy\n\n';
      formattedContent += '**Webster University** (2001-2005)\n\n';
      formattedContent += '### ASSC Motion Graphics\n\n';
      formattedContent += '**Saint Louis Community College** (1999-2001)\n\n';

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
    This is a RESUME. First, carefully analyze the content to understand its structure and hierarchy. Pay special attention to the chronology and organizational relationships. Then, follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name (P. BRADY GEORGEN) in ALL CAPS - make it stand out but feel personal

    2. Create a clean, logical hierarchy with these main sections (in ALL CAPS with underlines):
       - PROFESSIONAL SUMMARY (create a brief summary from available information if not explicitly provided)
       - CONTACT INFORMATION (extract from the About Me section)
       - EXPERIENCE (organize ALL work experience strictly chronologically, most recent first)
       - SKILLS & TECHNOLOGIES (combine all skills and technologies into one cohesive section)
       - EDUCATION (organize all education chronologically, most recent first)

    3. For the Experience section, CRITICALLY IMPORTANT:
       - Organize ALL entries by date (most recent first)
       - Use Title Case with proper indentation for company names
       - Format job titles on the next line with proper indentation
       - Format date ranges on the same line as job titles
       - For Daugherty Business Solutions specifically:
         * List client work (Cox, Bayer, Charter, Mastercard) indented under Daugherty
         * Each client should be in Title Case with additional indentation (4 spaces)
         * Format client work descriptions as indented bullet points under each client
       - For all other companies, list responsibilities and achievements as bullet points directly under the job

    4. For Education entries:
       - Use Title Case with proper indentation for degrees
       - Format institution and date range on the next line with proper indentation
       - Organize chronologically (most recent first)

    5. For Skills & Technologies:
       - Group related skills together
       - Use asterisks (*) for bullet points
       - Use ALL CAPS for key skill categories

    6. Ensure the visual hierarchy is clear through consistent indentation:
       - Level 1 (0 spaces): MAIN HEADERS WITH UNDERLINES
       - Level 2 (2 spaces): Company Names, Degree Names
       - Level 3 (4 spaces): Job Titles, Institution Names, Client Names
       - Level 4 (6 spaces): Bullet points for responsibilities, achievements

    7. Ensure generous spacing between sections (2-3 blank lines) for better readability

    8. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

    9. Preserve all original content but reorganize it into a logical, hierarchical structure based on chronology and organizational relationships

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

      // Add professional summary
      formattedContent += 'PROFESSIONAL SUMMARY\n';
      formattedContent += '--------------------\n\n';
      formattedContent += 'Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n\n';

      // Add contact information
      formattedContent += 'CONTACT INFORMATION\n';
      formattedContent += '-------------------\n\n';
      formattedContent += '  4350 A De Tonty St\n';
      formattedContent += '  St. Louis, MO\n';
      formattedContent += '  (314) 580-0608\n';
      formattedContent += '  pbradygeorgen.com\n';
      formattedContent += '  brady@pbradygeorgen.com\n\n\n';

      // Add experience section
      formattedContent += 'EXPERIENCE\n';
      formattedContent += '----------\n\n';

      // Daugherty (most recent with client work nested)
      formattedContent += '  Daugherty Business Solutions\n';
      formattedContent += '    Sr. Software Developer (III) (2014 - 2023)\n\n';
      formattedContent += '      * Led development of enterprise applications\n';
      formattedContent += '      * Implemented solutions using modern web technologies\n\n';

      // Client work nested under Daugherty
      formattedContent += '    Bayer\n';
      formattedContent += '      * Architected, developed, migrated, and maintained various enterprise scale\n';
      formattedContent += '        applications utilizing React, AWS, and SOA architectures\n';
      formattedContent += '      * Upheld Agile best practices throughout development lifecycle\n\n';

      formattedContent += '    Charter Communications\n';
      formattedContent += '      * Engineered interactive call center solutions empowering representatives\n';
      formattedContent += '        to provide enhanced customer service capabilities\n\n';

      formattedContent += '    Mastercard\n';
      formattedContent += '      * Developed comprehensive onboarding documentation, sample code, and API\n';
      formattedContent += '        integration\n';
      formattedContent += '      * Supported the MasterPass online purchasing initiative\n\n';

      formattedContent += '    Cox Communications\n';
      formattedContent += '      * Implemented scaffolding framework for modular React applications\n';
      formattedContent += '      * Integrated with Adobe Content Manager\n\n';

      // Digital Ronan
      formattedContent += '  Digital Ronan (freelance)\n';
      formattedContent += '    Consultant & Creative Technologist (2022 - Present)\n\n';
      formattedContent += '      * Providing strategic digital consultancy for local businesses\n';
      formattedContent += '      * Applying skills in web development, networking, and design\n\n';

      // Add other experience entries chronologically
      formattedContent += '  Deliveries on Demand\n';
      formattedContent += '    Lead Software Developer (2011 - 2013)\n\n';

      formattedContent += '  Infuze\n';
      formattedContent += '    Sr. Developer/Asst. Art Director (2009 - 2011)\n\n';

      formattedContent += '  Touchwood Creative\n';
      formattedContent += '    Lead Software Developer (2008 - 2009)\n\n';

      formattedContent += '  ThinkTank (freelance)\n';
      formattedContent += '    Software and Creative Director (2005 - 2008)\n\n';

      formattedContent += '  Asynchrony Solutions\n';
      formattedContent += '    Designer/Developer/Marketing Asst. (2005)\n\n\n';

      // Add skills section
      formattedContent += 'SKILLS & TECHNOLOGIES\n';
      formattedContent += '--------------------\n\n';
      formattedContent += '  CORE COMPETENCIES:\n';
      formattedContent += '    * Full Stack Development\n';
      formattedContent += '    * JavaScript/TypeScript\n';
      formattedContent += '    * Graphic Design & UI/UX\n';
      formattedContent += '    * React & React Native\n';
      formattedContent += '    * Illustration\n';
      formattedContent += '    * Creative/Technical writing\n\n';
      formattedContent += '  TECHNOLOGIES:\n';
      formattedContent += '    * AWS, AWS Amplify, SOA, CI/CD\n';
      formattedContent += '    * MongoDB, SQL, Docker, Terraform, Jenkins\n';
      formattedContent += '    * Node, Ruby, Java, Adobe CS, UI/UX Prototyping\n\n\n';

      // Add education section
      formattedContent += 'EDUCATION\n';
      formattedContent += '---------\n\n';
      formattedContent += '  BFA Graphic Design\n';
      formattedContent += '    Webster University (2001-2005)\n\n';
      formattedContent += '  BA Philosophy\n';
      formattedContent += '    Webster University (2001-2005)\n\n';
      formattedContent += '  ASSC Motion Graphics\n';
      formattedContent += '    Saint Louis Community College (1999-2001)\n\n';

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
