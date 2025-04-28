import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { cacheService } from './cacheService';
import { stringCacheService } from './stringCacheService';
import { dynamicOpenAiCache, dynamicStringCache } from './dynamicCacheService';
import { ResumeAnalysisResponse } from '@/types/openai';
import { HesseLogger } from './HesseLogger';
import { DanteLogger } from './DanteLogger';
import { checkContentFreshness, forceRefreshContent } from './pdfContentRefresher';

// Initialize the OpenAI client with fallback for build-time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build-time',
});

// Function to check if OpenAI API key is available
function isOpenAIKeyAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Types are now imported from @/types/openai

/**
 * Analyzes resume content using OpenAI's GPT model
 * @param resumeContent The content of the resume to analyze
 * @returns Structured analysis of the resume
 */
export async function analyzeResume(resumeContent: string, forceRefresh = false): Promise<ResumeAnalysisResponse> {
  try {
    // Check if the PDF content is stale
    const { isStale } = await checkContentFreshness();

    // If the content is stale, force a refresh
    if (isStale) {
      DanteLogger.success.basic('PDF content is stale, refreshing...');
      await forceRefreshContent();
      DanteLogger.success.core('PDF content refreshed automatically');

      // Force a cache refresh since the content has changed
      forceRefresh = true;
    }

    // Check if OpenAI API key is available
    if (!isOpenAIKeyAvailable()) {
      console.log('OpenAI API key is not available, returning mock data');
      return {
        summary: "I'm a senior software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.",
        keySkills: [
          "Full Stack Development",
          "JavaScript/TypeScript",
          "React/React Native",
          "AWS",
          "UI/UX Design",
          "Creative Technology"
        ],
        yearsOfExperience: "I've been in the industry for over 15 years, continuously learning and evolving with technology",
        educationLevel: "I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving",
        careerHighlights: [
          "I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader",
          "I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard",
          "My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions"
        ],
        industryExperience: [
          "Business Solutions",
          "Communications",
          "Healthcare/Pharmaceutical",
          "Financial Services"
        ],
        recommendations: [
          "I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities",
          "I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision",
          "My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference"
        ]
      };
    }

    // Always force refresh to ensure we're using fresh content
    const alwaysForceRefresh = true;
    forceRefresh = forceRefresh || alwaysForceRefresh;

    // Check for PDF content fingerprint to ensure we're using the right PDF
    try {
      const fingerprintPath = path.join(process.cwd(), 'public', 'extracted', 'content_fingerprint.txt');
      if (fs.existsSync(fingerprintPath)) {
        const fingerprint = fs.readFileSync(fingerprintPath, 'utf8').trim();
        console.log(`🔑 Using PDF content fingerprint for analysis: ${fingerprint.substring(0, 8)}...`);
        DanteLogger.success.basic(`Using PDF content fingerprint: ${fingerprint.substring(0, 8)}...`);

        // Get PDF information for logging
        try {
          const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
          if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            console.log(`📄 PDF file being used for analysis: ${pdfPath}`);
            console.log(`📊 PDF size: ${stats.size} bytes`);
            console.log(`⏱️ PDF last modified: ${new Date(stats.mtimeMs).toISOString()}`);
          } else {
            console.log(`⚠️ PDF file not found: ${pdfPath}`);
          }
        } catch (pdfError) {
          console.error('Error checking PDF file:', pdfError);
        }

        // Force refresh of the PDF fingerprint in the dynamic cache
        console.log(`🔄 Force refreshing PDF fingerprint in dynamic cache (forceRefresh=${forceRefresh})`);
        dynamicOpenAiCache.refreshPdfFingerprint(forceRefresh);
      } else {
        console.error(`❌ Content fingerprint file not found: ${fingerprintPath}`);
        throw new Error(`Content fingerprint file not found: ${fingerprintPath}`);
      }
    } catch (error) {
      console.error('Could not read PDF content fingerprint for analysis:', error);
      DanteLogger.error.runtime(`Could not read PDF content fingerprint for analysis: ${error}`);
      throw new Error(`Could not read PDF content fingerprint for analysis: ${error}`);
    }

    // Generate a cache key based on the resume content using the dynamic cache
    const cacheKey = dynamicOpenAiCache.generateCacheKey(resumeContent);

    // Always force refresh to ensure we're using fresh content
    if (forceRefresh) {
      HesseLogger.cache.invalidate(`Force refresh requested, skipping cache for key: ${cacheKey.substring(0, 8)}...`);
      DanteLogger.success.core('Forcing fresh analysis to ensure current PDF content is used');

      // Clear the cache if force refresh is requested
      dynamicOpenAiCache.clearCache();
    } else {
      // This branch should never be reached with alwaysForceRefresh = true
      const cachedResponse = dynamicOpenAiCache.getItem(cacheKey);
      if (cachedResponse) {
        HesseLogger.cache.hit(`Using cached OpenAI response for key: ${cacheKey.substring(0, 8)}...`);
        return cachedResponse;
      }
      HesseLogger.cache.miss(`Cache miss for key: ${cacheKey.substring(0, 8)}...`);
    }
    // Define the system message to set the context for the AI
    const systemMessage = `
      You are an expert resume analyzer with deep knowledge of the tech industry, particularly software development and design.

      Your task is to extract key information from the resume and provide a structured analysis that captures the essence of the candidate's experience, skills, and career trajectory.

      Your analysis should be written in first person, as if the resume owner is speaking directly to the reader.
      Use a conversational, natural tone following J.D. Salinger's writing style - authentic, direct, and slightly introspective.

      Focus on these aspects:
      1. Technical skills and expertise (programming languages, frameworks, tools)
      2. Creative abilities (design, UI/UX, illustration)
      3. Professional experience and accomplishments
      4. Educational background
      5. Industries worked in
      6. Career aspirations and strengths

      IMPORTANT: Your response must be a valid JSON object with EXACTLY these fields and no others:
      - summary: A string with a first-person summary that captures the essence of the candidate's professional identity (100-150 words)
      - keySkills: An array of strings listing 6-8 core technical and creative skills
      - yearsOfExperience: A string describing experience in first person, including total years and key roles
      - educationLevel: A string describing education in first person, including degrees and institutions
      - careerHighlights: An array of 3-4 strings with career highlights in first person, focusing on major accomplishments
      - industryExperience: An array of strings listing industries the candidate has worked in
      - recommendations: An array of 3 strings with career goals/recommendations in first person, reflecting the candidate's aspirations

      Do not include any additional fields or metadata in your response.
      Ensure all text is properly formatted and free of markdown or special characters.
    `;

    // Define the user message with the resume content
    const userMessage = `
      Analyze this resume content and provide a structured analysis in JSON format.

      Pay special attention to:
      - The candidate's blend of technical and creative skills
      - Their experience with React, AWS, and enterprise applications
      - Their work across different industries (like Cox Communications, Bayer, etc.)
      - Their educational background in both design and philosophy
      - Their career progression and leadership roles

      Remember to write in first person as if the candidate is speaking, using J.D. Salinger's conversational style.
      Focus on creating a narrative that shows the candidate's unique blend of technical expertise and creative abilities.

      For the recommendations section, suggest career directions that would leverage both their technical and creative strengths.

      Resume content:
      ${resumeContent}
    `;

    // Expected response format is defined in the system message

    // Log the OpenAI request
    console.log(`🤖 Sending request to OpenAI for resume analysis`);
    console.log(`📝 Resume content length: ${resumeContent.length} characters`);
    console.log(`📝 Resume content preview: "${resumeContent.substring(0, 100)}..."`);
    HesseLogger.openai.request(`Sending request to OpenAI for resume analysis (${resumeContent.length} chars)`);

    // Start timing the request
    const apiStartTime = Date.now();

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4, // Balanced temperature for creativity while maintaining consistency
      response_format: { type: "json_object" },
      max_tokens: 1500, // Ensure we have enough tokens for a detailed response
      top_p: 0.95, // Slightly more diverse responses
      presence_penalty: 0.1, // Slight penalty for repetition
      frequency_penalty: 0.1, // Slight penalty for frequent tokens,
    });

    // Calculate response time
    const apiEndTime = Date.now();
    const apiResponseTime = apiEndTime - apiStartTime;

    // Log the OpenAI response time
    HesseLogger.openai.response(`Received response from OpenAI in ${apiResponseTime}ms`);

    // Log token usage if available
    if (response.usage) {
      HesseLogger.openai.tokens(
        `Token usage: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`
      );
    }

    // Parse the response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      HesseLogger.openai.error("No content in the OpenAI response");
      throw new Error("No content in the OpenAI response");
    }

    console.log('Raw OpenAI response content:', content);
    HesseLogger.summary.progress("Received raw content from OpenAI, parsing...");

    // Parse the JSON response
    try {
      const analysis = JSON.parse(content) as ResumeAnalysisResponse;

      // Validate the response structure
      if (!analysis.summary || !analysis.keySkills || !analysis.yearsOfExperience) {
        console.error('Invalid response structure:', analysis);
        throw new Error('Invalid response structure from OpenAI');
      }

      // Perform additional validation
      const validationIssues: string[] = [];

      if (analysis.summary.length < 50) validationIssues.push('Summary too short');
      if (analysis.keySkills.length < 3) validationIssues.push('Too few skills');
      if (analysis.careerHighlights.length < 2) validationIssues.push('Too few career highlights');
      if (analysis.recommendations.length < 2) validationIssues.push('Too few recommendations');

      // Check for non-first-person language
      const thirdPersonPatterns = [
        /\bhe\b/i, /\bshe\b/i, /\bhis\b/i, /\bher\b/i,
        /\bthe candidate\b/i, /\bthe applicant\b/i,
        /\bthey have\b/i, /\bthey are\b/i
      ];

      const hasThirdPerson = thirdPersonPatterns.some(pattern =>
        pattern.test(analysis.summary) ||
        pattern.test(analysis.yearsOfExperience) ||
        pattern.test(analysis.educationLevel) ||
        analysis.careerHighlights.some(h => pattern.test(h)) ||
        analysis.recommendations.some(r => pattern.test(r))
      );

      if (hasThirdPerson) validationIssues.push('Contains third-person language');

      if (validationIssues.length > 0) {
        console.warn('Response validation issues:', validationIssues);
      }

      // Log the parsed analysis
      console.log('Parsed analysis:', {
        summary: analysis.summary.substring(0, 75) + '...',
        keySkills: `${analysis.keySkills.length} skills: ${analysis.keySkills.join(', ')}`,
        yearsOfExperience: analysis.yearsOfExperience.substring(0, 50) + '...',
        educationLevel: analysis.educationLevel.substring(0, 50) + '...',
        careerHighlights: `${analysis.careerHighlights.length} highlights`,
        industryExperience: analysis.industryExperience.join(', '),
        recommendations: `${analysis.recommendations.length} recommendations`
      });

      // Store the response in the dynamic cache
      dynamicOpenAiCache.setItem(cacheKey, analysis);
      HesseLogger.cache.update(`Stored item with key: ${cacheKey.substring(0, 8)}...`);
      DanteLogger.success.core(`Cached analysis with PDF fingerprint`);

      // Log success
      HesseLogger.summary.complete(`Successfully generated and parsed summary`);

      return analysis;
    } catch (error) {
      const parseError = error as Error;
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content that failed to parse:', content);
      HesseLogger.openai.error(`Failed to parse OpenAI response: ${parseError.message || 'Unknown error'}`);
      HesseLogger.summary.error(`JSON parsing error: ${parseError.message}`);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`❌ Error analyzing resume with OpenAI:`, error);
    console.error(`📄 PDF file: ${path.join(process.cwd(), 'public', 'default_resume.pdf')}`);
    console.error(`📝 Resume content length: ${resumeContent.length} characters`);
    console.error(`📝 Resume content preview: "${resumeContent.substring(0, 100)}..."`);

    HesseLogger.openai.error(`Error analyzing resume with OpenAI: ${error instanceof Error ? error.message : String(error)}`);
    HesseLogger.summary.error(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);

    // Create a detailed error message
    const errorMessage = `Failed to analyze resume with OpenAI: ${error instanceof Error ? error.message : String(error)}`;

    // Throw a more detailed error
    throw new Error(errorMessage);
  }
}

