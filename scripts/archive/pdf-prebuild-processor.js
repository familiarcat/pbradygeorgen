#!/usr/bin/env node

/**
 * PDF Pre-Build Processor
 *
 * This script processes PDFs during the build phase, extracting content and preparing
 * it for various download formats. This reduces the need for server-side rendering
 * at runtime and ensures that download functionality can be properly tested.
 *
 * Philosophical Framework:
 * - Salinger: Creating a "backstory" that happens behind the scenes
 * - Hesse: Balancing structure (build process) with flexibility (runtime options)
 * - Derrida: Deconstructing the PDF into various formats
 * - Dante: Guiding the content through different processing stages
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { OpenAIBuildAnalyzer } = require('../utils/openai-build-analyzer');
const { ResumeSchema, CoverLetterSchema } = require('../utils/resume-schema');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Dante emoji logger for console output
const danteEmoji = {
  success: {
    basic: '😇☀️',
    core: '😇🌟',
    perfection: '😇🌈'
  },
  error: {
    system: '👑💢',
    dataFlow: '⚠️⚡',
    validation: '⚠️🔥'
  },
  warn: {
    deprecated: '⚠️🌊',
    performance: '⚠️⏱️',
    security: '⚠️🔒'
  }
};

// Hesse logger for console output
const hesseLogger = {
  summary: {
    start: (message) => console.log(`${colors.cyan}${colors.bright}🔍 [Hesse:Summary:Start] ${message}${colors.reset}`),
    progress: (message) => console.log(`${colors.cyan}⏳ [Hesse:Summary:Progress] ${message}${colors.reset}`),
    complete: (message) => console.log(`${colors.green}✅ [Hesse:Summary:Complete] ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}❌ [Hesse:Summary:Error] ${message}${colors.reset}`)
  }
};

// Dante logger for console output
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic} [Dante:Paradiso:4:Sun] ${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core} [Dante:Paradiso:5:Mars] ${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection} [Dante:Paradiso:10:Empyrean] ${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system} [Dante:Inferno:1:Limbo] ${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow} [Dante:Inferno:5:Wrath] ${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation} [Dante:Inferno:8:Fraud] ${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated} [Dante:Purgatorio:1:Ante] ${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance} [Dante:Purgatorio:4:Sloth] ${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security} [Dante:Purgatorio:7:Lust] ${message}${colors.reset}`)
  }
};

/**
 * Generate enhanced text resume from structured content
 */
function generateEnhancedTextResume(structuredContent) {
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
    console.error('Error generating enhanced text resume:', error);
    return `Error generating enhanced text resume: ${error.message}`;
  }
}

/**
 * Generate enhanced markdown resume from structured content
 */
function generateEnhancedMarkdownResume(structuredContent) {
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
    console.error('Error generating enhanced markdown resume:', error);
    return `# Error Generating Resume\n\nThere was an error generating the enhanced markdown resume: ${error.message}`;
  }
}

/**
 * Generate enhanced HTML resume from structured content
 */
function generateEnhancedHtmlResume(structuredContent) {
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
            ${contactItems.join('\n            ')}
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
          ${skills.map(skill => `<li>${skill}</li>`).join('\n          ')}
        </ul>
      </section>`;
    }

    let experienceHtml = '';
    if (experience && experience.length > 0) {
      const jobsHtml = experience.map(job => {
        const responsibilitiesHtml = job.responsibilities && job.responsibilities.length > 0
          ? `
          <ul>
            ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('\n            ')}
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
    console.error('Error generating enhanced HTML resume:', error);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Resume</title>
</head>
<body>
  <h1>Error Generating Resume</h1>
  <p>There was an error generating the enhanced HTML resume: ${error.message}</p>
</body>
</html>`;
  }
}

/**
 * Generate enhanced cover letter from structured content
 */
function generateEnhancedCoverLetter(structuredContent) {
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
    console.error('Error generating enhanced cover letter:', error);
    return `# Error Generating Cover Letter

