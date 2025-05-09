/**
 * S3 Cover Letter Generator Module
 *
 * This module generates personalized cover letters based on the analyzed resume content,
 * using OpenAI to create authentic, humanistic content rather than templates.
 * It's the third step in the PDF processing pipeline, after extraction and analysis.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing the resume and reconstructing it as a cover letter
 * - Hesse: Finding connections between the resume content and potential employers
 * - Salinger: Ensuring authentic representation by rejecting templates
 * - Dante: Continuing the journey of content transformation
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { S3StorageManager } = require('./s3StorageManager.js');
require('dotenv').config();

// Create simple console loggers
const DanteLogger = {
  success: {
    basic: (message) => console.log(`😇☀️: ${message}`),
    core: (message) => console.log(`😇🌟: ${message}`),
    perfection: (message) => console.log(`😇🌈: ${message}`)
  },
  error: {
    system: (message, error) => console.error(`👑💢: ${message}${error ? ': ' + error : ''}`),
    dataFlow: (message) => console.error(`⚠️⚡: ${message}`),
    validation: (message) => console.error(`⚠️🔥: ${message}`)
  },
  warn: {
    deprecated: (message) => console.warn(`⚠️🌊: ${message}`),
    performance: (message) => console.warn(`⚠️⏱️: ${message}`),
    security: (message) => console.warn(`⚠️🔒: ${message}`)
  }
};

const HesseLogger = {
  summary: {
    start: (message) => console.log(`🔍 [Hesse:Summary:Start] ${message}`),
    progress: (message) => console.log(`⏳ [Hesse:Summary:Progress] ${message}`),
    complete: (message) => console.log(`✅ [Hesse:Summary:Complete] ${message}`),
    error: (message) => console.error(`❌ [Hesse:Summary:Error] ${message}`)
  }
};

/**
 * S3 Cover Letter Generator class
 */
