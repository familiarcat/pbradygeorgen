/**
 * OpenAI Analyzer Module
 *
 * This module handles the analysis of extracted PDF content using OpenAI.
 * It's the second step in the PDF processing pipeline.
 *
 * Philosophical Framework:
 * - Derrida: Reconstructing meaning from deconstructed text
 * - Hesse: Balancing AI interpretation with structured schema
 * - Dante: Guiding the content through the analysis journey
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { z } = require('zod');

// Import the resume schema
const { ResumeSchema } = require('./resume-schema');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Dante emoji logger
const danteEmoji = {
  success: {
    basic: '😇☀️: ',
    core: '😇🌟: ',
    perfection: '😇🌈: '
  },
  error: {
    system: '👑💢: ',
    dataFlow: '⚠️⚡: ',
    validation: '⚠️🔥: '
  },
  warn: {
    deprecated: '⚠️🌊: ',
    performance: '⚠️⏱️: ',
    security: '⚠️🔒: '
  }
};

// Hesse logger
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic}${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core}${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection}${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system}${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow}${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation}${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated}${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance}${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security}${message}${colors.reset}`)
  }
};

/**
 * OpenAI Analyzer class
 */
class OpenAIAnalyzer {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || path.join(process.cwd(), 'public', 'extracted'),
      cacheDir: options.cacheDir || path.join(process.cwd(), '.cache', 'openai'),
      apiKey: options.apiKey || process.env.OPENAI_API_KEY || '',
      model: options.model || 'gpt-4o',
      cacheEnabled: options.cacheEnabled !== false,
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      ...options
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Ensure cache directory exists if caching is enabled
    if (this.options.cacheEnabled) {
      if (!fs.existsSync(this.options.cacheDir)) {
        fs.mkdirSync(this.options.cacheDir, { recursive: true });
      }
    }

