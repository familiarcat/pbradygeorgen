/**
 * Mock Cover Letter Generator
 *
 * This is a simplified version of the S3CoverLetterGenerator that doesn't rely on S3 or OpenAI.
 * It's used for testing the UI when the real generator is not available.
 */

/**
 * Mock Cover Letter Generator class
 */
class MockCoverLetterGenerator {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      debug: options.debug || false,
      ...options
    };

    console.log('🔍 [Hesse:Summary:Start] Initializing Mock Cover Letter Generator');
    console.log('😇☀️: Initializing Mock Cover Letter Generator');
  }

  /**
   * Generate a cover letter
   * @param {string} contentFingerprint - Content fingerprint from extraction
   * @param {Object} coverLetterParams - Parameters for the cover letter
   * @param {boolean} forceRefresh - Whether to force refresh the cover letter
   * @returns {Promise<Object>} - Cover letter generation result
   */
  async generateCoverLetter(contentFingerprint, coverLetterParams = {}, forceRefresh = false) {
    try {
      console.log('🔍 [Hesse:Summary:Start] Generating mock cover letter');
      console.log('😇☀️: Generating mock cover letter with params:', coverLetterParams);

      // Generate a generic cover letter
      const coverLetter = this.generateGenericCoverLetter(coverLetterParams);

      // Generate HTML version
      const coverLetterHtml = this.generateHtmlCoverLetter(coverLetter, 'Benjamin Stein');

      console.log('✅ [Hesse:Summary:Complete] Mock cover letter generated successfully');
      console.log('😇🌈: Mock cover letter generated successfully');

      return {
        success: true,
        coverLetter,
        coverLetterHtml,
        contentFingerprint,
        s3Key: `mock-cover-letters/${contentFingerprint}/cover_letter.md`,
        htmlS3Key: `mock-cover-letters/${contentFingerprint}/cover_letter.html`,
        promptResponseS3Key: `mock-cover-letters/${contentFingerprint}/openai_prompt_response.json`,
        cached: false
      };
    } catch (error) {
      console.log(`❌ [Hesse:Summary:Error] Error generating mock cover letter: ${error.message}`);
      console.log('👑💢: Error generating mock cover letter', error);

      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * Generate a generic cover letter
   * @param {Object} params - Cover letter parameters
   * @returns {string} - Generic cover letter in markdown format
   */
  generateGenericCoverLetter(params) {
    const { generic } = params;

    if (generic) {
      return `# Benjamin Stein

I am writing to express my interest in exploring career opportunities where my background in clinical informatics and healthcare technology can be put to effective use. With a proven track record in implementing, maintaining, and optimizing healthcare information systems, I am confident in my ability to make significant contributions to any organization seeking expertise in this field.

Throughout my career, I have developed expertise in managing EHR systems, enterprise web browsers, and various administrative tools. My experience includes not only technical implementation but also training staff and ensuring compliance with data security standards. I have consistently demonstrated strong problem-solving abilities and effective communication skills, particularly in high-pressure healthcare environments where technology reliability is critical.

My approach to healthcare technology is guided by a commitment to creating user-friendly solutions that enhance clinical workflows rather than complicate them. I believe that technology should serve as a bridge to better patient care, and I have consistently worked to ensure that the systems I manage align with this philosophy. My background in both network and database administration provides me with a comprehensive understanding of healthcare IT infrastructure that can be valuable in various settings.

I would welcome the opportunity to discuss how my skills and experience could benefit an organization seeking someone with my qualifications. I am confident that my technical expertise, combined with my understanding of healthcare environments, would make me a valuable addition to any team focused on improving healthcare through technology.

Thank you for considering my application. I look forward to the possibility of speaking with you about how I can contribute to your organization's success.

Sincerely,
Benjamin Stein`;
    } else {
      return `# Benjamin Stein

I am writing to express my interest in the ${params.position} position at ${params.company}. With my extensive experience in clinical informatics and healthcare technology, I am excited about the opportunity to contribute to your team.

${params.companyDetails ? `I am particularly drawn to ${params.company} because ${params.companyDetails} This aligns perfectly with my professional background and personal values.` : ''}

Throughout my career, I have developed expertise in managing EHR systems, enterprise web browsers, and various administrative tools. My experience includes not only technical implementation but also training staff and ensuring compliance with data security standards. I have consistently demonstrated strong problem-solving abilities and effective communication skills, particularly in high-pressure healthcare environments.

${params.positionDetails ? `The ${params.position} role requiring ${params.positionDetails} seems like an excellent match for my skills and experience.` : ''}

I would welcome the opportunity to discuss how my skills and experience could benefit ${params.company}. I am confident that my technical expertise, combined with my understanding of healthcare environments, would make me a valuable addition to your team.

Thank you for considering my application. I look forward to the possibility of speaking with you about how I can contribute to your organization's success.

Sincerely,
Benjamin Stein`;
    }
  }

  /**
   * Generate HTML version of the cover letter
   * @param {string} markdown - Cover letter in markdown format
   * @param {string} name - Applicant's name
   * @returns {string} - Cover letter in HTML format
   */
  generateHtmlCoverLetter(markdown, name) {
    // Simple markdown to HTML conversion for basic elements
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap in paragraphs if not already done
    if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>') && !html.startsWith('<p>')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('</p>')) {
      html = html + '</p>';
    }

    // Create the full HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cover Letter - ${name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    p {
      margin-bottom: 16px;
    }
    .header {
      margin-bottom: 30px;
    }
    .date {
      color: #7f8c8d;
      margin-bottom: 20px;
    }
    .signature {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Cover Letter</h1>
    <div class="date">${new Date().toLocaleDateString()}</div>
  </div>

  ${html}

  <div class="signature">
    <p>Generated by AlexAI</p>
  </div>
</body>
</html>`;
  }
}

module.exports = MockCoverLetterGenerator;
