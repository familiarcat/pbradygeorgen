/**
 * OpenAI PDF Structure Service
 *
 * This service uses OpenAI to analyze the raw text extracted from a PDF
 * and structure it into sections and structured content.
 */

import { DanteLogger } from './DanteLogger';
import { HesseLogger } from './HesseLogger';
import { DynamicCacheService } from './dynamicCacheService';
import { promises as fs } from 'fs';
import path from 'path';

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create a cache service for OpenAI responses
const openaiCache = new DynamicCacheService<any>('openai-pdf-structure');

/**
 * Analyze resume content using OpenAI
 *
 * @param rawText The raw text extracted from the PDF
 * @returns The analyzed content with sections and structured content
 */
export async function analyzeResumeContent(rawText: string) {
  try {
    HesseLogger.ai.start('Analyzing resume content with OpenAI');

    // Check if OpenAI API key is available
    if (!OPENAI_API_KEY) {
      HesseLogger.ai.warning('OpenAI API key is not available');
      DanteLogger.warn.deprecated('OpenAI API key is not available, using fallback analysis');
      return createFallbackAnalysis(rawText);
    }

    // Generate a cache key based on the content
    const contentHash = await generateContentHash(rawText);
    const cacheKey = `resume-analysis-${contentHash}`;

    // Check if we have a cached response
    const cachedResponse = openaiCache.getItem(cacheKey);
    if (cachedResponse) {
      HesseLogger.ai.progress('Using cached OpenAI analysis');
      return cachedResponse;
    }

    // Create the prompt for OpenAI
    const prompt = createResumeAnalysisPrompt(rawText);

    // Call OpenAI API
    const startTime = Date.now();
    HesseLogger.openai.request('Sending resume content to OpenAI for analysis');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a resume parsing assistant that extracts structured information from resume text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    const endTime = Date.now();

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    // Parse the response
    const responseData = await response.json();

    // Extract the content from the response
    const content = responseData.choices[0].message.content;

    // Parse the JSON from the content
    let parsedContent;
    try {
      // The content might be wrapped in ```json and ``` markers
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonContent);
    } catch (error) {
      HesseLogger.ai.error(`Error parsing OpenAI response: ${error}`);
      DanteLogger.error.dataFlow('Error parsing OpenAI response', { error, content });
      return createFallbackAnalysis(rawText);
    }

    // Log success
    HesseLogger.openai.response(`OpenAI analysis completed in ${endTime - startTime}ms`);
    DanteLogger.success.core('Resume content analyzed successfully with OpenAI');

    // Cache the response
    openaiCache.setItem(cacheKey, parsedContent);

    return parsedContent;
  } catch (error) {
    HesseLogger.ai.error(`Error analyzing resume content: ${error}`);
    DanteLogger.error.dataFlow('Error analyzing resume content with OpenAI', { error });
    return createFallbackAnalysis(rawText);
  }
}

/**
 * Create a prompt for OpenAI to analyze resume content
 *
 * @param rawText The raw text extracted from the PDF
 * @returns The prompt for OpenAI
 */
function createResumeAnalysisPrompt(rawText: string): string {
  return `
I have extracted the following raw text from a resume PDF. Please analyze it and structure it into sections and structured content.

RAW TEXT:
\`\`\`
${rawText}
\`\`\`

Please return a JSON object with the following structure:
\`\`\`json
{
  "sections": {
    "name": "The person's name",
    "header": ["Lines that appear at the top of the resume"],
    "about": ["Lines that describe the person"],
    "contact": ["Contact information lines"],
    "skills": ["Skills listed in the resume"],
    "experience": ["Work experience lines"],
    "education": ["Education lines"],
    "clients": ["Client or project lines"],
    "other": ["Any other lines that don't fit into the above categories"]
  },
  "structuredContent": {
    "name": "The person's name",
    "summary": "A brief summary of the person's background",
    "contact": [
      { "text": "Email address" },
      { "text": "Phone number" },
      { "text": "LinkedIn profile" },
      { "text": "Other contact information" }
    ],
    "skills": [
      { "text": "Skill 1" },
      { "text": "Skill 2" }
    ],
    "experience": [
      {
        "period": "Date range (e.g., 2020-Present)",
        "company": "Company name",
        "title": "Job title",
        "description": "Job description"
      }
    ],
    "education": [
      {
        "degree": "Degree name",
        "institution": "Institution name",
        "period": "Date range"
      }
    ],
    "clients": [
      {
        "name": "Client name",
        "description": "Project description"
      }
    ],
    "about": "About section text"
  }
}
\`\`\`

Please ensure that:
1. All text is properly categorized into the appropriate sections
2. The structuredContent object contains well-formatted, structured information
3. Dates, company names, job titles, etc. are correctly identified
4. Skills are properly extracted and formatted
5. The JSON is valid and properly formatted
6. For experience entries, include a descriptive paragraph for each position
7. For education entries, include degree, institution, and period
8. For contact information, format as { "text": "contact info" }
9. For skills, format each skill as { "text": "skill description" }
10. Ensure all string values use escaped quotes for any internal quotation marks
`;
}

