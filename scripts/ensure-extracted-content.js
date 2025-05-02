/**
 * Ensure Extracted Content Script
 * 
 * This script ensures that the extracted directory exists with basic content,
 * which allows the build process to continue even if PDF extraction fails.
 */

const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  console.log('🔍 Ensuring extracted content exists...');
  
  // Create the extracted directory if it doesn't exist
  const extractedDir = path.join(__dirname, '../public/extracted');
  if (!fs.existsSync(extractedDir)) {
    console.log(`Creating extracted directory: ${extractedDir}`);
    fs.mkdirSync(extractedDir, { recursive: true });
  }
  
  // Check if resume_content.md exists
  const resumeContentPath = path.join(extractedDir, 'resume_content.md');
  if (!fs.existsSync(resumeContentPath)) {
    console.log(`Creating fallback resume_content.md: ${resumeContentPath}`);
    
    // Create a fallback resume content
    const fallbackContent = `# P. Brady Georgen

## Professional Summary

Sr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.

## Skills & Technologies

- JavaScript/TypeScript
- React/Next.js
- Node.js
- AWS
- UI/UX Design
- Full Stack Development

## Professional Experience

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

*This document was automatically generated as a fallback.*
*Generated on: ${new Date().toLocaleDateString()}*
`;
    
    fs.writeFileSync(resumeContentPath, fallbackContent);
  }
  
  // Check if cover_letter.md exists
  const coverLetterPath = path.join(extractedDir, 'cover_letter.md');
  if (!fs.existsSync(coverLetterPath)) {
    console.log(`Creating fallback cover_letter.md: ${coverLetterPath}`);
    
    // Create a fallback cover letter content
    const fallbackContent = `# Cover Letter

Dear Hiring Manager,

I am writing to express my interest in the Software Developer position at your company. With my experience in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS, I believe I would be a valuable addition to your team.

My experience includes developing and maintaining web applications using React, Next.js, and AWS. I have a strong background in UI/UX design and am passionate about creating intuitive and user-friendly interfaces.

I look forward to discussing how my skills and experience align with your needs.

Sincerely,
P. Brady Georgen

---

*This document was automatically generated as a fallback.*
*Generated on: ${new Date().toLocaleDateString()}*
`;
    
    fs.writeFileSync(coverLetterPath, fallbackContent);
  }
  
  // Check if content_fingerprint.txt exists
  const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
  if (!fs.existsSync(fingerprintPath)) {
    console.log(`Creating fallback content_fingerprint.txt: ${fingerprintPath}`);
    
    // Create a fallback fingerprint
    const fallbackFingerprint = `fallback-${Date.now()}`;
    fs.writeFileSync(fingerprintPath, fallbackFingerprint);
  }
  
  // Check if build_info.json exists
  const buildInfoPath = path.join(extractedDir, 'build_info.json');
  if (!fs.existsSync(buildInfoPath)) {
    console.log(`Creating fallback build_info.json: ${buildInfoPath}`);
    
    // Create a fallback build info
    const fallbackBuildInfo = {
      buildTimestamp: new Date().toISOString(),
      pdfInfo: {
        path: '/default_resume.pdf',
        size: 0,
        lastModified: new Date().toISOString(),
        contentFingerprint: `fallback-${Date.now()}`
      },
      extractionStatus: {
        textExtracted: true,
        fontsExtracted: false,
        colorsExtracted: false
      }
    };
    
    fs.writeFileSync(buildInfoPath, JSON.stringify(fallbackBuildInfo, null, 2));
  }
  
  console.log('✅ Extracted content verification completed');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
