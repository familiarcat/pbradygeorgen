/**
 * Analyze PDF Content Script
 *
 * This script uses OpenAI to analyze the extracted PDF content and structure it
 * for use in the application. It's designed to be run during the build process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import the OpenAI service
async function analyzeResumeContent() {
  try {
    console.log('🧠 Starting PDF content analysis with ChatGPT...');

    // Check if OpenAI API key is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key is not available, skipping analysis');

      // Create a placeholder analyzed content file to prevent build failures
      const placeholderContent = {
        sections: {
          summary: "Content analysis skipped - OpenAI API key not available",
          experience: [],
          education: [],
          skills: []
        },
        structuredContent: {
          name: "Default Resume",
          title: "Professional Resume",
          contact: {},
          summary: "Content analysis skipped - OpenAI API key not available",
          experience: [],
          education: [],
          skills: [],
          certifications: []
        }
      };

      // Save the placeholder content
      const extractedDir = path.join(process.cwd(), 'public', 'extracted');
      fs.writeFileSync(
        path.join(extractedDir, 'resume_content_analyzed.json'),
        JSON.stringify(placeholderContent, null, 2)
      );

      console.log('✅ Created placeholder analyzed content file');
      return true; // Return true to prevent build failure
    }

    // Check if the extracted content exists
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    const textPath = path.join(extractedDir, 'resume_content.txt');

    if (!fs.existsSync(textPath)) {
      console.error('❌ Extracted text content not found');
      return false;
    }

    // Read the extracted text content
    const rawText = fs.readFileSync(textPath, 'utf8');
    console.log(`📄 Read ${rawText.length} characters from extracted text`);

    // Import the OpenAI service
    const { analyzeResumeContent, saveAnalyzedContent } = require('./openai-pdf-analyzer');

    // Analyze the content
    console.log('🧠 Analyzing content with ChatGPT...');
    const analyzedContent = await analyzeResumeContent(rawText);

    if (!analyzedContent) {
      console.error('❌ Failed to analyze content with ChatGPT');
      return false;
    }

    // Save the analyzed content
    await saveAnalyzedContent(analyzedContent);

    console.log('✅ Content analysis completed successfully');
    console.log(`📄 Analyzed content saved to public/extracted/resume_content_analyzed.json`);

    // Print a preview of the analyzed content
    console.log('📝 Analyzed content preview:');
    console.log(JSON.stringify({
      name: analyzedContent.structuredContent.name,
      sections: Object.keys(analyzedContent.sections),
      structuredContent: Object.keys(analyzedContent.structuredContent)
    }, null, 2));

    return true;
  } catch (error) {
    console.error('❌ Error analyzing content:', error);
    return false;
  }
}

// Run the analysis
(async () => {
  try {
    const success = await analyzeResumeContent();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  }
})();
