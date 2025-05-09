/**
 * S3 OpenAI Analyzer Module
 *
 * This module handles the analysis of extracted PDF content using OpenAI,
 * storing the results in S3 as the single source of truth.
 * It's the second step in the PDF processing pipeline, after extraction.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing the raw text and reconstructing it with meaning
 * - Hesse: Finding patterns and connections in the content
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
 * S3 OpenAI Analyzer class
 */
class S3OpenAIAnalyzer {
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
   * Analyze extracted text using OpenAI and store results in S3
   * @param {string} contentFingerprint - Content fingerprint from extraction
   * @param {boolean} forceRefresh - Whether to force refresh the analysis
   * @returns {Promise<Object>} - Analysis result
   */
  async analyzeExtractedText(contentFingerprint, forceRefresh = false) {
    try {
      HesseLogger.summary.start(`Analyzing extracted text with OpenAI for content: ${contentFingerprint.substring(0, 8)}`);
      DanteLogger.success.basic(`Starting OpenAI analysis for content: ${contentFingerprint.substring(0, 8)}`);

      // Define S3 keys for the extracted text and analysis results
      const extractedTextS3Key = this.s3Manager.getExtractedContentS3Key(contentFingerprint, 'extracted_raw_text.txt');
      const analysisJsonS3Key = this.s3Manager.getAnalyzedContentS3Key(contentFingerprint, 'resume_analysis.json');
      const analysisMarkdownS3Key = this.s3Manager.getAnalyzedContentS3Key(contentFingerprint, 'resume_formatted.md');
      const promptResponseS3Key = this.s3Manager.getAnalyzedContentS3Key(contentFingerprint, 'openai_prompt_response.json');

      // Check if analysis already exists and force refresh is not enabled
      if (!forceRefresh && !this.options.forceOverwrite) {
        const existsResult = await this.s3Manager.fileExists(analysisJsonS3Key);

        if (existsResult.success && existsResult.exists) {
          HesseLogger.summary.progress('Analysis already exists in S3, using existing analysis');
          DanteLogger.success.core('Analysis already exists in S3, using existing analysis');

          // Download the existing analysis
          const downloadResult = await this.s3Manager.downloadText(analysisJsonS3Key);

          if (downloadResult.success && downloadResult.content) {
            return {
              success: true,
              analysis: JSON.parse(downloadResult.content),
              contentFingerprint,
              s3Key: analysisJsonS3Key,
              cached: true,
              metadata: downloadResult.metadata
            };
          }
        }
      }

      // Download the extracted text
      HesseLogger.summary.progress(`Downloading extracted text from S3: ${extractedTextS3Key}`);
      DanteLogger.success.basic(`Downloading extracted text from S3: ${extractedTextS3Key}`);

      const extractedTextResult = await this.s3Manager.downloadText(extractedTextS3Key);

      if (!extractedTextResult.success || !extractedTextResult.content) {
        throw new Error(`Failed to download extracted text from S3: ${extractedTextResult.message}`);
      }

      const extractedText = extractedTextResult.content;

      // Create the OpenAI prompt
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(extractedText);

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
        temperature: 0.2,
        max_tokens: 4000
      });

      // Extract the response content
      const responseContent = response.choices[0].message.content;

      // Parse the JSON response
      let parsedResponse;
      try {
        // The response should be JSON, but it might be wrapped in markdown code blocks
        const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) ||
          responseContent.match(/```\n([\s\S]*?)\n```/) ||
          [null, responseContent];

