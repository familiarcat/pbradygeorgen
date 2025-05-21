/**
 * Professional Introduction Generator
 *
 * This script creates compelling professional introductions that balance:
 * - Logical precision and clarity (influenced by analytical philosophy)
 * - Universal ethical principles and professional standards
 * - Authentic narrative elements that reveal genuine passion
 * - ATS optimization for modern hiring processes
 *
 * The resulting introduction maintains professional standards while incorporating
 * enough warmth and narrative depth to engage hiring managers on a human level.
 *
 * It runs during the prebuild process to ensure the content is available for the
 * header component.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./core/logger');
const config = require('./core/config');
const utils = require('./core/utils');
const { OpenAI } = require('openai');
const { infuseKatra, createKatraSystemMessage } = require('./core/katra-essence');

const logger = createLogger('professional-introduction');

/**
 * Generate a professional introduction from resume content
 *
 * Creates a compelling introduction that balances logical precision with narrative warmth.
 * The introduction follows professional standards while incorporating enough authentic
 * expression to engage hiring managers on a human level.
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

    // Create the prompt balancing logical precision with authentic expression and ATS optimization
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

Please create a brief, compelling introduction that balances clarity and precision with a touch of inspirational narrative:
1. Starts with a title "# ${userName} - Introduction"
2. Uses a clear, professionally approachable tone with moments of genuine warmth
3. IMPORTANT: Before writing, carefully analyze the chronological order of the candidate's experiences in the resume
4. Provides a concise overview of the candidate's career journey as a meaningful progression that STRICTLY follows the actual chronology from the resume
5. When mentioning specific roles or employers, maintain the exact chronological order as presented in the resume
6. For each accomplishment mentioned, explicitly state:
   - The specific technology or methodology used (e.g., Epic, Cerner, HL7)
   - The motivation or purpose behind using that technology
   - The measurable outcome or impact achieved (when available)
7. NEVER invent or assume chronological details that aren't explicitly stated in the resume
8. Expresses commitment to professional principles with authentic conviction
9. Includes a thoughtful statement about the values that drive the candidate professionally
10. Incorporates 3-5 industry-specific terms that will be recognized by ATS systems
11. Concludes with an inspiring yet practical statement about what the candidate hopes to bring to their next role

IMPORTANT: The entire introduction should be readable in about 20 seconds (approximately 150 words maximum, excluding the title). Focus on quality over quantity - every sentence should provide meaningful insight into the candidate's professional identity, ethical framework, and rational approach to their career.

Professional Style Guidelines with Narrative Warmth:
- Write in first person with a clear voice that conveys both professional competence and authentic passion
- Use concise, grammatically correct sentences (15-20 words maximum per sentence)
- Avoid ambiguity and unnecessary complexity while allowing for occasional expressive phrasing
- Balance direct language with thoughtfully chosen descriptive elements that add depth
- Include precise statements about professional experience with a sense of meaningful progression
- Express commitment to both the work itself and the values that guide it with genuine conviction
- Avoid both clichés and overly theoretical language
- Balance logical precision with moments of inspirational insight
- Articulate how the candidate's skills serve a larger professional purpose with authentic enthusiasm
- Include specific details that demonstrate the candidate's commitment to professional standards
- Use active voice and vivid verbs that convey both precision and energy
- Vary sentence structure while maintaining clarity and professionalism
- Ensure the tone is approachable, relatable, and subtly inspiring to hiring managers

ATS Optimization Guidelines (to be applied subtly):
- Naturally incorporate exact job title and skill keywords from the resume
- From the provided skills list, select 3-5 of the most relevant and impactful skills to highlight
- Prioritize skills that demonstrate unique value, technical expertise, or specialized knowledge
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
- CRITICAL: Maintain strict chronological accuracy when mentioning roles, employers, or time periods
- When describing career progression, always follow the exact chronological order presented in the resume
- NEVER invent or assume chronological details that aren't explicitly stated in the resume
- If the chronology is unclear in the resume, focus on skills and accomplishments without specifying a timeline
- Prioritize statements about professional duty, ethical principles, and universal standards in the field
- Include at least one statement about universal professional principles - what the candidate believes all professionals in their field should uphold
- End with a proper closing salutation that includes:
  * A brief closing statement (e.g., "Sincerely," or "Best regards,")
  * The candidate's full name
  * The candidate's email and phone number on separate lines

Logical Precision Guidelines:
- Before writing, carefully map out the chronological structure of the candidate's career
- Identify the exact sequence of roles, employers, and time periods from the resume
- Ensure all statements about the candidate's career progression follow this exact chronological sequence
- When mentioning multiple roles or employers, always present them in the correct chronological order
- If specific dates are mentioned in the resume, respect these exact timeframes
- If the chronology is ambiguous in the resume, avoid making specific chronological claims
- Double-check all factual claims against the resume content before finalizing

IMPORTANT:
- Do NOT include any meta-commentary about the introduction itself
- Do NOT add any text like "This introduction is tailored to..." or any explanations about how the introduction was created
- Do NOT mention that any content was extracted from a resume or other document
- The document should appear as if it was written directly and personally by the candidate
- NEVER use generic percentages or metrics - only include specific numbers that appear in the resume
`;

    logger.info('Sending request to OpenAI...');

    // Call OpenAI API with Katra-infused system message
    const systemContent = 'You are a gifted writer who creates extremely concise, impactful professional introductions (150 words maximum) while subtly incorporating ATS keywords. You create introductions that balance logical precision with professional principles and a touch of inspirational narrative, can be read in about 20 seconds, and convey both the essence of a person\'s career journey and their commitment to professional standards. Your writing has a clear voice that communicates professional competence while remaining approachable and occasionally revealing authentic passion. You excel at writing clear, grammatically concise sentences (15-20 words maximum per sentence) and avoid ambiguity and unnecessary complexity while allowing for occasional expressive phrasing. You distill complex career journeys into 2-3 brief paragraphs that capture professional qualifications, values, and a sense of meaningful progression. You are meticulous about maintaining chronological accuracy and logical precision. Before writing, you carefully analyze the resume to understand the exact timeline of the candidate\'s career progression. You NEVER invent or assume chronological details that aren\'t explicitly stated in the resume. You maintain the exact chronological order of roles, employers, and accomplishments as presented in the resume. For each accomplishment you mention, you explicitly state: (1) the specific technology or methodology used, (2) the motivation or purpose behind using that technology, and (3) the measurable outcome or impact achieved when available. You balance direct language with thoughtfully chosen descriptive elements that add depth. When presented with a list of skills, you intelligently select 3-5 of the most relevant and impactful skills to highlight based on the resume content and industry context. You prioritize skills that demonstrate unique value, technical expertise, or specialized knowledge. You incorporate these selected skills precisely within your concise narrative. You include at least one statement reflecting what the candidate believes all professionals in their field should prioritize, expressed with genuine conviction. You use active voice and vivid verbs that convey both precision and energy. You never use placeholder metrics or vague percentages. You structure content as a very brief, cohesive letter with minimal formatting. You always end with a proper closing salutation that includes a brief closing statement (e.g., "Sincerely," or "Best regards,"), the candidate\'s full name, and their email and phone number on separate lines. NEVER add meta-commentary or explanations about how the introduction was created. NEVER mention that content was extracted from a resume. NEVER mention philosophers or authors by name. The introduction should appear as if written directly and personally by the candidate. NEVER use horizontal rules in your markdown.';

    const response = await openai.chat.completions.create({
      model: config.openai.model || 'gpt-3.5-turbo',
      messages: [
        createKatraSystemMessage(systemContent),
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
 * Generate a fallback professional introduction when OpenAI is not available
 *
 * Creates a balanced introduction that maintains professional standards while
 * incorporating authentic expression and narrative elements. The fallback
 * follows the same philosophical principles as the AI-generated version but
 * with predefined structure and content.
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

    // Helper function to select a relevant skill from the skills array
    function selectRelevantSkill(skills, preferredIndex) {
      // If the preferred index exists, use it
      if (skills.length > preferredIndex) {
        return skills[preferredIndex];
      }
      // Otherwise, use a random skill from the available skills
      if (skills.length > 0) {
        return skills[Math.floor(Math.random() * skills.length)];
      }
      // Fallback values if no skills are available
      const fallbacks = ['advanced methodologies', 'specialized systems', 'industry best practices'];
      return fallbacks[preferredIndex % fallbacks.length];
    }

    // Helper function to select 2 relevant skills from the skills array
    function selectRelevantSkills(skills, count) {
      if (skills.length <= count) {
        return skills.join(' and ');
      }

      // Select 'count' skills from the array, prioritizing the first few
      const selectedSkills = [];

      // Always include the first skill if available
      if (skills.length > 0) {
        selectedSkills.push(skills[0]);
      }

      // Add one more skill, preferably from a different part of the array
      if (skills.length > 3) {
        selectedSkills.push(skills[3]);
      } else if (skills.length > 1) {
        selectedSkills.push(skills[1]);
      }

      return selectedSkills.join(' and ');
    }

    // Create a concise, compelling introduction balancing logical precision with authentic expression
    let firstParagraph = `As a ${userTitle}, I approach my work with both precision and genuine passion for excellence. My journey has been shaped by implementing ${userSkills.length > 0 ? userSkills[0] : 'industry-standard'} systems to streamline operations and enhance data integrity. `;

    firstParagraph += userSkills.length > 0
      ? `I've utilized ${selectRelevantSkill(userSkills, 1)} to develop solutions that not only meet technical requirements but significantly improve workflow efficiency for stakeholders.`
      : "I've utilized advanced methodologies to develop solutions that not only meet technical requirements but significantly improve workflow efficiency for stakeholders.";

    let secondParagraph = userSkills.length > 0
      ? `My experience with ${selectRelevantSkills(userSkills, 2)} has enabled me to address complex challenges with targeted technological approaches. By implementing ${selectRelevantSkill(userSkills, 2)}, I've achieved measurable improvements in process efficiency while maintaining rigorous compliance standards. This balanced approach ensures that technical excellence always serves a meaningful purpose, resulting in solutions that deliver tangible benefits to organizations.`
      : `Throughout my career, I've strategically applied analytical methodologies to identify system inefficiencies and implement targeted improvements. By integrating user-centered design principles with robust technical frameworks, I've developed solutions that consistently exceed performance benchmarks while enhancing user experience. This commitment to purposeful implementation has been the cornerstone of my professional success.`;

    const introduction = `# ${userName} - Introduction

${firstParagraph}

${secondParagraph}

I'm seeking a role where I can apply these proven approaches to contribute meaningful technological advancements to an organization that values both innovation and integrity. I look forward to discussing how my expertise might align with your specific objectives.

Sincerely,

${userName}
${userEmail || '[your email]'}
${userPhone || '[your phone]'}`;

    // Save the introduction
    const outputDir = options.outputDir || path.dirname(resumeContentPath);
    const outputPath = path.join(outputDir, 'introduction.md');
    utils.saveText(outputPath, introduction);

    logger.success(`Fallback introduction saved to: ${outputPath} `);

    return {
      success: true,
      introduction,
      outputPath
    };
  } catch (error) {
    logger.error(`Error generating fallback introduction: ${error.message} `);
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
        console.error(`Failed to generate introduction: ${result.error} `);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`Error: ${error.message} `);
      process.exit(1);
    });
}

module.exports = {
  generateIntroduction
};
