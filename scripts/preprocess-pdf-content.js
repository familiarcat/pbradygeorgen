/**
 * Pre-process PDF Content Script
 * 
 * This script pre-processes the PDF content with ChatGPT during the build process
 * to ensure the content is analyzed and ready for display.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the extracted content
const extractedDir = path.join(process.cwd(), 'public', 'extracted');
const textPath = path.join(extractedDir, 'resume_content.txt');
const analyzedPath = path.join(extractedDir, 'resume_content_analyzed.json');

// Check if the extracted text exists
if (!fs.existsSync(textPath)) {
  console.error(`❌ Extracted text file not found at ${textPath}`);
  process.exit(1);
}

console.log('🧠 Pre-processing PDF content with ChatGPT...');

try {
  // Run the analyze-pdf-content.js script
  console.log('🧠 Running analyze-pdf-content.js...');
  execSync('node scripts/analyze-pdf-content.js', { stdio: 'inherit' });
  
  // Check if the analyzed content exists
  if (!fs.existsSync(analyzedPath)) {
    console.error(`❌ Analyzed content file not found at ${analyzedPath}`);
    process.exit(1);
  }
  
  // Read the analyzed content
  const analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
  
  // Verify the analyzed content has the expected structure
  if (!analyzedContent.structuredContent || !analyzedContent.sections) {
    console.error('❌ Analyzed content does not have the expected structure');
    process.exit(1);
  }
  
  // Print some info about the analyzed content
  console.log('✅ PDF content pre-processed successfully');
  console.log(`📄 Name: ${analyzedContent.structuredContent.name}`);
  console.log(`📄 Sections: ${Object.keys(analyzedContent.sections).join(', ')}`);
  console.log(`📄 Structured sections: ${Object.keys(analyzedContent.structuredContent).join(', ')}`);
  
  // Update the build info
  const buildInfoPath = path.join(extractedDir, 'build_info.json');
  
  if (fs.existsSync(buildInfoPath)) {
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    
    // Update the build info
    buildInfo.extractionStatus = buildInfo.extractionStatus || {};
    buildInfo.extractionStatus.chatGptAnalyzed = true;
    buildInfo.chatGptAnalysis = {
      timestamp: new Date().toISOString(),
      name: analyzedContent.structuredContent.name,
      sections: Object.keys(analyzedContent.sections),
      structuredSections: Object.keys(analyzedContent.structuredContent)
    };
    
    // Save the updated build info
    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    console.log('📊 Build info updated');
  }
  
  // Exit with success
  process.exit(0);
} catch (error) {
  console.error('❌ Error pre-processing PDF content:', error);
  process.exit(1);
}
