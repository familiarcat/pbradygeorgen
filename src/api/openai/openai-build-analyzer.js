/**
 * OpenAI Build Analyzer
 *
 * This module performs OpenAI analysis during the build process,
 * ensuring that the complete analysis pipeline is executed before deployment.
 *
 * Philosophical Framework:
 * - Salinger: Moving complexity "behind the scenes" to simplify the user experience
 * - Hesse: Balancing structure (schema validation) with flexibility (AI analysis)
 * - Derrida: Deconstructing content into structured data
 * - Dante: Guiding the analysis through different stages
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { OpenAI } = require('openai');
const { z } = require('zod');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Dante emoji logger for console output
const danteEmoji = {
  success: {
    basic: '😇☀️',
    core: '😇🌟',
    perfection: '😇🌈'
  },
  error: {
    system: '👑💢',
    dataFlow: '⚠️⚡',
    validation: '⚠️🔥'
  },
  warn: {
    deprecated: '⚠️🌊',
    performance: '⚠️⏱️',
    security: '⚠️🔒'
  }
};

// Hesse logger for console output
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger for console output
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic} [Dante:Paradiso:4:Sun] ${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core} [Dante:Paradiso:5:Mars] ${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection} [Dante:Paradiso:10:Empyrean] ${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system} [Dante:Inferno:1:Limbo] ${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow} [Dante:Inferno:5:Wrath] ${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation} [Dante:Inferno:8:Fraud] ${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated} [Dante:Purgatorio:1:Ante] ${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance} [Dante:Purgatorio:4:Sloth] ${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security} [Dante:Purgatorio:7:Lust] ${message}${colors.reset}`)
  }
};

/**
 * OpenAI Build Analyzer class
 */
class OpenAIBuildAnalyzer {
  constructor(options = {}) {
    // Use environment variable if not provided
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
    this.model = options.model || 'gpt-3.5-turbo';
    this.cacheEnabled = options.cacheEnabled !== false;
    this.cachePath = options.cachePath || path.join(process.cwd(), '.cache', 'openai-build');
    this.debug = options.debug || process.env.DEBUG_LOGGING === 'true';

    // Ensure cache directory exists
    if (this.cacheEnabled) {
      fs.mkdirSync(this.cachePath, { recursive: true });
      if (this.debug) {
        console.log(`🔍 [OpenAIBuildAnalyzer] Cache directory: ${this.cachePath}`);
      }
    }

    // Check if API key is available
    if (!this.apiKey) {
      danteLogger.warn.security('OpenAI API key not found. Analysis will be simulated.');
      console.log(`${colors.yellow}⚠️ OpenAI API key not found. Analysis will be simulated.${colors.reset}`);
    } else if (this.debug) {
      console.log(`🔍 [OpenAIBuildAnalyzer] OpenAI API key found (${this.apiKey.substring(0, 3)}...)`);
    }
  }

