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
    
    // Save the raw text to a file
    fs.writeFileSync(outputPath, text);
    
    // Process the text to create a better structured markdown
    const improvedMarkdown = createImprovedMarkdown(text);
    
    // Save the improved markdown
    fs.writeFileSync(markdownPath, improvedMarkdown);
    
    console.log(`Text extracted successfully and saved to: ${outputPath}`);
    console.log(`Improved markdown version saved to: ${markdownPath}`);
    console.log('\nExtracted content preview:');
    console.log(improvedMarkdown.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('Failed to extract text:', error);
    process.exit(1);
  }
}

// Function to create improved markdown
function createImprovedMarkdown(text) {
  // Split the text into lines and clean them
  const lines = text.split('\\n').map(line => line.trim()).filter(line => line);
  
  // Identify key sections
  const sections = {
    header: [],
    about: [],
    contact: [],
    skills: [],
    experience: [],
    education: [],
    clients: []
  };
  
  // Process the text to identify sections
  let currentSection = 'header';
  
  // Extract name (assuming it's one of the first few lines)
  let name = '';
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    if (lines[i].includes('Georgen')) {
      name = lines[i];
      break;
    }
  }
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Identify sections based on keywords
    if (line.includes('ABOUT ME')) {
      currentSection = 'about';
      continue;
    } else if (line.includes('SKILLS') || line.includes('TECHNOLOGIES')) {
      currentSection = 'skills';
      continue;
    } else if (line.includes('WORK') && line.includes('EXPERIENCE')) {
      currentSection = 'experience';
      continue;
    } else if (line.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    } else if (line.match(/^[0-9]{4}/) && lines[i+1] && !lines[i+1].match(/^[0-9]{4}/)) {
      // Lines starting with years are likely experience entries
      currentSection = 'experience';
    } else if (line.includes('@') || line.includes('.com') || line.includes('St. Louis')) {
      currentSection = 'contact';
      continue;
    } else if (['Cox', 'Bayer', 'Charter', 'Mastercard'].some(client => line.includes(client))) {
      currentSection = 'clients';
      continue;
    }
    
    // Add the line to the current section
    sections[currentSection].push(line);
  }
  
  // Create the markdown content
  let markdown = `# ${name.trim()}\n\n`;
  
  // Add a professional summary from the header section
  if (sections.header.length > 0) {
    markdown += `## Professional Summary\n\n`;
    markdown += sections.header.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
  }
  
  // Add contact information
  if (sections.contact.length > 0) {
    markdown += `## Contact Information\n\n`;
    for (const line of sections.contact) {
      markdown += `- ${line.trim()}\n`;
    }
    markdown += '\n';
  }
  
  // Add skills
  if (sections.skills.length > 0) {
    markdown += `## Skills & Technologies\n\n`;
    for (const line of sections.skills) {
      if (line.startsWith('•')) {
        markdown += `- ${line.substring(1).trim()}\n`;
      } else {
        markdown += `- ${line.trim()}\n`;
      }
    }
    markdown += '\n';
  }
  
  // Add work experience
  if (sections.experience.length > 0) {
    markdown += `## Professional Experience\n\n`;
    
    // Process experience entries
    let i = 0;
    while (i < sections.experience.length) {
      const line = sections.experience[i];
      
      // Check if this line starts with a year range
      if (line.match(/^[0-9]{4}/)) {
        const period = line.trim();
        const company = sections.experience[i+1]?.trim() || '';
        const title = sections.experience[i+2]?.trim() || '';
        
        markdown += `### ${company} (${period})\n`;
        markdown += `**${title}**\n\n`;
        
        // Skip the lines we've already processed
        i += 3;
        
        // Add any description that follows until the next year entry
        let description = [];
        while (i < sections.experience.length && !sections.experience[i].match(/^[0-9]{4}/)) {
          description.push(sections.experience[i]);
          i++;
        }
        
        if (description.length > 0) {
          markdown += description.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
        } else {
          markdown += '\n';
        }
      } else {
        // If not a year entry, just add the line
        markdown += `${line.trim()}\n`;
        i++;
      }
    }
  }
  
  // Add client work
  if (sections.clients.length > 0) {
    markdown += `## Client Work\n\n`;
    
    let currentClient = '';
    let description = [];
    
    for (const line of sections.clients) {
      if (['Cox', 'Bayer', 'Charter', 'Mastercard'].some(client => line.includes(client))) {
        // If we have a previous client, add it to the markdown
        if (currentClient && description.length > 0) {
          markdown += `### ${currentClient}\n`;
          markdown += description.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
          description = [];
        }
        
        currentClient = line.trim();
      } else {
        description.push(line);
      }
    }
    
    // Add the last client
    if (currentClient && description.length > 0) {
      markdown += `### ${currentClient}\n`;
      markdown += description.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
    }
  }
  
  // Add education
  if (sections.education.length > 0) {
    markdown += `## Education\n\n`;
    
    let i = 0;
    while (i < sections.education.length) {
      const line = sections.education[i];
      
      if (line.includes('University') || line.includes('College')) {
        const degree = sections.education[i-1]?.trim() || '';
        const institution = line.trim();
        const period = sections.education[i+1]?.trim() || '';
        
        markdown += `### ${degree}\n`;
        markdown += `**${institution}** (${period})\n\n`;
        
        i += 2;
      } else {
        i++;
      }
    }
  }
  
  // Add about section
  if (sections.about.length > 0) {
    markdown += `## About\n\n`;
    markdown += sections.about.join(' ').replace(/\\s+/g, ' ').trim() + '\n\n';
  }
  
  // Add metadata
  markdown += `---\n\n`;
  markdown += `*This document was automatically extracted from a PDF resume.*\n`;
  markdown += `*Generated on: ${new Date().toLocaleDateString()}*\n`;
  
  return markdown;
}

// Run the main function
main();
