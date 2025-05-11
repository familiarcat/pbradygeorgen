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
  // Define the formatBasicMarkdown function here
  function formatBasicMarkdown(content: string): string {
    // Check if content is empty or undefined
    if (!content || content.trim() === '') {
      console.warn('Empty content provided to formatBasicMarkdown, using placeholder');
      return `# Resume Content\n\nNo content was available to format. This is a placeholder.\n\n*Generated on: ${new Date().toLocaleString()}*`;
    }

    try {
      // Try to parse the content as JSON first (in case it's already structured)
      try {
        const jsonContent = JSON.parse(content);

        // If we have structured JSON content, format it nicely
        if (jsonContent.structuredContent) {
          return formatStructuredContent(jsonContent.structuredContent);
        }
      } catch (jsonError) {
        // Not JSON, continue with text processing
        console.log('Content is not JSON, processing as text');
      }

      // Process the content as text
      const lines = content.split('\n');
      let formatted = '';

      // Extract name from the content or use default
      const nameMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m);
      const name = nameMatch ? nameMatch[1].trim() : 'P. Brady Georgen';

      // Start with the name as header
      formatted += `# ${name}\n\n`;

      // Look for sections in the content
      const sections = {
        summary: extractSection(content, 'summary', 'professional summary', 'about me'),
        experience: extractSection(content, 'experience', 'work experience', 'employment'),
        skills: extractSection(content, 'skills', 'technologies', 'expertise'),
        education: extractSection(content, 'education', 'academic background', 'qualifications'),
        contact: extractSection(content, 'contact', 'contact information', 'personal information')
      };

      // Add sections to the formatted content
      if (sections.summary) {
        formatted += `## Professional Summary\n\n${sections.summary}\n\n`;
      }

      if (sections.contact) {
        formatted += `## Contact Information\n\n${sections.contact}\n\n`;
      }

      if (sections.experience) {
        formatted += `## Experience\n\n${sections.experience}\n\n`;
      }

      if (sections.skills) {
        formatted += `## Skills & Technologies\n\n${sections.skills}\n\n`;
      }

      if (sections.education) {
        formatted += `## Education\n\n${sections.education}\n\n`;
      }

      // Add generation timestamp
      formatted += `\n\n*Generated on: ${new Date().toLocaleString()}*`;

      return formatted;
    } catch (error) {
      console.error('Error formatting markdown:', error);
      // Return a simple formatted version of the original content
      return `# Resume\n\n${content}\n\n*Generated on: ${new Date().toLocaleString()}*`;
    }
  }

  // Helper function to extract sections from content
  function extractSection(content: string, ...sectionNames: string[]): string {
    // Create a regex pattern to match any of the section names
    const sectionPattern = new RegExp(`(?:^|\\n)##?\\s+(${sectionNames.join('|')}).*?\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = content.match(sectionPattern);

    if (match && match[2]) {
      return match[2].trim();
    }

    return '';
  }

  // Format structured content from JSON
  function formatStructuredContent(data: any): string {
    let formatted = '';

    // Name and title
    formatted += `# ${data.name || 'Resume'}\n\n`;

    if (data.title) {
      formatted += `*${data.title}*\n\n`;
    }

    // Contact information
    if (data.contact) {
      formatted += `## Contact Information\n\n`;

      if (data.contact.address) formatted += `${data.contact.address}  \n`;
      if (data.contact.city && data.contact.state) formatted += `${data.contact.city}, ${data.contact.state}  \n`;
      if (data.contact.phone) formatted += `${data.contact.phone}  \n`;
      if (data.contact.email) formatted += `${data.contact.email}  \n`;
      if (data.contact.website) formatted += `${data.contact.website}  \n`;

      formatted += `\n`;
    }

    // Summary
    if (data.summary) {
      formatted += `## Professional Summary\n\n${data.summary}\n\n`;
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      formatted += `## Experience\n\n`;

      data.experience.forEach((job: any) => {
        if (job.company) formatted += `### ${job.company}\n\n`;
        if (job.title) {
          formatted += `**${job.title}**`;
          if (job.dates) formatted += ` (${job.dates})`;
          formatted += `\n\n`;
        }

        if (job.description) {
          if (Array.isArray(job.description)) {
            job.description.forEach((item: string) => {
              formatted += `- ${item}\n`;
            });
          } else {
            formatted += `${job.description}\n`;
          }
          formatted += `\n`;
        }
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      formatted += `## Skills & Technologies\n\n`;

      if (Array.isArray(data.skills)) {
        data.skills.forEach((skill: any) => {
          if (typeof skill === 'string') {
            formatted += `- ${skill}\n`;
          } else if (skill.category && skill.items) {
            formatted += `### ${skill.category}\n\n`;
            skill.items.forEach((item: string) => {
              formatted += `- ${item}\n`;
            });
            formatted += `\n`;
          }
        });
      } else {
        formatted += `${data.skills}\n`;
      }

      formatted += `\n`;
    }

    // Education
    if (data.education && data.education.length > 0) {
      formatted += `## Education\n\n`;

      data.education.forEach((edu: any) => {
        if (edu.degree) formatted += `### ${edu.degree}\n\n`;
        if (edu.institution) {
          formatted += `**${edu.institution}**`;
          if (edu.dates) formatted += ` (${edu.dates})`;
          formatted += `\n\n`;
        }

        if (edu.description) {
          formatted += `${edu.description}\n\n`;
        }
      });
    }

    // Add generation timestamp
    formatted += `\n\n*Generated on: ${new Date().toLocaleString()}*`;

    return formatted;
  }

  try {
    // Always use our own formatting for consistency
    console.log('Using custom resume markdown formatting for consistency');
    return formatBasicMarkdown(content);

    // This code is never executed
    return formatBasicMarkdown(content);
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
  // Define the formatBasicText function here
  function formatBasicText(content: string): string {
    // Check if content is empty or undefined
    if (!content || content.trim() === '') {
      console.warn('Empty content provided to formatBasicText, using placeholder');
      return `RESUME CONTENT\n\nNo content was available to format. This is a placeholder.\n\nGenerated on: ${new Date().toLocaleString()}`;
    }

    try {
      // Try to parse the content as JSON first (in case it's already structured)
      try {
        const jsonContent = JSON.parse(content);

        // If we have structured JSON content, format it nicely as text
        if (jsonContent.structuredContent) {
          return formatStructuredContentAsText(jsonContent.structuredContent);
        }
      } catch (jsonError) {
        // Not JSON, continue with text processing
        console.log('Content is not JSON, processing as text');
      }

      // Process the content as text
      const lines = content.split('\n');
      let formatted = '';

      // Extract name from the content or use default
      const nameMatch = content.match(/^#\s+(.+)$/m) || content.match(/^(.+)$/m);
      const name = nameMatch ? nameMatch[1].trim().toUpperCase() : 'P. BRADY GEORGEN';

      // Start with the name as header
      formatted += `${name}\n${'='.repeat(name.length)}\n\n\n`;

      // Look for sections in the content
      const sections = {
        summary: extractSection(content, 'summary', 'professional summary', 'about me'),
        experience: extractSection(content, 'experience', 'work experience', 'employment'),
        skills: extractSection(content, 'skills', 'technologies', 'expertise'),
        education: extractSection(content, 'education', 'academic background', 'qualifications'),
        contact: extractSection(content, 'contact', 'contact information', 'personal information')
      };

      // Add sections to the formatted content
      if (sections.summary) {
        formatted += `PROFESSIONAL SUMMARY\n${'-'.repeat(20)}\n\n${sections.summary}\n\n\n`;
      }

      if (sections.contact) {
        formatted += `CONTACT INFORMATION\n${'-'.repeat(19)}\n\n${sections.contact}\n\n\n`;
      }

      if (sections.experience) {
        formatted += `EXPERIENCE\n${'-'.repeat(10)}\n\n${sections.experience}\n\n\n`;
      }

      if (sections.skills) {
        formatted += `SKILLS & TECHNOLOGIES\n${'-'.repeat(20)}\n\n${sections.skills}\n\n\n`;
      }

      if (sections.education) {
        formatted += `EDUCATION\n${'-'.repeat(9)}\n\n${sections.education}\n\n\n`;
      }

      // Add generation timestamp
      formatted += `Generated on: ${new Date().toLocaleString()}`;

      return formatted;
    } catch (error) {
      console.error('Error formatting text:', error);
      // Return a simple formatted version of the original content
      return `RESUME\n\n${content}\n\nGenerated on: ${new Date().toLocaleString()}`;
    }
  }

  // Format structured content from JSON as plain text
  function formatStructuredContentAsText(data: any): string {
    let formatted = '';

    // Name and title
    const name = (data.name || 'RESUME').toUpperCase();
    formatted += `${name}\n${'='.repeat(name.length)}\n\n`;

    if (data.title) {
      formatted += `${data.title}\n\n`;
    }

    // Contact information
    if (data.contact) {
      formatted += `CONTACT INFORMATION\n${'-'.repeat(19)}\n\n`;

      if (data.contact.address) formatted += `  ${data.contact.address}\n`;
      if (data.contact.city && data.contact.state) formatted += `  ${data.contact.city}, ${data.contact.state}\n`;
      if (data.contact.phone) formatted += `  ${data.contact.phone}\n`;
      if (data.contact.email) formatted += `  ${data.contact.email}\n`;
      if (data.contact.website) formatted += `  ${data.contact.website}\n`;

      formatted += `\n\n`;
    }

    // Summary
    if (data.summary) {
      formatted += `PROFESSIONAL SUMMARY\n${'-'.repeat(20)}\n\n${data.summary}\n\n\n`;
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      formatted += `EXPERIENCE\n${'-'.repeat(10)}\n\n`;

      data.experience.forEach((job: any) => {
        if (job.company) formatted += `  ${job.company}\n`;
        if (job.title) {
          formatted += `    ${job.title}`;
          if (job.dates) formatted += ` (${job.dates})`;
          formatted += `\n\n`;
        }

        if (job.description) {
          if (Array.isArray(job.description)) {
            job.description.forEach((item: string) => {
              formatted += `      * ${item}\n`;
            });
          } else {
            formatted += `      * ${job.description}\n`;
          }
          formatted += `\n`;
        }
      });

      formatted += `\n`;
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      formatted += `SKILLS & TECHNOLOGIES\n${'-'.repeat(20)}\n\n`;

      if (Array.isArray(data.skills)) {
        // Group skills by category if possible
        const categories: {[key: string]: string[]} = {};
        let uncategorized: string[] = [];

        data.skills.forEach((skill: any) => {
          if (typeof skill === 'string') {
            uncategorized.push(skill);
          } else if (skill.category && skill.items) {
            categories[skill.category] = skill.items;
          }
        });

        // Add uncategorized skills first
        if (uncategorized.length > 0) {
          formatted += `  CORE COMPETENCIES:\n`;
          uncategorized.forEach((skill: string) => {
            formatted += `    * ${skill}\n`;
          });
          formatted += `\n`;
        }

        // Add categorized skills
        Object.entries(categories).forEach(([category, items]) => {
          formatted += `  ${category.toUpperCase()}:\n`;
          items.forEach((item: string) => {
            formatted += `    * ${item}\n`;
          });
          formatted += `\n`;
        });
      } else {
        formatted += `  ${data.skills}\n\n`;
      }
    }

    // Education
    if (data.education && data.education.length > 0) {
      formatted += `EDUCATION\n${'-'.repeat(9)}\n\n`;

      data.education.forEach((edu: any) => {
        if (edu.degree) formatted += `  ${edu.degree}\n`;
        if (edu.institution) {
          formatted += `    ${edu.institution}`;
          if (edu.dates) formatted += ` (${edu.dates})`;
          formatted += `\n\n`;
        }

        if (edu.description) {
          formatted += `    ${edu.description}\n\n`;
        }
      });
    }

    // Add generation timestamp
    formatted += `Generated on: ${new Date().toLocaleString()}`;

    return formatted;
  }

  try {
    // Always use our own formatting for consistency
    console.log('Using custom resume text formatting for consistency');
    return formatBasicText(content);

    // This code is never executed
    return formatBasicText(content);
  } catch (error) {
    console.error('Error generating formatted text:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicText(content);
  }
}


