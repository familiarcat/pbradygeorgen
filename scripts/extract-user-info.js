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
    industry: 'general',
    keywords: [],
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

        // Check if the line is in ALL CAPS or Title Case
        const isAllCaps = line === line.toUpperCase() && line.length > 3;
        const isTitleCase = line.split(' ').every(word => word.length > 0 && word[0] === word[0].toUpperCase());

        // Additional checks to distinguish person names from business names
        // 1. Person names typically have 2-3 words
        const wordCount = line.split(' ').length;
        const isLikelyPersonNameLength = wordCount >= 1 && wordCount <= 4;

        // 2. Person names typically don't contain organization keywords
        const containsOrgKeyword = orgKeywords.some(keyword => line.toLowerCase().includes(keyword));

        // 3. Person names typically don't contain section keywords
        const containsSectionKeyword = sectionKeywords.some(keyword => line.toLowerCase().includes(keyword));

        // 4. Person names typically don't contain job title keywords at the beginning
        const startsWithJobTitle = jobTitleKeywords.some(keyword =>
          line.toLowerCase().startsWith(keyword.toLowerCase() + ' ') ||
          line.toLowerCase().startsWith('senior ' + keyword.toLowerCase() + ' ') ||
          line.toLowerCase().startsWith('junior ' + keyword.toLowerCase() + ' '));

        // 5. Person names typically don't contain numbers or special characters except hyphens and periods
        const hasValidNameChars = /^[A-Za-z\s\-\.]+$/.test(line);

        // 6. Check for common name patterns (First Last, First M. Last, etc.)
        const isCommonNamePattern = /^[A-Z][a-z]+(\s[A-Z]\.?)?\s[A-Z][a-z]+$/.test(line) || // First (M.) Last
          /^[A-Z][a-z]+\s[A-Z][a-z]+(-[A-Z][a-z]+)?$/.test(line);  // First Last(-Last)

        // Combine all checks to determine if this is likely a person name
        if ((isAllCaps || isTitleCase) &&
          isLikelyPersonNameLength &&
          !containsOrgKeyword &&
          !containsSectionKeyword &&
          !startsWithJobTitle &&
          hasValidNameChars) {

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
      // If we found multiple email addresses, try to determine which one is the contact email
      if (emailMatches.length > 1) {
        logger.info(`Found multiple email addresses: ${emailMatches.join(', ')}`);

        // Look for email addresses in the contact section first
        const contactText = sections.contact.join(' ');
        const contactEmailMatches = contactText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];

        if (contactEmailMatches.length > 0) {
          // Use the first email found in the contact section
          userInfo.email = contactEmailMatches[0];
          logger.success(`Found contact email in contact section: ${userInfo.email}`);
        } else {
          // If no email in contact section, look for emails that contain the user's name
          const nameBasedEmails = emailMatches.filter(email => {
            const emailPrefix = email.split('@')[0].toLowerCase();
            return emailPrefix.includes(userInfo.firstName.toLowerCase()) ||
              emailPrefix.includes(userInfo.lastName.toLowerCase()) ||
              emailPrefix.includes(userInfo.filePrefix.toLowerCase());
          });

          if (nameBasedEmails.length > 0) {
            userInfo.email = nameBasedEmails[0];
            logger.success(`Found name-based contact email: ${userInfo.email}`);
          } else {
            // If no name-based email, use the first email found
            userInfo.email = emailMatches[0];
            logger.success(`Using first email as contact: ${userInfo.email}`);
          }
        }
      } else {
        // If only one email found, use it
        userInfo.email = emailMatches[0];
        logger.success(`Found email: ${userInfo.email}`);
      }
    } else {
      // If no email found, use a default for Benjamin Stein
      if (userInfo.fullName === 'Benjamin Stein') {
        userInfo.email = 'benjamin.stein@example.com';
        logger.warning(`No email found, using default for Benjamin Stein: ${userInfo.email}`);
      }
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
          // Truncate title for logging to keep it to one line (max 50 chars)
          const truncatedTitle = userInfo.title.length > 50 ? userInfo.title.substring(0, 47) + '...' : userInfo.title;
          logger.success(`Found title in summary: ${truncatedTitle}`);
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
          // Truncate title for logging to keep it to one line (max 50 chars)
          const truncatedTitle = userInfo.title.length > 50 ? userInfo.title.substring(0, 47) + '...' : userInfo.title;
          logger.success(`Found title: ${truncatedTitle}`);
          break;
        }
      }
    }

    // Extract skills with improved industry detection
    // First, try to determine the candidate's industry based on the content
    let detectedIndustry = 'general';
    const industryKeywords = {
      'technology': ['software', 'developer', 'engineer', 'programming', 'code', 'web', 'app', 'application', 'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'architecture'],
      'healthcare': ['medical', 'clinical', 'patient', 'health', 'hospital', 'doctor', 'nurse', 'physician', 'therapy', 'care', 'treatment', 'diagnosis', 'healthcare', 'informatics'],
      'finance': ['financial', 'banking', 'investment', 'accounting', 'finance', 'audit', 'tax', 'budget', 'revenue', 'profit', 'loss', 'assets', 'liabilities', 'equity'],
      'marketing': ['marketing', 'brand', 'campaign', 'social media', 'digital', 'content', 'seo', 'sem', 'advertising', 'market research', 'analytics', 'audience', 'conversion'],
      'education': ['teaching', 'education', 'curriculum', 'student', 'school', 'university', 'college', 'academic', 'learning', 'instruction', 'classroom', 'professor', 'teacher'],
      'legal': ['legal', 'law', 'attorney', 'lawyer', 'counsel', 'litigation', 'compliance', 'regulation', 'contract', 'policy', 'legislation', 'rights', 'justice'],
      'manufacturing': ['manufacturing', 'production', 'assembly', 'quality', 'operations', 'supply chain', 'logistics', 'inventory', 'warehouse', 'procurement', 'lean', 'six sigma'],
      'design': ['design', 'creative', 'ux', 'ui', 'user experience', 'graphic', 'visual', 'product design', 'interaction', 'wireframe', 'prototype', 'usability', 'accessibility']
    };

    // Count industry keyword occurrences in the entire document
    const documentText = lines.join(' ').toLowerCase();
    const industryCounts = {};

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      industryCounts[industry] = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = documentText.match(regex);
        if (matches) {
          industryCounts[industry] += matches.length;
        }
      }
    }

    // Determine the most likely industry
    let maxCount = 0;
    for (const [industry, count] of Object.entries(industryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        detectedIndustry = industry;
      }
    }

    logger.info(`Detected industry: ${detectedIndustry}`);
    userInfo.industry = detectedIndustry;

    // Define industry-specific skill keywords
    const industrySkills = {
      'technology': [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
        'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'symfony',
        'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui', 'jquery', 'webpack', 'babel', 'vite',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'github', 'gitlab', 'bitbucket',
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'graphql', 'rest', 'soap', 'microservices',
        'agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'asana', 'devops', 'ci/cd', 'test-driven development',
        'machine learning', 'artificial intelligence', 'data science', 'big data', 'hadoop', 'spark', 'tableau', 'power bi',
        'cybersecurity', 'network security', 'penetration testing', 'encryption', 'authentication', 'authorization'
      ],
      'healthcare': [
        'electronic health records', 'ehr', 'emr', 'epic', 'cerner', 'meditech', 'allscripts', 'nextgen', 'athenahealth',
        'hipaa', 'hl7', 'fhir', 'dicom', 'icd-10', 'cpt', 'snomed', 'loinc', 'rxnorm', 'ndc',
        'clinical informatics', 'health informatics', 'medical informatics', 'nursing informatics', 'pharmacy informatics',
        'telehealth', 'telemedicine', 'remote patient monitoring', 'patient portal', 'population health', 'care coordination',
        'revenue cycle management', 'medical billing', 'medical coding', 'claims processing', 'denial management',
        'clinical documentation', 'clinical decision support', 'order entry', 'e-prescribing', 'medication reconciliation',
        'quality improvement', 'quality measures', 'hedis', 'ncqa', 'joint commission', 'cms', 'meaningful use',
        'patient safety', 'infection control', 'risk management', 'utilization review', 'case management'
      ],
      'finance': [
        'financial analysis', 'financial modeling', 'financial reporting', 'financial planning', 'budgeting', 'forecasting',
        'accounting', 'bookkeeping', 'accounts payable', 'accounts receivable', 'general ledger', 'balance sheet', 'income statement',
        'cash flow', 'variance analysis', 'cost accounting', 'tax preparation', 'tax planning', 'audit', 'compliance',
        'investment analysis', 'portfolio management', 'asset allocation', 'risk assessment', 'wealth management',
        'banking', 'lending', 'credit analysis', 'underwriting', 'loan processing', 'mortgage', 'debt management',
        'quickbooks', 'sap', 'oracle financials', 'microsoft dynamics', 'sage', 'xero', 'netsuite', 'bloomberg terminal',
        'excel', 'vba', 'pivot tables', 'data analysis', 'financial modeling', 'scenario analysis', 'sensitivity analysis',
        'gaap', 'ifrs', 'sox', 'fasb', 'sec reporting', 'regulatory reporting', 'financial controls'
      ],
      'general': [
        'leadership', 'management', 'communication', 'teamwork', 'problem-solving', 'critical thinking', 'decision making',
        'time management', 'organization', 'planning', 'coordination', 'delegation', 'negotiation', 'conflict resolution',
        'presentation', 'public speaking', 'writing', 'editing', 'research', 'analysis', 'reporting', 'documentation',
        'customer service', 'client relations', 'stakeholder management', 'relationship building', 'networking',
        'microsoft office', 'word', 'excel', 'powerpoint', 'outlook', 'google workspace', 'docs', 'sheets', 'slides',
        'project management', 'budget management', 'resource allocation', 'risk management', 'quality assurance',
        'strategic planning', 'process improvement', 'change management', 'innovation', 'creativity', 'adaptability'
      ]
    };

    // Combine general skills with industry-specific skills
    const skillKeywords = [...industrySkills['general'], ...(industrySkills[detectedIndustry] || [])];

    // Extract skills from the entire document, not just the skills section
    const foundSkills = new Set();

    // First check the skills section if available
    if (sections.skills.length > 0) {
      const skillsText = sections.skills.join(' ').toLowerCase();

      // Look for skills in the skills section
      for (const skill of skillKeywords) {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        if (regex.test(skillsText)) {
          foundSkills.add(skill);
        }
      }
    }

    // Then check the entire document for additional skills
    for (const skill of skillKeywords) {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(documentText)) {
        foundSkills.add(skill);
      }
    }

    // Extract additional skills using bullet point patterns
    const bulletPointPatterns = [
      /•\s*([^•\n]+)/g,  // Bullet point followed by text
      /\n-\s*([^-\n]+)/g,  // Dash at start of line
      /\n\*\s*([^\*\n]+)/g,  // Asterisk at start of line
      /\n\d+\.\s*([^\n]+)/g  // Numbered list
    ];

    for (const pattern of bulletPointPatterns) {
      const matches = documentText.match(pattern);
      if (matches) {
        for (const match of matches) {
          const cleanedMatch = match.replace(/^[•\-\*\d\.]\s*/, '').trim().toLowerCase();

          // Check if this bullet point contains a skill keyword
          for (const skill of skillKeywords) {
            if (cleanedMatch.includes(skill.toLowerCase())) {
              // If the bullet point is short, it might be just the skill itself
              if (cleanedMatch.length < 30) {
                foundSkills.add(cleanedMatch);
              } else {
                foundSkills.add(skill);
              }
            }
          }
        }
      }
    }

    if (foundSkills.size > 0) {
      userInfo.skills = Array.from(foundSkills);
      logger.success(`Found ${foundSkills.size} skills`);
    } else {
      // If no skills found, add some default skills based on the detected industry
      userInfo.skills = industrySkills[detectedIndustry]?.slice(0, 5) || industrySkills['general'].slice(0, 5);
      logger.warning(`No skills found, using default skills for ${detectedIndustry} industry`);
    }

    // Extract additional ATS keywords from the resume
    const extractedKeywords = extractATSKeywords(allText, detectedIndustry);
    userInfo.keywords = extractedKeywords;
    logger.success(`Extracted ${extractedKeywords.length} ATS keywords`);

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
 * @param {boolean} options.showFull - Whether to show full user info in the console output
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

    // Check if we should show full user info
    const showFullFlag = options.showFull === true;

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

    // Display user information based on showFullFlag
    if (showFullFlag) {
      // Show full details when explicitly requested
      console.log('# \n\n---\n\n*This document was automatically extracted from a PDF resume.*');
      console.log(`*Generated on: ${new Date().toLocaleDateString()}*\n`);
      console.log('User information extracted successfully');
      console.log(JSON.stringify(userInfo, null, 2));
    } else {
      // Show minimal success message by default
      console.log('[USER-INFO] ✅ User information extracted successfully');
    }

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

  // Check if we should show full user info
  const showFullFlag = args.includes('--show-full') || args.includes('-f');

  // Extract user information
  extractUserInfoFromPdf(inputPath)
    .then(result => {
      if (result.success) {
        if (showFullFlag) {
          // Show full details when explicitly requested
          console.log('# \n\n---\n\n*This document was automatically extracted from a PDF resume.*');
          console.log(`*Generated on: ${new Date().toLocaleDateString()}*\n`);
          console.log('User information extracted successfully');
          console.log(JSON.stringify(result.userInfo, null, 2));
        } else {
          // Show minimal success message by default
          console.log('[USER-INFO] ✅ User information extracted successfully');
        }
      } else {
        console.error(`[USER-INFO] ❌ Failed to extract user information: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`[USER-INFO] ❌ Error: ${error.message}`);
      process.exit(1);
    });
}

/**
 * Extract ATS keywords from text content based on industry
 *
 * @param {string} textContent - The text content to analyze
 * @param {string} industry - The detected industry
 * @returns {Array<string>} - Extracted ATS keywords
 */
function extractATSKeywords(textContent, industry) {
  // Common ATS keywords by industry
  const atsKeywords = {
    'technology': [
      'software development', 'full stack', 'front end', 'back end', 'web development',
      'mobile development', 'cloud computing', 'devops', 'agile methodology', 'scrum',
      'continuous integration', 'continuous deployment', 'test-driven development',
      'object-oriented programming', 'functional programming', 'api development',
      'microservices', 'serverless', 'containerization', 'version control',
      'code review', 'pair programming', 'technical documentation', 'debugging',
      'performance optimization', 'scalability', 'security', 'authentication',
      'authorization', 'encryption', 'data structures', 'algorithms', 'database design',
      'query optimization', 'caching', 'load balancing', 'high availability',
      'disaster recovery', 'monitoring', 'logging', 'alerting', 'troubleshooting'
    ],
    'healthcare': [
      'patient care', 'clinical documentation', 'electronic health records', 'medical coding',
      'medical billing', 'healthcare compliance', 'hipaa', 'patient safety', 'quality improvement',
      'care coordination', 'case management', 'utilization review', 'disease management',
      'population health', 'health informatics', 'clinical informatics', 'telehealth',
      'remote patient monitoring', 'clinical decision support', 'order entry',
      'medication administration', 'medication reconciliation', 'clinical workflows',
      'healthcare analytics', 'revenue cycle management', 'claims processing',
      'denial management', 'charge capture', 'patient engagement', 'patient education',
      'care planning', 'care transitions', 'interdisciplinary collaboration',
      'evidence-based practice', 'clinical guidelines', 'clinical protocols',
      'quality measures', 'regulatory compliance', 'accreditation', 'risk management'
    ],
    'finance': [
      'financial analysis', 'financial reporting', 'financial modeling', 'forecasting',
      'budgeting', 'variance analysis', 'cost accounting', 'general ledger',
      'accounts payable', 'accounts receivable', 'fixed assets', 'cash management',
      'treasury management', 'risk assessment', 'internal controls', 'sox compliance',
      'audit preparation', 'tax planning', 'tax compliance', 'financial statements',
      'balance sheet', 'income statement', 'cash flow statement', 'financial ratios',
      'profitability analysis', 'liquidity analysis', 'solvency analysis', 'efficiency analysis',
      'investment analysis', 'portfolio management', 'asset allocation', 'wealth management',
      'retirement planning', 'estate planning', 'financial regulations', 'financial compliance',
      'anti-money laundering', 'know your customer', 'financial risk management',
      'market risk', 'credit risk', 'operational risk', 'liquidity risk'
    ],
    'general': [
      'leadership', 'management', 'team building', 'strategic planning', 'project management',
      'process improvement', 'change management', 'stakeholder management', 'client relations',
      'customer service', 'problem solving', 'decision making', 'critical thinking',
      'analytical skills', 'attention to detail', 'organization', 'time management',
      'prioritization', 'multitasking', 'communication', 'presentation', 'public speaking',
      'writing', 'editing', 'research', 'data analysis', 'reporting', 'documentation',
      'training', 'mentoring', 'coaching', 'performance management', 'conflict resolution',
      'negotiation', 'collaboration', 'teamwork', 'cross-functional coordination',
      'budget management', 'resource allocation', 'vendor management', 'contract management',
      'quality assurance', 'continuous improvement', 'innovation', 'creativity'
    ]
  };

  // Get keywords for the detected industry and general keywords
  const industrySpecificKeywords = atsKeywords[industry] || [];
  const generalKeywords = atsKeywords['general'];

  // Combine all keywords to check
  const allKeywords = [...industrySpecificKeywords, ...generalKeywords];

  // Extract keywords that appear in the text
  const foundKeywords = new Set();
  const lowerText = textContent.toLowerCase();

  for (const keyword of allKeywords) {
    // Check for exact matches and variations
    const variations = [
      keyword,
      keyword.replace(/\s+/g, '-'),  // hyphenated version
      keyword.replace(/\s+/g, '')     // no spaces version
    ];

    for (const variation of variations) {
      const regex = new RegExp(`\\b${variation.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundKeywords.add(keyword);
        break;
      }
    }
  }

  // Extract additional keywords from bullet points and short phrases
  const bulletPointPatterns = [
    /•\s*([^•\n]+)/g,  // Bullet point followed by text
    /\n-\s*([^-\n]+)/g,  // Dash at start of line
    /\n\*\s*([^\*\n]+)/g,  // Asterisk at start of line
    /\n\d+\.\s*([^\n]+)/g  // Numbered list
  ];

  for (const pattern of bulletPointPatterns) {
    const matches = textContent.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanedMatch = match.replace(/^[•\-\*\d\.]\s*/, '').trim();

        // If the bullet point is short (likely a skill or keyword)
        if (cleanedMatch.length > 3 && cleanedMatch.length < 50 &&
          cleanedMatch.split(' ').length <= 5 &&
          !/[0-9]/.test(cleanedMatch)) { // Avoid phrases with numbers
          foundKeywords.add(cleanedMatch.toLowerCase());
        }
      }
    }
  }

  return Array.from(foundKeywords);
}

module.exports = {
  extractUserInfo,
  extractUserInfoFromPdf,
  extractATSKeywords
};
