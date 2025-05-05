/**
 * PDF Processing with OpenAI
 *
 * This script processes a PDF file using OpenAI to extract structured content.
 * It follows Derrida's philosophy of deconstruction by breaking down the PDF
 * into its component parts and analyzing them separately.
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
require('dotenv').config();

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-for-amplify-build',
});

/**
 * Main function
 */
async function main() {
  // Check if a file path was provided as a command-line argument
  const args = process.argv.slice(2);
  let pdfPath;

  if (args.length > 0) {
    // Use the provided file path
    pdfPath = args[0];
  } else {
    // Use the default file path
    pdfPath = path.join(__dirname, '../public/default_resume.pdf');
    log.info(`Using default PDF path: ${pdfPath}`);

    // Log the file's last modified time to help with debugging
    try {
      const stats = fs.statSync(pdfPath);
      log.info(`PDF file last modified: ${stats.mtime}`);
    } catch (err) {
      log.error(`Error checking PDF file stats: ${err}`);
    }
  }

  const extractedDir = path.join(__dirname, '../public/extracted');
  const outputPath = path.join(extractedDir, 'resume_content.txt');
  const markdownPath = path.join(extractedDir, 'resume_content.md');
  const jsonPath = path.join(extractedDir, 'resume_content.json');

  try {
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    log.info(`Extracting text from: ${pdfPath}`);

    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfPath);

    // Parse the PDF
    const data = await pdfParse(dataBuffer);

    // Get the text content
    const text = data.text;

    // Save the raw text to a file
    fs.writeFileSync(outputPath, text);
    log.success(`Raw text saved to: ${outputPath}`);

    // Process with OpenAI
    log.info('Processing with OpenAI...');

    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-for-amplify-build') {
      log.warning('No valid OpenAI API key found. Using fallback processing method.');

      // Use the fallback method
      const improvedMarkdown = createImprovedMarkdown(text);
      fs.writeFileSync(markdownPath, improvedMarkdown);

      // Create a basic JSON structure
      const jsonContent = {
        title: 'Resume',
        summary: 'Resume content preview',
        sections: [
          {
            title: 'Summary',
            content: text.substring(0, 200) + '...'
          },
          {
            title: 'Skills',
            content: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'AWS']
          },
          {
            title: 'Experience',
            content: 'Professional experience information'
          }
        ],
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
      log.success(`Basic JSON content saved to: ${jsonPath}`);

      log.success(`Improved markdown saved to: ${markdownPath}`);
      log.info('\nExtracted content preview:');
      log.info(improvedMarkdown.substring(0, 500) + '...');

      return;
    }

    // Process with OpenAI
    const structuredContent = await processWithOpenAI(text);

    // Save the structured content as JSON
    fs.writeFileSync(jsonPath, JSON.stringify(structuredContent, null, 2));
    log.success(`Structured content saved to: ${jsonPath}`);

    // Generate markdown from the structured content
    const markdown = generateMarkdown(structuredContent);
    fs.writeFileSync(markdownPath, markdown);
    log.success(`Markdown content saved to: ${markdownPath}`);

    log.info('\nExtracted content preview:');
    log.info(markdown.substring(0, 500) + '...');

  } catch (error) {
    log.error(`Failed to process PDF: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Process text with OpenAI
 */
async function processWithOpenAI(text) {
  try {
    log.info('Sending content to OpenAI for analysis...');

    const prompt = `
    You are an expert resume analyzer. Extract structured information from the following resume text.
    Format the output as a JSON object with the following structure:
    {
      "title": "Resume title or name",
      "summary": "A brief professional summary",
      "sections": [
        {
          "title": "Section title (e.g., Skills, Experience, Education)",
          "content": "Section content or array of items"
        }
      ]
    }

    For skills, education, and similar list-based sections, use arrays for the content.
    For experience and other paragraph-based sections, use strings for the content.

    Resume text:
    ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert resume analyzer that extracts structured information from resume text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;

    // Parse the JSON response
    try {
      // Check if the response is wrapped in markdown code blocks
      let jsonString = content;

      // Remove markdown code blocks if present
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = content.match(jsonRegex);

      if (match && match[1]) {
        jsonString = match[1].trim();
        log.info('Extracted JSON from markdown code blocks');
      }

      const jsonContent = JSON.parse(jsonString);
      log.success('Successfully parsed OpenAI response');
      return jsonContent;
    } catch (error) {
      log.error(`Failed to parse OpenAI response: ${error.message}`);
      log.info('OpenAI response:');
      console.log(content);

      // Return a basic structure
      return {
        title: 'Resume',
        summary: 'Resume content preview',
        sections: [
          {
            title: 'Summary',
            content: text.substring(0, 200) + '...'
          },
          {
            title: 'Raw Content',
            content: content
          }
        ],
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    log.error(`OpenAI API error: ${error.message}`);

    // Return a basic structure
    return {
      title: 'Resume',
      summary: 'Resume content preview',
      sections: [
        {
          title: 'Summary',
          content: text.substring(0, 200) + '...'
        },
        {
          title: 'Error',
          content: `Failed to process with OpenAI: ${error.message}`
        }
      ],
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate markdown from structured content
 */
function generateMarkdown(content) {
  let markdown = `# ${content.title || 'Resume'}\n\n`;

  if (content.summary) {
    markdown += `${content.summary}\n\n`;
  }

  if (content.sections && Array.isArray(content.sections)) {
    for (const section of content.sections) {
      markdown += `## ${section.title}\n\n`;

      if (Array.isArray(section.content)) {
        for (const item of section.content) {
          markdown += `- ${item}\n`;
        }
      } else {
        markdown += `${section.content}\n`;
      }

      markdown += '\n';
    }
  }

  // Add metadata
  markdown += `---\n\n`;
  markdown += `*This document was automatically extracted from a PDF resume using OpenAI.*\n`;
  markdown += `*Generated on: ${new Date().toLocaleDateString()}*\n`;

  return markdown;
}

/**
 * Fallback function to create improved markdown
 */
function createImprovedMarkdown(text) {
  // Split the text into lines and clean them
  const lines = text.split('\\n').map(line => line.trim()).filter(line => line);

  // Identify key sections
  const sections = {
    header: [],
    about: [],
    contact: [],
    skills: [],
    experience: [],
    education: [],
    clients: []
  };

  // Process the text to identify sections
  let currentSection = 'header';

  // Extract name (assuming it's one of the first few lines)
  let name = '';
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    if (lines[i].includes('Georgen')) {
      name = lines[i];
      break;
    }
  }

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Identify sections based on keywords
    if (line.includes('ABOUT ME')) {
      currentSection = 'about';
      continue;
    } else if (line.includes('SKILLS') || line.includes('TECHNOLOGIES')) {
      currentSection = 'skills';
      continue;
    } else if (line.includes('WORK') && line.includes('EXPERIENCE')) {
      currentSection = 'experience';
      continue;
    } else if (line.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    } else if (line.match(/^[0-9]{4}/) && lines[i + 1] && !lines[i + 1].match(/^[0-9]{4}/)) {
      // Lines starting with years are likely experience entries
      currentSection = 'experience';
    } else if (line.includes('@') || line.includes('.com') || line.includes('St. Louis')) {
      currentSection = 'contact';
      continue;
    } else if (['Cox', 'Bayer', 'Charter', 'Mastercard'].some(client => line.includes(client))) {
      currentSection = 'clients';
      continue;
    }

    // Add the line to the current section
    sections[currentSection].push(line);
  }

  // Create the markdown content
  let markdown = `# ${name.trim() || 'Resume'}\n\n`;

  // Add a professional summary from the header section
  if (sections.header.length > 0) {
    markdown += `## Professional Summary\n\n`;
    markdown += sections.header.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
  }

  // Add contact information
  if (sections.contact.length > 0) {
    markdown += `## Contact Information\n\n`;
    for (const line of sections.contact) {
      markdown += `- ${line.trim()}\n`;
    }
    markdown += '\n';
  }

  // Add skills
  if (sections.skills.length > 0) {
    markdown += `## Skills & Technologies\n\n`;
    for (const line of sections.skills) {
      if (line.startsWith('•')) {
        markdown += `- ${line.substring(1).trim()}\n`;
      } else {
        markdown += `- ${line.trim()}\n`;
      }
    }
    markdown += '\n';
  }

  // Add work experience
  if (sections.experience.length > 0) {
    markdown += `## Professional Experience\n\n`;

    // Process experience entries
    let i = 0;
    while (i < sections.experience.length) {
      const line = sections.experience[i];

      // Check if this line starts with a year range
      if (line.match(/^[0-9]{4}/)) {
        const period = line.trim();
        const company = sections.experience[i + 1]?.trim() || '';
        const title = sections.experience[i + 2]?.trim() || '';

        markdown += `### ${company} (${period})\n`;
        markdown += `**${title}**\n\n`;

        // Skip the lines we've already processed
        i += 3;

        // Add any description that follows until the next year entry
        let description = [];
        while (i < sections.experience.length && !sections.experience[i].match(/^[0-9]{4}/)) {
          description.push(sections.experience[i]);
          i++;
        }

        if (description.length > 0) {
          markdown += description.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
        } else {
          markdown += '\n';
        }
      } else {
        // If not a year entry, just add the line
        markdown += `${line.trim()}\n`;
        i++;
      }
    }
  }

  // Add education
  if (sections.education.length > 0) {
    markdown += `## Education\n\n`;

    let i = 0;
    while (i < sections.education.length) {
      const line = sections.education[i];

      if (line.includes('University') || line.includes('College')) {
        const degree = sections.education[i - 1]?.trim() || '';
        const institution = line.trim();
        const period = sections.education[i + 1]?.trim() || '';

        markdown += `### ${degree}\n`;
        markdown += `**${institution}** (${period})\n\n`;

        i += 2;
      } else {
        i++;
      }
    }
  }

  // Add about section
  if (sections.about.length > 0) {
    markdown += `## About\n\n`;
    markdown += sections.about.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
  }

  // Add metadata
  markdown += `---\n\n`;
  markdown += `*This document was automatically extracted from a PDF resume.*\n`;
  markdown += `*Generated on: ${new Date().toLocaleDateString()}*\n`;

  return markdown;
}

// Run the main function
main();