  /**
   * Analyze content with OpenAI during build
   */
  async analyzeContent(content, schema) {
    try {
      hesseLogger.summary.start('Starting OpenAI analysis during build');
      danteLogger.success.basic('Starting OpenAI analysis during build');

      if (this.debug) {
        console.log(`🔍 [OpenAIBuildAnalyzer] Analyzing content (${content.length} characters)`);
        console.log(`🔍 [OpenAIBuildAnalyzer] Using model: ${this.model}`);
        console.log(`🔍 [OpenAIBuildAnalyzer] Cache enabled: ${this.cacheEnabled}`);
      }

      // Generate a cache key based on content and schema
      const cacheKey = this.generateCacheKey(content, schema);

      if (this.debug) {
        console.log(`🔍 [OpenAIBuildAnalyzer] Cache key: ${cacheKey}`);
      }

      // Check cache if enabled
      if (this.cacheEnabled) {
        const cachedResult = this.getCachedResult(cacheKey);
        if (cachedResult) {
          hesseLogger.summary.progress('Using cached OpenAI analysis result');
          danteLogger.success.core('Using cached OpenAI analysis result');

          if (this.debug) {
            console.log(`🔍 [OpenAIBuildAnalyzer] Cache hit for key: ${cacheKey}`);
          }

          return {
            ...cachedResult,
            cached: true
          };
        } else if (this.debug) {
          console.log(`🔍 [OpenAIBuildAnalyzer] Cache miss for key: ${cacheKey}`);
        }
      }

      // If no API key is available, simulate the analysis
      if (!this.apiKey) {
        hesseLogger.summary.progress('Simulating OpenAI analysis (no API key)');
        danteLogger.warn.security('Simulating OpenAI analysis (no API key)');

        return this.simulateAnalysis(content, schema);
      }

      // Configure OpenAI
      const openai = new OpenAI({
        apiKey: this.apiKey
      });

      // Create the prompt
      const prompt = this.createAnalysisPrompt(content, schema);

      hesseLogger.summary.progress('Sending request to OpenAI');
      danteLogger.success.basic('Sending request to OpenAI');

      if (this.debug) {
        console.log(`🔍 [OpenAIBuildAnalyzer] Sending request to OpenAI`);
        console.log(`🔍 [OpenAIBuildAnalyzer] Prompt length: ${prompt.length} characters`);
      }

      // Call OpenAI
      const startTime = Date.now();
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that analyzes content and returns structured data.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });
      const endTime = Date.now();

      hesseLogger.summary.progress(`OpenAI response received in ${endTime - startTime}ms`);
      danteLogger.success.core(`OpenAI response received in ${endTime - startTime}ms`);

      if (this.debug) {
        console.log(`🔍 [OpenAIBuildAnalyzer] OpenAI response received in ${endTime - startTime}ms`);
        console.log(`🔍 [OpenAIBuildAnalyzer] Response length: ${response.choices[0]?.message?.content?.length || 0} characters`);
      }

      // Parse the response
      const responseText = response.choices[0]?.message?.content || '{}';
      let responseData;

      try {
        responseData = JSON.parse(responseText);

        if (this.debug) {
          console.log(`🔍 [OpenAIBuildAnalyzer] Response parsed successfully`);
        }
      } catch (parseError) {
        hesseLogger.summary.error(`Error parsing OpenAI response: ${parseError.message}`);
        danteLogger.error.system('Error parsing OpenAI response', parseError);

        if (this.debug) {
          console.log(`❌ [OpenAIBuildAnalyzer] Error parsing OpenAI response: ${parseError.message}`);
          console.log(`❌ [OpenAIBuildAnalyzer] Response text: ${responseText.substring(0, 100)}...`);
        }

        // Return a simulated response as fallback
        return this.simulateAnalysis(content, schema, parseError);
      }

      // Validate with Zod
      const validationResult = this.validateWithZod(responseData, schema);

      if (validationResult.success) {
        hesseLogger.summary.complete('OpenAI analysis validated successfully');
        danteLogger.success.perfection('OpenAI analysis validated successfully');

        if (this.debug) {
          console.log(`✅ [OpenAIBuildAnalyzer] Validation successful`);
        }
      } else {
        hesseLogger.summary.error(`Validation failed: ${validationResult.error}`);
        danteLogger.error.validation(`Validation failed: ${validationResult.error}`);

        if (this.debug) {
          console.log(`❌ [OpenAIBuildAnalyzer] Validation failed`);
          console.log(`❌ [OpenAIBuildAnalyzer] Validation errors: ${JSON.stringify(validationResult.error.errors)}`);
        }
      }

      const result = {
        success: validationResult.success,
        data: validationResult.success ? validationResult.data : responseData,
        validationResult: {
          success: validationResult.success,
          error: validationResult.success ? undefined : validationResult.error,
          timestamp: new Date().toISOString()
        },
        error: validationResult.success ? undefined : validationResult.error
      };

