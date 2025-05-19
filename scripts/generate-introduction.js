/**
 * Generate Introduction Script
 *
 * This script generates an introduction/summary from the extracted resume content
 * using OpenAI. It runs during the prebuild process to ensure the content is
 * available for the SalingerHeader component.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./core/logger');
const config = require('./core/config');
const utils = require('./core/utils');
const { OpenAI } = require('openai');

const logger = createLogger('introduction');

/**
 * Generate an introduction from the resume content
 *
 * @param {string} resumeContentPath - Path to the resume content file
 * @param {Object} options - Options for generation
 * @returns {Promise<Object>} - Result of the generation
 */
async function generateIntroduction(resumeContentPath, options = {}) {
  try {
    logger.info(`Generating introduction from resume content: ${resumeContentPath}`);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warning('OpenAI API key not found. Using fallback introduction.');
      return generateFallbackIntroduction(resumeContentPath, options);
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
    let userSkills = [];
    let userEmail = '';
    let userPhone = '';
    let userLocation = '';

    if (fs.existsSync(userInfoPath)) {
      try {
        const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
        userName = userInfo.fullName || 'User';
        userTitle = userInfo.title || 'Professional';
        userSkills = userInfo.skills || [];
        userEmail = userInfo.email || '';
        userPhone = userInfo.phone || '';
        userLocation = userInfo.location || '';
        logger.info(`Using user information from user_info.json: ${userName}, ${userTitle}`);
      } catch (error) {
        logger.error(`Error parsing user_info.json: ${error.message}`);
      }
    }

    // Create the prompt with ATS-focused instructions
    const prompt = `
I need you to create a professional introduction based on the following resume content.
This introduction will be used as a cover letter or introduction document that will be processed by
Applicant Tracking Systems (ATS) as well as read by hiring managers. Format the output as markdown.

Resume Content:
${resumeContent}

User Information:
- Name: ${userName}
- Title: ${userTitle}
- Skills: ${userSkills.join(', ')}
- Email: ${userEmail}
- Phone: ${userPhone}
- Location: ${userLocation}

Please create an ATS-optimized introduction that:
1. Starts with a title "# ${userName} - Introduction"
2. Includes a professional summary section that clearly states the candidate's role and years of experience
3. Lists key skills using industry-standard terminology that will be recognized by ATS systems
4. Mentions specific industry experience with measurable achievements and metrics when possible
5. Highlights career achievements with quantifiable results (percentages, numbers, etc.)
6. Includes education information and relevant certifications if available
7. Ends with what the candidate is looking for in their next role and why they're a good fit
8. Uses keywords from the resume that will be recognized by ATS systems

The introduction should:
- Be concise and focused, suitable for a single-page PDF
- Use active voice and strong action verbs
- Avoid generic statements and focus on specific accomplishments
- Include industry-specific keywords and phrases that ATS systems look for
- Maintain a professional tone throughout
- Be well-structured with clear headings and bullet points where appropriate
`;

    logger.info('Sending request to OpenAI...');

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS-optimization specialist and professional introduction writer. You create well-structured, compelling introductions in markdown format that are optimized for both Applicant Tracking Systems and human readers. Your introductions use industry-standard terminology, include relevant keywords, highlight measurable achievements, and present the candidate\'s unique value proposition in a clear, concise manner. You focus on specific accomplishments rather than generic statements and ensure all content is tailored to the candidate\'s target role and industry.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Get the response text
    const introduction = response.choices[0].message.content;

    // Save the introduction
    const outputDir = options.outputDir || path.dirname(resumeContentPath);
    const outputPath = path.join(outputDir, 'introduction.md');
    utils.saveText(outputPath, introduction);

    logger.success(`Introduction saved to: ${outputPath}`);

    return {
      success: true,
      introduction,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating introduction: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a fallback introduction when OpenAI is not available
 *
 * @param {string} resumeContentPath - Path to the resume content file
 * @param {Object} options - Options for generation
 * @returns {Promise<Object>} - Result of the generation
 */
async function generateFallbackIntroduction(resumeContentPath, options = {}) {
  try {
    logger.info('Generating fallback introduction...');

    // Load user information
    const userInfoPath = path.join(path.dirname(resumeContentPath), 'user_info.json');
    let userName = 'User';
    let userTitle = 'Professional';
    let userSkills = [];
    let userEmail = '';
    let userPhone = '';
    let userLocation = '';

    if (fs.existsSync(userInfoPath)) {
      try {
        const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
        userName = userInfo.fullName || 'User';
        userTitle = userInfo.title || 'Professional';
        userSkills = userInfo.skills || [];
        userEmail = userInfo.email || '';
        userPhone = userInfo.phone || '';
        userLocation = userInfo.location || '';
        logger.info(`Using user information from user_info.json: ${userName}, ${userTitle}`);
      } catch (error) {
        logger.error(`Error parsing user_info.json: ${error.message}`);
      }
    }

    // Create a basic introduction optimized for ATS
    const introduction = `# ${userName} - Introduction

## Professional Summary

As an experienced ${userTitle} with a proven track record of success, I bring 5+ years of expertise in delivering high-quality results and innovative solutions. My background includes a strong foundation in industry best practices, with a focus on optimizing processes and driving measurable outcomes.

## Key Skills

${userSkills.length > 0 ? userSkills.map(skill => `- ${skill}`).join('\n') : `
- Technical expertise in industry-standard methodologies
- Advanced problem-solving and analytical thinking
- Cross-functional team collaboration and leadership
- Project management and strategic planning
- Continuous improvement and innovation
- Data analysis and performance optimization`}

## Industry Experience

I have successfully implemented solutions that resulted in 30% efficiency improvements and 25% cost reductions across multiple projects. My experience spans various sectors, allowing me to apply transferable skills and adapt quickly to new environments and requirements.

## Career Achievements

- Delivered projects consistently on time and under budget, resulting in 95% client satisfaction ratings
- Implemented process improvements that increased team productivity by 40%
- Recognized for excellence with multiple performance awards
- Mentored junior team members, leading to 80% promotion rate within the team
- Contributed to business growth initiatives that expanded market reach by 35%

## Education & Certifications

- Bachelor's Degree in relevant field
- Industry-recognized certifications
- Continuous professional development through specialized training

## What I'm Looking For

I am seeking a challenging role where I can leverage my expertise in ${userTitle.toLowerCase()} to drive innovation and deliver exceptional results. I am particularly interested in organizations that value collaboration, continuous improvement, and data-driven decision-making. My goal is to contribute to a team where I can make a significant impact while continuing to grow professionally.

## Contact Information

${userEmail ? `- Email: ${userEmail}` : ''}
${userPhone ? `- Phone: ${userPhone}` : ''}
${userLocation ? `- Location: ${userLocation}` : ''}
`;

    // Save the introduction
    const outputDir = options.outputDir || path.dirname(resumeContentPath);
    const outputPath = path.join(outputDir, 'introduction.md');
    utils.saveText(outputPath, introduction);

    logger.success(`Fallback introduction saved to: ${outputPath}`);

    return {
      success: true,
      introduction,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating fallback introduction: ${error.message}`);
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

  // Generate introduction
  generateIntroduction(inputPath)
    .then(result => {
      if (result.success) {
        console.log('Introduction generated successfully');
      } else {
        console.error(`Failed to generate introduction: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  generateIntroduction
};
