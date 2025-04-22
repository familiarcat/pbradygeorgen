/**
 * Generate Improved Markdown Script
 * 
 * This script takes the extracted text from a PDF and generates an improved
 * markdown version with better structure and formatting.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to create improved markdown from raw text
function createImprovedMarkdown(text) {
  // Split the text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // Try to identify the document structure
  let markdown = '';
  let currentSection = '';
  let inList = false;
  
  // Assume the first non-empty line is the name/title
  if (lines.length > 0) {
    markdown += `# ${lines[0]}\n\n`;
  }
  
  // Process the remaining lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Check if this line looks like a section header
    // (all caps, short, or followed by a line of dashes/underscores)
    const isHeader = (
      (line === line.toUpperCase() && line.length < 50) ||
      (nextLine && nextLine.match(/^[-_=]{3,}$/))
    );
    
    if (isHeader) {
      // End any current list
      if (inList) {
        markdown += '\n';
        inList = false;
      }
      
      // Add a new section header
      currentSection = line;
      markdown += `\n## ${line}\n\n`;
      
      // Skip the next line if it's just dashes/underscores
      if (nextLine && nextLine.match(/^[-_=]{3,}$/)) {
        i++;
      }
    } else if (line.match(/^[•\-\*]\s/) || line.match(/^\d+\.\s/)) {
      // This line looks like a list item
      if (!inList) {
        markdown += '\n';
        inList = true;
      }
      markdown += `${line}\n`;
    } else if (line.match(/^[A-Z][a-z]+\s\d{4}\s-\s/) || line.match(/^[A-Z][a-z]+\s\d{4}\s-\s[A-Z][a-z]+\s\d{4}/)) {
      // This looks like a date range, probably for experience or education
      markdown += `\n### ${line}\n\n`;
    } else {
      // Regular paragraph text
      if (inList) {
        markdown += '\n';
        inList = false;
      }
      markdown += `${line}\n\n`;
    }
  }
  
  return markdown;
}

// Main function
async function main() {
  const inputPath = path.join(__dirname, '../public/extracted/resume_content.txt');
  const outputPath = path.join(__dirname, '../public/extracted/resume_content.md');
  const improvedOutputPath = path.join(__dirname, '../public/extracted/resume_content_improved.md');
  
  try {
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`Reading extracted text from: ${inputPath}`);
    
    // Check if the input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      console.log('Trying to extract text from PDF first...');
      
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
      
      // Check again if the file exists
      if (!fs.existsSync(inputPath)) {
        console.error(`Still cannot find input file: ${inputPath}`);
        process.exit(1);
      }
    }
    
    // Read the extracted text
    const text = fs.readFileSync(inputPath, 'utf8');
    
    // Create a basic markdown version
    const basicMarkdown = `# Extracted PDF Content\n\n${text}`;
    fs.writeFileSync(outputPath, basicMarkdown);
    
    // Create an improved markdown version
    const improvedMarkdown = createImprovedMarkdown(text);
    fs.writeFileSync(improvedOutputPath, improvedMarkdown);
    
    console.log(`Basic markdown saved to: ${outputPath}`);
    console.log(`Improved markdown saved to: ${improvedOutputPath}`);
    console.log('\nImproved markdown preview:');
    console.log(improvedMarkdown.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('Error generating improved markdown:', error);
    process.exit(1);
  }
}

// Run the main function
main();
