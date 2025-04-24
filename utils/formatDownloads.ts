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
    let inList = false;

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

    // Skip OpenAI API call
    if (false && openai) {

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a faster, cheaper model for formatting
      messages: [
        {
          role: "system",
          content: `You are a resume formatting expert. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work.
          Then, format it as clean, professional markdown with a J.D. Salinger-inspired approach.

          Follow these specific guidelines:

          1. Start with the person's name (P. Brady Georgen) as a level 1 heading (# Name) - make it stand out but feel personal

          2. Create a clean, logical hierarchy with these main sections (as level 2 headings):
             - ## Professional Summary (create a brief summary from available information if not explicitly provided)
             - ## Contact Information (extract from the About Me section)
             - ## Experience (organize ALL work experience strictly chronologically, most recent first)
             - ## Skills & Technologies (combine all skills and technologies into one cohesive section)
             - ## Education (organize all education chronologically, most recent first)

          3. For the Experience section, CRITICALLY IMPORTANT:
             - MANUALLY OVERRIDE the chronological order to ensure Daugherty Business Solutions (2014-2023) is ALWAYS listed FIRST in the Experience section
             - After Daugherty, list Digital Ronan (2022-Present), then other positions in chronological order
             - Use level 3 headings (### Company Name) for primary employers/companies
             - Format job titles in bold (**Job Title**)
             - Format date ranges on the same line as job titles, e.g., **Job Title** (2020 - Present)
             - Include a brief description of responsibilities directly under each job title

             - CONSULTANCY PATTERN (VERY IMPORTANT): For consultancy firms like Daugherty Business Solutions:
               * First list general responsibilities at the consultancy firm
               * Then use level 4 headings (#### Client: Client Name) to list client engagements
               * Each client engagement MUST be nested UNDER Daugherty Business Solutions, NOT as separate entries or sections
               * Format client work descriptions as bullet points under each client heading
               * DO NOT create a separate "Client Work" section - all client work must be nested under Daugherty
               * The Experience section MUST follow this EXACT structure:
                 ### Daugherty Business Solutions
                 **Sr. Software Developer (III)** (2014 - 2023)
                 - Led development of enterprise applications
                 - Implemented solutions using modern web technologies

                 #### Client: Bayer
                 - Architected and developed enterprise-scale applications
                 - Upheld Agile best practices throughout development lifecycle

                 #### Client: Charter Communications
                 - Engineered interactive call center solutions

                 #### Client: Mastercard
                 - Developed comprehensive onboarding documentation

                 #### Client: Cox Communications
                 - Implemented scaffolding framework for modular React applications

          4. For Education entries:
             - Use level 3 headings (### Degree)
             - Format institution and date range on the next line, e.g., **Institution** (Year-Year)
             - Organize chronologically (most recent first)

          5. For Skills & Technologies:
             - Group related skills together
             - Use bullet points for each skill or skill group
             - Highlight key skills with bold formatting

          6. Ensure the visual hierarchy is clear through consistent formatting:
             - Level 1 (# Heading): Name
             - Level 2 (## Heading): Main sections (Summary, Contact, Experience, Skills, Education)
             - Level 3 (### Heading): Primary employers, Degrees
             - Level 4 (#### Client: Name): Client engagements under consultancy employers
             - Bold text: Job titles, important skills
             - Bullet points: Responsibilities, achievements, skills

          7. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

          8. IMPORTANT: There should be NO separate "Client Work" section. All client work must be nested under the appropriate employer in the Experience section.

          9. DO NOT add any footer text, metadata, or generation information at the end

          Return ONLY the formatted markdown, nothing else.`
        },
        {
          role: "user",
          content: `Please format this resume content as clean, professional markdown:\n\n${content}`
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: 2000,
    });

    const formattedMarkdown = response.choices[0]?.message?.content || '';

    if (!formattedMarkdown) {
      console.log('Empty response from OpenAI, using basic markdown formatting');
      return formatBasicMarkdown(content);
    }

    return formattedMarkdown;
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
    let inList = false;

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

    // Skip OpenAI API call
    if (false && openai) {

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a faster, cheaper model for formatting
      messages: [
        {
          role: "system",
          content: `You are a resume formatting expert. First, carefully analyze the content to understand its structure and hierarchy. Apply Hesse-like logical analysis to identify organizational relationships, particularly for consultancy/agency work.
          Then, format it as clean, professional plain text with a J.D. Salinger-inspired approach.

          Follow these specific guidelines:

          1. Start with the person's name (P. BRADY GEORGEN) in ALL CAPS - make it stand out but feel personal

          2. Create a clean, logical hierarchy with these main sections (in ALL CAPS with underlines):
             - PROFESSIONAL SUMMARY (create a brief summary from available information if not explicitly provided)
             - CONTACT INFORMATION (extract from the About Me section)
             - EXPERIENCE (organize ALL work experience strictly chronologically, most recent first)
             - SKILLS & TECHNOLOGIES (combine all skills and technologies into one cohesive section)
             - EDUCATION (organize all education chronologically, most recent first)

          3. For the Experience section, CRITICALLY IMPORTANT:
             - MANUALLY OVERRIDE the chronological order to ensure Daugherty Business Solutions (2014-2023) is ALWAYS listed FIRST in the Experience section
             - After Daugherty, list Digital Ronan (2022-Present), then other positions in chronological order
             - Use Title Case with proper indentation (2 spaces) for primary employers/companies
             - Format job titles on the next line with proper indentation (4 spaces)
             - Format date ranges on the same line as job titles
             - Include a brief description of general responsibilities directly under each job title

             - CONSULTANCY PATTERN (VERY IMPORTANT): For consultancy firms like Daugherty Business Solutions:
               * First list general responsibilities at the consultancy firm with proper indentation (6 spaces)
               * Then list client engagements with "Client:" prefix and client name in Title Case (6 spaces indentation)
               * Each client engagement MUST be nested UNDER Daugherty Business Solutions, NOT as separate entries or sections
               * Format client work descriptions with additional indentation (8 spaces)
               * DO NOT create a separate "CLIENT WORK" section - all client work must be nested under Daugherty
               * The Experience section MUST follow this EXACT structure:
                 Daugherty Business Solutions
                   Sr. Software Developer (III) (2014 - 2023)
                     * Led development of enterprise applications
                     * Implemented solutions using modern web technologies

                     Client: Bayer
                       * Architected and developed enterprise-scale applications
                       * Upheld Agile best practices throughout development lifecycle

                     Client: Charter Communications
                       * Engineered interactive call center solutions

                     Client: Mastercard
                       * Developed comprehensive onboarding documentation

                     Client: Cox Communications
                       * Implemented scaffolding framework for modular React applications

          4. For Education entries:
             - Use Title Case with proper indentation (2 spaces) for degrees
             - Format institution and date range on the next line with proper indentation (4 spaces)
             - Organize chronologically (most recent first)

          5. For Skills & Technologies:
             - Group related skills together
             - Use asterisks (*) for bullet points
             - Use ALL CAPS for key skill categories

          6. Ensure the visual hierarchy is clear through consistent indentation:
             - Level 1 (0 spaces): MAIN HEADERS WITH UNDERLINES
             - Level 2 (2 spaces): Primary employers, Degree Names
             - Level 3 (4 spaces): Job Titles, Institution Names
             - Level 4 (6 spaces): General responsibilities, Client engagements
             - Level 5 (8 spaces): Client-specific responsibilities

          7. Ensure generous spacing between sections (2-3 blank lines) for better readability

          8. Maintain a clean, professional layout with a personal touch that reflects Salinger's attention to authentic voice and detail

          9. IMPORTANT: There should be NO separate "CLIENT WORK" section. All client work must be nested under the appropriate employer in the EXPERIENCE section.

          10. DO NOT add any footer text, metadata, or generation information at the end

          Return ONLY the formatted plain text, nothing else.`
        },
        {
          role: "user",
          content: `Please format this resume content as clean, professional plain text:\n\n${content}`
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: 2000,
    });

    const formattedText = response.choices[0]?.message?.content || '';

    if (!formattedText) {
      console.log('Empty response from OpenAI, using basic text formatting');
      return formatBasicText(content);
    }

    return formattedText;
  } catch (error) {
    console.error('Error generating formatted text:', error);
    // Fall back to basic formatting if OpenAI fails
    return formatBasicText(content);
  }
}