class S3CoverLetterGenerator {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      forceOverwrite: options.forceOverwrite || false,
      openaiModel: options.openaiModel || 'gpt-4-turbo',
      ...options
    };

    // Get the S3 Storage Manager instance
    this.s3Manager = S3StorageManager.getInstance();

    // Initialize OpenAI
    if (!process.env.OPENAI_API_KEY) {
      DanteLogger.error.system('OpenAI API key not found. Set OPENAI_API_KEY environment variable.');
      throw new Error('OpenAI API key not found. Set OPENAI_API_KEY environment variable.');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate a cover letter based on the analyzed resume content
   * @param {string} contentFingerprint - Content fingerprint from extraction
   * @param {Object} coverLetterParams - Parameters for the cover letter (company, position, etc.)
   * @param {boolean} forceRefresh - Whether to force refresh the cover letter
   * @returns {Promise<Object>} - Cover letter generation result
   */
  async generateCoverLetter(contentFingerprint, coverLetterParams = {}, forceRefresh = false) {
    try {
      HesseLogger.summary.start(`Generating cover letter for content: ${contentFingerprint.substring(0, 8)}`);
      DanteLogger.success.basic(`Starting cover letter generation for content: ${contentFingerprint.substring(0, 8)}`);

      // Set default cover letter parameters
      const params = {
        company: coverLetterParams.company || 'the company',
        position: coverLetterParams.position || 'the position',
        hiringManager: coverLetterParams.hiringManager || 'Hiring Manager',
        companyDetails: coverLetterParams.companyDetails || '',
        positionDetails: coverLetterParams.positionDetails || '',
        ...coverLetterParams
      };

      // Define S3 keys for the analyzed content and cover letter
      const analysisJsonS3Key = this.s3Manager.getAnalyzedContentS3Key(contentFingerprint, 'resume_analysis.json');
      const coverLetterMarkdownS3Key = this.s3Manager.getCoverLetterS3Key(contentFingerprint, 'cover_letter.md');
      const coverLetterHtmlS3Key = this.s3Manager.getCoverLetterS3Key(contentFingerprint, 'cover_letter.html');
      const promptResponseS3Key = this.s3Manager.getCoverLetterS3Key(contentFingerprint, 'openai_prompt_response.json');

      // Check if this is a generic request
      const isGenericRequest = params && params.generic === true;

      // Always force regeneration for generic requests
      const shouldForceRefresh = forceRefresh || isGenericRequest || this.options.forceOverwrite;

      // Log the regeneration decision
      if (isGenericRequest) {
        HesseLogger.summary.progress('Generic cover letter requested, forcing regeneration');
        DanteLogger.success.basic('Generic cover letter requested, forcing regeneration');
      } else if (forceRefresh) {
        HesseLogger.summary.progress('Force refresh requested, regenerating cover letter');
        DanteLogger.success.basic('Force refresh requested, regenerating cover letter');
      }

      // Check if cover letter already exists and force refresh is not enabled
      if (!shouldForceRefresh) {
        const existsResult = await this.s3Manager.fileExists(coverLetterMarkdownS3Key);

        if (existsResult.success && existsResult.exists) {
          HesseLogger.summary.progress('Cover letter already exists in S3, using existing cover letter');
          DanteLogger.success.core('Cover letter already exists in S3, using existing cover letter');

          // Download the existing cover letter
          const downloadResult = await this.s3Manager.downloadText(coverLetterMarkdownS3Key);

          if (downloadResult.success && downloadResult.content) {
            return {
              success: true,
              coverLetter: downloadResult.content,
              contentFingerprint,
              s3Key: coverLetterMarkdownS3Key,
              cached: true,
              metadata: downloadResult.metadata
            };
          }
        }
      }

      // Try to download the analyzed content from S3
      HesseLogger.summary.progress(`Downloading analyzed content from S3: ${analysisJsonS3Key}`);
      DanteLogger.success.basic(`Downloading analyzed content from S3: ${analysisJsonS3Key}`);

      const analysisResult = await this.s3Manager.downloadText(analysisJsonS3Key);
      let analysis;

      if (analysisResult.success && analysisResult.content) {
        // Successfully downloaded from S3
        analysis = JSON.parse(analysisResult.content);
      } else {
        // If S3 download fails, try to read from local file
        HesseLogger.summary.progress('Failed to download from S3, trying local file');
        DanteLogger.warn.deprecated('Failed to download from S3, trying local file');

        // Try to find the file in the public/extracted directory
        const fs = require('fs');
        const path = require('path');
        const publicDir = path.join(process.cwd(), 'public');

        // First try the exact path from S3
        const localAnalysisPathExact = path.join(publicDir, analysisJsonS3Key);

        // Then try the extracted directory
        const localAnalysisPath = fs.existsSync(localAnalysisPathExact)
          ? localAnalysisPathExact
          : path.join(publicDir, 'extracted', 'resume_analysis.json');

        if (fs.existsSync(localAnalysisPath)) {
          HesseLogger.summary.progress(`Using local analysis file: ${localAnalysisPath}`);
          DanteLogger.success.basic(`Using local analysis file: ${localAnalysisPath}`);

          try {
            const localAnalysisContent = fs.readFileSync(localAnalysisPath, 'utf8');
            analysis = JSON.parse(localAnalysisContent);
          } catch (readError) {
            throw new Error(`Failed to read local analysis file: ${readError.message}`);
          }
        } else {
          throw new Error(`Failed to download analyzed content from S3 and local file not found: ${localAnalysisPath}`);
        }
      }

      // Create the OpenAI prompt
      const systemPrompt = this.createSystemPrompt(params.generic || false);
      const userPrompt = this.createUserPrompt(analysis, params);

      // Log the prompts
      if (this.options.debug) {
        HesseLogger.summary.progress('System Prompt:');
        console.log(systemPrompt);
        HesseLogger.summary.progress('User Prompt:');
        console.log(userPrompt);
      }

      // Call OpenAI API
      HesseLogger.summary.progress(`Calling OpenAI API with model: ${this.options.openaiModel}`);
      DanteLogger.success.basic(`Calling OpenAI API with model: ${this.options.openaiModel}`);

      const response = await this.openai.chat.completions.create({
        model: this.options.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      // Extract the response content
      let coverLetterMarkdown = response.choices[0].message.content;

      // If this is a generic request, validate that the content is truly generic
      if (params.generic) {
        // Check if the content appears to be generic
        const isGenericContent = this.isGenericCoverLetter(coverLetterMarkdown);

        if (!isGenericContent) {
          HesseLogger.summary.progress('Generated content is not generic, fixing salutation and specific references');
          DanteLogger.warn.deprecated('Generated content is not generic, fixing salutation and specific references');

          // Fix the salutation to ensure it's generic
          coverLetterMarkdown = coverLetterMarkdown.replace(
            /Dear (Dr\.|Mr\.|Mrs\.|Ms\.|Professor|Prof\.|Sir|Madam) [A-Z][a-z]+,/g,
            'Dear Hiring Manager,'
          );

          // Remove specific company references
          coverLetterMarkdown = coverLetterMarkdown.replace(
            /at ([A-Z][A-Za-z0-9\s&]+(Inc\.|LLC|Corp\.|Corporation|Company|Technologies|Solutions|Systems))/g,
            'at an organization'
          );

          // Remove specific position references
          coverLetterMarkdown = coverLetterMarkdown.replace(
            /(the|your) ([A-Z][A-Za-z0-9\s&]+) position/g,
            'a position'
          );

          // Log the fixed content
          HesseLogger.summary.progress('Content fixed to be more generic');
          DanteLogger.success.basic('Content fixed to be more generic');
        }
      }

      // Save the prompt and response for reference
      const promptResponse = {
        systemPrompt,
        userPrompt,
        rawResponse: coverLetterMarkdown,
        model: this.options.openaiModel,
        timestamp: new Date().toISOString(),
        params
      };

      // Upload the prompt and response to S3
      HesseLogger.summary.progress(`Uploading prompt and response to S3: ${promptResponseS3Key}`);
      DanteLogger.success.basic(`Uploading prompt and response to S3: ${promptResponseS3Key}`);

      const promptResponseUploadResult = await this.s3Manager.uploadJson(
        promptResponse,
        promptResponseS3Key,
        { contentFingerprint }
      );

      if (!promptResponseUploadResult.success) {
        throw new Error(`Failed to upload prompt and response to S3: ${promptResponseUploadResult.message}`);
      }

      // Upload the cover letter markdown to S3
      HesseLogger.summary.progress(`Uploading cover letter markdown to S3: ${coverLetterMarkdownS3Key}`);
      DanteLogger.success.basic(`Uploading cover letter markdown to S3: ${coverLetterMarkdownS3Key}`);

      const markdownUploadResult = await this.s3Manager.uploadMarkdown(
        coverLetterMarkdown,
        coverLetterMarkdownS3Key,
        { contentFingerprint, params }
      );

      if (!markdownUploadResult.success) {
        throw new Error(`Failed to upload cover letter markdown to S3: ${markdownUploadResult.message}`);
      }

      // Generate HTML version of the cover letter
      const coverLetterHtml = this.generateHtmlCoverLetter(coverLetterMarkdown, analysis.name);

      // Upload the cover letter HTML to S3
      HesseLogger.summary.progress(`Uploading cover letter HTML to S3: ${coverLetterHtmlS3Key}`);
      DanteLogger.success.basic(`Uploading cover letter HTML to S3: ${coverLetterHtmlS3Key}`);

      const htmlUploadResult = await this.s3Manager.uploadHtml(
        coverLetterHtml,
        coverLetterHtmlS3Key,
        { contentFingerprint, params }
      );

      if (!htmlUploadResult.success) {
        throw new Error(`Failed to upload cover letter HTML to S3: ${htmlUploadResult.message}`);
      }

      HesseLogger.summary.complete('Cover letter generation and S3 upload completed successfully');
      DanteLogger.success.perfection('Cover letter generation and S3 upload completed successfully');

      return {
        success: true,
        coverLetter: coverLetterMarkdown,
        coverLetterHtml,
        contentFingerprint,
        s3Key: coverLetterMarkdownS3Key,
        htmlS3Key: coverLetterHtmlS3Key,
        promptResponseS3Key,
        cached: false
      };
    } catch (error) {
      HesseLogger.summary.error(`Error generating cover letter: ${error.message}`);
      DanteLogger.error.system('Error generating cover letter', error);

      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * Create the system prompt for OpenAI
   * @param {boolean} isGeneric - Whether to create a generic system prompt
   * @returns {string} - System prompt
   */
  createSystemPrompt(isGeneric = false) {
    if (isGeneric) {
      return `You are an expert cover letter writer with a humanistic approach following the Salinger philosophy of simplicity and authenticity. Your task is to create a universal, adaptable cover letter based on the resume information provided that can be used for multiple job applications.

IMPORTANT: This MUST be a generic cover letter with NO specific names, companies, or positions mentioned.

Follow these guidelines:
1. Write in a professional but conversational tone that reflects the applicant's personality
2. Highlight transferable skills and experiences from the resume that would be valuable in most professional settings
3. NEVER include specific company names, position titles, or hiring manager names
4. Be concise but comprehensive, aiming for 3-4 paragraphs
5. Format the cover letter in clean markdown
6. ALWAYS use "Dear Hiring Manager" as the salutation - NEVER use a specific name or title
7. Make the content feel authentic while remaining adaptable to different opportunities
8. Use phrases like "any organization," "various settings," or "a team" instead of specific references
9. Maintain a confident but not arrogant tone
10. Focus on universal skills and experiences that would apply to many different roles

The cover letter should have this general structure:
- Salutation (MUST be "Dear Hiring Manager" - no exceptions)
- Opening paragraph (introduction and general statement of interest in new opportunities)
- 1-2 body paragraphs (highlighting relevant experience and transferable skills)
- Closing paragraph (expressing interest in discussing opportunities further)
- Professional closing ("Sincerely," followed by the applicant's name)

Return ONLY the cover letter in markdown format without any additional text or explanation.`;
    } else {
      return `You are an expert cover letter writer with a humanistic approach. Your task is to create a personalized, authentic cover letter based on the resume information provided.

Follow these guidelines:
1. Write in a professional but conversational tone that reflects the applicant's personality
2. Highlight relevant skills and experiences from the resume that match the position
3. Avoid generic templates and clichés
4. Be concise but comprehensive, aiming for 3-4 paragraphs
5. Format the cover letter in clean markdown
6. Include a proper salutation and closing
7. Make the content feel personal and tailored to the specific company and position
8. Emphasize how the applicant's unique background and skills would benefit the company
9. Maintain a confident but not arrogant tone

The cover letter should have this general structure:
- Salutation (addressed to the hiring manager if provided, otherwise "Dear Hiring Manager")
- Opening paragraph (introduction and statement of interest)
- 1-2 body paragraphs (highlighting relevant experience and skills)
- Closing paragraph (expressing interest in an interview)
- Professional closing ("Sincerely," followed by the applicant's name)

Return ONLY the cover letter in markdown format without any additional text or explanation.`;
    }
  }

  /**
   * Create the user prompt for OpenAI
   * @param {Object} analysis - Analyzed resume content
   * @param {Object} params - Cover letter parameters
   * @returns {string} - User prompt
   */
  createUserPrompt(analysis, params) {
    // Extract key information from the analysis
    const { name, summary, skills, experience, education } = analysis;

    // Format experience highlights
    const experienceHighlights = experience && experience.length > 0
      ? experience.slice(0, 2).map(job =>
        `- ${job.title} at ${job.company} (${job.dates}): ${job.responsibilities ? job.responsibilities[0] : ''}`)
        .join('\n')
      : 'No experience provided';

    // Format education highlights
    const educationHighlights = education && education.length > 0
      ? education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.dates || 'dates not specified'})`)
        .join('\n')
      : 'No education provided';

    // Format skills
    const skillsList = skills && skills.length > 0
      ? skills.join(', ')
      : 'No skills provided';

    // Create a generic or specific prompt based on the params
    if (params.generic) {
      return `Please write a universal, adaptable cover letter for ${name} that can be used for multiple job applications.

IMPORTANT: This MUST be a generic cover letter with NO specific names, companies, or positions mentioned.

Resume Summary:
${summary || 'No summary provided'}

Key Skills:
${skillsList}

Experience Highlights:
${experienceHighlights}

Education:
${educationHighlights}

The cover letter MUST:
1. Be addressed ONLY to "Dear Hiring Manager" - never use a specific name
2. Avoid mentioning any specific company names or position titles
3. Focus on transferable skills that apply to many different roles
4. Use phrases like "any organization," "various settings," or "a team" instead of specific references
5. Be generic enough to be used for various positions while still highlighting the candidate's unique qualifications

Remember: This is a universal cover letter that should work for ANY job application without modification.`;
    } else {
      return `Please write a personalized cover letter for ${name} applying for the position of "${params.position}" at "${params.company}".

Resume Summary:
${summary || 'No summary provided'}

Key Skills:
${skillsList}

Experience Highlights:
${experienceHighlights}

Education:
${educationHighlights}

Additional Information about the company:
${params.companyDetails || 'No additional company information provided'}

Additional Information about the position:
${params.positionDetails || 'No additional position information provided'}

The cover letter should be addressed to: ${params.hiringManager || 'Hiring Manager'}`;
    }
  }

  /**
   * Check if a cover letter appears to be generic
   * @param {string} content - The cover letter content to check
   * @returns {boolean} - Whether the content appears to be generic
   */
  isGenericCoverLetter(content) {
    if (!content) return false;

    // Check for specific names or titles that would indicate a non-generic letter
    const specificNameRegex = /Dear (Dr\.|Mr\.|Mrs\.|Ms\.|Professor|Prof\.|Sir|Madam) [A-Z][a-z]+/;
    if (specificNameRegex.test(content)) {
      HesseLogger.summary.progress('Detected specific name in salutation');
      DanteLogger.warn.deprecated('Detected specific name in salutation');
      return false;
    }

    // Check for specific company names (excluding generic terms)
    const specificCompanyRegex = /at ([A-Z][A-Za-z0-9\s&]+(Inc\.|LLC|Corp\.|Corporation|Company|Technologies|Solutions|Systems))/;
    if (specificCompanyRegex.test(content)) {
      HesseLogger.summary.progress('Detected specific company name');
      DanteLogger.warn.deprecated('Detected specific company name');
      return false;
    }

    // Check for specific phrases that indicate a generic cover letter
    const genericPhrases = [
      'Dear Hiring Manager',
      'To Whom It May Concern',
      'Prospective Employer',
      'future opportunities',
      'various positions',
      'multiple job applications',
      'any organization',
      'transferable skills',
      'exploring career opportunities',
      'seeking expertise in this field',
      'various settings',
      'any team',
      'an organization seeking'
    ];

    // Check for specific phrases that indicate a specific cover letter
    const specificPhrases = [
      'specific role',
      'your company',
      'your organization',
      'your team',
      'this position',
      'this role',
      'this opportunity',
      'at your company',
      'join your team',
      'contribute to your mission',
      'your job posting',
      'the position of',
      'the role of'
    ];

    // Count how many generic and specific phrases are present
    let genericCount = 0;
    let specificCount = 0;

    genericPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        genericCount++;
      }
    });

    specificPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        specificCount++;
      }
    });

    // Log the results for debugging
    if (this.options.debug) {
      HesseLogger.summary.progress(`Generic phrases found: ${genericCount}, Specific phrases found: ${specificCount}`);
    }

    // If there are more generic phrases than specific ones, consider it generic
    const isGeneric = genericCount > specificCount;

    if (!isGeneric) {
      HesseLogger.summary.progress('Content appears to be specific rather than generic');
      DanteLogger.warn.deprecated('Content appears to be specific rather than generic');
    }

    return isGeneric;
  }

  /**
   * Generate HTML version of the cover letter
   * @param {string} markdown - Cover letter in markdown format
   * @param {string} name - Applicant's name
   * @returns {string} - Cover letter in HTML format
   */
  generateHtmlCoverLetter(markdown, name) {
    // Simple markdown to HTML conversion for basic elements
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap in paragraphs if not already done
    if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>') && !html.startsWith('<p>')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('</p>')) {
      html = html + '</p>';
    }

    // Create the full HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cover Letter - ${name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    p {
      margin-bottom: 16px;
    }
    .header {
      margin-bottom: 30px;
    }
    .date {
      color: #7f8c8d;
      margin-bottom: 20px;
    }
    .signature {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Cover Letter</h1>
    <div class="date">${new Date().toLocaleDateString()}</div>
  </div>

  ${html}

  <div class="signature">
    <p>Generated by AlexAI</p>
  </div>
</body>
</html>`;
  }
}

module.exports = S3CoverLetterGenerator;