        const jsonContent = jsonMatch[1] || responseContent;
        parsedResponse = JSON.parse(jsonContent);
      } catch (parseError) {
        HesseLogger.summary.error(`Failed to parse OpenAI response as JSON: ${parseError.message}`);
        DanteLogger.error.dataFlow(`Failed to parse OpenAI response as JSON: ${parseError.message}`);

        // If we can't parse as JSON, use the raw response
        parsedResponse = {
          error: 'Failed to parse response as JSON',
          rawResponse: responseContent
        };
      }

      // Save the prompt and response for reference
      const promptResponse = {
        systemPrompt,
        userPrompt,
        rawResponse: responseContent,
        parsedResponse,
        model: this.options.openaiModel,
        timestamp: new Date().toISOString()
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

      // Upload the analysis to S3
      HesseLogger.summary.progress(`Uploading analysis to S3: ${analysisJsonS3Key}`);
      DanteLogger.success.basic(`Uploading analysis to S3: ${analysisJsonS3Key}`);

      const analysisUploadResult = await this.s3Manager.uploadJson(
        parsedResponse,
        analysisJsonS3Key,
        { contentFingerprint }
      );

      if (!analysisUploadResult.success) {
        throw new Error(`Failed to upload analysis to S3: ${analysisUploadResult.message}`);
      }

      // Generate a formatted markdown version of the resume
      const formattedMarkdown = this.generateFormattedMarkdown(parsedResponse);

      // Upload the formatted markdown to S3
      HesseLogger.summary.progress(`Uploading formatted markdown to S3: ${analysisMarkdownS3Key}`);
      DanteLogger.success.basic(`Uploading formatted markdown to S3: ${analysisMarkdownS3Key}`);

      const markdownUploadResult = await this.s3Manager.uploadMarkdown(
        formattedMarkdown,
        analysisMarkdownS3Key,
        { contentFingerprint }
      );

      if (!markdownUploadResult.success) {
        throw new Error(`Failed to upload formatted markdown to S3: ${markdownUploadResult.message}`);
      }

      HesseLogger.summary.complete('OpenAI analysis and S3 upload completed successfully');
      DanteLogger.success.perfection('OpenAI analysis and S3 upload completed successfully');

      return {
        success: true,
        analysis: parsedResponse,
        formattedMarkdown,
        contentFingerprint,
        s3Key: analysisJsonS3Key,
        promptResponseS3Key,
        cached: false
      };
    } catch (error) {
      HesseLogger.summary.error(`Error analyzing extracted text with OpenAI: ${error.message}`);
      DanteLogger.error.system('Error analyzing extracted text with OpenAI', error);

      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * Create the system prompt for OpenAI
   * @returns {string} - System prompt
   */
  createSystemPrompt() {
    return `You are an expert resume analyzer and formatter. Your task is to analyze the raw text extracted from a resume PDF and convert it into a well-structured, properly formatted JSON object.

Follow these guidelines:
1. Carefully analyze the resume content to identify key sections and information
2. Properly format names, job titles, companies, and other entities with correct capitalization
3. Preserve the original intent and information while improving formatting and structure
4. Return a JSON object with the following structure:

{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State",
    "linkedin": "LinkedIn URL (if available)",
    "website": "Personal website (if available)"
  },
  "summary": "Professional summary paragraph",
  "skills": ["Skill 1", "Skill 2", ...],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "dates": "Start Date - End Date",
      "responsibilities": ["Responsibility 1", "Responsibility 2", ...]
    },
    ...
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "location": "City, State",
      "dates": "Start Date - End Date",
      "details": ["Detail 1", "Detail 2", ...]
    },
    ...
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Issue Date",
      "expires": "Expiration Date (if applicable)"
    },
    ...
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project Description",
      "technologies": ["Technology 1", "Technology 2", ...],
      "url": "Project URL (if available)"
    },
    ...
  ]
}

If certain sections are not present in the resume, include them as empty arrays or objects. If you're uncertain about any information, make your best guess based on context but mark it with "(inferred)" at the end.

Return ONLY the JSON object without any additional text or explanation.`;
  }

  /**
   * Create the user prompt for OpenAI
   * @param {string} extractedText - Extracted text from PDF
   * @returns {string} - User prompt
   */
  createUserPrompt(extractedText) {
    return `Here is the raw text extracted from a resume PDF. Please analyze it and convert it into a well-structured JSON object according to the format specified:

${extractedText}`;
  }

  /**
   * Generate formatted markdown from the analysis
   * @param {Object} analysis - Analysis from OpenAI
   * @returns {string} - Formatted markdown
   */
  generateFormattedMarkdown(analysis) {
    try {
      let markdown = `# ${analysis.name}\n\n`;

      // Contact information
      if (analysis.contact) {
        const contactItems = [];
        if (analysis.contact.email) contactItems.push(`Email: ${analysis.contact.email}`);
        if (analysis.contact.phone) contactItems.push(`Phone: ${analysis.contact.phone}`);
        if (analysis.contact.location) contactItems.push(`Location: ${analysis.contact.location}`);
        if (analysis.contact.linkedin) contactItems.push(`LinkedIn: ${analysis.contact.linkedin}`);
        if (analysis.contact.website) contactItems.push(`Website: ${analysis.contact.website}`);

        markdown += `## Contact Information\n\n`;
        markdown += contactItems.join(' | ') + '\n\n';
      }

      // Summary
      if (analysis.summary) {
        markdown += `## Professional Summary\n\n${analysis.summary}\n\n`;
      }

      // Skills
      if (analysis.skills && analysis.skills.length > 0) {
        markdown += `## Skills\n\n`;
        markdown += analysis.skills.join(' • ') + '\n\n';
      }

      // Experience
      if (analysis.experience && analysis.experience.length > 0) {
        markdown += `## Professional Experience\n\n`;

        analysis.experience.forEach(job => {
          markdown += `### ${job.title}\n`;
          markdown += `**${job.company}**`;
          if (job.location) markdown += ` | ${job.location}`;
          if (job.dates) markdown += ` | ${job.dates}`;
          markdown += '\n\n';

          if (job.responsibilities && job.responsibilities.length > 0) {
            job.responsibilities.forEach(resp => {
              markdown += `- ${resp}\n`;
            });
            markdown += '\n';
          }
        });
      }

      // Education
      if (analysis.education && analysis.education.length > 0) {
        markdown += `## Education\n\n`;

        analysis.education.forEach(edu => {
          markdown += `### ${edu.degree}\n`;
          markdown += `**${edu.institution}**`;
          if (edu.location) markdown += ` | ${edu.location}`;
          if (edu.dates) markdown += ` | ${edu.dates}`;
          markdown += '\n\n';

          if (edu.details && edu.details.length > 0) {
            edu.details.forEach(detail => {
              markdown += `- ${detail}\n`;
            });
            markdown += '\n';
          }
        });
      }

      // Certifications
      if (analysis.certifications && analysis.certifications.length > 0) {
        markdown += `## Certifications\n\n`;

        analysis.certifications.forEach(cert => {
          markdown += `- **${cert.name}**`;
          if (cert.issuer) markdown += ` - ${cert.issuer}`;
          if (cert.date) markdown += ` (${cert.date}`;
          if (cert.expires) markdown += ` - ${cert.expires}`;
          if (cert.date) markdown += `)`;
          markdown += '\n';
        });
        markdown += '\n';
      }

      // Projects
      if (analysis.projects && analysis.projects.length > 0) {
        markdown += `## Projects\n\n`;

        analysis.projects.forEach(project => {
          markdown += `### ${project.name}\n\n`;
          if (project.description) markdown += `${project.description}\n\n`;
          if (project.technologies && project.technologies.length > 0) {
            markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
          }
          if (project.url) markdown += `**URL:** [${project.url}](${project.url})\n\n`;
        });
      }

      return markdown;
    } catch (error) {
      DanteLogger.error.dataFlow(`Error generating formatted markdown: ${error.message}`);
      return `# Error Generating Formatted Markdown\n\nThere was an error generating the formatted markdown from the analysis: ${error.message}\n\n## Raw Analysis\n\n\`\`\`json\n${JSON.stringify(analysis, null, 2)}\n\`\`\``;
    }
  }
}

module.exports = S3OpenAIAnalyzer;