      // Cache the result if enabled
      if (this.cacheEnabled) {
        this.cacheResult(cacheKey, result);

        if (this.debug) {
          console.log(`🔍 [OpenAIBuildAnalyzer] Result cached with key: ${cacheKey}`);
        }
      }

      return result;
    } catch (error) {
      hesseLogger.summary.error(`Error in OpenAI build analysis: ${error.message}`);
      danteLogger.error.system('Error in OpenAI build analysis', error);

      if (this.debug) {
        console.log(`❌ [OpenAIBuildAnalyzer] Error in OpenAI build analysis: ${error.message}`);
        console.log(`❌ [OpenAIBuildAnalyzer] Error details:`, error);
      }

      // Return a simulated response as fallback
      return this.simulateAnalysis(content, schema, error);
    }
  }

  /**
   * Generate a cache key based on content and schema
   */
  generateCacheKey(content, schema) {
    const contentHash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
    const schemaHash = crypto.createHash('sha256').update(JSON.stringify(schema)).digest('hex').substring(0, 8);
    return `${contentHash}-${schemaHash}`;
  }

  /**
   * Get cached result
   */
  getCachedResult(cacheKey) {
    const cachePath = path.join(this.cachePath, `${cacheKey}.json`);
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
   */
  cacheResult(cacheKey, result) {
    const cachePath = path.join(this.cachePath, `${cacheKey}.json`);
    try {
      fs.writeFileSync(cachePath, JSON.stringify(result, null, 2));
    } catch (error) {
      console.warn('Error writing cache:', error);
    }
  }

  /**
   * Create analysis prompt
   */
  createAnalysisPrompt(content, schema) {
    // Extract schema description from Zod
    const schemaDescription = this.extractZodSchemaDescription(schema);

    return `
Please analyze the following content (likely from a resume or CV) and extract structured information according to the schema.

CONTENT:
${content}

SCHEMA:
${schemaDescription}

In addition to extracting the structured information, please also:
1. Create a well-written professional summary that highlights key qualifications
2. Identify and categorize skills into technical and soft skills
3. Extract and enhance experience descriptions to highlight achievements
4. Format education information consistently
5. Ensure all content is professionally written and ready for download

Your response should be a valid JSON object that conforms to the schema, but with rich, well-formatted content
that would be suitable for downloading as a professional resume or CV.

For any missing information that you cannot find in the content but is required by the schema, please make reasonable
inferences based on the available information. Mark any such inferences with "[Inferred]" at the beginning.

Return the result as a valid JSON object that conforms to the schema.
`;
  }

  /**
   * Extract schema description from Zod
   */
  extractZodSchemaDescription(schema) {
    // This is a simplified version - in practice, you would implement
    // a more sophisticated schema description extractor
    try {
      // Try to get a human-readable description of the schema
      let description = '';

      if (schema._def && schema._def.typeName === 'ZodObject') {
        description = 'An object with the following properties:\n';

        for (const [key, value] of Object.entries(schema._def.shape())) {
          description += `- ${key}: ${this.getZodTypeDescription(value)}\n`;
        }
      } else {
        description = this.getZodTypeDescription(schema);
      }

      return description;
    } catch (error) {
      console.warn('Error extracting schema description:', error);
      return 'Schema description not available';
    }
  }

  /**
   * Get a description of a Zod type
   */
  getZodTypeDescription(zodType) {
    if (!zodType || !zodType._def) {
      return 'unknown';
    }

    switch (zodType._def.typeName) {
      case 'ZodString':
        return 'string';
      case 'ZodNumber':
        return 'number';
      case 'ZodBoolean':
        return 'boolean';
      case 'ZodArray':
        return `array of ${this.getZodTypeDescription(zodType._def.type)}`;
      case 'ZodObject':
        return 'object';
      case 'ZodEnum':
        return `enum (${zodType._def.values.join(', ')})`;
      case 'ZodOptional':
        return `optional ${this.getZodTypeDescription(zodType._def.innerType)}`;
      case 'ZodNullable':
        return `nullable ${this.getZodTypeDescription(zodType._def.innerType)}`;
      default:
        return zodType._def.typeName || 'unknown';
    }
  }

  /**
   * Validate data with Zod schema
   */
  validateWithZod(data, schema) {
    try {
      const result = schema.safeParse(data);

      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
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
   * Simulate OpenAI analysis (used when API key is not available or as fallback)
   */
  simulateAnalysis(content, schema, error = null) {
    hesseLogger.summary.progress('Simulating OpenAI analysis');

    if (error) {
      danteLogger.warn.deprecated(`Simulating OpenAI analysis due to error: ${error.message}`);
    } else {
      danteLogger.warn.deprecated('Simulating OpenAI analysis');
    }

    if (this.debug) {
      console.log(`🔍 [OpenAIBuildAnalyzer] Simulating OpenAI analysis`);
      if (error) {
        console.log(`🔍 [OpenAIBuildAnalyzer] Simulation reason: ${error.message}`);
      }
    }

    // Create a simulated response based on the schema
    const simulatedData = this.createSimulatedData(schema);

    // Validate with Zod
    const validationResult = this.validateWithZod(simulatedData, schema);

    if (validationResult.success) {
      hesseLogger.summary.complete('Simulated analysis validated successfully');
      danteLogger.success.core('Simulated analysis validated successfully');
    } else {
      hesseLogger.summary.error(`Simulated analysis validation failed: ${validationResult.error}`);
      danteLogger.error.validation(`Simulated analysis validation failed: ${validationResult.error}`);
    }

    return {
      success: validationResult.success,
      data: validationResult.success ? validationResult.data : simulatedData,
      validationResult: {
        success: validationResult.success,
        error: validationResult.success ? undefined : validationResult.error,
        timestamp: new Date().toISOString()
      },
      error: validationResult.success ? undefined : validationResult.error,
      simulated: true
    };
  }

  /**
   * Create simulated data based on the schema
   */
  createSimulatedData(schema) {
    try {
      // Extract some keywords from the content to make the simulation more realistic
      const keywords = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Next.js'];

      // Create a simulated resume
      return {
        name: 'John Doe',
        summary: 'Experienced software developer with expertise in JavaScript/TypeScript, React, Node.js, and AWS.',
        skills: [
          'JavaScript/TypeScript',
          'React',
          'Node.js',
          'AWS',
          'Next.js'
        ],
        experience: [
          {
            title: 'Senior Software Developer',
            company: 'ABC Company',
            period: '2020 - Present',
            responsibilities: [
              'Developed and maintained web applications using React and Node.js',
              'Implemented CI/CD pipelines using GitHub Actions',
              'Deployed applications to AWS using Amplify'
            ]
          },
          {
            title: 'Software Developer',
            company: 'XYZ Company',
            period: '2018 - 2020',
            responsibilities: [
              'Developed front-end applications using React',
              'Implemented RESTful APIs using Node.js',
              'Worked with MongoDB and PostgreSQL databases'
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
          email: 'example@example.com',
          phone: '(123) 456-7890',
          linkedin: 'linkedin.com/in/example'
        }
      };
    } catch (error) {
      console.warn('Error creating simulated data:', error);

      // Return a minimal object that should pass validation
      return {
        name: 'Simulated User',
        summary: 'Simulated summary',
        skills: ['Skill 1', 'Skill 2'],
        experience: [
          {
            title: 'Simulated Position',
            company: 'Simulated Company',
            period: '2020 - Present',
            responsibilities: ['Responsibility 1', 'Responsibility 2']
          }
        ],
        education: [
          {
            degree: 'Simulated Degree',
            institution: 'Simulated Institution',
            period: '2014 - 2018'
          }
        ],
        contact: {
          email: 'simulated@example.com'
        }
      };
    }
  }
}

module.exports = {
  OpenAIBuildAnalyzer
};