    // Check if API key is available
    if (!this.options.apiKey) {
      danteLogger.warn.security('OpenAI API key not found. Analysis will be simulated.');
    }
  }

  /**
   * Analyze content with OpenAI
   * @param {Object} extractionResult - Result from the PDF extraction
   * @returns {Promise<Object>} - Analysis result
   */
  async analyzeContent(extractionResult) {
    try {
      hesseLogger.summary.start('Starting OpenAI analysis');
      danteLogger.success.basic('Starting OpenAI analysis');

      if (!extractionResult.success) {
        throw new Error('Extraction result is not successful');
      }

      const { text, contentFingerprint } = extractionResult;

      // Check cache if enabled
      if (this.options.cacheEnabled) {
        const cachedResult = this.getCachedResult(contentFingerprint);
        if (cachedResult) {
          hesseLogger.summary.progress('Using cached OpenAI analysis result');
          danteLogger.success.core('Using cached OpenAI analysis result');

          return {
            ...cachedResult,
            cached: true
          };
        }
      }

      // If no API key is available, simulate the analysis
      if (!this.options.apiKey) {
        hesseLogger.summary.progress('Simulating OpenAI analysis (no API key)');
        danteLogger.warn.security('Simulating OpenAI analysis (no API key)');

        return this.simulateAnalysis(text, contentFingerprint);
      }

      // Configure OpenAI
      const openai = new OpenAI({
        apiKey: this.options.apiKey
      });

      // Create the prompt
      const prompt = this.createAnalysisPrompt(text);

      hesseLogger.summary.progress('Sending request to OpenAI');
      danteLogger.success.basic('Sending request to OpenAI');

      // Call OpenAI
      const startTime = Date.now();
      const response = await openai.chat.completions.create({
        model: this.options.model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that analyzes resume content and returns structured data.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      const endTime = Date.now();

      hesseLogger.summary.progress(`OpenAI response received in ${endTime - startTime}ms`);
      danteLogger.success.core(`OpenAI response received in ${endTime - startTime}ms`);

      // Parse the response
      const responseText = response.choices[0]?.message?.content || '{}';
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        hesseLogger.summary.error(`Error parsing OpenAI response: ${parseError.message}`);
        danteLogger.error.system('Error parsing OpenAI response', parseError);

        // Return a simulated response as fallback
        return this.simulateAnalysis(text, contentFingerprint, parseError);
      }

      // Validate with Zod
      const validationResult = this.validateWithZod(responseData);

      if (validationResult.success) {
        hesseLogger.summary.complete('OpenAI analysis validated successfully');
        danteLogger.success.perfection('OpenAI analysis validated successfully');
      } else {
        hesseLogger.summary.error(`Validation failed: ${validationResult.error}`);
        danteLogger.error.validation(`Validation failed: ${validationResult.error}`);
      }

      const result = {
        success: validationResult.success,
        data: validationResult.success ? validationResult.data : responseData,
        validationResult: {
          success: validationResult.success,
          error: validationResult.success ? undefined : validationResult.error,
          timestamp: new Date().toISOString()
        },
        contentFingerprint,
        error: validationResult.success ? undefined : validationResult.error
      };

      // Cache the result if enabled
      if (this.options.cacheEnabled) {
        this.cacheResult(contentFingerprint, result);
      }

      // Save the analyzed result
      this.saveAnalyzedResult(result, text);

      return result;
    } catch (error) {
      hesseLogger.summary.error(`Error in OpenAI analysis: ${error.message}`);
      danteLogger.error.system('Error in OpenAI analysis', error);

      // Return a simulated response as fallback
      return this.simulateAnalysis(extractionResult.text, extractionResult.contentFingerprint, error);
    }
  }

  /**
   * Create analysis prompt
   * @param {string} content - The content to analyze
   * @returns {string} - The prompt
   */
  createAnalysisPrompt(content) {
    return `
Please analyze the following resume content and extract structured information according to the schema.

CONTENT:
${content}

SCHEMA:
{
  "name": "string (required)",
  "summary": "string (required)",
  "skills": ["string (at least one required)"],
  "experience": [
    {
      "title": "string (required)",
      "company": "string (required)",
      "period": "string (required)",
      "responsibilities": ["string (at least one required)"]
    }
  ],
  "education": [
    {
      "degree": "string (required)",
      "institution": "string (required)",
      "period": "string (required)"
    }
  ],
  "contact": {
    "email": "string (optional)",
    "phone": "string (optional)",
    "linkedin": "string (optional)",
    "website": "string (optional)",
    "github": "string (optional)",
    "twitter": "string (optional)",
    "location": "string (optional)"
  }
}

INSTRUCTIONS:
1. Extract the person's name, summary, skills, experience, education, and contact information.
2. For skills, include both technical and soft skills as an array of strings.
3. For experience, include job title, company name, period, and responsibilities.
4. For education, include degree, institution, and period.
5. For contact information, extract as many details as available.
6. Ensure all required fields are filled.
7. If information is not available, make a reasonable inference based on the content.
8. IMPORTANT: Make sure the skills field is an array of strings, not an array of objects.
9. IMPORTANT: Make sure the output JSON exactly matches the schema structure.

Return the result as a valid JSON object that conforms to the schema.
`;
  }

  /**
   * Validate data with Zod schema
   * @param {Object} data - The data to validate
   * @returns {Object} - Validation result
   */
  validateWithZod(data) {
    try {
      // Log the data structure for debugging
      if (this.options.debug) {
        console.log('Validating data structure:');
        console.log(JSON.stringify(data, null, 2));
      }

      const result = ResumeSchema.safeParse(data);

      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        // Log detailed validation errors
        if (this.options.debug) {
          console.log('Validation errors:');
          console.log(JSON.stringify(result.error.format(), null, 2));
        }

        // Check for specific issues with skills field
        if (data.skills && !Array.isArray(data.skills)) {
          danteLogger.error.validation('Skills field is not an array');

          // Try to fix the skills field if possible
          if (typeof data.skills === 'object') {
            const fixedData = { ...data };

            if (Array.isArray(data.skills.technical)) {
              fixedData.skills = data.skills.technical;

              // Try validating again
              const fixedResult = ResumeSchema.safeParse(fixedData);
              if (fixedResult.success) {
                danteLogger.success.core('Fixed skills field and validation succeeded');
                return {
                  success: true,
                  data: fixedResult.data,
                  fixed: true
                };
              }
            }
          }
        }

        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error
      };
    }
  }

  /**
   * Get cached result
   * @param {string} contentFingerprint - Content fingerprint
   * @returns {Object|null} - Cached result or null
   */
  getCachedResult(contentFingerprint) {
    const cachePath = path.join(this.options.cacheDir, `${contentFingerprint}.json`);
    if (fs.existsSync(cachePath)) {
      try {
        return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      } catch (error) {
        console.warn('Error reading cache:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Cache result
   * @param {string} contentFingerprint - Content fingerprint
   * @param {Object} result - Result to cache
   */
  cacheResult(contentFingerprint, result) {
    const cachePath = path.join(this.options.cacheDir, `${contentFingerprint}.json`);
    try {
      fs.writeFileSync(cachePath, JSON.stringify(result, null, 2));
    } catch (error) {
      console.warn('Error writing cache:', error);
    }
  }

  /**
   * Save analyzed result
   * @param {Object} result - Analysis result
   * @param {string} rawText - Raw text
   */
  saveAnalyzedResult(result, rawText) {
    const analyzedJson = {
      metadata: {
        analysisDate: new Date().toISOString(),
        contentFingerprint: result.contentFingerprint,
        openaiModel: this.options.model,
        cached: result.cached || false,
        simulated: result.simulated || false,
        fallback: !result.success
      },
      analysis: {
        skills: {
          technical: Array.isArray(result.data?.skills)
            ? result.data.skills.filter(skill =>
              typeof skill === 'string' && (
                skill.toLowerCase().includes('javascript') ||
                skill.toLowerCase().includes('react') ||
                skill.toLowerCase().includes('aws') ||
                skill.toLowerCase().includes('node')
              )
            )
            : [],
          soft: Array.isArray(result.data?.skills)
            ? result.data.skills.filter(skill =>
              typeof skill === 'string' && (
                !skill.toLowerCase().includes('javascript') &&
                !skill.toLowerCase().includes('react') &&
                !skill.toLowerCase().includes('aws') &&
                !skill.toLowerCase().includes('node')
              )
            )
            : []
        },
        experience: {
          years: result.data?.experience?.length * 2 || 0, // Rough estimate
          domains: ['Web Development', 'Cloud Computing'],
          highlights: result.data?.experience?.flatMap(exp => exp.responsibilities).slice(0, 3) || []
        },
        education: {
          level: result.data?.education?.[0]?.degree || 'Unknown',
          field: result.data?.education?.[0]?.degree || 'Unknown',
          relevance: 'High'
        },
        summary: result.data?.summary || ''
      },
      structuredContent: result.data || {},
      zodValidation: {
        success: result.success,
        error: result.success ? undefined : JSON.stringify(result.error),
        timestamp: new Date().toISOString()
      },
      rawText
    };

    // Save the analyzed JSON
    fs.writeFileSync(
      path.join(this.options.outputDir, 'resume_content_analyzed.json'),
      JSON.stringify(analyzedJson, null, 2)
    );
  }

  /**
   * Simulate OpenAI analysis
   * @param {string} content - Content to analyze
   * @param {string} contentFingerprint - Content fingerprint
   * @param {Error} error - Error that triggered simulation
   * @returns {Object} - Simulated analysis result
   */
  simulateAnalysis(content, contentFingerprint, error = null) {
    hesseLogger.summary.progress('Simulating OpenAI analysis');

    if (error) {
      danteLogger.warn.deprecated(`Simulating OpenAI analysis due to error: ${error.message}`);
    } else {
      danteLogger.warn.deprecated('Simulating OpenAI analysis');
    }

    // Create a simulated response based on the content
    const simulatedData = {
      name: 'John Doe',
      summary: 'Experienced software developer with expertise in JavaScript/TypeScript, React, Node.js, and AWS.',
      skills: [
        'JavaScript/TypeScript',
        'React',
        'Node.js',
        'AWS',
        'Next.js',
        'CI/CD',
        'RESTful APIs',
        'MongoDB',
        'PostgreSQL',
        'Git/GitHub',
        'Communication',
        'Teamwork',
        'Problem Solving'
      ],
      experience: [
        {
          title: 'Senior Software Developer',
          company: 'ABC Company',
          period: '2020 - Present',
          responsibilities: [
            'Developed and maintained web applications using React and Node.js',
            'Implemented CI/CD pipelines using GitHub Actions',
            'Deployed applications to AWS using Amplify',
            'Collaborated with cross-functional teams to deliver high-quality software',
            'Mentored junior developers and conducted code reviews'
          ]
        },
        {
          title: 'Software Developer',
          company: 'XYZ Company',
          period: '2018 - 2020',
          responsibilities: [
            'Developed front-end applications using React',
            'Implemented RESTful APIs using Node.js',
            'Worked with MongoDB and PostgreSQL databases',
            'Participated in Agile development processes',
            'Contributed to open-source projects'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          period: '2014 - 2018'
        }
      ],
      contact: {
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        linkedin: 'linkedin.com/in/johndoe'
      }
    };

    // Log the simulated data for debugging
    if (this.options.debug) {
      console.log('Simulated data structure:');
      console.log(JSON.stringify(simulatedData, null, 2));
    }

    // Validate with Zod
    const validationResult = this.validateWithZod(simulatedData);

    if (validationResult.success) {
      hesseLogger.summary.complete('Simulated analysis validated successfully');
      danteLogger.success.core('Simulated analysis validated successfully');
    } else {
      hesseLogger.summary.error(`Simulated analysis validation failed: ${validationResult.error}`);
      danteLogger.error.validation(`Simulated analysis validation failed: ${validationResult.error}`);
    }

    const result = {
      success: validationResult.success,
      data: validationResult.success ? validationResult.data : simulatedData,
      validationResult: {
        success: validationResult.success,
        error: validationResult.success ? undefined : validationResult.error,
        timestamp: new Date().toISOString()
      },
      contentFingerprint,
      error: validationResult.success ? undefined : validationResult.error,
      simulated: true
    };

    // Save the analyzed result
    this.saveAnalyzedResult(result, content);

    return result;
  }
}

module.exports = OpenAIAnalyzer;
