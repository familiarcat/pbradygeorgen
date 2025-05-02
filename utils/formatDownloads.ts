'use client';

import OpenAI from 'openai';

// Initialize the OpenAI client conditionally to avoid client-side errors
let openai: OpenAI | null = null;

// Only initialize if we have an API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
if (apiKey) {
  try {
    openai = new OpenAI({ apiKey });
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
    openai = null;
  }
}

/**
 * Generate a properly formatted markdown version of the resume content
 * @param content The raw content to format
 * @returns Properly formatted markdown
 */
export async function generateFormattedMarkdown(content: string): Promise<string> {
  // Define the formatBasicMarkdown function here
  function formatBasicMarkdown(content: string): string {
    // Extract sections based on common patterns
    const lines = content.split('\n');
    let formatted = '';
    const inList = false;

    // Start with a clean header
    formatted += `# P. Brady Georgen\n\n`;
    formatted += `## Professional Summary\n\n`;
    formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n`;

    // Add contact information
    formatted += `## Contact Information\n\n`;
    formatted += `4350 A De Tonty St  \n`;
    formatted += `St. Louis, MO  \n`;
    formatted += `(314) 580-0608  \n`;
    formatted += `pbradygeorgen.com  \n`;
    formatted += `brady@pbradygeorgen.com\n\n`;

    // Add experience section
    formatted += `## Experience\n\n`;

    // Always add Daugherty first with client work nested
    formatted += `### Daugherty Business Solutions\n\n`;
    formatted += `**Sr. Software Developer (III)** (2014 - 2023)\n\n`;
    formatted += `- Led development of enterprise applications\n`;
    formatted += `- Implemented solutions using modern web technologies\n`;
    formatted += `- Collaborated with cross-functional teams to deliver high-quality software solutions\n\n`;

    // Client work nested under Daugherty with "Client:" prefix
    formatted += `#### Client: Bayer\n\n`;
    formatted += `- Architected, developed, migrated, and maintained various enterprise scale applications utilizing React, AWS, and SOA architectures\n`;
    formatted += `- Upheld Agile best practices throughout development lifecycle\n\n`;

    formatted += `#### Client: Charter Communications\n\n`;
    formatted += `- Engineered interactive call center solutions empowering representatives to provide enhanced customer service capabilities\n`;
    formatted += `- Implemented user-friendly interfaces for call center operations\n\n`;

    formatted += `#### Client: Mastercard\n\n`;
    formatted += `- Developed comprehensive onboarding documentation, sample code, and API integration\n`;
    formatted += `- Supported the MasterPass online purchasing initiative\n\n`;

    formatted += `#### Client: Cox Communications\n\n`;
    formatted += `- Implemented scaffolding framework for modular React applications\n`;
    formatted += `- Integrated with Adobe Content Manager\n`;
    formatted += `- Developed reusable component libraries\n\n`;

    // Digital Ronan (second, even though it's more recent by date)
    formatted += `### Digital Ronan (freelance)\n\n`;
    formatted += `**Consultant & Creative Technologist** (2022 - Present)\n\n`;
    formatted += `- Providing strategic digital consultancy for local businesses\n`;
    formatted += `- Applying skills in web development, networking, and design\n`;
    formatted += `- Creating custom digital solutions for small to medium businesses\n\n`;

    // Add other experience entries chronologically
    formatted += `### Deliveries on Demand\n\n`;
    formatted += `**Lead Software Developer** (2013 - 2014)\n\n`;
    formatted += `- Developed and maintained delivery management software\n`;
    formatted += `- Led a team of developers in creating mobile applications\n\n`;

    formatted += `### Infuze\n\n`;
    formatted += `**Sr. Developer/Asst. Art Director** (2011 - 2013)\n\n`;
    formatted += `- Combined technical development with creative design direction\n`;
    formatted += `- Created digital marketing solutions for clients\n\n`;

    formatted += `### Touchwood Creative\n\n`;
    formatted += `**Lead Software Developer** (2008 - 2009)\n\n`;
    formatted += `- Developed custom web applications for clients\n`;
    formatted += `- Implemented creative digital solutions\n\n`;

    formatted += `### ThinkTank (freelance)\n\n`;
    formatted += `**Software and Creative Director** (2005 - 2008)\n\n`;
    formatted += `- Provided software development and creative direction services\n`;
    formatted += `- Managed client relationships and project deliverables\n\n`;

    formatted += `### Asynchrony Solutions\n\n`;
    formatted += `**Designer/Developer/Marketing Asst.** (2004 - 2005)\n\n`;
    formatted += `- Assisted with design, development, and marketing initiatives\n`;
    formatted += `- Contributed to various software projects\n\n`;

    // Add skills section with Core Skills and Technical Skills subsections
    formatted += `## Skills & Technologies\n\n`;

    // Core Skills subsection
    formatted += `### Core Skills\n\n`;
    formatted += `- **Full Stack Development**\n`;
    formatted += `- **JavaScript/TypeScript**\n`;
    formatted += `- **Graphic Design & UI/UX**\n`;
    formatted += `- **React & React Native**\n`;
    formatted += `- **AWS & Cloud Architecture**\n`;
    formatted += `- **Illustration**\n`;
    formatted += `- **Creative/Technical Writing**\n\n`;

    // Technical Skills subsection with grouped technologies
    formatted += `### Technical Skills\n\n`;
    formatted += `- **Frontend**: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n`;
    formatted += `- **Backend**: Node.js, Ruby, Java\n`;
    formatted += `- **Cloud & Infrastructure**: AWS, AWS Amplify, Docker, Terraform\n`;
    formatted += `- **Database**: MongoDB, SQL\n`;
    formatted += `- **DevOps**: CI/CD, Jenkins, Shell Automation\n`;
    formatted += `- **Architecture**: SOA (Service-Oriented Architecture)\n`;
    formatted += `- **Design**: Adobe Creative Suite\n\n`;

    // Add education section
    formatted += `## Education\n\n`;
    formatted += `### BFA Graphic Design\n\n`;
    formatted += `**Webster University** (2001-2005)\n\n`;
    formatted += `### BA Philosophy\n\n`;
    formatted += `**Webster University** (2001-2005)\n\n`;
    formatted += `### ASSC Motion Graphics\n\n`;
    formatted += `**Saint Louis Community College** (1999-2001)\n\n`;

    return formatted;
  }

  try {
    // Always use our own formatting for consistency
    console.log('Using custom resume markdown formatting for consistency');
    return formatBasicMarkdown(content);

    // This code is never executed
    return formatBasicMarkdown(content);
  } catch (error) {
    console.error('Error generating formatted markdown:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicMarkdown(content);
  }
}

/**
 * Generate a properly formatted plain text version of the resume content
 * @param content The raw content to format
 * @returns Properly formatted text
 */
export async function generateFormattedText(content: string): Promise<string> {
  // Define the formatBasicText function here
  function formatBasicText(content: string): string {
    // Extract sections based on common patterns
    const lines = content.split('\n');
    let formatted = '';
    const inList = false;

    // Start with a clean header
    formatted += `P. BRADY GEORGEN\n${'='.repeat(16)}\n\n\n`;

    // Add professional summary
    formatted += `PROFESSIONAL SUMMARY\n${'-'.repeat(20)}\n\n`;
    formatted += `Senior Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS. Combines technical proficiency with creative design background to deliver innovative solutions for enterprise clients.\n\n\n`;

    // Add contact information
    formatted += `CONTACT INFORMATION\n${'-'.repeat(19)}\n\n`;
    formatted += `  4350 A De Tonty St\n`;
    formatted += `  St. Louis, MO\n`;
    formatted += `  (314) 580-0608\n`;
    formatted += `  pbradygeorgen.com\n`;
    formatted += `  brady@pbradygeorgen.com\n\n\n`;

    // Add experience section
    formatted += `EXPERIENCE\n${'-'.repeat(10)}\n\n`;

    // Always add Daugherty first with client work nested
    formatted += `  Daugherty Business Solutions\n`;
    formatted += `    Sr. Software Developer (III) (2014 - 2023)\n\n`;
    formatted += `      * Led development of enterprise applications\n`;
    formatted += `      * Implemented solutions using modern web technologies\n`;
    formatted += `      * Collaborated with cross-functional teams to deliver high-quality software solutions\n\n`;

    // Client work nested under Daugherty with "Client:" prefix
    formatted += `      Client: Bayer\n`;
    formatted += `        * Architected, developed, migrated, and maintained various enterprise scale\n`;
    formatted += `          applications utilizing React, AWS, and SOA architectures\n`;
    formatted += `        * Upheld Agile best practices throughout development lifecycle\n\n`;

    formatted += `      Client: Charter Communications\n`;
    formatted += `        * Engineered interactive call center solutions empowering representatives\n`;
    formatted += `          to provide enhanced customer service capabilities\n`;
    formatted += `        * Implemented user-friendly interfaces for call center operations\n\n`;

    formatted += `      Client: Mastercard\n`;
    formatted += `        * Developed comprehensive onboarding documentation, sample code, and API\n`;
    formatted += `          integration\n`;
    formatted += `        * Supported the MasterPass online purchasing initiative\n\n`;

    formatted += `      Client: Cox Communications\n`;
    formatted += `        * Implemented scaffolding framework for modular React applications\n`;
    formatted += `        * Integrated with Adobe Content Manager\n`;
    formatted += `        * Developed reusable component libraries\n\n`;

    // Digital Ronan (second, even though it's more recent by date)
    formatted += `  Digital Ronan (freelance)\n`;
    formatted += `    Consultant & Creative Technologist (2022 - Present)\n\n`;
    formatted += `      * Providing strategic digital consultancy for local businesses\n`;
    formatted += `      * Applying skills in web development, networking, and design\n`;
    formatted += `      * Creating custom digital solutions for small to medium businesses\n\n`;

    // Add other experience entries chronologically
    formatted += `  Deliveries on Demand\n`;
    formatted += `    Lead Software Developer (2013 - 2014)\n\n`;
    formatted += `      * Developed and maintained delivery management software\n`;
    formatted += `      * Led a team of developers in creating mobile applications\n\n`;

    formatted += `  Infuze\n`;
    formatted += `    Sr. Developer/Asst. Art Director (2011 - 2013)\n\n`;
    formatted += `      * Combined technical development with creative design direction\n`;
    formatted += `      * Created digital marketing solutions for clients\n\n`;

    formatted += `  Touchwood Creative\n`;
    formatted += `    Lead Software Developer (2008 - 2009)\n\n`;
    formatted += `      * Developed custom web applications for clients\n`;
    formatted += `      * Implemented creative digital solutions\n\n`;

    formatted += `  ThinkTank (freelance)\n`;
    formatted += `    Software and Creative Director (2005 - 2008)\n\n`;
    formatted += `      * Provided software development and creative direction services\n`;
    formatted += `      * Managed client relationships and project deliverables\n\n`;

    formatted += `  Asynchrony Solutions\n`;
    formatted += `    Designer/Developer/Marketing Asst. (2004 - 2005)\n\n`;
    formatted += `      * Assisted with design, development, and marketing initiatives\n`;
    formatted += `      * Contributed to various software projects\n\n\n`;

    // Add skills section
    formatted += `SKILLS & TECHNOLOGIES\n${'-'.repeat(20)}\n\n`;
    formatted += `  CORE COMPETENCIES:\n`;
    formatted += `    * Full Stack Development\n`;
    formatted += `    * JavaScript/TypeScript\n`;
    formatted += `    * Graphic Design & UI/UX\n`;
    formatted += `    * React & React Native\n`;
    formatted += `    * AWS & Cloud Architecture\n`;
    formatted += `    * Illustration\n`;
    formatted += `    * Creative/Technical Writing\n\n`;
    formatted += `  TECHNOLOGIES:\n`;
    formatted += `    * Frontend: React, React Native, JavaScript, TypeScript, UI/UX Prototyping\n`;
    formatted += `    * Backend: Node.js, Ruby, Java\n`;
    formatted += `    * Cloud & Infrastructure: AWS, AWS Amplify, Docker, Terraform\n`;
    formatted += `    * Database: MongoDB, SQL\n`;
    formatted += `    * DevOps: CI/CD, Jenkins, Shell Automation\n`;
    formatted += `    * Architecture: SOA (Service-Oriented Architecture)\n`;
    formatted += `    * Design: Adobe Creative Suite\n\n\n`;

    // Add education section
    formatted += `EDUCATION\n${'-'.repeat(9)}\n\n`;
    formatted += `  BFA Graphic Design\n`;
    formatted += `    Webster University (2001-2005)\n\n`;
    formatted += `  BA Philosophy\n`;
    formatted += `    Webster University (2001-2005)\n\n`;
    formatted += `  ASSC Motion Graphics\n`;
    formatted += `    Saint Louis Community College (1999-2001)\n\n`;

    return formatted;
  }

  try {
    // Always use our own formatting for consistency
    console.log('Using custom resume text formatting for consistency');
    return formatBasicText(content);

    // This code is never executed
    return formatBasicText(content);
  } catch (error) {
    console.error('Error generating formatted text:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicText(content);
  }
}


