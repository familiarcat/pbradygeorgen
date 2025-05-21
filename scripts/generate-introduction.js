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

    // Create the prompt with Salinger narrative style and ATS optimization
    const prompt = `
I need you to create a professional introduction based on the following resume content.
This introduction will be used as a cover letter that will be processed by Applicant Tracking Systems (ATS)
as well as read by hiring managers. Format the output as markdown.

Resume Content:
${resumeContent}

User Information:
- Name: ${userName}
- Title: ${userTitle}
- Industry: ${userIndustry}
- Skills: ${userSkills.join(', ')}
- ATS Keywords: ${userKeywords.join(', ')}
- Email: ${userEmail}
- Phone: ${userPhone}
- Location: ${userLocation}

Please create a brief, precise introduction that balances clarity and precision with professional ethics:
1. Starts with a title "# ${userName} - Introduction"
2. Uses a clear, precise, and professionally approachable tone
3. Provides a concise overview of the candidate's career journey, emphasizing both competence and purpose
4. States 2-3 key skills directly and efficiently
5. Expresses commitment to professional principles in the industry
6. Includes a clear statement about the values that drive the candidate professionally
7. Incorporates 3-5 industry-specific terms that will be recognized by ATS systems
8. Concludes with a direct statement about what the candidate considers essential in their next role

IMPORTANT: The entire introduction should be readable in about 20 seconds (approximately 150 words maximum, excluding the title). Focus on quality over quantity - every sentence should provide meaningful insight into the candidate's professional identity, ethical framework, and rational approach to their career.

Professional Style Guidelines:
- Write in first person with a clear, precise voice that conveys professional competence
- Use concise, grammatically correct sentences (15-20 words maximum per sentence)
- Avoid ambiguity, vagueness, and unnecessary complexity
- Employ direct, straightforward language that communicates exactly what is meant
- Include precise statements about professional experience and qualifications
- Express commitment to both the work itself and the ethical principles that guide it
- Avoid both clichés and overly theoretical language
- Balance logical precision with universal principles
- Clearly articulate how the candidate's skills serve a larger professional purpose
- Include specific details that demonstrate the candidate's commitment to professional standards
- Use active voice and precise verbs
- Maintain consistent, simple sentence structure for clarity
- Ensure the tone is approachable and relatable to hiring managers

ATS Optimization Guidelines (to be applied subtly):
- Naturally incorporate exact job title and skill keywords from the resume
- Include industry-specific technical terms, tools, and methodologies within the narrative
- Use both spelled-out terms and acronyms where it feels natural
- Ensure keyword density is natural (5-8% keyword density is optimal)
- Include both hard skills (technical abilities) and soft skills (communication, leadership)
- Match keywords to the candidate's industry and job level

Formatting Guidelines:
- Structure as a very concise, cohesive letter (approximately 150 words maximum)
- Use 2-3 short paragraphs total for the main body of the introduction
- Aim for 3-5 sentences per paragraph maximum
- Keep sentences short and direct (15-20 words maximum per sentence)
- Use simple sentence structures with minimal subordinate clauses
- Break complex ideas into multiple simple sentences
- Eliminate all unnecessary words and phrases
- Use no headings except for the title
- Use active voice and language that balances conversational tone with professional dignity
- DO NOT use horizontal rules (---, ***, or ___) anywhere in the document
- Use one line break between paragraphs for readability
- NEVER use placeholder metrics or vague percentages
- Only include specific, concrete metrics if they appear in the resume and are truly impactful
- Prioritize statements about professional duty, ethical principles, and universal standards in the field
- Include at least one statement that reflects Kant's categorical imperative - what the candidate believes all professionals in their field should do
- End with a proper closing salutation that includes:
  * A brief closing statement (e.g., "Sincerely," or "Best regards,")
  * The candidate's full name
  * The candidate's email and phone number on separate lines

IMPORTANT:
- Do NOT include any meta-commentary about the introduction itself
- Do NOT add any text like "This introduction is tailored to..." or any explanations about how the introduction was created
- Do NOT mention that any content was extracted from a resume or other document
- The document should appear as if it was written directly and personally by the candidate
- NEVER use generic percentages or metrics - only include specific numbers that appear in the resume
`;

    logger.info('Sending request to OpenAI...');

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a gifted writer who creates extremely concise, impactful professional introductions (150 words maximum) while subtly incorporating ATS keywords. You create introductions that balance logical precision with professional principles, can be read in about 20 seconds, and convey both the essence of a person\'s career journey and their commitment to professional standards. Your writing has a clear, precise voice that communicates professional competence while remaining approachable. You excel at writing clear, grammatically concise sentences (15-20 words maximum per sentence) and avoid ambiguity, vagueness, and unnecessary complexity. You distill complex career journeys into 2-3 brief paragraphs that capture professional qualifications and values. You use direct, straightforward language that communicates exactly what is meant. You balance logical precision with ethical principles, selecting details that demonstrate how the candidate\'s work aligns with industry standards. You incorporate 3-5 industry-specific terms precisely within your concise narrative. You include at least one statement reflecting what the candidate believes all professionals in their field should prioritize. You never use placeholder metrics or vague percentages. You structure content as a very brief, cohesive letter with minimal formatting. You always end with a proper closing salutation that includes a brief closing statement (e.g., "Sincerely," or "Best regards,"), the candidate\'s full name, and their email and phone number on separate lines. NEVER add meta-commentary or explanations about how the introduction was created. NEVER mention that content was extracted from a resume. NEVER mention philosophers or authors by name. The introduction should appear as if written directly and personally by the candidate. NEVER use horizontal rules in your markdown.'
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

    // Create a concise, precise, and approachable professional introduction
    const introduction = `# ${userName} - Introduction

As a ${userTitle}, I approach my work with precision and a strong sense of professional responsibility. My expertise lies in developing efficient systems and implementing industry best practices. I consistently apply analytical thinking to solve complex problems and maintain high standards of quality.

${userSkills.length > 0 ? `My professional experience in ${userSkills.slice(0, 2).join(' and ')} has equipped me to deliver measurable results. I believe that technical excellence must always align with ethical considerations. This balanced approach ensures that my work meets both functional requirements and professional standards.` : `My professional approach centers on practical problem-solving and responsible implementation. I develop systems that balance technical efficiency with ethical considerations. This methodology ensures that my work serves both immediate objectives and long-term goals.`}

I'm seeking a position where I can apply my expertise to advance an organization's goals while maintaining high professional standards. I look forward to discussing how my qualifications align with your team's needs.

Sincerely,

${userName}
${userEmail || '[your email]'}
${userPhone || '[your phone]'}
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
