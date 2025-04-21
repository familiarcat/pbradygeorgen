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
          professional markdown. Preserve the hierarchical structure, use proper markdown formatting for headers,
          lists, emphasis, etc. Make the content scannable and well-organized. Follow these guidelines:

          1. Use # for the name
          2. Use ## for section headers
          3. Use ### for job titles/companies
          4. Use bullet lists for responsibilities and skills
          5. Use **bold** for emphasis on important elements
          6. Ensure proper spacing between sections
          7. Maintain a clean, professional layout
          8. Preserve all original content
          9. Do not add any new content or commentary

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
          professional plain text. Preserve the hierarchical structure, use proper spacing, indentation, and
          capitalization to indicate hierarchy. Make the content scannable and well-organized. Follow these guidelines:

          1. Use ALL CAPS for the name
          2. Use ALL CAPS with underlines (====) for section headers
          3. Use Title Case with proper indentation for job titles/companies
          4. Use dashes (-) or asterisks (*) for bullet points
          5. Use proper indentation to show hierarchy
          6. Ensure proper spacing between sections
          7. Use spacing and alignment to create a clean, professional layout
          8. Preserve all original content
          9. Do not add any new content or commentary

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
 * Basic markdown formatting as a fallback
 * @param content The raw content to format
 * @returns Basic formatted markdown
 */
function formatBasicMarkdown(content: string): string {
  // Extract sections based on common patterns
  const lines = content.split('\n');
  let formatted = '';
  let inList = false;

  lines.forEach(line => {
    // Detect and format headers
    if (line.trim().match(/^P\.\s*Brady\s*Georgen/i)) {
      formatted += `# ${line.trim()}\n\n`;
    }
    // Section headers
    else if (line.trim().match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CONTACT)/i)) {
      formatted += `\n## ${line.trim()}\n\n`;
    }
    // Job titles or companies (assuming they often have years in parentheses)
    else if (line.trim().match(/.*\(\d{4}.*\d{4}.*\)/i) || line.trim().match(/^[A-Z][\w\s]+,\s*[A-Z][\w\s]+$/)) {
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

  return formatted;
}

/**
 * Basic text formatting as a fallback
 * @param content The raw content to format
 * @returns Basic formatted text
 */
function formatBasicText(content: string): string {
  // Extract sections based on common patterns
  const lines = content.split('\n');
  let formatted = '';
  let inList = false;

  lines.forEach(line => {
    // Detect and format headers
    if (line.trim().match(/^P\.\s*Brady\s*Georgen/i)) {
      formatted += `${line.trim().toUpperCase()}\n${'='.repeat(line.trim().length)}\n\n`;
    }
    // Section headers
    else if (line.trim().match(/^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CONTACT)/i)) {
      formatted += `\n${line.trim().toUpperCase()}\n${'-'.repeat(line.trim().length)}\n\n`;
    }
    // Job titles or companies (assuming they often have years in parentheses)
    else if (line.trim().match(/.*\(\d{4}.*\d{4}.*\)/i) || line.trim().match(/^[A-Z][\w\s]+,\s*[A-Z][\w\s]+$/)) {
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

  return formatted;
}
