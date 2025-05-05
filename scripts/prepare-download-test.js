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

  // Create the downloads directory if it doesn't exist
  const downloadsDir = path.join(process.cwd(), 'public/downloads');
  if (!fs.existsSync(downloadsDir)) {
    console.log(`Creating downloads directory: ${downloadsDir}`);
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // Create resume.md in the downloads directory
  const resumeMdPath = path.join(downloadsDir, 'resume.md');
  if (!fs.existsSync(resumeMdPath)) {
    console.log(`Creating resume.md: ${resumeMdPath}`);

    // Use the content from resume_content.md
    let resumeContent = '';
    if (fs.existsSync(resumeContentPath)) {
      resumeContent = fs.readFileSync(resumeContentPath, 'utf8');
    } else {
      resumeContent = `# P. Brady Georgen\n\n## Professional Summary\n\nSr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n*Generated as a placeholder for testing*\n*Generated on: ${new Date().toLocaleDateString()}*`;
    }

    fs.writeFileSync(resumeMdPath, resumeContent);
  }

  // Create resume.txt in the downloads directory
  const resumeTxtPath = path.join(downloadsDir, 'resume.txt');
  if (!fs.existsSync(resumeTxtPath)) {
    console.log(`Creating resume.txt: ${resumeTxtPath}`);

    // Convert markdown to text
    let resumeContent = '';
    if (fs.existsSync(resumeContentPath)) {
      resumeContent = fs.readFileSync(resumeContentPath, 'utf8');
    } else {
      resumeContent = `# P. Brady Georgen\n\n## Professional Summary\n\nSr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.\n\n*Generated as a placeholder for testing*\n*Generated on: ${new Date().toLocaleDateString()}*`;
    }

    // Simple markdown to text conversion
    const textContent = resumeContent
      .replace(/#{1,6}\s+(.+)$/gm, '$1\n')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n\s*\n/g, '\n\n');

    fs.writeFileSync(resumeTxtPath, textContent);
  }

  // Create resume.json in the downloads directory
  const resumeJsonPath = path.join(downloadsDir, 'resume.json');
  if (!fs.existsSync(resumeJsonPath)) {
    console.log(`Creating resume.json: ${resumeJsonPath}`);

    // Use the content from resume_content_analyzed.json
    let resumeJson = {};
    if (fs.existsSync(analyzedContentPath)) {
      resumeJson = JSON.parse(fs.readFileSync(analyzedContentPath, 'utf8'));
    } else {
      resumeJson = {
        structuredContent: {
          name: "P. Brady Georgen",
          summary: "Sr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS."
        },
        metadata: {
          generationTime: Date.now(),
          contentFingerprint: `test-${Date.now()}`
        }
      };
    }

    fs.writeFileSync(resumeJsonPath, JSON.stringify(resumeJson, null, 2));
  }

  // Create resume.html in the downloads directory
  const resumeHtmlPath = path.join(downloadsDir, 'resume.html');
  if (!fs.existsSync(resumeHtmlPath)) {
    console.log(`Creating resume.html: ${resumeHtmlPath}`);

    // Create a simple HTML version
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>P. Brady Georgen - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 20px; }
    h3 { color: #555; }
    .summary { font-style: italic; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>P. Brady Georgen</h1>
  <div class="summary">
    <p>Sr. Software Developer with expertise in full-stack development, JavaScript/TypeScript, UI/UX, React, and AWS.</p>
  </div>

  <footer>
    <p><em>Generated on: ${new Date().toLocaleString()}</em></p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(resumeHtmlPath, htmlContent);
  }

  // Create cover_letter.md in the downloads directory
  const coverLetterMdPath = path.join(downloadsDir, 'cover_letter.md');
  if (!fs.existsSync(coverLetterMdPath)) {
    console.log(`Creating cover_letter.md: ${coverLetterMdPath}`);

    // Use the content from cover_letter.md
    let coverLetterContent = '';
    if (fs.existsSync(coverLetterPath)) {
      coverLetterContent = fs.readFileSync(coverLetterPath, 'utf8');
    } else {
      coverLetterContent = `# Cover Letter\n\nDear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your company.\n\nSincerely,\nP. Brady Georgen\n\n*Generated as a placeholder for testing*\n*Generated on: ${new Date().toLocaleDateString()}*`;
    }

    fs.writeFileSync(coverLetterMdPath, coverLetterContent);
  }

  // Create cover_letter.html in the downloads directory
  const coverLetterHtmlPath = path.join(downloadsDir, 'cover_letter.html');
  if (!fs.existsSync(coverLetterHtmlPath)) {
    console.log(`Creating cover_letter.html: ${coverLetterHtmlPath}`);

    // Create a simple HTML version
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Cover Letter - P. Brady Georgen</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; text-align: center; }
    .date { text-align: right; margin-bottom: 20px; }
    .signature { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>Cover Letter</h1>
  <div class="date">${new Date().toLocaleDateString()}</div>

  <p>Dear Hiring Manager,</p>

  <p>I am writing to express my interest in the Software Developer position at your company.</p>

  <div class="signature">
    <p>Sincerely,<br>P. Brady Georgen</p>
  </div>

  <footer>
    <p><em>Generated on: ${new Date().toLocaleString()}</em></p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(coverLetterHtmlPath, htmlContent);
  }

  // Create preview_content.json in the downloads directory
  const previewContentPath = path.join(downloadsDir, 'preview_content.json');
  if (!fs.existsSync(previewContentPath)) {
    console.log(`Creating preview_content.json: ${previewContentPath}`);

    // Create preview content
    const previewContent = {
      timestamp: new Date().toISOString(),
      formats: {
        text: fs.existsSync(resumeTxtPath) ? fs.readFileSync(resumeTxtPath, 'utf8') : 'Text content placeholder',
        markdown: fs.existsSync(resumeMdPath) ? fs.readFileSync(resumeMdPath, 'utf8') : 'Markdown content placeholder',
        json: fs.existsSync(resumeJsonPath) ? fs.readFileSync(resumeJsonPath, 'utf8') : '{"placeholder": true}',
        coverLetter: fs.existsSync(coverLetterMdPath) ? fs.readFileSync(coverLetterMdPath, 'utf8') : 'Cover letter placeholder'
      }
    };

    fs.writeFileSync(previewContentPath, JSON.stringify(previewContent, null, 2));
  }

  // Create download_test_report.json in the public directory
  const testReportPath = path.join(process.cwd(), 'public/download_test_report.json');
  if (!fs.existsSync(testReportPath)) {
    console.log(`Creating download_test_report.json: ${testReportPath}`);

    // Create test report
    const testReport = {
      timestamp: new Date().toISOString(),
      formats: {
        text: {
          available: fs.existsSync(resumeTxtPath),
          path: '/downloads/resume.txt',
          size: fs.existsSync(resumeTxtPath) ? fs.statSync(resumeTxtPath).size : 0,
          contentType: 'text/plain'
        },
        markdown: {
          available: fs.existsSync(resumeMdPath),
          path: '/downloads/resume.md',
          size: fs.existsSync(resumeMdPath) ? fs.statSync(resumeMdPath).size : 0,
          contentType: 'text/markdown'
        },
        json: {
          available: fs.existsSync(resumeJsonPath),
          path: '/downloads/resume.json',
          size: fs.existsSync(resumeJsonPath) ? fs.statSync(resumeJsonPath).size : 0,
          contentType: 'application/json'
        },
        html: {
          available: fs.existsSync(resumeHtmlPath),
          path: '/downloads/resume.html',
          size: fs.existsSync(resumeHtmlPath) ? fs.statSync(resumeHtmlPath).size : 0,
          contentType: 'text/html'
        },
        coverLetter: {
          available: fs.existsSync(coverLetterMdPath),
          path: '/downloads/cover_letter.md',
          size: fs.existsSync(coverLetterMdPath) ? fs.statSync(coverLetterMdPath).size : 0,
          contentType: 'text/markdown'
        },
        coverLetterHtml: {
          available: fs.existsSync(coverLetterHtmlPath),
          path: '/downloads/cover_letter.html',
          size: fs.existsSync(coverLetterHtmlPath) ? fs.statSync(coverLetterHtmlPath).size : 0,
          contentType: 'text/html'
        }
      },
      tests: {
        allFormatsAvailable: true,
        formatCount: 6,
        totalSize: 0
      }
    };

    // Calculate total size
    Object.values(testReport.formats).forEach(format => {
      testReport.tests.totalSize += format.size;
      if (!format.available) {
        testReport.tests.allFormatsAvailable = false;
      }
    });

    fs.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
  }

  console.log('✅ Environment prepared for download functionality tests');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
