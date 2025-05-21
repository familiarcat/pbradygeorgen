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

Please create a brief, pointed narrative-style introduction that balances Salinger's storytelling with Kantian professional ethics:
1. Starts with a title "# ${userName} - Introduction"
2. Uses a personal yet professionally dignified tone that feels authentic and principled
3. Provides a concise glimpse of the candidate's career journey, emphasizing both duty and purpose
4. Weaves in 2-3 key skills naturally within the narrative flow
5. Expresses genuine commitment to universal professional principles in the industry
6. Includes a brief statement about the moral imperatives that drive the candidate professionally
7. Subtly incorporates 3-5 industry-specific terms that will be recognized by ATS systems
8. Concludes with a brief statement about the candidate's professional categorical imperative - what they must do in their next role

IMPORTANT: The entire introduction should be readable in about 20 seconds (approximately 150 words maximum, excluding the title). Focus on quality over quantity - every sentence should provide meaningful insight into the candidate's professional identity, ethical framework, and rational approach to their career.

Salinger-Kant Hybrid Style Guidelines:
- Write in first person with an authentic voice that conveys both personality and rational dignity
- Use concise, grammatically correct sentences (15-20 words maximum per sentence)
- Avoid run-on sentences, complex clauses, and excessive comma usage
- Create a sense of both connection with the reader and respect for universal professional standards
- Include thoughtful reflections on how experiences have shaped the candidate's professional duty and purpose
- Express genuine commitment to both the work itself and the ethical principles that guide it
- Avoid both clichés and overly theoretical language
- Balance personal narrative (Salinger) with universal principles (Kant)
- Show how the candidate's skills serve both personal fulfillment and a larger professional purpose
- Include specific details that demonstrate the candidate's commitment to acting according to principles that could be universal laws in their field
- Use active voice and strong verbs
- Vary sentence structure but maintain simplicity and clarity

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
          content: 'You are a gifted writer who combines J.D. Salinger\'s authentic storytelling with Immanuel Kant\'s ethical framework to create extremely concise, impactful introductions (150 words maximum) while subtly incorporating ATS keywords. You create introductions that balance personal narrative with professional principles, can be read in about 20 seconds, and convey both the essence of a person\'s career journey and their commitment to universal professional standards. Your writing has a distinctive voice that creates an immediate connection with the reader while maintaining professional dignity. You excel at writing clear, grammatically concise sentences (15-20 words maximum per sentence) and avoid run-on sentences, complex clauses, and excessive comma usage. You distill complex career journeys into 2-3 brief paragraphs that capture both personal motivations and professional duty. You break complex ideas into multiple simple sentences with active voice and strong verbs. You balance Salinger\'s intimacy with Kant\'s rational principles, selecting details that demonstrate how the candidate\'s work aligns with universal ethical standards in their field. You incorporate 3-5 industry-specific terms naturally within your concise narrative. You include at least one statement reflecting Kant\'s categorical imperative - what the candidate believes all professionals in their field should do. You never use placeholder metrics or vague percentages. You structure content as a very brief, cohesive letter with minimal formatting. NEVER add meta-commentary or explanations about how the introduction was created. NEVER mention that content was extracted from a resume. The introduction should appear as if written directly and personally by the candidate. NEVER use horizontal rules in your markdown.'
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

    // Create a concise narrative-style introduction balancing Salinger with Kantian principles
    const introduction = `# ${userName} - Introduction

I first encountered ${userTitle.toLowerCase()} work as both an opportunity and a professional duty. I find deep satisfaction in bringing order to complex systems. My journey began with genuine curiosity about underlying structures. I remain committed to standards that transcend individual preferences.

${userSkills.length > 0 ? `My experience with ${userSkills.slice(0, 2).join(' and ')} has shaped my professional outlook. I believe excellence requires both technical skill and ethical judgment. My guiding principle is to create systems worthy of universal adoption. These systems must respect both efficiency and human dignity.` : `I am guided by a clear professional imperative in my work. I create systems worthy of universal adoption. These systems must respect both efficiency and human dignity. My work serves universal principles, not just immediate goals.`}

I seek a role where I can contribute to an organization valuing both innovation and ethical standards. I would welcome discussing how my approach aligns with your team's vision. Please contact me at ${userEmail || '[your email]'} or ${userPhone || '[your phone]'}.
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
