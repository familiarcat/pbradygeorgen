/**
 * Generate Resume Script
 *
 * This script generates a resume from the extracted content
 * using OpenAI. It runs during the prebuild process to ensure the content is
 * available for the SalingerHeader component.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./core/logger');
const config = require('./core/config');
const utils = require('./core/utils');
const { OpenAI } = require('openai');

const logger = createLogger('resume');

/**
 * Generate a resume from the extracted content
 * 
 * @param {string} resumeContentPath - Path to the resume content file
 * @param {Object} options - Options for generation
 * @returns {Promise<Object>} - Result of the generation
 */
async function generateResume(resumeContentPath, options = {}) {
  try {
    logger.info(`Generating resume from content: ${resumeContentPath}`);
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warning('OpenAI API key not found. Using fallback resume.');
      return generateFallbackResume(resumeContentPath, options);
    }
    
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Check if the resume content file exists
    if (!fs.existsSync(resumeContentPath)) {
      logger.error(`Resume content file not found: ${resumeContentPath}`);
      return {
        success: false,
        error: 'Resume content file not found'
      };
    }
    
    // Read the resume content
    const resumeContent = fs.readFileSync(resumeContentPath, 'utf8');
    
    // Load user information
    const userInfoPath = path.join(path.dirname(resumeContentPath), 'user_info.json');
    let userName = 'User';
    let userTitle = 'Professional';
    let userEmail = '';
    let userPhone = '';
    let userLocation = '';
    
    if (fs.existsSync(userInfoPath)) {
      try {
        const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
        userName = userInfo.fullName || 'User';
        userTitle = userInfo.title || 'Professional';
        userEmail = userInfo.email || '';
        userPhone = userInfo.phone || '';
        userLocation = userInfo.location || '';
        logger.info(`Using user information from user_info.json: ${userName}, ${userTitle}`);
      } catch (error) {
        logger.error(`Error parsing user_info.json: ${error.message}`);
      }
    }
    
    // Create the prompt
    const prompt = `
I need you to create a professional resume based on the following content.
The resume should be well-structured, concise, and highlight the key skills, experience,
and value proposition of the candidate. Format the output as markdown.

Resume Content:
${resumeContent}

Please create a resume that:
1. Starts with a title "# ${userName}"
2. Includes a professional summary section
3. Lists contact information (${userEmail}, ${userPhone}, ${userLocation})
4. Lists work experience in reverse chronological order
5. Includes skills and technologies
6. Includes education information if available

The resume should be concise and focused, suitable for a single-page PDF.
`;
    
    logger.info('Sending request to OpenAI...');
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer that creates well-structured, compelling resumes in markdown format. Your resumes are concise, focused, and highlight the unique value proposition of the candidate.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Get the response text
    const resume = response.choices[0].message.content;
    
    // Save the resume
    const outputDir = options.outputDir || path.dirname(resumeContentPath);
    const outputPath = path.join(outputDir, 'resume.md');
    utils.saveText(outputPath, resume);
    
    logger.success(`Resume saved to: ${outputPath}`);
    
    return {
      success: true,
      resume,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating resume: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a fallback resume when OpenAI is not available
 * 
 * @param {string} resumeContentPath - Path to the resume content file
 * @param {Object} options - Options for generation
 * @returns {Promise<Object>} - Result of the generation
 */
async function generateFallbackResume(resumeContentPath, options = {}) {
  try {
    logger.info('Generating fallback resume...');
    
    // Load user information
    const userInfoPath = path.join(path.dirname(resumeContentPath), 'user_info.json');
    let userName = 'User';
    let userTitle = 'Professional';
    let userEmail = '';
    let userPhone = '';
    let userLocation = '';
    
    if (fs.existsSync(userInfoPath)) {
      try {
        const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
        userName = userInfo.fullName || 'User';
        userTitle = userInfo.title || 'Professional';
        userEmail = userInfo.email || '';
        userPhone = userInfo.phone || '';
        userLocation = userInfo.location || '';
        logger.info(`Using user information from user_info.json: ${userName}, ${userTitle}`);
      } catch (error) {
        logger.error(`Error parsing user_info.json: ${error.message}`);
      }
    }
    
    // Create a basic resume
    const resume = `# ${userName}

## Professional Summary

As a ${userTitle}, I bring a wealth of experience and expertise to the table. My background includes a strong foundation in my field, with a focus on delivering high-quality results and innovative solutions.

## Contact Information

${userLocation}
${userPhone}
${userEmail}

## Experience

### Current Position

${userTitle}

## Skills

- Professional expertise in my field
- Strong communication and collaboration skills
- Problem-solving and analytical thinking
- Adaptability and continuous learning
- Attention to detail and quality focus

## Education

- Relevant education and certifications in my field
`;
    
    // Save the resume
    const outputDir = options.outputDir || path.dirname(resumeContentPath);
    const outputPath = path.join(outputDir, 'resume.md');
    utils.saveText(outputPath, resume);
    
    logger.success(`Fallback resume saved to: ${outputPath}`);
    
    return {
      success: true,
      resume,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating fallback resume: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// If this script is run directly
if (require.main === module) {
  // Get the input file path from command line arguments
  const args = process.argv.slice(2);
  let inputPath;
  
  if (args.length > 0) {
    // Use the provided file path
    inputPath = args[0];
  } else {
    // Use the default file path
    inputPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');
  }
  
  // Generate resume
  generateResume(inputPath)
    .then(result => {
      if (result.success) {
        console.log('Resume generated successfully');
      } else {
        console.error(`Failed to generate resume: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  generateResume
};
