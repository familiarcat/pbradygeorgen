/**
 * Create PDF Source Identifier
 * 
 * This script creates a JSON file containing information about the current active PDF source.
 * It's used to invalidate caches when the PDF source changes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load the PDF source configuration
let pdfSourceConfig;
try {
  pdfSourceConfig = require('../pdf-source.config.js');
  console.log(`Loaded PDF source configuration (active: ${pdfSourceConfig.active})`);
} catch (error) {
  console.error('Failed to load PDF source configuration:', error);
  // Default configuration if the file doesn't exist
  pdfSourceConfig = {
    active: 'default',
    sources: {
      default: {
        path: 'public/pbradygeorgen_resume.pdf',
        outputPrefix: '',
        description: 'Default resume PDF'
      }
    }
  };
}

// Get the active source
const activeSourceName = pdfSourceConfig.active;
const activeSource = pdfSourceConfig.sources[activeSourceName];

if (!activeSource) {
  console.error(`Active PDF source '${activeSourceName}' not found in configuration`);
  process.exit(1);
}

// Get the PDF file path
const pdfPath = path.join(process.cwd(), activeSource.path);

// Check if the PDF file exists
if (!fs.existsSync(pdfPath)) {
  console.error(`PDF file not found at ${pdfPath}`);
  process.exit(1);
}

// Get the PDF file stats
const stats = fs.statSync(pdfPath);
const lastModified = stats.mtime.toISOString();
const fileSize = stats.size;

// Create a unique identifier for the PDF
const fileContent = fs.readFileSync(pdfPath);
const contentHash = crypto.createHash('md5').update(fileContent).digest('hex');

// Create the source identifier object
const sourceIdentifier = {
  name: activeSourceName,
  path: activeSource.path,
  lastModified,
  fileSize,
  contentHash,
  timestamp: new Date().toISOString()
};

// Create the output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'public', 'extracted');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the source identifier to a JSON file
const outputPath = path.join(outputDir, 'pdf_source_identifier.json');
fs.writeFileSync(outputPath, JSON.stringify(sourceIdentifier, null, 2));

console.log(`Created PDF source identifier at ${outputPath}`);
console.log(`Active PDF source: ${activeSourceName}`);
console.log(`Content hash: ${contentHash}`);
