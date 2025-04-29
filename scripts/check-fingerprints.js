/**
 * Check Fingerprints Script
 * 
 * This script checks if the content fingerprinting is working correctly
 * by comparing the current fingerprint with the stored one.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Get the PDF path
const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');

// Check if the PDF exists
if (!fs.existsSync(pdfPath)) {
  console.error(`❌ PDF file not found at ${pdfPath}`);
  process.exit(1);
}

// Get PDF metadata
const stats = fs.statSync(pdfPath);
const pdfSize = stats.size;
const pdfModified = stats.mtime.getTime();
const pdfModifiedDate = new Date(pdfModified).toISOString();

// Generate fingerprint
const contentFingerprint = crypto
  .createHash('sha256')
  .update(`${pdfPath}:${pdfSize}:${pdfModified}`)
  .digest('hex');

// Read the stored fingerprint
const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');

if (!fs.existsSync(buildInfoPath)) {
  console.error(`❌ Build info file not found at ${buildInfoPath}`);
  process.exit(1);
}

const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));

// Compare fingerprints
console.log('📄 PDF file:', pdfPath);
console.log('📊 Size:', pdfSize, 'bytes');
console.log('⏱️ Last modified:', pdfModifiedDate);
console.log('🔑 Current fingerprint:', contentFingerprint);
console.log('🔑 Stored fingerprint:', buildInfo.pdfInfo.contentFingerprint);
console.log('🔍 Match:', contentFingerprint === buildInfo.pdfInfo.contentFingerprint ? '✅ Yes' : '❌ No');

// Check content fingerprint
const contentPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.md');

if (fs.existsSync(contentPath)) {
  const contentPreview = fs.readFileSync(contentPath, 'utf8').substring(0, 500);
  const contentHash = crypto.createHash('sha256').update(contentPreview).digest('hex');
  
  console.log('\n📄 Content preview hash:', contentHash);
  console.log('📄 Stored content hash:', buildInfo.pdfInfo.contentFingerprint);
  console.log('🔍 Content hash match:', contentHash === buildInfo.pdfInfo.contentFingerprint ? '✅ Yes' : '❌ No');
} else {
  console.error(`❌ Content file not found at ${contentPath}`);
}

// Check if the analyzed content exists
const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

if (fs.existsSync(analyzedPath)) {
  console.log('\n✅ Analyzed content file exists');
  
  // Read the analyzed content
  const analyzedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
  
  // Print some info about the analyzed content
  console.log('📄 Name:', analyzedContent.structuredContent.name);
  console.log('📄 Sections:', Object.keys(analyzedContent.sections).join(', '));
  console.log('📄 Structured sections:', Object.keys(analyzedContent.structuredContent).join(', '));
} else {
  console.error(`❌ Analyzed content file not found at ${analyzedPath}`);
}

// Exit with success
process.exit(0);
