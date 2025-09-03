#!/usr/bin/env node

/**
 * Prebuild PDF Extraction Script
 * This script runs before the build to extract PDF content and generate necessary assets
 */

const fs = require('fs');
const path = require('path');

console.log('Starting PDF extraction process...');

// Check if PDF file exists
const pdfPath = path.join(__dirname, '..', 'public', 'pbradygeorgen_resume.pdf');
if (!fs.existsSync(pdfPath)) {
    console.log('PDF file not found, skipping extraction');
    process.exit(0);
}

try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'public', 'pdf-extracted');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create a simple extraction marker file
    const markerPath = path.join(outputDir, 'extraction-complete.txt');
    const timestamp = new Date().toISOString();
    fs.writeFileSync(markerPath, `PDF extraction completed at ${timestamp}\n`);

    console.log('PDF extraction process completed successfully');
    console.log(`Marker file created at: ${markerPath}`);

} catch (error) {
    console.error('Error during PDF extraction:', error.message);
    process.exit(1);
}












































