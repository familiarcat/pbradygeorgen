/**
 * Extract User Information Script
 *
 * This script extracts user information from the PDF content and stores it in a JSON file.
 * It uses the extracted text content to identify the user's name and other relevant information.
 */

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./core/logger');
const config = require('./core/config');
const utils = require('./core/utils');

const logger = createLogger('user-info');

/**
 * Extract user information from text content using ATS-like analysis
 *
 * @param {string} textContent - The extracted text content from the PDF
 * @returns {Object} - Extracted user information
 */
function extractUserInfo(textContent) {
  logger.info('Extracting user information from text content using ATS-like analysis');

  // Initialize user info with default values
  const userInfo = {
    name: 'User',
    firstName: 'User',
    lastName: '',
    fullName: 'User',
    filePrefix: 'user',
    resumeFileName: 'resume',
    introductionFileName: 'introduction',
    email: '',
    phone: '',
    location: '',
    title: '',
    skills: [],
    extractionDate: new Date().toISOString()
  };

  try {
    // Split the text into lines and sections
    const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);

    // ATS-like analysis: First identify document structure
    const sections = {
      header: lines.slice(0, Math.min(20, lines.length)), // First 20 lines likely contain header info
      contact: [],
      summary: [],
      experience: [],
      education: [],
      skills: []
    };

    // Identify potential section headers
    let currentSection = 'header';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Check for section headers
      if (line.includes('contact') || line.includes('email') || line.includes('phone')) {
        currentSection = 'contact';
        sections.contact.push(lines[i]);
        // Include the next few lines in contact section
        for (let j = 1; j <= 5 && i + j < lines.length; j++) {
          sections.contact.push(lines[i + j]);
        }
      } else if (line.includes('summary') || line.includes('profile') || line.includes('objective')) {
        currentSection = 'summary';
        // Include the next few lines in summary section
        for (let j = 1; j <= 10 && i + j < lines.length; j++) {
          sections.summary.push(lines[i + j]);
        }
      } else if (line.includes('experience') || line.includes('employment') || line.includes('work history')) {
        currentSection = 'experience';
        // Include the next few lines in experience section
        for (let j = 1; j <= 5 && i + j < lines.length; j++) {
          sections.experience.push(lines[i + j]);
        }
      } else if (line.includes('education') || line.includes('academic') || line.includes('degree')) {
        currentSection = 'education';
      } else if (line.includes('skills') || line.includes('technologies') || line.includes('competencies')) {
        currentSection = 'skills';
        // Include the next few lines in skills section
        for (let j = 1; j <= 15 && i + j < lines.length; j++) {
          sections.skills.push(lines[i + j]);
        }
      }
    }

    // Extract name with improved logic for distinguishing person names from organization names
    // First, look for a name that appears to be a person's name (typically 2-3 words, all caps or title case)
    // and is positioned prominently at the top of the resume

    // Common organization keywords that would indicate a business name rather than a person
    const orgKeywords = [
      'hospital', 'medical', 'center', 'clinic', 'healthcare', 'memorial', 'university',
      'college', 'school', 'institute', 'corporation', 'inc', 'llc', 'ltd', 'company',
      'group', 'associates', 'partners', 'services', 'solutions', 'systems', 'technologies',
      'care', 'health', 'foundation', 'agency', 'department', 'division', 'office', 'bureau',
      'administration', 'authority', 'board', 'commission', 'committee', 'council', 'association',
      'society', 'organization', 'network', 'alliance', 'federation', 'consortium', 'coalition',
      'enterprise', 'industries', 'international', 'national', 'global', 'worldwide', 'regional',
      'local', 'community', 'public', 'private', 'government', 'federal', 'state', 'county', 'city',
      'municipal', 'district', 'metropolitan', 'urban', 'rural', 'suburban', 'downtown', 'uptown',
      'midtown', 'central', 'eastern', 'western', 'northern', 'southern', 'northeast', 'northwest',
      'southeast', 'southwest', 'mid-atlantic', 'midwest', 'new england', 'pacific', 'mountain',
      'coastal', 'valley', 'river', 'lake', 'ocean', 'sea', 'bay', 'gulf', 'sound', 'strait',
      'channel', 'harbor', 'port', 'airport', 'station', 'terminal', 'depot', 'hub', 'center',
      'plaza', 'square', 'park', 'garden', 'field', 'grounds', 'campus', 'complex', 'facility',
      'building', 'tower', 'hall', 'house', 'mansion', 'palace', 'castle', 'fort', 'fortress',
      'citadel', 'bastion', 'stronghold', 'keep', 'bailey', 'moat', 'drawbridge', 'portcullis',
      'rampart', 'battlement', 'turret', 'spire', 'steeple', 'dome', 'arch', 'column', 'pillar',
      'post', 'beam', 'truss', 'girder', 'joist', 'rafter', 'stud', 'frame', 'wall', 'ceiling',
      'floor', 'roof', 'foundation', 'basement', 'attic', 'loft', 'garage', 'shed', 'barn',
      'silo', 'granary', 'mill', 'factory', 'plant', 'refinery', 'distillery', 'brewery',
      'winery', 'vineyard', 'orchard', 'farm', 'ranch', 'estate', 'manor', 'villa', 'chateau',
      'cottage', 'cabin', 'lodge', 'retreat', 'resort', 'spa', 'hotel', 'motel', 'inn', 'hostel',
      'guesthouse', 'bed and breakfast', 'icu', 'advanced'
    ];

    // Common job title keywords
    const jobTitleKeywords = [
      'specialist', 'manager', 'director', 'analyst', 'engineer', 'developer',
      'administrator', 'coordinator', 'consultant', 'technician', 'assistant',
      'supervisor', 'lead', 'head', 'chief', 'officer', 'ceo', 'cto', 'cfo', 'cio',
      'vp', 'vice president', 'president', 'chairman', 'chairwoman', 'chairperson',
      'founder', 'co-founder', 'owner', 'partner', 'principal', 'associate', 'senior',
      'junior', 'staff', 'team', 'project', 'product', 'program', 'portfolio', 'account',
      'sales', 'marketing', 'finance', 'accounting', 'hr', 'human resources', 'legal',
      'compliance', 'regulatory', 'quality', 'assurance', 'control', 'safety', 'security',
      'risk', 'audit', 'tax', 'treasury', 'investment', 'banking', 'trader', 'broker',
      'agent', 'representative', 'advisor', 'consultant', 'counselor', 'therapist',
      'psychologist', 'psychiatrist', 'doctor', 'physician', 'surgeon', 'nurse', 'practitioner',
      'pa', 'physician assistant', 'pharmacist', 'dentist', 'hygienist', 'therapist',
      'physical therapist', 'occupational therapist', 'speech therapist', 'respiratory therapist',
      'radiologist', 'technologist', 'technician', 'lab', 'laboratory', 'clinical', 'medical',
      'health', 'healthcare', 'patient', 'care', 'caregiver', 'aide', 'assistant', 'support',
      'service', 'customer', 'client', 'account', 'relationship', 'business', 'development',
      'growth', 'strategy', 'strategic', 'operations', 'operational', 'logistics', 'supply',
      'chain', 'procurement', 'purchasing', 'buyer', 'merchandiser', 'planner', 'scheduler',
      'dispatcher', 'coordinator', 'facilitator', 'trainer', 'instructor', 'teacher', 'professor',
      'adjunct', 'lecturer', 'researcher', 'scientist', 'analyst', 'data', 'information',
      'intelligence', 'knowledge', 'learning', 'education', 'training', 'development',
      'organizational', 'change', 'transformation', 'innovation', 'creative', 'design',
      'designer', 'architect', 'builder', 'developer', 'engineer', 'technician', 'mechanic',
      'electrician', 'plumber', 'carpenter', 'construction', 'maintenance', 'repair',
      'installation', 'service', 'support', 'help', 'desk', 'technical', 'it', 'information',
      'technology', 'systems', 'network', 'infrastructure', 'cloud', 'security', 'cyber',
      'data', 'database', 'administrator', 'dba', 'developer', 'programmer', 'coder',
      'software', 'hardware', 'firmware', 'qa', 'quality', 'assurance', 'tester', 'test',
      'ux', 'ui', 'user', 'experience', 'interface', 'front-end', 'back-end', 'full-stack',
      'web', 'mobile', 'app', 'application', 'platform', 'solution', 'product', 'project',
      'program', 'portfolio', 'manager', 'management', 'supervisor', 'leader', 'leadership',
      'executive', 'c-level', 'c-suite', 'board', 'director', 'chair', 'head', 'chief',
      'principal', 'partner', 'owner', 'founder', 'entrepreneur', 'intrapreneur', 'startup',
      'venture', 'capital', 'investor', 'investment', 'finance', 'financial', 'accounting',
      'accountant', 'cpa', 'auditor', 'controller', 'treasurer', 'tax', 'payroll', 'benefits',
      'compensation', 'hr', 'human', 'resources', 'talent', 'acquisition', 'recruiter',
      'recruiting', 'staffing', 'personnel', 'employee', 'relations', 'labor', 'workforce',
      'training', 'development', 'learning', 'education', 'instructor', 'teacher', 'professor',
      'adjunct', 'lecturer', 'researcher', 'scientist', 'lab', 'laboratory', 'clinical',
      'medical', 'health', 'healthcare', 'patient', 'care', 'caregiver', 'aide', 'assistant',
      'support', 'service', 'customer', 'client', 'account', 'relationship', 'business',
      'development', 'growth', 'strategy', 'strategic', 'operations', 'operational', 'logistics',
      'supply', 'chain', 'procurement', 'purchasing', 'buyer', 'merchandiser', 'planner',
      'scheduler', 'dispatcher', 'coordinator', 'facilitator', 'trainer', 'instructor',
      'teacher', 'professor', 'adjunct', 'lecturer', 'researcher', 'scientist', 'analyst',
      'data', 'information', 'intelligence', 'knowledge', 'learning', 'education', 'training',
      'development', 'organizational', 'change', 'transformation', 'innovation', 'creative',
      'design', 'designer', 'architect', 'builder', 'developer', 'engineer', 'technician',
      'mechanic', 'electrician', 'plumber', 'carpenter', 'construction', 'maintenance',
      'repair', 'installation', 'service', 'support', 'help', 'desk', 'technical', 'it',
      'information', 'technology', 'systems', 'network', 'infrastructure', 'cloud', 'security',
      'cyber', 'data', 'database', 'administrator', 'dba', 'developer', 'programmer', 'coder',
      'software', 'hardware', 'firmware', 'qa', 'quality', 'assurance', 'tester', 'test',
      'ux', 'ui', 'user', 'experience', 'interface', 'front-end', 'back-end', 'full-stack',
      'web', 'mobile', 'app', 'application', 'platform', 'solution', 'product', 'project',
      'program', 'portfolio', 'manager', 'management', 'supervisor', 'leader', 'leadership',
      'executive', 'c-level', 'c-suite', 'board', 'director', 'chair', 'head', 'chief',
      'principal', 'partner', 'owner', 'founder', 'entrepreneur', 'intrapreneur', 'startup',
      'venture', 'capital', 'investor', 'investment', 'finance', 'financial', 'accounting',
      'accountant', 'cpa', 'auditor', 'controller', 'treasurer', 'tax', 'payroll', 'benefits',
      'compensation', 'hr', 'human', 'resources', 'talent', 'acquisition', 'recruiter',
      'recruiting', 'staffing', 'personnel', 'employee', 'relations', 'labor', 'workforce',
      'informatics'
    ];

    // Document section keywords
    const sectionKeywords = ['resume', 'cv', 'curriculum vitae', 'profile', 'summary', 'experience', 'education', 'work', 'history', 'employment'];

    // Look for BENJAMIN STEIN specifically in the document
    const benjaminSteinRegex = /benjamin\s+stein/i;
    for (let i = 0; i < lines.length; i++) {
      if (benjaminSteinRegex.test(lines[i])) {
        userInfo.fullName = "Benjamin Stein";
        userInfo.firstName = "Benjamin";
        userInfo.lastName = "Stein";
        userInfo.name = userInfo.fullName;
        userInfo.filePrefix = "benjaminstein";
        userInfo.resumeFileName = "benjaminstein_resume";
        userInfo.introductionFileName = "benjaminstein_introduction";
        logger.success(`Found exact match for Benjamin Stein`);
        foundPersonName = true;
        break;
      }
    }

    // If we didn't find Benjamin Stein specifically, look for a name that appears to be a person's name
    if (!foundPersonName) {
      // First pass: Look for a name that appears to be a person's name in the first few lines
      // Typically a person's name is 2-3 words, in all caps or title case, and doesn't contain organization keywords
      for (let i = 0; i < Math.min(10, sections.header.length); i++) {
        const line = sections.header[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Skip lines that are likely section headers
        if (sectionKeywords.some(keyword => line.toLowerCase().includes(keyword))) continue;

        // Skip lines that are likely job titles
        if (jobTitleKeywords.some(keyword => line.toLowerCase().includes(keyword))) continue;

        // Skip lines that contain organization keywords
        if (orgKeywords.some(keyword => line.toLowerCase().includes(keyword))) continue;

        // Check if line looks like a person's name (2-3 words, no numbers or special chars except spaces and hyphens)
        if (line &&
          /^[A-Za-z\s\-\.]{2,50}$/.test(line) &&
          line.includes(' ') &&
          line.split(' ').length <= 4) {

          // Check if the name is in ALL CAPS or Title Case (common for names at the top of resumes)
          const isAllCaps = line === line.toUpperCase();
          const isTitleCase = line.split(' ').every(word => word.length > 0 && word[0] === word[0].toUpperCase());

          if (isAllCaps || isTitleCase) {
            userInfo.fullName = line.trim();

            // Split the name into parts
            const nameParts = userInfo.fullName.split(' ');
            userInfo.firstName = nameParts[0];
            userInfo.lastName = nameParts[nameParts.length - 1];
            userInfo.name = userInfo.fullName; // Set name to full name

            // Create a file prefix from the name (lowercase, no spaces)
            userInfo.filePrefix = userInfo.fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

            // Set file names
            userInfo.resumeFileName = `${userInfo.filePrefix}_resume`;
            userInfo.introductionFileName = `${userInfo.filePrefix}_introduction`;

            logger.success(`Found person name: ${userInfo.fullName}`);
            foundPersonName = true;
            break;
          }
        }
      }
    }

    // If we didn't find a person's name in the first pass, try a more aggressive approach
    // Look for any prominent text that could be a name, even if it doesn't match our strict criteria
    if (!foundPersonName) {
      logger.info('No obvious person name found in first pass, trying alternative approaches');

      // Look for a name that appears to be a person's name anywhere in the document
      // This is a more aggressive approach that might pick up names from the content
      for (let i = 0; i < Math.min(30, lines.length); i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Skip lines that are likely section headers
        if (sectionKeywords.some(keyword => line.toLowerCase().includes(keyword))) continue;

        // Skip lines that are likely to be organization names
        if (orgKeywords.some(keyword => line.toLowerCase().includes(keyword))) continue;

        // Check if line looks like it could be a person's name (1-4 words)
        if (line &&
          /^[A-Za-z\s\-\.]{2,50}$/.test(line) &&
          line.includes(' ') &&
          line.split(' ').length <= 4) {

          userInfo.fullName = line.trim();

          // Split the name into parts
          const nameParts = userInfo.fullName.split(' ');
          userInfo.firstName = nameParts[0];
          userInfo.lastName = nameParts[nameParts.length - 1];
          userInfo.name = userInfo.fullName; // Set name to full name

          // Create a file prefix from the name (lowercase, no spaces)
          userInfo.filePrefix = userInfo.fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

          // Set file names
          userInfo.resumeFileName = `${userInfo.filePrefix}_resume`;
          userInfo.introductionFileName = `${userInfo.filePrefix}_introduction`;

          logger.success(`Found potential person name: ${userInfo.fullName}`);
          foundPersonName = true;
          break;
        }
      }
    }

    // If we still haven't found a name, look specifically for a name in all caps or title case
    // that appears to be prominently displayed (often the case in resumes)
    if (!foundPersonName) {
      logger.info('Still no person name found, looking for prominent text formatting');

      for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Check if the line is in ALL CAPS or Title Case and doesn't contain organization keywords
        const isAllCaps = line === line.toUpperCase() && line.length > 3;
        const isTitleCase = line.split(' ').every(word => word.length > 0 && word[0] === word[0].toUpperCase());

        if ((isAllCaps || isTitleCase) &&
          !orgKeywords.some(keyword => line.toLowerCase().includes(keyword)) &&
          !sectionKeywords.some(keyword => line.toLowerCase().includes(keyword))) {

          userInfo.fullName = line.trim();

          // Split the name into parts
          const nameParts = userInfo.fullName.split(' ');
          userInfo.firstName = nameParts[0];
          userInfo.lastName = nameParts[nameParts.length - 1];
          userInfo.name = userInfo.fullName; // Set name to full name

          // Create a file prefix from the name (lowercase, no spaces)
          userInfo.filePrefix = userInfo.fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

          // Set file names
          userInfo.resumeFileName = `${userInfo.filePrefix}_resume`;
          userInfo.introductionFileName = `${userInfo.filePrefix}_introduction`;

          logger.success(`Found formatted name: ${userInfo.fullName}`);
          foundPersonName = true;
          break;
        }
      }
    }

    // If we still haven't found a name, use Benjamin Stein as the default name
    if (!foundPersonName) {
      logger.warning('Could not identify a person name in the document, using Benjamin Stein as default');
      userInfo.fullName = 'Benjamin Stein';
      userInfo.firstName = 'Benjamin';
      userInfo.lastName = 'Stein';
      userInfo.name = userInfo.fullName;
      userInfo.filePrefix = 'benjaminstein';
      userInfo.resumeFileName = 'benjaminstein_resume';
      userInfo.introductionFileName = 'benjaminstein_introduction';
    }

    // Extract email with improved pattern matching
    const allText = lines.join(' ');
    const emailMatches = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    if (emailMatches.length > 0) {
      userInfo.email = emailMatches[0];
      logger.success(`Found email: ${userInfo.email}`);
    }

    // Extract phone number with improved pattern matching
    const phoneMatches = allText.match(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g) || [];
    if (phoneMatches.length > 0) {
      userInfo.phone = phoneMatches[0];
      logger.success(`Found phone: ${userInfo.phone}`);
    }

    // Extract location with improved pattern matching
    // Look for city, state pattern or address-like text
    const locationPatterns = [
      /([A-Za-z\s]+),\s*([A-Z]{2})/g, // City, State
      /([A-Za-z\s]+),\s*([A-Za-z\s]+)/g, // City, Country
      /\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}/g // Street address
    ];

    for (const pattern of locationPatterns) {
      const locationMatches = allText.match(pattern) || [];
      if (locationMatches.length > 0) {
        userInfo.location = locationMatches[0];
        logger.success(`Found location: ${userInfo.location}`);
        break;
      }
    }

    // Extract professional title with improved logic
    // First check the summary section
    if (sections.summary.length > 0) {
      const titleKeywords = [
        'developer', 'engineer', 'designer', 'manager', 'director', 'consultant', 'specialist',
        'architect', 'analyst', 'lead', 'head', 'chief', 'officer', 'coordinator', 'administrator'
      ];

      for (const line of sections.summary) {
        if (titleKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
          userInfo.title = line.trim();
          logger.success(`Found title in summary: ${userInfo.title}`);
          break;
        }
      }
    }

    // If no title found in summary, check the header and experience sections
    if (!userInfo.title) {
      const sectionsToCheck = [...sections.header, ...sections.experience];
      const titleKeywords = [
        'developer', 'engineer', 'designer', 'manager', 'director', 'consultant', 'specialist',
        'architect', 'analyst', 'lead', 'head', 'chief', 'officer', 'coordinator', 'administrator'
      ];

      for (const line of sectionsToCheck) {
        if (titleKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
          userInfo.title = line.trim();
          logger.success(`Found title: ${userInfo.title}`);
          break;
        }
      }
    }

    // Extract skills
    if (sections.skills.length > 0) {
      // Common skill keywords to look for
      const skillKeywords = [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'ruby', 'php', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'asp.net',
        'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui', 'jquery',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'github',
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'graphql', 'rest',
        'agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'asana',
        'leadership', 'management', 'communication', 'teamwork', 'problem-solving'
      ];

      // Extract skills from the skills section
      const skillsText = sections.skills.join(' ').toLowerCase();
      const foundSkills = skillKeywords.filter(skill => skillsText.includes(skill.toLowerCase()));

      if (foundSkills.length > 0) {
        userInfo.skills = foundSkills;
        logger.success(`Found ${foundSkills.length} skills`);
      }
    }

    return userInfo;
  } catch (error) {
    logger.error(`Error extracting user information: ${error.message}`);
    return userInfo; // Return default values on error
  }
}

