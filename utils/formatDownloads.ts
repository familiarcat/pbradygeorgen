'use client';

import OpenAI from 'openai';

// Initialize the OpenAI client conditionally to avoid client-side errors
let openai: OpenAI | null = null;

// Only initialize if we have an API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
if (apiKey) {
  try {
    openai = new OpenAI({ apiKey });
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
    openai = null;
  }
}

/**
 * Generate a properly formatted markdown version of the resume content
 * @param content The raw content to format
 * @returns Properly formatted markdown
 */
export async function generateFormattedMarkdown(content: string): Promise<string> {
  try {
    // If OpenAI client is not available, fall back to basic formatting
    if (!openai) {
      console.log('OpenAI client not available, using basic markdown formatting');
      return formatBasicMarkdown(content);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a faster, cheaper model for formatting
      messages: [
        {
          role: "system",
          content: `You are a resume formatting expert. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work.
          Then, format it as clean, professional markdown with a J.D. Salinger-inspired approach.

          Follow these specific guidelines:

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
                 - Architected and developed enterprise-scale applications
                 - Upheld Agile best practices throughout development lifecycle

                 #### Client: Charter Communications
                 - Engineered interactive call center solutions

                 #### Client: Mastercard
                 - Developed comprehensive onboarding documentation

                 #### Client: Cox Communications
                 - Implemented scaffolding framework for modular React applications

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
             - Level 3 (### Heading): Primary employers, Degrees
             - Level 4 (#### Client: Name): Client engagements under consultancy employers
             - Bold text: Job titles, important skills
             - Bullet points: Responsibilities, achievements, skills

          7. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

          8. IMPORTANT: There should be NO separate "Client Work" section. All client work must be nested under the appropriate employer in the Experience section.

          9. DO NOT add any footer text, metadata, or generation information at the end

          Return ONLY the formatted markdown, nothing else.`
        },
        {
          role: "user",
          content: `Please format this resume content as clean, professional markdown:\n\n${content}`
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: 2000,
    });

    const formattedMarkdown = response.choices[0]?.message?.content || '';

    if (!formattedMarkdown) {
      console.log('Empty response from OpenAI, using basic markdown formatting');
      return formatBasicMarkdown(content);
    }

    return formattedMarkdown;
  } catch (error) {
    console.error('Error generating formatted markdown:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicMarkdown(content);
  }
}

/**
 * Generate a properly formatted plain text version of the resume content
 * @param content The raw content to format
 * @returns Properly formatted text
 */
export async function generateFormattedText(content: string): Promise<string> {
  try {
    // If OpenAI client is not available, fall back to basic formatting
    if (!openai) {
      console.log('OpenAI client not available, using basic text formatting');
      return formatBasicText(content);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a faster, cheaper model for formatting
      messages: [
        {
          role: "system",
          content: `You are a resume formatting expert. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work.
          Then, format it as clean, professional plain text with a J.D. Salinger-inspired approach.

          Follow these specific guidelines:

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

          Return ONLY the formatted plain text, nothing else.`
        },
        {
          role: "user",
          content: `Please format this resume content as clean, professional plain text:\n\n${content}`
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: 2000,
    });

    const formattedText = response.choices[0]?.message?.content || '';

    if (!formattedText) {
      console.log('Empty response from OpenAI, using basic text formatting');
      return formatBasicText(content);
    }

    return formattedText;
  } catch (error) {
    console.error('Error generating formatted text:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicText(content);
  }
}

/**
 * Basic markdown formatting as a fallback with Salinger-inspired approach
 * @param content The raw content to format
 * @returns Basic formatted markdown
 */
function formatBasicMarkdown(content: string): string {
  // Extract sections based on common patterns
  const lines = content.split('\n');
  let formatted = '';
  let inList = false;

  // Start with a clean header
  formatted += `# P. Brady Georgen\n\n`;
  formatted += `## Professional Summary\n\n`;
  formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n`;

  // Add contact information
  formatted += `## Contact Information\n\n`;
  formatted += `4350 A De Tonty St  \n`;
  formatted += `St. Louis, MO  \n`;
  formatted += `(314) 580-0608  \n`;
  formatted += `pbradygeorgen.com  \n`;
  formatted += `brady@pbradygeorgen.com\n\n`;

  // Add experience section
  formatted += `## Experience\n\n`;

  // Process the content
  let experienceAdded = false;
  let educationAdded = false;

  lines.forEach(line => {
    // Skip the name since we already added it
    if (line.trim().match(/^P\.\s*Brady\s*Georgen/i)) {
      return;
    }

    // Experience section
    else if (line.trim().match(/^(EXPERIENCE|WORK|EMPLOYMENT)/i)) {
      // Already added the section header
      experienceAdded = true;
    }

    // Education section
    else if (line.trim().match(/^(EDUCATION|ACADEMIC)/i)) {
      if (!educationAdded) {
        formatted += `\n## Education\n\n`;
        educationAdded = true;
      }
    }

    // Skills section
    else if (line.trim().match(/^(SKILLS|EXPERTISE|PROFICIENCIES)/i)) {
      formatted += `\n## Skills & Technologies\n\n`;

      // Add Core Skills subsection
      formatted += `### Core Skills\n\n`;
      formatted += `- **Full Stack Development**\n`;
      formatted += `- **JavaScript/TypeScript**\n`;
      formatted += `- **Graphic Design & UI/UX**\n`;
      formatted += `- **React & React Native**\n`;
      formatted += `- **AWS & Cloud Architecture**\n`;
      formatted += `- **Illustration**\n`;
      formatted += `- **Creative/Technical Writing**\n\n`;

      // Add Technical Skills subsection
      formatted += `### Technical Skills\n\n`;
      formatted += `- **Frontend**: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n`;
      formatted += `- **Backend**: Node.js, Ruby, Java\n`;
      formatted += `- **Cloud & Infrastructure**: AWS, AWS Amplify, Docker, Terraform\n`;
      formatted += `- **Database**: MongoDB, SQL\n`;
      formatted += `- **DevOps**: CI/CD, Jenkins, Shell Automation\n`;
      formatted += `- **Architecture**: SOA (Service-Oriented Architecture)\n`;
      formatted += `- **Design**: Adobe Creative Suite\n\n`;
    }

    // Job titles or companies (assuming they often have years in parentheses)
    else if (line.trim().match(/.*\(\d{4}.*\d{4}.*\)/i) ||
             line.trim().match(/^[A-Z][\w\s]+,\s*[A-Z][\w\s]+$/) ||
             line.trim().match(/Daugherty|Asynchrony|Webster/i)) {
      formatted += `### ${line.trim()}\n\n`;
    }

    // List items (often start with bullet points or dashes)
    else if (line.trim().match(/^[\-\•\*]/)) {
      formatted += `- ${line.trim().replace(/^[\-\•\*]\s*/, '')}\n`;
      inList = true;
    }

    // Continuation of list items (indented lines)
    else if (line.trim() && inList && line.match(/^\s+/)) {
      formatted += `  ${line.trim()}\n`;
    }

    // Regular content
    else if (line.trim()) {
      formatted += `${line.trim()}\n\n`;
      inList = false;
    }
  });

  // Add education if not found in the content
  if (!educationAdded) {
    formatted += `\n## Education\n\n`;
    formatted += `### BFA Graphic Design\n\n`;
    formatted += `**Webster University** (2001-2005)\n\n`;
    formatted += `### BA Philosophy\n\n`;
    formatted += `**Webster University** (2001-2005)\n\n`;
  }

  return formatted;
}

/**
 * Basic text formatting as a fallback with Salinger-inspired approach
 * @param content The raw content to format
 * @returns Basic formatted text
 */
function formatBasicText(content: string): string {
  // Extract sections based on common patterns
  const lines = content.split('\n');
  let formatted = '';
  let inList = false;

  // Start with a clean header
  formatted += `P. BRADY GEORGEN\n${'='.repeat(16)}\n\n\n`;

  // Add professional summary
  formatted += `PROFESSIONAL SUMMARY\n${'-'.repeat(20)}\n\n`;
  formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n\n`;

  // Add contact information
  formatted += `CONTACT INFORMATION\n${'-'.repeat(19)}\n\n`;
  formatted += `  4350 A De Tonty St\n`;
  formatted += `  St. Louis, MO\n`;
  formatted += `  (314) 580-0608\n`;
  formatted += `  pbradygeorgen.com\n`;
  formatted += `  brady@pbradygeorgen.com\n\n\n`;

  // Add experience section
  formatted += `EXPERIENCE\n${'-'.repeat(10)}\n\n`;

  // Process the content
  let experienceAdded = false;
  let educationAdded = false;

  lines.forEach(line => {
    // Skip the name since we already added it
    if (line.trim().match(/^P\.\s*Brady\s*Georgen/i)) {
      return;
    }

    // Experience section
    else if (line.trim().match(/^(EXPERIENCE|WORK|EMPLOYMENT)/i)) {
      // Already added the section header
      experienceAdded = true;
    }

    // Education section
    else if (line.trim().match(/^(EDUCATION|ACADEMIC)/i)) {
      if (!educationAdded) {
        formatted += `\n\nEDUCATION\n${'-'.repeat(9)}\n\n`;
        educationAdded = true;
      }
    }

    // Skills section
    else if (line.trim().match(/^(SKILLS|EXPERTISE|PROFICIENCIES)/i)) {
      formatted += `\n\nSKILLS & TECHNOLOGIES\n${'-'.repeat(20)}\n\n`;

      // Add Core Skills subsection
      formatted += `  CORE COMPETENCIES:\n`;
      formatted += `    * Full Stack Development\n`;
      formatted += `    * JavaScript/TypeScript\n`;
      formatted += `    * Graphic Design & UI/UX\n`;
      formatted += `    * React & React Native\n`;
      formatted += `    * AWS & Cloud Architecture\n`;
      formatted += `    * Illustration\n`;
      formatted += `    * Creative/Technical Writing\n\n`;

      // Add Technical Skills subsection
      formatted += `  TECHNOLOGIES:\n`;
      formatted += `    * Frontend: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n`;
      formatted += `    * Backend: Node.js, Ruby, Java\n`;
      formatted += `    * Cloud & Infrastructure: AWS, AWS Amplify, Docker, Terraform\n`;
      formatted += `    * Database: MongoDB, SQL\n`;
      formatted += `    * DevOps: CI/CD, Jenkins, Shell Automation\n`;
      formatted += `    * Architecture: SOA (Service-Oriented Architecture)\n`;
      formatted += `    * Design: Adobe Creative Suite\n\n`;
    }

    // Job titles or companies (assuming they often have years in parentheses)
    else if (line.trim().match(/.*\(\d{4}.*\d{4}.*\)/i) ||
             line.trim().match(/^[A-Z][\w\s]+,\s*[A-Z][\w\s]+$/) ||
             line.trim().match(/Daugherty|Asynchrony|Webster/i)) {
      formatted += `  ${line.trim()}\n\n`;
    }

    // List items (often start with bullet points or dashes)
    else if (line.trim().match(/^[\-\•\*]/)) {
      formatted += `    * ${line.trim().replace(/^[\-\•\*]\s*/, '')}\n`;
      inList = true;
    }

    // Continuation of list items (indented lines)
    else if (line.trim() && inList && line.match(/^\s+/)) {
      formatted += `      ${line.trim()}\n`;
    }

    // Regular content
    else if (line.trim()) {
      formatted += `${line.trim()}\n\n`;
      inList = false;
    }
  });

  // Add education if not found in the content
  if (!educationAdded) {
    formatted += `\n\nEDUCATION\n${'-'.repeat(9)}\n\n`;
    formatted += `  BFA Graphic Design\n`;
    formatted += `  Webster University (2001-2005)\n\n`;
    formatted += `  BA Philosophy\n`;
    formatted += `  Webster University (2001-2005)\n\n`;
  }

  return formatted;
}
