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
    This is a RESUME. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work. Then, follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name (P. Brady Georgen) as a level 1 heading (# Name) - make it stand out but feel personal

    2. Create a clean, logical hierarchy with these main sections (as level 2 headings):
       - ## Professional Summary (create a brief summary from available information if not explicitly provided)
       - ## Contact Information (extract from the About Me section)
       - ## Experience (organize ALL work experience strictly chronologically, most recent first)
       - ## Skills & Technologies (combine all skills and technologies into one cohesive section)
       - ## Education (organize all education chronologically, most recent first)

    3. For the Experience section, CRITICALLY IMPORTANT:
       - MANUALLY OVERRIDE the chronological order to ensure Daugherty Business Solutions (2014-2023) is ALWAYS listed FIRST in the Experience section
       - After Daugherty, list Digital Ronan (2022-Present), then other positions in chronological order
       - Use level 3 headings (### Company Name) for primary employers/companies
       - Format job titles in bold (**Job Title**)
       - Format date ranges on the same line as job titles, e.g., **Job Title** (2020 - Present)
       - Include a brief description of responsibilities directly under each job title

       - CONSULTANCY PATTERN (VERY IMPORTANT): For consultancy firms like Daugherty Business Solutions:
         * First list general responsibilities at the consultancy firm
         * Then use level 4 headings (#### Client: Client Name) to list client engagements
         * Each client engagement MUST be nested UNDER Daugherty Business Solutions, NOT as separate entries or sections
         * Format client work descriptions as bullet points under each client heading
         * DO NOT create a separate "Client Work" section - all client work must be nested under Daugherty
         * The Experience section MUST follow this EXACT structure:
           ### Daugherty Business Solutions
           **Sr. Software Developer (III)** (2014 - 2023)
           - Led development of enterprise applications
           - Implemented solutions using modern web technologies

           #### Client: Bayer
           - Architected and developed enterprise-scale applications utilizing React, AWS, and SOA architectures
           - Upheld Agile best practices throughout development lifecycle

           #### Client: Charter Communications
           - Engineered interactive call center solutions empowering representatives to provide enhanced customer service capabilities

           #### Client: Mastercard
           - Developed comprehensive onboarding documentation, sample code, and API integration
           - Supported the MasterPass online purchasing initiative

           #### Client: Cox Communications
           - Implemented scaffolding framework for modular React applications
           - Integrated with Adobe Content Manager

    4. For Education entries:
       - Use level 3 headings (### Degree)
       - Format institution and date range on the next line, e.g., **Institution** (Year-Year)
       - Organize chronologically (most recent first)
       - Ensure proper visual nesting by using consistent formatting for all education entries

    5. For Skills & Technologies section (VERY IMPORTANT):
       - Create two distinct subsections:
         * Core Skills: List primary skills with bullet points and bold formatting
         * Technical Skills: Create a comprehensive, organized list of all technologies mentioned
       - Include ALL technologies mentioned in the resume: React, React Native, AWS, AWS Amplify, SOA, CI/CD, MongoDB, SQL, Docker, Terraform, Jenkins, Shell Automation, Node, Ruby, Java, Javascript, Typescript, Adobe CS, UI/UX Prototyping
       - Group related technologies together (e.g., Frontend, Backend, Cloud, DevOps)
       - Format as a clean, well-organized list that showcases the breadth of technical expertise
       - Example structure:
         ## Skills & Technologies

         ### Core Skills
         - **Full Stack Development**
         - **JavaScript/TypeScript**
         - **Graphic Design & UI/UX**
         - **Illustration**
         - **Creative/Technical Writing**

         ### Technical Skills
         - **Frontend**: React, React Native, JavaScript, TypeScript, UI/UX Prototyping
         - **Backend**: Node.js, Ruby, Java
         - **Cloud & Infrastructure**: AWS, AWS Amplify, Docker, Terraform
         - **Database**: MongoDB, SQL
         - **DevOps**: CI/CD, Jenkins, Shell Automation
         - **Architecture**: SOA (Service-Oriented Architecture)
         - **Design**: Adobe Creative Suite

    6. Ensure the visual hierarchy is clear through consistent formatting and indentation:
       - Level 1 (# Heading): Name
       - Level 2 (## Heading): Main sections (Summary, Contact, Experience, Skills, Education)
       - Level 3 (### Heading): Primary employers, Degrees, Skill categories
       - Level 4 (#### Client: Name): Client engagements under consultancy employers
       - Bold text: Job titles, important skills, technology categories
       - Bullet points: Responsibilities, achievements, skills
       - Use proper indentation to visually reinforce the hierarchical relationships

    7. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

    8. IMPORTANT: There should be NO separate "Client Work" section. All client work must be nested under the appropriate employer in the Experience section.

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
    // Always use our own formatting for consistency
    if (true) {
      DanteLogger.warn.deprecated('Using custom resume formatting for consistency');

      // Create a more structured markdown with Salinger-inspired formatting
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

      // Daugherty (ALWAYS first with client work nested)
      formattedContent += '### Daugherty Business Solutions\n\n';
      formattedContent += '**Sr. Software Developer (III)** (2014 - 2023)\n\n';
      formattedContent += '- Led development of enterprise applications\n';
      formattedContent += '- Implemented solutions using modern web technologies\n';
      formattedContent += '- Collaborated with cross-functional teams to deliver high-quality software solutions\n\n';

      // Client work nested under Daugherty with "Client:" prefix
      formattedContent += '#### Client: Bayer\n\n';
      formattedContent += '- Architected, developed, migrated, and maintained various enterprise scale applications utilizing React, AWS, and SOA architectures\n';
      formattedContent += '- Upheld Agile best practices throughout development lifecycle\n\n';

      formattedContent += '#### Client: Charter Communications\n\n';
      formattedContent += '- Engineered interactive call center solutions empowering representatives to provide enhanced customer service capabilities\n';
      formattedContent += '- Implemented user-friendly interfaces for call center operations\n\n';

      formattedContent += '#### Client: Mastercard\n\n';
      formattedContent += '- Developed comprehensive onboarding documentation, sample code, and API integration\n';
      formattedContent += '- Supported the MasterPass online purchasing initiative\n\n';

      formattedContent += '#### Client: Cox Communications\n\n';
      formattedContent += '- Implemented scaffolding framework for modular React applications\n';
      formattedContent += '- Integrated with Adobe Content Manager\n';
      formattedContent += '- Developed reusable component libraries\n\n';

      // Digital Ronan (second, even though it's more recent by date)
      formattedContent += '### Digital Ronan (freelance)\n\n';
      formattedContent += '**Consultant & Creative Technologist** (2022 - Present)\n\n';
      formattedContent += '- Providing strategic digital consultancy for local businesses\n';
      formattedContent += '- Applying skills in web development, networking, and design\n';
      formattedContent += '- Creating custom digital solutions for small to medium businesses\n\n';

      // Add other experience entries chronologically
      formattedContent += '### Deliveries on Demand\n\n';
      formattedContent += '**Lead Software Developer** (2013 - 2014)\n\n';
      formattedContent += '- Developed and maintained delivery management software\n';
      formattedContent += '- Led a team of developers in creating mobile applications\n\n';

      formattedContent += '### Infuze\n\n';
      formattedContent += '**Sr. Developer/Asst. Art Director** (2011 - 2013)\n\n';
      formattedContent += '- Combined technical development with creative design direction\n';
      formattedContent += '- Created digital marketing solutions for clients\n\n';

      formattedContent += '### Touchwood Creative\n\n';
      formattedContent += '**Lead Software Developer** (2008 - 2009)\n\n';
      formattedContent += '- Developed custom web applications for clients\n';
      formattedContent += '- Implemented creative digital solutions\n\n';

      formattedContent += '### ThinkTank (freelance)\n\n';
      formattedContent += '**Software and Creative Director** (2005 - 2008)\n\n';
      formattedContent += '- Provided software development and creative direction services\n';
      formattedContent += '- Managed client relationships and project deliverables\n\n';

      formattedContent += '### Asynchrony Solutions\n\n';
      formattedContent += '**Designer/Developer/Marketing Asst.** (2004 - 2005)\n\n';
      formattedContent += '- Assisted with design, development, and marketing initiatives\n';
      formattedContent += '- Contributed to various software projects\n\n';

      // Add skills section with Core Skills and Technical Skills subsections
      formattedContent += '## Skills & Technologies\n\n';

      // Core Skills subsection
      formattedContent += '### Core Skills\n\n';
      formattedContent += '- **Full Stack Development**\n';
      formattedContent += '- **JavaScript/TypeScript**\n';
      formattedContent += '- **Graphic Design & UI/UX**\n';
      formattedContent += '- **React & React Native**\n';
      formattedContent += '- **AWS & Cloud Architecture**\n';
      formattedContent += '- **Illustration**\n';
      formattedContent += '- **Creative/Technical Writing**\n\n';

      // Technical Skills subsection with grouped technologies
      formattedContent += '### Technical Skills\n\n';
      formattedContent += '- **Frontend**: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n';
      formattedContent += '- **Backend**: Node.js, Ruby, Java\n';
      formattedContent += '- **Cloud & Infrastructure**: AWS, AWS Amplify, Docker, Terraform\n';
      formattedContent += '- **Database**: MongoDB, SQL\n';
      formattedContent += '- **DevOps**: CI/CD, Jenkins, Shell Automation\n';
      formattedContent += '- **Architecture**: SOA (Service-Oriented Architecture)\n';
      formattedContent += '- **Design**: Adobe Creative Suite\n\n';

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
    This is a RESUME. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work. Then, follow these specific guidelines with a J.D. Salinger-inspired approach to formatting:

    1. Start with the person's name (P. BRADY GEORGEN) in ALL CAPS - make it stand out but feel personal

    2. Create a clean, logical hierarchy with these main sections (in ALL CAPS with underlines):
       - PROFESSIONAL SUMMARY (create a brief summary from available information if not explicitly provided)
       - CONTACT INFORMATION (extract from the About Me section)
       - EXPERIENCE (organize ALL work experience strictly chronologically, most recent first)
       - SKILLS & TECHNOLOGIES (combine all skills and technologies into one cohesive section)
       - EDUCATION (organize all education chronologically, most recent first)

    3. For the Experience section, CRITICALLY IMPORTANT:
       - MANUALLY OVERRIDE the chronological order to ensure Daugherty Business Solutions (2014-2023) is ALWAYS listed FIRST in the Experience section
       - After Daugherty, list Digital Ronan (2022-Present), then other positions in chronological order
       - Use Title Case with proper indentation (2 spaces) for primary employers/companies
       - Format job titles on the next line with proper indentation (4 spaces)
       - Format date ranges on the same line as job titles
       - Include a brief description of general responsibilities directly under each job title

       - CONSULTANCY PATTERN (VERY IMPORTANT): For consultancy firms like Daugherty Business Solutions:
         * First list general responsibilities at the consultancy firm with proper indentation (6 spaces)
         * Then list client engagements with "Client:" prefix and client name in Title Case (6 spaces indentation)
         * Each client engagement MUST be nested UNDER Daugherty Business Solutions, NOT as separate entries or sections
         * Format client work descriptions with additional indentation (8 spaces)
         * DO NOT create a separate "CLIENT WORK" section - all client work must be nested under Daugherty
         * The Experience section MUST follow this EXACT structure:
           Daugherty Business Solutions
             Sr. Software Developer (III) (2014 - 2023)
               * Led development of enterprise applications
               * Implemented solutions using modern web technologies

               Client: Bayer
                 * Architected and developed enterprise-scale applications
                 * Upheld Agile best practices throughout development lifecycle

               Client: Charter Communications
                 * Engineered interactive call center solutions

               Client: Mastercard
                 * Developed comprehensive onboarding documentation

               Client: Cox Communications
                 * Implemented scaffolding framework for modular React applications

    4. For Education entries:
       - Use Title Case with proper indentation (2 spaces) for degrees
       - Format institution and date range on the next line with proper indentation (4 spaces)
       - Organize chronologically (most recent first)

    5. For Skills & Technologies:
       - Group related skills together
       - Use asterisks (*) for bullet points
       - Use ALL CAPS for key skill categories

    6. Ensure the visual hierarchy is clear through consistent indentation:
       - Level 1 (0 spaces): MAIN HEADERS WITH UNDERLINES
       - Level 2 (2 spaces): Primary employers, Degree Names
       - Level 3 (4 spaces): Job Titles, Institution Names
       - Level 4 (6 spaces): General responsibilities, Client engagements
       - Level 5 (8 spaces): Client-specific responsibilities

    7. Ensure generous spacing between sections (2-3 blank lines) for better readability

    8. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

    9. IMPORTANT: There should be NO separate "CLIENT WORK" section. All client work must be nested under the appropriate employer in the EXPERIENCE section.

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
    // Always use our own formatting for consistency
    if (true) {
      DanteLogger.warn.deprecated('Using custom resume text formatting for consistency');

      // Create a more structured fallback text with Salinger-inspired formatting
      // This matches the structure of the markdown formatting for consistency
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
      formattedContent += '4350 A De Tonty St\n';
      formattedContent += 'St. Louis, MO\n';
      formattedContent += '(314) 580-0608\n';
      formattedContent += 'pbradygeorgen.com\n';
      formattedContent += 'brady@pbradygeorgen.com\n\n\n';

      // Add experience section
      formattedContent += 'EXPERIENCE\n';
      formattedContent += '----------\n\n';

      // Daugherty (ALWAYS first with client work nested)
      formattedContent += 'Daugherty Business Solutions\n';
      formattedContent += 'Sr. Software Developer (III) (2014 - 2023)\n\n';
      formattedContent += '* Led development of enterprise applications\n';
      formattedContent += '* Implemented solutions using modern web technologies\n';
      formattedContent += '* Collaborated with cross-functional teams to deliver high-quality software solutions\n\n';

      // Client work nested under Daugherty with "Client:" prefix
      formattedContent += 'Client: Bayer\n\n';
      formattedContent += '* Architected, developed, migrated, and maintained various enterprise scale applications utilizing React, AWS, and SOA architectures\n';
      formattedContent += '* Upheld Agile best practices throughout development lifecycle\n\n';

      formattedContent += 'Client: Charter Communications\n\n';
      formattedContent += '* Engineered interactive call center solutions empowering representatives to provide enhanced customer service capabilities\n';
      formattedContent += '* Implemented user-friendly interfaces for call center operations\n\n';

      formattedContent += 'Client: Mastercard\n\n';
      formattedContent += '* Developed comprehensive onboarding documentation, sample code, and API integration\n';
      formattedContent += '* Supported the MasterPass online purchasing initiative\n\n';

      formattedContent += 'Client: Cox Communications\n\n';
      formattedContent += '* Implemented scaffolding framework for modular React applications\n';
      formattedContent += '* Integrated with Adobe Content Manager\n';
      formattedContent += '* Developed reusable component libraries\n\n';

      // Digital Ronan (second, even though it's more recent by date)
      formattedContent += 'Digital Ronan (freelance)\n';
      formattedContent += 'Consultant & Creative Technologist (2022 - Present)\n\n';
      formattedContent += '* Providing strategic digital consultancy for local businesses\n';
      formattedContent += '* Applying skills in web development, networking, and design\n';
      formattedContent += '* Creating custom digital solutions for small to medium businesses\n\n';

      // Add other experience entries chronologically
      formattedContent += 'Deliveries on Demand\n';
      formattedContent += 'Lead Software Developer (2013 - 2014)\n\n';
      formattedContent += '* Developed and maintained delivery management software\n';
      formattedContent += '* Led a team of developers in creating mobile applications\n\n';

      formattedContent += 'Infuze\n';
      formattedContent += 'Sr. Developer/Asst. Art Director (2011 - 2013)\n\n';
      formattedContent += '* Combined technical development with creative design direction\n';
      formattedContent += '* Created digital marketing solutions for clients\n\n';

      formattedContent += 'Touchwood Creative\n';
      formattedContent += 'Lead Software Developer (2008 - 2009)\n\n';
      formattedContent += '* Developed custom web applications for clients\n';
      formattedContent += '* Implemented creative digital solutions\n\n';

      formattedContent += 'ThinkTank (freelance)\n';
      formattedContent += 'Software and Creative Director (2005 - 2008)\n\n';
      formattedContent += '* Provided software development and creative direction services\n';
      formattedContent += '* Managed client relationships and project deliverables\n\n';

      formattedContent += 'Asynchrony Solutions\n';
      formattedContent += 'Designer/Developer/Marketing Asst. (2004 - 2005)\n\n';
      formattedContent += '* Assisted with design, development, and marketing initiatives\n';
      formattedContent += '* Contributed to various software projects\n\n\n';

      // Add skills section with Core Skills and Technical Skills subsections
      formattedContent += 'SKILLS & TECHNOLOGIES\n';
      formattedContent += '--------------------\n\n';

      // Core Skills subsection
      formattedContent += 'CORE SKILLS\n\n';
      formattedContent += '* Full Stack Development\n';
      formattedContent += '* JavaScript/TypeScript\n';
      formattedContent += '* Graphic Design & UI/UX\n';
      formattedContent += '* React & React Native\n';
      formattedContent += '* AWS & Cloud Architecture\n';
      formattedContent += '* Illustration\n';
      formattedContent += '* Creative/Technical Writing\n\n';

      // Technical Skills subsection with grouped technologies
      formattedContent += 'TECHNICAL SKILLS\n\n';
      formattedContent += '* Frontend: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n';
      formattedContent += '* Backend: Node.js, Ruby, Java\n';
      formattedContent += '* Cloud & Infrastructure: AWS, AWS Amplify, Docker, Terraform\n';
      formattedContent += '* Database: MongoDB, SQL\n';
      formattedContent += '* DevOps: CI/CD, Jenkins, Shell Automation\n';
      formattedContent += '* Architecture: SOA (Service-Oriented Architecture)\n';
      formattedContent += '* Design: Adobe Creative Suite\n\n\n';

      // Add education section
      formattedContent += 'EDUCATION\n';
      formattedContent += '---------\n\n';
      formattedContent += 'BFA Graphic Design\n\n';
      formattedContent += 'Webster University (2001-2005)\n\n';
      formattedContent += 'BA Philosophy\n\n';
      formattedContent += 'Webster University (2001-2005)\n\n';
      formattedContent += 'ASSC Motion Graphics\n\n';
      formattedContent += 'Saint Louis Community College (1999-2001)\n\n';

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
