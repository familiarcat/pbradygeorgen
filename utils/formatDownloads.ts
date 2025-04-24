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
          content: `You are a resume formatting expert. Your task is to take resume content and format it as clean,
          professional markdown with a J.D. Salinger-inspired approach. Preserve the hierarchical structure, use proper
          markdown formatting for headers, lists, emphasis, etc. Make the content scannable and well-organized.
          Follow these guidelines:

          1. Use # for the name - make it stand out but feel personal
          2. Use ## for section headers
          3. Use ### for job titles/companies
          4. Use bullet lists for responsibilities and skills - keep them concise and meaningful
          5. Use **bold** for emphasis on important elements
          6. Ensure generous spacing between sections for better readability
          7. Maintain a clean, professional layout with a personal touch
          8. Preserve all original content
          9. Do not add any new content or commentary
          10. DO NOT add any footer text, metadata, or generation information at the end

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
          content: `You are a resume formatting expert. Your task is to take resume content and format it as clean,
          professional plain text with a J.D. Salinger-inspired approach. Preserve the hierarchical structure, use proper
          spacing, indentation, and capitalization to indicate hierarchy. Make the content scannable and well-organized.
          Follow these guidelines:

          1. Use ALL CAPS for the name - make it stand out but feel personal
          2. Use ALL CAPS with underlines (====) for section headers
          3. Use Title Case with proper indentation for job titles/companies
          4. Use dashes (-) or asterisks (*) for bullet points - keep them concise and meaningful
          5. Use proper indentation to show hierarchy (2 spaces for each level)
          6. Ensure generous spacing between sections (2-3 blank lines) for better readability
          7. Use spacing and alignment to create a clean, professional layout with a personal touch
          8. Preserve all original content
          9. Do not add any new content or commentary
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
  formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n`;

  // Add main sections
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
      formatted += `\n## Skills\n\n`;
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
  formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n\n`;

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
      formatted += `\n\nSKILLS\n${'-'.repeat(6)}\n\n`;
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
