/**
 * Restore Original PDF Script
 *
 * This script restores the original PDF after testing a different template.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main function
async function main() {
  try {
    console.log('Restoring original PDF...');

    // Check if backup exists
    const originalPdfPath = path.join(__dirname, '../public/default_resume.pdf');
    const backupPdfPath = path.join(__dirname, '../public/default_resume.backup.pdf');

    if (!fs.existsSync(backupPdfPath)) {
      console.error('Backup PDF not found. Cannot restore original.');
      process.exit(1);
    }

    // Restore the original PDF
    fs.copyFileSync(backupPdfPath, originalPdfPath);

    // Re-extract content from the original PDF
    console.log('Re-extracting content from original PDF...');
    try {
      // Try to run the improved extraction script
      execSync('node scripts/extract-pdf-text-improved.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Improved extraction failed, trying alternative method...');
      try {
        // Try the pdf-parse method
        execSync('node scripts/extract-pdf-text-with-pdf-parse.js', { stdio: 'inherit' });
      } catch (error2) {
        console.log('PDF-parse extraction failed, trying simple method...');
        // Try the simple method
        execSync('node scripts/extract-pdf-text-simple.js', { stdio: 'inherit' });
      }
    }

    // Generate improved markdown content
    console.log('Regenerating improved markdown content...');
    try {
      // Try to run the OpenAI analysis
      execSync('node scripts/generate-improved-markdown.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('Failed to generate improved markdown. You may need to run the app and use the API directly.');
    }

    console.log('\nOriginal PDF restored!');
    console.log('You can now run the application with the original PDF:');
    console.log('npm run dev');

  } catch (error) {
    console.error('Error restoring original PDF:', error);
    process.exit(1);
  }
}

// Run the main function
main();
