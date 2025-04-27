/**
 * PDF Content Verification Script
 * 
 * This script verifies that the extracted content matches the expected PDF.
 * It's used during the build process to ensure we're using the right PDF.
 */

const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  console.log('🔍 Verifying PDF content...');
  
  // Check if the PDF file exists
  const pdfPath = path.join(__dirname, '../public/default_resume.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ ERROR: PDF file not found at', pdfPath);
    process.exit(1);
  }
  
  // Get PDF metadata
  const pdfStats = fs.statSync(pdfPath);
  const pdfSize = pdfStats.size;
  const pdfModified = pdfStats.mtime;
  
  console.log(`📄 PDF file: ${pdfPath}`);
  console.log(`📊 Size: ${pdfSize} bytes`);
  console.log(`⏱️ Last modified: ${pdfModified}`);
  
  // Check if the extracted content exists
  const extractedDir = path.join(__dirname, '../public/extracted');
  const contentPath = path.join(extractedDir, 'resume_content.md');
  const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
  const buildInfoPath = path.join(extractedDir, 'build_info.json');
  
  if (!fs.existsSync(contentPath)) {
    console.error('❌ ERROR: Extracted content not found at', contentPath);
    console.log('🔄 Running extraction process...');
    
    try {
      // Run the extraction script
      const { execSync } = require('child_process');
      execSync('./amplify-dynamic-pdf.sh', { stdio: 'inherit' });
      console.log('✅ Extraction completed successfully');
    } catch (error) {
      console.error('❌ ERROR: Extraction failed:', error);
      process.exit(1);
    }
  }
  
  // Read the content fingerprint
  if (fs.existsSync(fingerprintPath)) {
    const fingerprint = fs.readFileSync(fingerprintPath, 'utf8').trim();
    console.log(`🔑 Content fingerprint: ${fingerprint}`);
  } else {
    console.warn('⚠️ WARNING: Content fingerprint not found');
  }
  
  // Read the build info
  if (fs.existsSync(buildInfoPath)) {
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    console.log('📊 Build info:');
    console.log(`  - Build timestamp: ${buildInfo.buildTimestamp}`);
    console.log(`  - PDF size: ${buildInfo.pdfInfo.size} bytes`);
    console.log(`  - PDF last modified: ${buildInfo.pdfInfo.lastModified}`);
    console.log(`  - Content fingerprint: ${buildInfo.pdfInfo.contentFingerprint}`);
    
    // Check if the content was extracted from the current PDF
    if (buildInfo.pdfInfo.size !== pdfSize) {
      console.warn('⚠️ WARNING: PDF size mismatch - content may be from a different PDF');
      console.log(`  - Current PDF size: ${pdfSize} bytes`);
      console.log(`  - Extracted from PDF size: ${buildInfo.pdfInfo.size} bytes`);
      
      // Force re-extraction
      console.log('🔄 Forcing re-extraction due to PDF mismatch...');
      try {
        const { execSync } = require('child_process');
        execSync('./amplify-dynamic-pdf.sh', { stdio: 'inherit' });
        console.log('✅ Re-extraction completed successfully');
      } catch (error) {
        console.error('❌ ERROR: Re-extraction failed:', error);
        process.exit(1);
      }
    } else {
      console.log('✅ PDF size matches - content is from the current PDF');
    }
  } else {
    console.warn('⚠️ WARNING: Build info not found');
    
    // Force extraction to create build info
    console.log('🔄 Forcing extraction to create build info...');
    try {
      const { execSync } = require('child_process');
      execSync('./amplify-dynamic-pdf.sh', { stdio: 'inherit' });
      console.log('✅ Extraction completed successfully');
    } catch (error) {
      console.error('❌ ERROR: Extraction failed:', error);
      process.exit(1);
    }
  }
  
  // Read the extracted content
  if (fs.existsSync(contentPath)) {
    const content = fs.readFileSync(contentPath, 'utf8');
    const contentPreview = content.split('\n').slice(0, 5).join('\n');
    console.log('📄 Content preview:');
    console.log(contentPreview);
    console.log('...');
  }
  
  console.log('✅ PDF content verification completed');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
