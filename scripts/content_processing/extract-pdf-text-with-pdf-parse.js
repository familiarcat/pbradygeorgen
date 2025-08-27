const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Main function
async function main() {
  const pdfPath = path.join(__dirname, '../public/pbradygeorgen_resume.pdf');
  const outputPath = path.join(__dirname, '../public/extracted/resume_content.txt');
  const markdownPath = path.join(__dirname, '../public/extracted/resume_content.md');
  
  try {
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`Extracting text from: ${pdfPath}`);
    
    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Parse the PDF
    const data = await pdfParse(dataBuffer);
    
    // Get the text content
    const text = data.text;
    
    // Save the text to a file
    fs.writeFileSync(outputPath, text);
    
    // Create a markdown version with some formatting
    const markdown = `# PDF Content: ${path.basename(pdfPath)}\n\n` +
      `**Number of Pages:** ${data.numpages}\n\n` +
      `**Content:**\n\n` +
      text.split('\n').map(line => line.trim()).filter(line => line).join('\n\n');
    
    fs.writeFileSync(markdownPath, markdown);
    
    console.log(`Text extracted successfully and saved to: ${outputPath}`);
    console.log(`Markdown version saved to: ${markdownPath}`);
    console.log('\nExtracted content preview:');
    console.log(text.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('Failed to extract text:', error);
    process.exit(1);
  }
}

// Run the main function
main();
