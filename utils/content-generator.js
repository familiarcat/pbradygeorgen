/**
 * Content Generator Module
 * 
 * This module generates various content formats from the analyzed data.
 * It's the third step in the PDF processing pipeline.
 * 
 * Philosophical Framework:
 * - Derrida: Reconstructing content in different formats
 * - Hesse: Balancing structure with presentation
 * - Salinger: Creating clean, user-focused content
 * - Dante: Completing the journey of content transformation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Dante emoji logger
const danteEmoji = {
  success: {
    basic: '😇☀️: ',
    core: '😇🌟: ',
    perfection: '😇🌈: '
  },
  error: {
    system: '👑💢: ',
    dataFlow: '⚠️⚡: ',
    validation: '⚠️🔥: '
  },
  warn: {
    deprecated: '⚠️🌊: ',
    performance: '⚠️⏱️: ',
    security: '⚠️🔒: '
  }
};

// Hesse logger
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic}${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core}${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection}${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system}${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow}${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation}${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated}${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance}${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security}${message}${colors.reset}`)
  }
};

/**
 * Content Generator class
 */
class ContentGenerator {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      inputDir: options.inputDir || path.join(process.cwd(), 'public', 'extracted'),
      outputDir: options.outputDir || path.join(process.cwd(), 'public', 'downloads'),
      debug: options.debug || process.env.DEBUG_LOGGING === 'true',
      ...options
    };
    
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
  }
  
  /**
   * Generate content formats
   * @param {Object} analysisResult - Result from the OpenAI analysis
   * @returns {Promise<Object>} - Generation result
   */
  async generateContent(analysisResult) {
    try {
      hesseLogger.summary.start('Generating content formats');
      danteLogger.success.basic('Starting content generation');
      
      if (!analysisResult.success && !analysisResult.data) {
        throw new Error('Analysis result is not successful and no data is available');
      }
      
      const structuredContent = analysisResult.data;
      const formats = {};
      
      // Generate text format
      formats.text = this.generateTextResume(structuredContent);
      fs.writeFileSync(path.join(this.options.outputDir, 'resume.txt'), formats.text);
      
      // Generate markdown format
      formats.markdown = this.generateMarkdownResume(structuredContent);
      fs.writeFileSync(path.join(this.options.outputDir, 'resume.md'), formats.markdown);
      
      // Generate JSON format
      formats.json = JSON.stringify(structuredContent, null, 2);
      fs.writeFileSync(path.join(this.options.outputDir, 'resume.json'), formats.json);
      
      // Generate HTML format
      formats.html = this.generateHtmlResume(structuredContent);
      fs.writeFileSync(path.join(this.options.outputDir, 'resume.html'), formats.html);
      
      // Generate cover letter
      formats.coverLetter = this.generateCoverLetter(structuredContent);
      fs.writeFileSync(path.join(this.options.outputDir, 'cover_letter.md'), formats.coverLetter);
      
      // Generate HTML cover letter
      formats.coverLetterHtml = this.generateHtmlCoverLetter(formats.coverLetter);
      fs.writeFileSync(path.join(this.options.outputDir, 'cover_letter.html'), formats.coverLetterHtml);
      
      // Create a preview content file
      const previewContent = {
        timestamp: new Date().toISOString(),
        formats: {
          text: formats.text,
          markdown: formats.markdown,
          json: formats.json,
          coverLetter: formats.coverLetter
        }
      };
      
      fs.writeFileSync(
        path.join(this.options.outputDir, 'preview_content.json'),
        JSON.stringify(previewContent, null, 2)
      );
      
      hesseLogger.summary.complete('Content generation completed successfully');
      danteLogger.success.perfection('Content generation completed successfully');
      
      return {
        success: true,
        formats,
        formatCount: Object.keys(formats).length,
        allFormatsAvailable: true,
        totalSize: Object.values(formats).reduce((total, content) => total + content.length, 0)
      };
    } catch (error) {
      hesseLogger.summary.error(`Error generating content: ${error.message}`);
      danteLogger.error.system('Error generating content', error);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
  
  /**
   * Generate text resume
   * @param {Object} structuredContent - Structured content
   * @returns {string} - Text resume
   */
  generateTextResume(structuredContent) {
    try {
      const { name, summary, skills, experience, education, contact } = structuredContent;
      
      let text = `${name.toUpperCase()}\n`;
      
      // Add contact information
      if (contact) {
        const contactLines = [];
        if (contact.email) contactLines.push(`Email: ${contact.email}`);
        if (contact.phone) contactLines.push(`Phone: ${contact.phone}`);
        if (contact.linkedin) contactLines.push(`LinkedIn: ${contact.linkedin}`);
        if (contact.website) contactLines.push(`Website: ${contact.website}`);
        if (contact.github) contactLines.push(`GitHub: ${contact.github}`);
        if (contact.location) contactLines.push(`Location: ${contact.location}`);
        
        text += `\n${contactLines.join(' | ')}\n`;
      }
      
      // Add summary
      text += `\nSUMMARY\n${'='.repeat(7)}\n${summary}\n`;
      
      // Add skills
      if (skills && skills.length > 0) {
        text += `\nSKILLS\n${'='.repeat(6)}\n${skills.join(', ')}\n`;
      }
      
      // Add experience
      if (experience && experience.length > 0) {
        text += `\nEXPERIENCE\n${'='.repeat(10)}\n`;
        
        experience.forEach(job => {
          text += `\n${job.title} | ${job.company} | ${job.period}\n`;
          
          if (job.responsibilities && job.responsibilities.length > 0) {
            job.responsibilities.forEach(resp => {
              text += `- ${resp}\n`;
            });
          }
        });
      }
      
      // Add education
      if (education && education.length > 0) {
        text += `\nEDUCATION\n${'='.repeat(9)}\n`;
        
        education.forEach(edu => {
          text += `\n${edu.degree} | ${edu.institution} | ${edu.period}\n`;
        });
      }
      
      return text;
    } catch (error) {
      console.error('Error generating text resume:', error);
      return `Error generating text resume: ${error.message}`;
    }
  }
  
  /**
   * Generate markdown resume
   * @param {Object} structuredContent - Structured content
   * @returns {string} - Markdown resume
   */
  generateMarkdownResume(structuredContent) {
    try {
      const { name, summary, skills, experience, education, contact } = structuredContent;
      
      let markdown = `# ${name}\n\n`;
      
      // Add contact information
      if (contact) {
        const contactLines = [];
        if (contact.email) contactLines.push(`[${contact.email}](mailto:${contact.email})`);
        if (contact.phone) contactLines.push(contact.phone);
        if (contact.linkedin) contactLines.push(`[LinkedIn](${contact.linkedin})`);
        if (contact.website) contactLines.push(`[Website](${contact.website})`);
        if (contact.github) contactLines.push(`[GitHub](${contact.github})`);
        if (contact.location) contactLines.push(contact.location);
        
        markdown += `${contactLines.join(' | ')}\n\n`;
      }
      
      // Add summary
      markdown += `## Summary\n\n${summary}\n\n`;
      
      // Add skills
      if (skills && skills.length > 0) {
        markdown += `## Skills\n\n`;
        markdown += skills.map(skill => `- ${skill}`).join('\n');
        markdown += '\n\n';
      }
      
      // Add experience
      if (experience && experience.length > 0) {
        markdown += `## Experience\n\n`;
        
        experience.forEach(job => {
          markdown += `### ${job.title}\n`;
          markdown += `**${job.company}** | ${job.period}\n\n`;
          
          if (job.responsibilities && job.responsibilities.length > 0) {
            job.responsibilities.forEach(resp => {
              markdown += `- ${resp}\n`;
            });
            markdown += '\n';
          }
        });
      }
      
      // Add education
      if (education && education.length > 0) {
        markdown += `## Education\n\n`;
        
        education.forEach(edu => {
          markdown += `### ${edu.degree}\n`;
          markdown += `**${edu.institution}** | ${edu.period}\n\n`;
        });
      }
      
      return markdown;
    } catch (error) {
      console.error('Error generating markdown resume:', error);
      return `# Error Generating Resume\n\nThere was an error generating the markdown resume: ${error.message}`;
    }
  }
  
  /**
   * Generate HTML resume
   * @param {Object} structuredContent - Structured content
   * @returns {string} - HTML resume
   */
  generateHtmlResume(structuredContent) {
    try {
      const { name, summary, skills, experience, education, contact } = structuredContent;
      
      // Generate the content sections
      let contactHtml = '';
      if (contact) {
        const contactItems = [];
        if (contact.email) contactItems.push(`<li><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></li>`);
        if (contact.phone) contactItems.push(`<li><strong>Phone:</strong> ${contact.phone}</li>`);
        if (contact.linkedin) contactItems.push(`<li><strong>LinkedIn:</strong> <a href="${contact.linkedin}" target="_blank">${contact.linkedin}</a></li>`);
        if (contact.website) contactItems.push(`<li><strong>Website:</strong> <a href="${contact.website}" target="_blank">${contact.website}</a></li>`);
        if (contact.github) contactItems.push(`<li><strong>GitHub:</strong> <a href="${contact.github}" target="_blank">${contact.github}</a></li>`);
        if (contact.location) contactItems.push(`<li><strong>Location:</strong> ${contact.location}</li>`);
        
        if (contactItems.length > 0) {
          contactHtml = `
          <div class="contact-info">
            <ul>
              ${contactItems.join('\n              ')}
            </ul>
          </div>`;
        }
      }
      
      let skillsHtml = '';
      if (skills && skills.length > 0) {
        skillsHtml = `
        <section id="skills">
          <h2>Skills</h2>
          <ul>
            ${skills.map(skill => `<li>${skill}</li>`).join('\n            ')}
          </ul>
        </section>`;
      }
      
      let experienceHtml = '';
      if (experience && experience.length > 0) {
        const jobsHtml = experience.map(job => {
          const responsibilitiesHtml = job.responsibilities && job.responsibilities.length > 0
            ? `
            <ul>
              ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('\n              ')}
            </ul>`
            : '';
          
          return `
          <div class="job">
            <h3>${job.title}</h3>
            <p class="job-meta"><strong>${job.company}</strong> | ${job.period}</p>
            ${responsibilitiesHtml}
          </div>`;
        }).join('\n        ');
        
        experienceHtml = `
        <section id="experience">
          <h2>Experience</h2>
          ${jobsHtml}
        </section>`;
      }
      
      let educationHtml = '';
      if (education && education.length > 0) {
        const educationItemsHtml = education.map(edu => `
          <div class="education-item">
            <h3>${edu.degree}</h3>
            <p><strong>${edu.institution}</strong> | ${edu.period}</p>
          </div>`).join('\n        ');
        
        educationHtml = `
        <section id="education">
          <h2>Education</h2>
          ${educationItemsHtml}
        </section>`;
      }
      
      // Combine everything into the final HTML
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Resume</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    header {
      margin-bottom: 30px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 36px;
    }
    h2 {
      color: #3498db;
      border-bottom: 2px solid #3498db;
      padding-bottom: 5px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    h3 {
      color: #2c3e50;
      margin-bottom: 5px;
    }
    .contact-info ul {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    .contact-info li {
      margin-bottom: 5px;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    section {
      margin-bottom: 30px;
    }
    .job, .education-item {
      margin-bottom: 20px;
    }
    .job-meta {
      font-style: italic;
      margin-top: 0;
      margin-bottom: 10px;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
    @media print {
      body {
        padding: 0;
      }
      a {
        color: #333;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${name}</h1>
    ${contactHtml}
  </header>
  
  <section id="summary">
    <h2>Summary</h2>
    <p>${summary}</p>
  </section>
  
  ${skillsHtml}
  
  ${experienceHtml}
  
  ${educationHtml}
</body>
</html>`;
    } catch (error) {
      console.error('Error generating HTML resume:', error);
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Resume</title>
</head>
<body>
  <h1>Error Generating Resume</h1>
  <p>There was an error generating the HTML resume: ${error.message}</p>
</body>
</html>`;
    }
  }
  
  /**
   * Generate cover letter
   * @param {Object} structuredContent - Structured content
   * @returns {string} - Cover letter
   */
  generateCoverLetter(structuredContent) {
    try {
      const { name, summary, skills, experience } = structuredContent;
      
      // Extract company and position (if available)
      const company = "Your Company";
      const position = experience && experience.length > 0 ? experience[0].title : "the open position";
      
      // Extract key skills
      const keySkills = skills && skills.length > 0 
        ? skills.slice(0, 3).join(', ') 
        : "my professional skills";
      
      // Extract key achievements
      const keyAchievements = experience && experience.length > 0 && experience[0].responsibilities && experience[0].responsibilities.length > 0
        ? experience[0].responsibilities[0]
        : "my professional achievements";
      
      // Generate the cover letter
      return `# Cover Letter

Dear Hiring Manager,

## Introduction

I am writing to express my interest in ${position} at ${company}. With my background in ${keySkills}, I am confident that I would be a valuable addition to your team.

## Professional Background

${summary}

## Why I'm a Great Fit

Throughout my career, I have demonstrated ${keyAchievements.toLowerCase()}. I am particularly drawn to ${company} because of your reputation for innovation and excellence in the industry.

## Skills and Qualifications

My key qualifications that align with this role include:

- ${skills ? skills[0] : "Professional expertise"}
- ${skills && skills.length > 1 ? skills[1] : "Technical knowledge"}
- ${skills && skills.length > 2 ? skills[2] : "Strong communication skills"}

## Closing

I am excited about the opportunity to bring my unique skills and experience to ${company}. I would welcome the chance to discuss how my background and qualifications would be a good match for this position.

Thank you for your time and consideration.

Sincerely,

${name}
`;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return `# Error Generating Cover Letter

There was an error generating the cover letter: ${error.message}`;
    }
  }
  
  /**
   * Generate HTML cover letter
   * @param {string} markdownContent - Markdown content
   * @returns {string} - HTML cover letter
   */
  generateHtmlCoverLetter(markdownContent) {
    try {
      // Convert markdown headings to HTML
      let htmlContent = markdownContent
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
      
      // Convert markdown lists to HTML
      htmlContent = htmlContent.replace(/^\s*[-*+]\s+(.*$)/gm, '<li>$1</li>');
      htmlContent = htmlContent.replace(/<li>.*(?:\n<li>.*)*\n?/g, '<ul>$&</ul>');
      
      // Convert markdown paragraphs to HTML
      htmlContent = htmlContent.replace(/^(?!<[h|u|l])(.*$)/gm, '<p>$1</p>');
      
      // Remove empty paragraphs
      htmlContent = htmlContent.replace(/<p><\/p>/g, '');
      
      // Wrap in HTML document
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cover Letter</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 30px;
      font-size: 28px;
    }
    h2 {
      color: #3498db;
      margin-top: 25px;
      margin-bottom: 15px;
      font-size: 20px;
    }
    p {
      margin-bottom: 15px;
      text-align: justify;
    }
    ul {
      padding-left: 20px;
      margin-bottom: 20px;
    }
    li {
      margin-bottom: 10px;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
    } catch (error) {
      console.error('Error generating HTML cover letter:', error);
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Cover Letter</title>
</head>
<body>
  <h1>Error Generating Cover Letter</h1>
  <p>There was an error generating the HTML cover letter: ${error.message}</p>
</body>
</html>`;
    }
  }
}

module.exports = ContentGenerator;
