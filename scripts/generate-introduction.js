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

Please create a narrative-style introduction in the Salinger tradition that:
1. Starts with a title "# ${userName} - Introduction"
2. Uses a personal, conversational tone that feels authentic and human
3. Tells a cohesive story about the candidate's career journey, motivations, and aspirations
4. Weaves in key skills and experiences naturally within the narrative flow
5. Expresses genuine passion for the industry and the candidate's specific role
6. Includes personal values and what drives the candidate professionally
7. Subtly incorporates industry-specific terminology that will be recognized by ATS systems
8. Concludes with what the candidate is looking for in their next role and why they're a good fit

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
- Structure as a cohesive letter rather than a list of achievements
- Use paragraphs instead of bullet points for a more narrative flow
- Include 1-2 short paragraphs for each major career phase or theme
- Use minimal headings - only where they enhance readability
- Be concise and focused, suitable for a single-page PDF
- Use active voice and conversational language
- DO NOT use horizontal rules (---, ***, or ___) anywhere in the document
- Ensure proper spacing between paragraphs for readability
- NEVER use placeholder metrics or vague percentages (like "increased efficiency by XX%")
- Only include specific, concrete metrics if they appear in the resume

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
          content: 'You are a gifted writer in the tradition of J.D. Salinger who also understands ATS optimization. You create authentic, personal introductions in a narrative style that feels genuinely human while subtly incorporating keywords for ATS systems. Your writing has a distinctive voice and creates an intimate connection with the reader through thoughtful reflection and genuine enthusiasm. You craft cohesive stories about career journeys that weave in skills and experiences naturally, avoiding corporate clichés and jargon when possible. You balance professionalism with personality, showing rather than telling about capabilities through specific details that make the narrative feel lived. You understand how to incorporate industry terminology and keywords (5-8% density) in a way that feels completely natural to human readers. You never use placeholder metrics or vague percentages - only concrete numbers from the resume. You structure content as a cohesive letter with paragraphs rather than bullet points, using minimal headings. NEVER add meta-commentary or explanations about how the introduction was created. NEVER mention that content was extracted from a resume or other document. The introduction should appear as if written directly and personally by the candidate. NEVER use horizontal rules (---, ***, or ___) in your markdown.'
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

    // Create a narrative-style introduction in the Salinger tradition
    const introduction = `# ${userName} - Introduction

The first time I encountered the world of ${userTitle.toLowerCase()} work, I knew I had found my calling. There's something deeply satisfying about bringing order to complex systems and watching as they begin to function with newfound efficiency. Throughout my career, I've been fortunate to work with talented teams who have helped shape my approach to problem-solving and innovation.

My journey in this field began with a genuine curiosity about how things work beneath the surface. I've always been the type of person who needs to understand the "why" behind processes before I can truly contribute to improving them. This natural inclination has served me well as I've navigated various challenges across different organizations.

${userSkills.length > 0 ? `Working with ${userSkills.slice(0, 3).join(', ')}, and other technologies has been both challenging and rewarding. I find particular joy in those moments when a complex problem suddenly reveals its solution after days of careful analysis.` : `Working with various technologies and methodologies has been both challenging and rewarding. I find particular joy in those moments when a complex problem suddenly reveals its solution after days of careful analysis.`}

What drives me professionally is the knowledge that my work makes a tangible difference. When I implement a solution that helps colleagues work more efficiently or improves service delivery, I feel a sense of purpose that transcends the technical aspects of the job. I believe that technology should serve people, not the other way around, and this philosophy guides my approach to every project.

My experiences have taught me the value of clear communication and collaboration. I've learned that the most elegant technical solution will fail if it doesn't address the actual needs of the people who will use it. This understanding has made me a better listener and a more effective team member.

Looking ahead, I'm seeking a role where I can continue to grow while contributing meaningfully to an organization that values innovation and thoughtful problem-solving. I'm particularly drawn to environments where continuous learning is encouraged and where I can work alongside others who share my passion for excellence.

I would welcome the opportunity to discuss how my background and approach might align with your team's needs. Please feel free to contact me at ${userEmail || '[your email]'} or ${userPhone || '[your phone]'} to arrange a conversation.

${userLocation ? `Based in ${userLocation}, I am` : 'I am'} ready for new challenges and excited about the possibilities that lie ahead.
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
