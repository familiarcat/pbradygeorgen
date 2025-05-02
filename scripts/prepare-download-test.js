/**
 * Prepare Download Test Environment
 * 
 * This script prepares the environment for download functionality tests by:
 * 1. Ensuring the extracted directory exists
 * 2. Creating necessary content files if they don't exist
 * 3. Generating sample content for testing
 */

const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  console.log('🔧 Preparing environment for download functionality tests...');
  
  // Create the extracted directory if it doesn't exist
  const extractedDir = path.join(process.cwd(), 'public/extracted');
  if (!fs.existsSync(extractedDir)) {
    console.log(`Creating extracted directory: ${extractedDir}`);
    fs.mkdirSync(extractedDir, { recursive: true });
  }
  
  // Create resume_content.md if it doesn't exist
  const resumeContentPath = path.join(extractedDir, 'resume_content.md');
  if (!fs.existsSync(resumeContentPath)) {
    console.log(`Creating resume_content.md: ${resumeContentPath}`);
    
    // Create sample resume content that matches test expectations
    const resumeContent = `# P. Brady Georgen

## Professional Summary

Sr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.

## Skills

- JavaScript/TypeScript
- React/Next.js
- Node.js
- AWS
- UI/UX Design
- Full Stack Development

## Experience

### Software Development Company (2020-Present)
**Sr. Software Developer**

Developed and maintained web applications using React, Next.js, and AWS.

### Previous Company (2015-2020)
**Software Developer**

Worked on various projects using JavaScript, Node.js, and React.

## Education

### Computer Science
**University** (2010-2014)

---

*This document was automatically generated for testing.*
*Generated on: ${new Date().toLocaleDateString()}*`;
    
    fs.writeFileSync(resumeContentPath, resumeContent);
  }
  
  // Create resume_content_analyzed.json if it doesn't exist
  const analyzedContentPath = path.join(extractedDir, 'resume_content_analyzed.json');
  if (!fs.existsSync(analyzedContentPath)) {
    console.log(`Creating resume_content_analyzed.json: ${analyzedContentPath}`);
    
    // Create sample analyzed content
    const analyzedContent = {
      structuredContent: {
        name: "P. Brady Georgen",
        summary: "Sr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.",
        skills: [
          { text: "JavaScript/TypeScript" },
          { text: "React/Next.js" },
          { text: "Node.js" },
          { text: "AWS" },
          { text: "UI/UX Design" },
          { text: "Full Stack Development" }
        ],
        experience: [
          {
            title: "Sr. Software Developer",
            company: "Software Development Company",
            period: "2020-Present",
            description: "Developed and maintained web applications using React, Next.js, and AWS."
          },
          {
            title: "Software Developer",
            company: "Previous Company",
            period: "2015-2020",
            description: "Worked on various projects using JavaScript, Node.js, and React."
          }
        ],
        education: [
          {
            degree: "Computer Science",
            institution: "University",
            period: "2010-2014"
          }
        ]
      },
      metadata: {
        generationTime: Date.now(),
        contentFingerprint: `test-${Date.now()}`,
        sections: ["summary", "skills", "experience", "education"],
        format: "json",
        contentType: "resume"
      }
    };
    
    fs.writeFileSync(analyzedContentPath, JSON.stringify(analyzedContent, null, 2));
  }
  
  // Create cover_letter.md if it doesn't exist
  const coverLetterPath = path.join(extractedDir, 'cover_letter.md');
  if (!fs.existsSync(coverLetterPath)) {
    console.log(`Creating cover_letter.md: ${coverLetterPath}`);
    
    // Create sample cover letter content
    const coverLetterContent = `# Cover Letter

Dear Hiring Manager,

I am writing to express my interest in the Software Developer position at your company. With my experience in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS, I believe I would be a valuable addition to your team.

My experience includes developing and maintaining web applications using React, Next.js, and AWS. I have a strong background in UI/UX design and am passionate about creating intuitive and user-friendly interfaces.

I look forward to discussing how my skills and experience align with your needs.

Sincerely,
P. Brady Georgen

---

*This document was automatically generated for testing.*
*Generated on: ${new Date().toLocaleDateString()}*`;
    
    fs.writeFileSync(coverLetterPath, coverLetterContent);
  }
  
  // Create content_fingerprint.txt if it doesn't exist
  const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
  if (!fs.existsSync(fingerprintPath)) {
    console.log(`Creating content_fingerprint.txt: ${fingerprintPath}`);
    
    // Create a fingerprint
    const fingerprint = `test-${Date.now()}`;
    fs.writeFileSync(fingerprintPath, fingerprint);
  }
  
  // Create build_info.json if it doesn't exist
  const buildInfoPath = path.join(extractedDir, 'build_info.json');
  if (!fs.existsSync(buildInfoPath)) {
    console.log(`Creating build_info.json: ${buildInfoPath}`);
    
    // Create build info
    const buildInfo = {
      buildTimestamp: new Date().toISOString(),
      pdfInfo: {
        path: '/default_resume.pdf',
        size: 12345,
        lastModified: new Date().toISOString(),
        contentFingerprint: `test-${Date.now()}`
      },
      extractionStatus: {
        textExtracted: true,
        fontsExtracted: true,
        colorsExtracted: true
      }
    };
    
    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  }
  
  // Ensure default_resume.pdf exists
  const defaultResumePath = path.join(process.cwd(), 'public/default_resume.pdf');
  if (!fs.existsSync(defaultResumePath)) {
    console.log(`Warning: default_resume.pdf not found at ${defaultResumePath}`);
    console.log('Some tests may fail without this file');
  }
  
  console.log('✅ Environment prepared for download functionality tests');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
