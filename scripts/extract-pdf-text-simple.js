const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Main function
async function main() {
  const pdfPath = path.join(__dirname, '../public/pbradygeorgen_resume.pdf');
  const outputPath = path.join(__dirname, '../public/extracted/resume_content.txt');
  
  try {
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`Extracting text from: ${pdfPath}`);
    
    // Use pdftotext if available (part of poppler-utils)
    try {
      await execPromise('which pdftotext');
      console.log('Using pdftotext for extraction');
      
      await execPromise(`pdftotext -layout "${pdfPath}" "${outputPath}"`);
      console.log(`Text extracted successfully and saved to: ${outputPath}`);
      
      // Read and display a preview
      const text = fs.readFileSync(outputPath, 'utf8');
      console.log('\nExtracted content preview:');
      console.log(text.substring(0, 500) + '...');
      
    } catch (cmdError) {
      console.log('pdftotext not available, using alternative method');
      
      // Create a simple text file with instructions
      const instructionText = `
PDF TEXT EXTRACTION FAILED

The PDF text extraction tool requires pdftotext (part of poppler-utils) to be installed.

To install on macOS:
brew install poppler

To install on Ubuntu/Debian:
sudo apt-get install poppler-utils

To install on Windows:
Download from https://blog.alivate.com.au/poppler-windows/

Once installed, run this script again.
`;
      
      fs.writeFileSync(outputPath, instructionText);
      console.log(`Instructions saved to: ${outputPath}`);
    }
    
  } catch (error) {
    console.error('Failed to extract text:', error);
    process.exit(1);
  }
}

// Run the main function
main();