There was an error generating the enhanced cover letter: ${error.message}`;
  }
}

/**
 * Generate enhanced HTML cover letter from markdown content
 */
function generateEnhancedHtmlCoverLetter(markdownContent) {
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
    console.error('Error generating enhanced HTML cover letter:', error);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Cover Letter</title>
</head>
<body>
  <h1>Error Generating Cover Letter</h1>
  <p>There was an error generating the enhanced HTML cover letter: ${error.message}</p>
</body>
</html>`;
  }
}

/**
 * Main function to process PDFs during build
 */
async function processPdfsForBuild() {
  try {
    console.log(`\n${colors.magenta}${colors.bright}🔄 PDF PRE-BUILD PROCESSING${colors.reset}`);
    console.log(`${colors.magenta}=============================`);
    console.log(`Build timestamp: ${new Date().toLocaleString()}`);

    hesseLogger.summary.start('Starting PDF pre-build processing');

    // 1. Ensure directories exist
    const publicDir = path.join(process.cwd(), 'public');
    const extractedDir = path.join(publicDir, 'extracted');
    const pdfsDir = path.join(publicDir, 'pdfs');
    const analyzedDir = path.join(publicDir, 'analyzed');
    const coverLettersDir = path.join(publicDir, 'cover-letters');
    const downloadsDir = path.join(publicDir, 'downloads');

    // Create directories if they don't exist
    [extractedDir, pdfsDir, analyzedDir, coverLettersDir, downloadsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });

    // 2. Find default resume PDF
    const defaultResumePath = path.join(publicDir, 'default_resume.pdf');

    if (!fs.existsSync(defaultResumePath)) {
      throw new Error(`Default resume PDF not found at ${defaultResumePath}`);
    }

    hesseLogger.summary.progress(`Found default resume PDF: ${defaultResumePath}`);
    danteLogger.success.basic(`Found default resume PDF: ${defaultResumePath}`);

    // 3. Process the PDF using the existing PDF processor
    console.log(`\n${colors.cyan}${colors.bright}🔄 PROCESSING DEFAULT RESUME PDF${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    // Run the PDF processor script
    try {
      console.log('Executing PDF processor script...');

      // Use the existing PDF processor script
      const processorScript = path.join(process.cwd(), 'scripts', 'process-pdf.js');

      if (fs.existsSync(processorScript)) {
        execSync(`node ${processorScript} --pdf=${defaultResumePath} --force`, { stdio: 'inherit' });
        hesseLogger.summary.progress('PDF processed successfully using process-pdf.js');
        danteLogger.success.core('PDF processed successfully');
      } else {
        // Fallback to the dynamic PDF extraction script
        const extractionScript = path.join(process.cwd(), 'scripts', 'dynamic-pdf-extraction.js');

        if (fs.existsSync(extractionScript)) {
          execSync(`node ${extractionScript} --pdf=${defaultResumePath} --force`, { stdio: 'inherit' });
          hesseLogger.summary.progress('PDF processed successfully using dynamic-pdf-extraction.js');
          danteLogger.success.core('PDF processed successfully');
        } else {
          throw new Error('PDF processor scripts not found');
        }
      }
    } catch (error) {
      danteLogger.error.system('Error processing PDF', error);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    // 4. Generate download formats
    console.log(`\n${colors.cyan}${colors.bright}🔄 GENERATING DOWNLOAD FORMATS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    // 4.1. Check if extracted content exists
    const extractedJsonPath = path.join(extractedDir, 'resume_content.json');
    const extractedTextPath = path.join(extractedDir, 'resume_content.txt');
    const extractedMarkdownPath = path.join(extractedDir, 'resume_content.md');

    if (!fs.existsSync(extractedJsonPath)) {
      throw new Error(`Extracted JSON content not found at ${extractedJsonPath}`);
    }

    hesseLogger.summary.progress('Found extracted content');
    danteLogger.success.basic('Found extracted content');

    // 4.2. Read the extracted content
    const extractedJson = JSON.parse(fs.readFileSync(extractedJsonPath, 'utf8'));
    const extractedText = fs.existsSync(extractedTextPath) ? fs.readFileSync(extractedTextPath, 'utf8') : '';
    const extractedMarkdown = fs.existsSync(extractedMarkdownPath) ? fs.readFileSync(extractedMarkdownPath, 'utf8') : '';

    // Get the content fingerprint
    const contentFingerprint = extractedJson.metadata?.contentFingerprint ||
      fs.existsSync(path.join(extractedDir, 'content_fingerprint.txt')) ?
      fs.readFileSync(path.join(extractedDir, 'content_fingerprint.txt'), 'utf8').trim() :
      crypto.createHash('sha256').update(extractedText).digest('hex').substring(0, 8);

    // 4.3. Analyze content with OpenAI during build
    console.log(`\n${colors.cyan}${colors.bright}🔄 ANALYZING CONTENT WITH OPENAI${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    hesseLogger.summary.progress('Analyzing content with OpenAI during build');
    danteLogger.success.basic('Analyzing content with OpenAI during build');

    // Initialize the OpenAI build analyzer
    const openaiAnalyzer = new OpenAIBuildAnalyzer({
      // API key will be taken from environment variable
      cacheEnabled: true,
      debug: process.env.DEBUG_LOGGING === 'true'
    });

    // Analyze the content with OpenAI
    const analysisResult = await openaiAnalyzer.analyzeContent(extractedText, ResumeSchema);

    let analyzedJson = null;

    if (analysisResult.success) {
      hesseLogger.summary.progress('OpenAI analysis completed successfully');
      danteLogger.success.core('OpenAI analysis completed successfully');

      // Create analyzed content with OpenAI results
      analyzedJson = {
        metadata: {
          source: path.basename(defaultResumePath),
          analysisDate: new Date().toISOString(),
          contentFingerprint,
          openaiModel: 'gpt-4o',
          cached: analysisResult.cached || false,
          simulated: analysisResult.simulated || false
        },
        analysis: {
          skills: {
            technical: analysisResult.data.skills.filter(skill =>
              skill.toLowerCase().includes('javascript') ||
              skill.toLowerCase().includes('react') ||
              skill.toLowerCase().includes('aws') ||
              skill.toLowerCase().includes('node')
            ),
            soft: analysisResult.data.skills.filter(skill =>
              !skill.toLowerCase().includes('javascript') &&
              !skill.toLowerCase().includes('react') &&
              !skill.toLowerCase().includes('aws') &&
              !skill.toLowerCase().includes('node')
            )
          },
          experience: {
            years: analysisResult.data.experience.length * 2, // Rough estimate
            domains: ['Web Development', 'Cloud Computing'],
            highlights: analysisResult.data.experience.flatMap(exp => exp.responsibilities).slice(0, 3)
          },
          education: {
            level: analysisResult.data.education[0]?.degree || 'Unknown',
            field: analysisResult.data.education[0]?.degree || 'Unknown',
            relevance: 'High'
          },
          summary: analysisResult.data.summary
        },
        structuredContent: analysisResult.data,
        zodValidation: {
          success: true,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      hesseLogger.summary.error(`OpenAI analysis failed: ${analysisResult.error}`);
      danteLogger.error.system('OpenAI analysis failed', analysisResult.error);

      // Create a fallback analyzed content
      analyzedJson = {
        metadata: {
          source: path.basename(defaultResumePath),
          analysisDate: new Date().toISOString(),
          contentFingerprint,
          fallback: true,
          simulated: analysisResult.simulated || false
        },
        analysis: {
          skills: {
            technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
            soft: ['Communication', 'Teamwork', 'Problem Solving']
          },
          experience: {
            years: 5,
            domains: ['Web Development', 'Cloud Computing'],
            highlights: [
              'Developed and maintained web applications',
              'Implemented CI/CD pipelines',
              'Deployed applications to AWS'
            ]
          },
          education: {
            level: 'Bachelor',
            field: 'Computer Science',
            relevance: 'High'
          },
          summary: 'Experienced software developer with expertise in JavaScript/TypeScript, React, Node.js, and AWS.'
        },
        structuredContent: extractedJson.structuredContent,
        zodValidation: {
          success: false,
          error: analysisResult.error?.toString() || 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }

    // Save the analyzed JSON
    const analyzedJsonPath = path.join(extractedDir, 'resume_content_analyzed.json');
    fs.writeFileSync(analyzedJsonPath, JSON.stringify(analyzedJson, null, 2));

    hesseLogger.summary.progress('Saved analyzed content to file');
    danteLogger.success.basic('Saved analyzed content to file');

    // 4.5. Check if cover letter exists
    const coverLetterPath = path.join(extractedDir, 'cover_letter.md');

    if (!fs.existsSync(coverLetterPath)) {
      danteLogger.warn.deprecated('Cover letter not found');
    } else {
      hesseLogger.summary.progress('Found cover letter');
      danteLogger.success.basic('Found cover letter');
    }

    // 4.6. Read the cover letter
    const coverLetterContent = fs.existsSync(coverLetterPath) ? fs.readFileSync(coverLetterPath, 'utf8') : '';

    // 4.7. Generate download formats based on OpenAI analysis
    console.log(`\n${colors.cyan}${colors.bright}🔄 GENERATING ENHANCED DOWNLOAD FORMATS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);

    hesseLogger.summary.progress('Generating enhanced download formats from OpenAI analysis');
    danteLogger.success.basic('Generating enhanced download formats from OpenAI analysis');

    // Determine if we have valid OpenAI analysis
    const hasValidAnalysis = analyzedJson &&
      analyzedJson.structuredContent &&
      !analyzedJson.metadata?.fallback;

    if (hasValidAnalysis) {
      hesseLogger.summary.progress('Using OpenAI analysis for download formats');
      danteLogger.success.core('Using OpenAI analysis for download formats');

      // Get the structured content from OpenAI
      const structuredContent = analyzedJson.structuredContent;

      // 4.7.1. Generate enhanced text format
      const enhancedText = this.generateEnhancedTextResume(structuredContent);
      fs.writeFileSync(path.join(downloadsDir, 'resume.txt'), enhancedText);

      // 4.7.2. Generate enhanced markdown format
      const enhancedMarkdown = this.generateEnhancedMarkdownResume(structuredContent);
      fs.writeFileSync(path.join(downloadsDir, 'resume.md'), enhancedMarkdown);

      // 4.7.3. Generate enhanced JSON format
      fs.writeFileSync(
        path.join(downloadsDir, 'resume.json'),
        JSON.stringify(analyzedJson, null, 2)
      );

      // 4.7.4. Generate enhanced HTML format
      const enhancedHtml = this.generateEnhancedHtmlResume(structuredContent);
      fs.writeFileSync(path.join(downloadsDir, 'resume.html'), enhancedHtml);

      // 4.7.5. Generate enhanced cover letter
      const enhancedCoverLetter = this.generateEnhancedCoverLetter(structuredContent);
      fs.writeFileSync(path.join(downloadsDir, 'cover_letter.md'), enhancedCoverLetter);

      // 4.7.6. Generate enhanced HTML cover letter
      const enhancedCoverLetterHtml = this.generateEnhancedHtmlCoverLetter(enhancedCoverLetter);
      fs.writeFileSync(path.join(downloadsDir, 'cover_letter.html'), enhancedCoverLetterHtml);
    } else {
      hesseLogger.summary.progress('Using extracted content for download formats (OpenAI analysis not available)');
      danteLogger.warn.deprecated('Using extracted content for download formats (OpenAI analysis not available)');

      // Fallback to original files
      // 4.7.1. Copy the original files to the downloads directory
      if (fs.existsSync(extractedTextPath)) {
        fs.copyFileSync(extractedTextPath, path.join(downloadsDir, 'resume.txt'));
      }

      if (fs.existsSync(extractedMarkdownPath)) {
        fs.copyFileSync(extractedMarkdownPath, path.join(downloadsDir, 'resume.md'));
      }

      if (fs.existsSync(coverLetterPath)) {
        fs.copyFileSync(coverLetterPath, path.join(downloadsDir, 'cover_letter.md'));
      }

      // 4.7.2. Generate JSON download
      fs.writeFileSync(
        path.join(downloadsDir, 'resume.json'),
        JSON.stringify(analyzedJson || extractedJson, null, 2)
      );

      // 4.7.3. Generate HTML download
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #333;
    }
    h1 {
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    h2 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      margin-top: 20px;
    }
    ul {
      padding-left: 20px;
    }
    .experience {
      margin-bottom: 20px;
    }
    .experience h3 {
      margin-bottom: 5px;
    }
    .experience p {
      margin-top: 0;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>Resume</h1>
  <div>
    ${extractedMarkdown.replace(/^#.*$/m, '').replace(/\n/g, '<br>')}
  </div>
</body>
</html>`;

      fs.writeFileSync(path.join(downloadsDir, 'resume.html'), htmlContent);

      // 4.7.4. Generate HTML cover letter
      if (coverLetterContent) {
        const coverLetterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cover Letter</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #333;
    }
    h1 {
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
    }
    h2 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  ${coverLetterContent.replace(/^#/gm, '<h1>').replace(/^##/gm, '<h2>').replace(/^###/gm, '<h3>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
</body>
</html>`;

        fs.writeFileSync(path.join(downloadsDir, 'cover_letter.html'), coverLetterHtml);
      }
    }

    // 4.8. Generate download test report
    const downloadTestReport = {
      timestamp: new Date().toISOString(),
      formats: {
        pdf: {
          available: fs.existsSync(defaultResumePath),
          path: '/default_resume.pdf',
          size: fs.existsSync(defaultResumePath) ? fs.statSync(defaultResumePath).size : 0
        },
        text: {
          available: fs.existsSync(path.join(downloadsDir, 'resume.txt')),
          path: '/downloads/resume.txt',
          size: fs.existsSync(path.join(downloadsDir, 'resume.txt')) ? fs.statSync(path.join(downloadsDir, 'resume.txt')).size : 0
        },
        markdown: {
          available: fs.existsSync(path.join(downloadsDir, 'resume.md')),
          path: '/downloads/resume.md',
          size: fs.existsSync(path.join(downloadsDir, 'resume.md')) ? fs.statSync(path.join(downloadsDir, 'resume.md')).size : 0
        },
        json: {
          available: fs.existsSync(path.join(downloadsDir, 'resume.json')),
          path: '/downloads/resume.json',
          size: fs.existsSync(path.join(downloadsDir, 'resume.json')) ? fs.statSync(path.join(downloadsDir, 'resume.json')).size : 0
        },
        html: {
          available: fs.existsSync(path.join(downloadsDir, 'resume.html')),
          path: '/downloads/resume.html',
          size: fs.existsSync(path.join(downloadsDir, 'resume.html')) ? fs.statSync(path.join(downloadsDir, 'resume.html')).size : 0
        },
        coverLetter: {
          available: fs.existsSync(path.join(downloadsDir, 'cover_letter.md')),
          path: '/downloads/cover_letter.md',
          size: fs.existsSync(path.join(downloadsDir, 'cover_letter.md')) ? fs.statSync(path.join(downloadsDir, 'cover_letter.md')).size : 0
        },
        coverLetterHtml: {
          available: fs.existsSync(path.join(downloadsDir, 'cover_letter.html')),
          path: '/downloads/cover_letter.html',
          size: fs.existsSync(path.join(downloadsDir, 'cover_letter.html')) ? fs.statSync(path.join(downloadsDir, 'cover_letter.html')).size : 0
        }
      },
      tests: {
        allFormatsAvailable: true,
        totalSize: 0,
        formatCount: 0
      },
      // Add OpenAI analysis and validation results
      analysis: {
        performed: true,
        timestamp: analyzedJson?.metadata?.analysisDate || new Date().toISOString(),
        model: analyzedJson?.metadata?.openaiModel || 'unknown',
        cached: analyzedJson?.metadata?.cached || false,
        simulated: analyzedJson?.metadata?.simulated || false,
        fallback: analyzedJson?.metadata?.fallback || false
      },
      validation: analyzedJson?.zodValidation || {
        success: false,
        error: 'Validation results not available',
        timestamp: new Date().toISOString()
      }
    };

    // Calculate test results
    let allFormatsAvailable = true;
    let totalSize = 0;
    let formatCount = 0;

    Object.keys(downloadTestReport.formats).forEach(format => {
      const formatInfo = downloadTestReport.formats[format];
      if (!formatInfo.available) {
        allFormatsAvailable = false;
      } else {
        totalSize += formatInfo.size;
        formatCount++;
      }
    });

    downloadTestReport.tests.allFormatsAvailable = allFormatsAvailable;
    downloadTestReport.tests.totalSize = totalSize;
    downloadTestReport.tests.formatCount = formatCount;

    // Save the download test report
    fs.writeFileSync(
      path.join(downloadsDir, 'download_test_report.json'),
      JSON.stringify(downloadTestReport, null, 2)
    );

    // 5. Generate preview content for the download test page
    const previewContent = {
      timestamp: new Date().toISOString(),
      formats: {
        text: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        markdown: extractedMarkdown.substring(0, 500) + (extractedMarkdown.length > 500 ? '...' : ''),
        json: JSON.stringify(analyzedJson || extractedJson, null, 2).substring(0, 500) + '...',
        coverLetter: coverLetterContent.substring(0, 500) + (coverLetterContent.length > 500 ? '...' : '')
      }
    };

    // Save the preview content
    fs.writeFileSync(
      path.join(downloadsDir, 'preview_content.json'),
      JSON.stringify(previewContent, null, 2)
    );

    // 6. Complete the process
    hesseLogger.summary.complete('PDF pre-build processing completed successfully');
    danteLogger.success.perfection('PDF pre-build processing completed successfully');

    console.log(`\n${colors.green}${colors.bright}✅ PDF PRE-BUILD PROCESSING COMPLETED${colors.reset}`);
    console.log(`${colors.green}=============================`);
    console.log(`Generated download formats: ${formatCount}`);
    console.log(`Total size: ${totalSize} bytes`);
    console.log(`All formats available: ${allFormatsAvailable ? 'Yes' : 'No'}`);
    console.log(`Download test report saved to: ${path.join(downloadsDir, 'download_test_report.json')}`);
    console.log(`Preview content saved to: ${path.join(downloadsDir, 'preview_content.json')}`);

    return {
      success: true,
      message: 'PDF pre-build processing completed successfully',
      downloadTestReport
    };
  } catch (error) {
    hesseLogger.summary.error(`PDF pre-build processing failed: ${error.message}`);
    danteLogger.error.system('PDF pre-build processing failed', error);

    console.log(`\n${colors.red}${colors.bright}❌ PDF PRE-BUILD PROCESSING FAILED${colors.reset}`);
    console.log(`${colors.red}=============================`);
    console.log(`Error: ${error.message}`);

    return {
      success: false,
      message: `PDF pre-build processing failed: ${error.message}`,
      error
    };
  }
}

// Run the main function
processPdfsForBuild().then(result => {
  if (!result.success) {
    process.exit(1);
  }
});