/**
 * Create a fallback analysis when OpenAI is not available
 *
 * @param rawText The raw text extracted from the PDF
 * @returns A basic analysis of the content
 */
function createFallbackAnalysis(rawText: string) {
  // Split the text into lines and clean them
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line);

  // Extract name (assuming it's one of the first few lines)
  let name = '';
  // Look for a name in the first few lines
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    // Look for lines that might be names (capitalized words without common keywords)
    if (lines[i].match(/^[A-Z][a-z]+ [A-Z][a-z]+/) &&
        !lines[i].includes('EXPERIENCE') &&
        !lines[i].includes('EDUCATION') &&
        !lines[i].includes('SKILLS') &&
        !lines[i].includes('ABOUT')) {
      name = lines[i];
      break;
    }
  }

  // If no name found, use a generic title
  if (!name) {
    name = 'Professional Resume';
  }

  // Extract contact information
  const contactLines = lines.filter(line =>
    line.includes('@') ||
    line.includes('.com') ||
    line.match(/[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}/)
  );

  // Extract skills
  const skillLines = lines.filter(line =>
    line.includes('•') ||
    line.includes('*') ||
    line.toLowerCase().includes('skill')
  );

  // Extract experience
  const experienceLines = lines.filter(line =>
    line.match(/^[0-9]{4}/) ||
    line.includes('Experience') ||
    line.includes('EXPERIENCE')
  );

  // Extract education
  const educationLines = lines.filter(line =>
    line.includes('Education') ||
    line.includes('EDUCATION') ||
    line.includes('University') ||
    line.includes('College')
  );

  // Create a basic experience entry
  const experienceEntries = [];
  if (experienceLines.length > 0) {
    experienceEntries.push({
      period: "Present",
      company: "Company",
      title: "Professional",
      description: "Professional experience extracted from resume."
    });
  }

  // Create a basic education entry
  const educationEntries = [];
  if (educationLines.length > 0) {
    educationEntries.push({
      degree: "Degree",
      institution: "Institution",
      period: "Education Period"
    });
  }

  // Create a basic analysis
  return {
    sections: {
      name,
      header: lines.slice(0, 5),
      about: [],
      contact: contactLines,
      skills: skillLines,
      experience: experienceLines,
      education: educationLines,
      clients: [],
      other: []
    },
    structuredContent: {
      name,
      summary: lines.slice(0, 5).join(' '),
      contact: contactLines.map(line => ({ text: line.trim() })),
      skills: skillLines.map(line => {
        if (line.startsWith('•') || line.startsWith('*')) {
          return { text: line.substring(1).trim() };
        }
        return { text: line.trim() };
      }),
      experience: experienceEntries,
      education: educationEntries,
      clients: [],
      about: ''
    }
  };
}

/**
 * Generate a hash of the content for caching
 *
 * @param content The content to hash
 * @returns A hash of the content
 */
async function generateContentHash(content: string): Promise<string> {
  // In a browser environment, we would use the Web Crypto API
  // In Node.js, we use the crypto module
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Save the analyzed content to a file for debugging
 *
 * @param content The analyzed content
 */
export async function saveAnalyzedContent(content: any): Promise<void> {
  try {
    const outputPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    await fs.writeFile(outputPath, JSON.stringify(content, null, 2));
    DanteLogger.success.basic('Analyzed content saved to file');
  } catch (error) {
    DanteLogger.error.dataFlow('Error saving analyzed content', { error });
  }
}