/**
 * Create a hash from a string
 * @param str The string to hash
 * @returns A hash of the string
 */
async function createHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Format resume content into a well-structured summary using OpenAI
 *
 * @param resumeContent The raw resume content to format
 * @param forceRefresh Whether to force a refresh of the cached response
 * @returns A formatted markdown summary
 */
export async function formatSummaryContent(
  resumeContent: string,
  forceRefresh: boolean = false
): Promise<string> {
  try {
    // Check if the PDF content is stale
    const { isStale } = await checkContentFreshness();

    // If the content is stale, force a refresh
    if (isStale) {
      DanteLogger.success.basic('PDF content is stale, refreshing...');
      await forceRefreshContent();
      DanteLogger.success.core('PDF content refreshed automatically');

      // Force a cache refresh since the content has changed
      forceRefresh = true;
    }

    // Always force refresh to ensure we're using fresh content
    const alwaysForceRefresh = true;
    forceRefresh = forceRefresh || alwaysForceRefresh;

    // Check for PDF content fingerprint to ensure we're using the right PDF
    try {
      const fingerprintPath = path.join(process.cwd(), 'public', 'extracted', 'content_fingerprint.txt');
      if (fs.existsSync(fingerprintPath)) {
        const fingerprint = fs.readFileSync(fingerprintPath, 'utf8').trim();
        console.log(`🔑 Using PDF content fingerprint for summary: ${fingerprint.substring(0, 8)}...`);
        DanteLogger.success.basic(`Using PDF content fingerprint for summary: ${fingerprint.substring(0, 8)}...`);

        // Get PDF information for logging
        try {
          const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
          if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            console.log(`📄 PDF file being used for summary: ${pdfPath}`);
            console.log(`📊 PDF size: ${stats.size} bytes`);
            console.log(`⏱️ PDF last modified: ${new Date(stats.mtimeMs).toISOString()}`);
          } else {
            console.log(`⚠️ PDF file not found: ${pdfPath}`);
          }
        } catch (pdfError) {
          console.error('Error checking PDF file:', pdfError);
        }

        // Force refresh of the PDF fingerprint in the dynamic cache
        console.log(`🔄 Force refreshing PDF fingerprint in dynamic cache (forceRefresh=${forceRefresh})`);
        dynamicStringCache.refreshPdfFingerprint(forceRefresh);
      } else {
        console.error(`❌ Content fingerprint file not found: ${fingerprintPath}`);
        throw new Error(`Content fingerprint file not found: ${fingerprintPath}`);
      }
    } catch (error) {
      console.error('Could not read PDF content fingerprint for summary:', error);
      DanteLogger.error.runtime(`Could not read PDF content fingerprint for summary: ${error}`);
      throw new Error(`Could not read PDF content fingerprint for summary: ${error}`);
    }

    // Generate a cache key based on the content using the dynamic cache
    const cacheKey = dynamicStringCache.generateCacheKey(resumeContent);

    // Always force refresh to ensure we're using fresh content
    if (forceRefresh) {
      HesseLogger.cache.invalidate(`Force refresh requested, skipping cache for formatted summary key: ${cacheKey.substring(0, 8)}...`);
      DanteLogger.success.core('Forcing fresh summary to ensure current PDF content is used');

      // Clear the cache if force refresh is requested
      dynamicStringCache.clearCache();
    } else {
      // This branch should never be reached with alwaysForceRefresh = true
      const cachedResponse = dynamicStringCache.getItem(cacheKey);
      if (cachedResponse) {
        HesseLogger.cache.hit(`Using cached formatted summary for key: ${cacheKey.substring(0, 8)}...`);
        return cachedResponse;
      }
      HesseLogger.cache.miss(`Cache miss for formatted summary key: ${cacheKey.substring(0, 8)}...`);
    }

    // Read the prompt template
    const promptPath = path.join(process.cwd(), 'prompts/summary_format_prompt.txt');
    let promptTemplate = '';

    try {
      if (fs.existsSync(promptPath)) {
        promptTemplate = fs.readFileSync(promptPath, 'utf8');
      } else {
        // Fallback prompt if file doesn't exist
        promptTemplate = `Format the following resume content into a well-structured markdown document following these guidelines:

1. Use a first-person narrative style throughout
2. Create clear section headers with ## for main sections
3. Use bullet points for lists of skills, experiences, etc.
4. Maintain the personal tone and professional focus
5. Organize content into these sections in this order:
   - Professional Summary (introduction paragraph)
   - Key Skills (bullet list)
   - Experience (brief overview with years)
   - Education (brief description)
   - Career Highlights (bullet list)
   - Industry Experience (bullet list)
   - Recommendations (what I'm looking for - bullet list)

Here's the raw content to format:

{content}

Format the content as a complete markdown document with the title "# P. Brady Georgen - Summary" at the top. Ensure all sections are properly formatted with appropriate headers, bullet points, and paragraph breaks.`;
      }
    } catch (error) {
      HesseLogger.ai.error(`Error reading prompt template: ${error}`);
      throw new Error(`Failed to read prompt template: ${error}`);
    }

    // Replace {content} placeholder with actual content if needed
    const prompt = promptTemplate.includes('{content}')
      ? promptTemplate.replace('{content}', resumeContent)
      : promptTemplate;

    // Log the OpenAI request
    console.log(`🤖 Sending request to OpenAI for summary formatting`);
    console.log(`📝 Resume content length: ${resumeContent.length} characters`);
    console.log(`📝 Resume content preview: "${resumeContent.substring(0, 100)}..."`);
    HesseLogger.openai.request('Sending request to OpenAI for summary formatting');

    // Start timing the request
    const apiStartTime = Date.now();

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional cover letter writer that creates well-structured, compelling cover letters in markdown format. You follow the Salinger philosophy of writing: direct, personal, and authentic. Your cover letters are concise, focused, and highlight the unique value proposition of the candidate. You MUST create content that fits on a SINGLE 8.5x11\" page when converted to PDF. This means being extremely concise and prioritizing only the most important information. Follow the instructions exactly and only return the formatted markdown."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.4, // Slightly higher temperature for more natural writing style
      max_tokens: 1200, // Reduced token limit to ensure concise content
    });

    // Calculate response time
    const apiEndTime = Date.now();
    const apiResponseTime = apiEndTime - apiStartTime;

    // Log the OpenAI response time
    HesseLogger.openai.response(`Received response from OpenAI in ${apiResponseTime}ms`);

    // Log token usage if available
    if (response.usage) {
      HesseLogger.openai.tokens(
        `Token usage: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`
      );
    }

    // Parse the response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      HesseLogger.openai.error("No content in the OpenAI response");
      throw new Error("No content in the OpenAI response");
    }

    // Store the response in the dynamic string cache
    dynamicStringCache.setItem(cacheKey, content);
    HesseLogger.cache.update(`Stored formatted summary with key: ${cacheKey.substring(0, 8)}...`);
    DanteLogger.success.core(`Cached formatted summary with PDF fingerprint`);

    // Log success
    HesseLogger.summary.complete(`Successfully formatted summary`);

    return content;
  } catch (error) {
    console.error(`❌ Error formatting summary with OpenAI:`, error);
    console.error(`📄 PDF file: ${path.join(process.cwd(), 'public', 'default_resume.pdf')}`);
    console.error(`📝 Resume content length: ${resumeContent.length} characters`);
    console.error(`📝 Resume content preview: "${resumeContent.substring(0, 100)}..."`);

    HesseLogger.openai.error(`Error formatting summary with OpenAI: ${error instanceof Error ? error.message : String(error)}`);
    HesseLogger.summary.error(`Formatting failed: ${error instanceof Error ? error.message : String(error)}`);

    // Create a detailed error message
    const errorMessage = `Failed to format summary with OpenAI: ${error instanceof Error ? error.message : String(error)}`;

    // Throw a more detailed error
    throw new Error(errorMessage);
  }
}

export default {
  analyzeResume,
  formatSummaryContent
};