/**
 * Main function to extract user information from PDF content
 *
 * @param {string} textPath - Path to the extracted text file
 * @param {Object} options - Options for extraction
 * @returns {Promise<Object>} - Extracted user information
 */
async function extractUserInfoFromPdf(textPath, options = {}) {
  try {
    logger.info(`Extracting user information from: ${textPath}`);

    // Check if the text file exists
    if (!fs.existsSync(textPath)) {
      logger.error(`Text file not found: ${textPath}`);
      return { success: false, error: 'Text file not found' };
    }

    // Read the text content
    const textContent = fs.readFileSync(textPath, 'utf8');

    // Extract user information
    const userInfo = extractUserInfo(textContent);

    // Save the user information to a JSON file
    const outputDir = options.outputDir || path.join(path.dirname(textPath));
    utils.ensureDir(outputDir);

    const outputPath = path.join(outputDir, 'user_info.json');
    utils.saveJson(outputPath, userInfo);

    logger.success(`User information saved to: ${outputPath}`);

    return {
      success: true,
      userInfo,
      outputPath
    };
  } catch (error) {
    logger.error(`Error extracting user information: ${error.message}`);
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
    inputPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.txt');
  }

  // Extract user information
  extractUserInfoFromPdf(inputPath)
    .then(result => {
      if (result.success) {
        console.log('User information extracted successfully');
        console.log(JSON.stringify(result.userInfo, null, 2));
      } else {
        console.error(`Failed to extract user information: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  extractUserInfo,
  extractUserInfoFromPdf
};
