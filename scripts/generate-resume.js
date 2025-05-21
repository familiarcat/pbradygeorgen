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
    let userSkills = [];
    let userKeywords = [];
    let userIndustry = 'general';
    let userEmail = '';
    let userPhone = '';
    let userLocation = '';

    if (fs.existsSync(userInfoPath)) {
      try {
        const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'));
        userName = userInfo.fullName || 'User';
        userTitle = userInfo.title || 'Professional';
        userSkills = userInfo.skills || [];
        userKeywords = userInfo.keywords || [];
        userIndustry = userInfo.industry || 'general';
        userEmail = userInfo.email || '';
        userPhone = userInfo.phone || '';
        userLocation = userInfo.location || '';
        logger.info(`Using user information from user_info.json: ${userName}, ${userTitle}, Industry: ${userIndustry}`);
      } catch (error) {
        logger.error(`Error parsing user_info.json: ${error.message}`);
      }
    }

    // Create the prompt with enhanced ATS optimization
    const prompt = `
I need you to create a professional resume based on the following content.
This resume will be processed by Applicant Tracking Systems (ATS) as well as read by hiring managers.
The resume should be well-structured, concise, and highlight the key skills, experience,
and value proposition of the candidate. Format the output as markdown.

Resume Content:
${resumeContent}

Please create an ATS-optimized resume for the ${userIndustry} industry that:
1. Starts with a title "# ${userName}"
2. Includes a professional summary section that highlights core competencies and years of experience
3. Lists contact information (${userEmail}, ${userPhone}, ${userLocation})
4. Lists work experience in reverse chronological order with measurable achievements
5. Includes a comprehensive skills section organized by category (technical skills, soft skills, etc.)
6. Includes education information and certifications if available

Industry-Specific Information:
- Industry: ${userIndustry}
- Job Title: ${userTitle}
- Key Skills: ${userSkills.join(', ')}
- ATS Keywords to Include: ${userKeywords.join(', ')}

ATS Optimization Guidelines:
- Use exact job title and skill keywords from the resume multiple times (3-5 times for primary keywords)
- Include industry-specific technical terms, tools, methodologies, and certifications
- Use both spelled-out terms and acronyms (e.g., "Applicant Tracking System (ATS)" then "ATS" later)
- Place important keywords in section headings when possible
- Use standard section headings that ATS systems recognize (e.g., "Professional Summary", "Skills", "Experience")
- Ensure keyword density is natural (5-8% keyword density is optimal)
- Include both hard skills (technical abilities) and soft skills (communication, leadership)
- Match keywords to the candidate's industry and job level
- Quantify achievements with specific metrics and numbers when possible

Formatting Guidelines:
- Be concise and focused, suitable for a single-page PDF
- Use active voice and strong action verbs (achieved, implemented, led, developed, etc.)
- Avoid generic statements and focus on specific accomplishments
- Maintain a professional tone throughout
- Use clear headings and bullet points for better ATS parsing
- DO NOT use horizontal rules (---, ***, or ___) anywhere in the document
- Use spacing between sections instead of horizontal lines
- Use a clean, simple structure with consistent formatting
- Ensure proper spacing between sections for readability

IMPORTANT:
- DO NOT include any meta-commentary about the resume itself
- DO NOT include any text like "This resume effectively highlights..." or "Let me know if you need any further modifications"
- DO NOT mention that the content is generated or optimized for ATS
- End the resume with "References available upon request." and nothing else
`;

    logger.info('Sending request to OpenAI...');

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS-optimization specialist and professional resume writer with deep knowledge of how Applicant Tracking Systems parse and score documents. You create well-structured, compelling resumes in markdown format that achieve high ATS scores while remaining engaging for human readers. Your resumes strategically incorporate keywords with optimal density (5-8%), use industry-standard terminology, highlight measurable achievements with specific metrics, and present the candidate\'s unique value proposition in a clear, concise manner. You understand the importance of keyword placement, using exact match terms from the resume, and incorporating both acronyms and spelled-out terms. You focus on specific accomplishments with quantifiable results rather than generic statements and ensure all content is precisely tailored to the candidate\'s target role and industry. You use ATS-friendly formatting with standard section headings, clean structure, and proper spacing. NEVER use horizontal rules (---, ***, or ___) in your markdown. Use spacing between sections instead of horizontal lines. NEVER include any meta-commentary about the resume itself. NEVER include any text like "This resume effectively highlights..." or "Let me know if you need any further modifications". NEVER mention that the content is generated or optimized for ATS. End the resume with "References available upon request." and nothing else.'
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
