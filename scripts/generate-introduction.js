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

Please create a brief, pointed narrative-style introduction in the Salinger tradition that:
1. Starts with a title "# ${userName} - Introduction"
2. Uses a personal, conversational tone that feels authentic and human
3. Provides a concise glimpse of the candidate's career journey, core motivations, and aspirations
4. Weaves in 2-3 key skills naturally within the narrative flow
5. Expresses genuine passion for the industry in 1-2 impactful sentences
6. Includes a brief statement about what drives the candidate professionally
7. Subtly incorporates 3-5 industry-specific terms that will be recognized by ATS systems
8. Concludes with a brief statement about what the candidate is looking for in their next role

IMPORTANT: The entire introduction should be readable in about 20 seconds (approximately 150 words maximum, excluding the title). Focus on quality over quantity - every sentence should provide meaningful insight into the candidate's persona, goals, or motivations.

Salinger Narrative Style Guidelines:
- Write in first person with an authentic, distinctive voice
- Use natural language patterns that feel like genuine human writing
- Create a sense of intimacy and connection with the reader
- Include thoughtful reflections on experiences and what they've taught the candidate
- Express genuine enthusiasm and passion for the work
- Avoid clichés and corporate jargon when possible
- Balance professionalism with personality
- Show rather than tell about skills and capabilities
- Include small, specific details that make the narrative feel real and lived

ATS Optimization Guidelines (to be applied subtly):
- Naturally incorporate exact job title and skill keywords from the resume
- Include industry-specific technical terms, tools, and methodologies within the narrative
- Use both spelled-out terms and acronyms where it feels natural
- Ensure keyword density is natural (5-8% keyword density is optimal)
- Include both hard skills (technical abilities) and soft skills (communication, leadership)
- Match keywords to the candidate's industry and job level

Formatting Guidelines:
- Structure as a very concise, cohesive letter (approximately 150 words maximum)
- Use 2-3 short paragraphs total for the entire introduction
- Aim for 3-5 sentences per paragraph maximum
- Eliminate all unnecessary words and phrases
- Use no headings except for the title
- Use active voice and impactful, conversational language
- DO NOT use horizontal rules (---, ***, or ___) anywhere in the document
- Use one line break between paragraphs for readability
- NEVER use placeholder metrics or vague percentages
- Only include specific, concrete metrics if they appear in the resume and are truly impactful
- Prioritize statements about motivation, passion, and career goals over listing experiences

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
          content: 'You are a gifted writer in the tradition of J.D. Salinger who specializes in extremely concise, impactful introductions (150 words maximum) while subtly incorporating ATS keywords. You create authentic, personal introductions that can be read in about 20 seconds while still conveying the essence of a person\'s career motivations and aspirations. Your writing has a distinctive voice that creates an immediate connection with the reader through carefully chosen words and genuine enthusiasm. You distill complex career journeys into 2-3 brief paragraphs that capture the core of what drives a person professionally. You balance professionalism with personality, selecting only the most impactful details that make the narrative feel authentic. You incorporate 3-5 industry-specific terms naturally within the flow of your concise narrative. You never use placeholder metrics or vague percentages. You structure content as a very brief, cohesive letter with minimal formatting. NEVER add meta-commentary or explanations about how the introduction was created. NEVER mention that content was extracted from a resume. The introduction should appear as if written directly and personally by the candidate. NEVER use horizontal rules in your markdown.'
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

    // Create a concise narrative-style introduction in the Salinger tradition
    const introduction = `# ${userName} - Introduction

The first time I encountered the world of ${userTitle.toLowerCase()} work, I knew I had found my calling. There's something deeply satisfying about bringing order to complex systems and watching them function with newfound efficiency. My journey began with a genuine curiosity about how things work beneath the surface.

${userSkills.length > 0 ? `Working with ${userSkills.slice(0, 2).join(' and ')} has been both challenging and rewarding. What drives me is knowing my work makes a tangible difference. I believe that technology should serve people, not the other way around, and this philosophy guides my approach to every project.` : `What drives me professionally is knowing my work makes a tangible difference. I believe that technology should serve people, not the other way around, and this philosophy guides my approach to every project.`}

I'm seeking a role where I can contribute meaningfully to an organization that values innovation and thoughtful problem-solving. I would welcome the opportunity to discuss how my background might align with your team's needs. Please contact me at ${userEmail || '[your email]'} or ${userPhone || '[your phone]'}.
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
