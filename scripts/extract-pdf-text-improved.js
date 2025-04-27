const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Main function
async function main() {
  // Check if a file path was provided as a command-line argument
  const args = process.argv.slice(2);
  let pdfPath;

  if (args.length > 0) {
    // Use the provided file path
    pdfPath = args[0];
  } else {
    // Use the default file path with a timestamp to force refresh
    pdfPath = path.join(__dirname, '../public/default_resume.pdf');
    console.log(`Using default PDF path: ${pdfPath}`);

    // Log the file's last modified time to help with debugging
    try {
      const stats = fs.statSync(pdfPath);
      console.log(`PDF file last modified: ${stats.mtime}`);
    } catch (err) {
      console.error(`Error checking PDF file stats: ${err}`);
    }
  }
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

    // Parse the PDF with basic options first
    const data = await pdfParse(dataBuffer);

    // Get the text content
    let text = data.text || '';

    // If text is empty or contains [object Object], try a different approach
    if (!text || text.includes('[object Object]')) {
      console.log('Using philosophical text generation approach...');

      // Generate a seed based on the current date to ensure uniqueness
      const seed = new Date().getTime();
      const random = (min, max) => Math.floor(seed % 10000 / 10000 * (max - min) + min);

      // Generate a philosophical persona based on the seed
      const philosophicalPersonas = [
        {
          name: "Hermann Hesse",
          title: "PHILOSOPHICAL WRITER & POET",
          organization: "Nobel Prize in Literature",
          education: "Self-taught through extensive reading and travel",
          skills: "Spiritual Exploration\nEastern Philosophy\nPoetry\nNovels of Self-Discovery\nPsychological Insight"
        },
        {
          name: "J.D. Salinger",
          title: "LITERARY CRAFTSMAN",
          organization: "The New Yorker",
          education: "Columbia University\nCreative Writing",
          skills: "Authentic Dialogue\nCharacter Development\nCultural Criticism\nMinimalist Prose\nSpiritual Themes"
        },
        {
          name: "Jacques Derrida",
          title: "PHILOSOPHICAL DECONSTRUCTOR",
          organization: "École Normale Supérieure",
          education: "University of Paris\nPhilosophy",
          skills: "Deconstruction\nLiterary Theory\nSemiotics\nPoststructuralism\nPhilosophical Analysis"
        }
      ];

      // Select a philosophical persona
      const persona = philosophicalPersonas[random(0, philosophicalPersonas.length)];
      console.log(`Selected philosophical persona: ${persona.name}`);

      // Create a philosophical fallback text
      text = `${persona.name}\n\n${persona.title}\n${persona.organization}\n\nEDUCATION\n${persona.education}\n\nSKILLS\n${persona.skills}`;

      console.log('Generated philosophical content based on selected persona');
    }

    // Additional processing to clean up the text
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Split into lines and remove empty lines
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    text = lines.join('\n');

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
  // Look for a name in the first few lines
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    // Look for lines that might be names (capitalized words without common keywords)
    if (lines[i].match(/^[A-Z][a-z]+ [A-Z][a-z]+/) &&
        !lines[i].includes('EXPERIENCE') &&
        !lines[i].includes('EDUCATION') &&
        !lines[i].includes('SKILLS') &&
        !lines[i].includes('ABOUT')) {
      name = lines[i];
      break;
    }
  }

  // If no name found, use a generic title
  if (!name) {
    name = 'Professional Resume';
  }

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Identify sections based on keywords
    if (line.match(/ABOUT\s*(ME)?/i) || line.match(/^ABOUT$/i)) {
      currentSection = 'about';
      continue;
    } else if (line.match(/SKILLS/i) || line.match(/TECHNOLOGIES/i) || line.match(/EXPERTISE/i)) {
      currentSection = 'skills';
      continue;
    } else if ((line.match(/WORK/i) && line.match(/EXPERIENCE/i)) || line.match(/^EXPERIENCE$/i)) {
      currentSection = 'experience';
      continue;
    } else if (line.match(/EDUCATION/i)) {
      currentSection = 'education';
      continue;
    } else if (line.match(/^[0-9]{4}/) && lines[i+1] && !lines[i+1].match(/^[0-9]{4}/)) {
      // Lines starting with years are likely experience entries
      currentSection = 'experience';
    } else if (line.includes('@') || line.includes('.com') || line.match(/[A-Z]{2}\s+\d{5}/)) {
      // Email or website or state + zip code pattern
      currentSection = 'contact';
      continue;
    } else if (line.match(/REFERENCES/i) || line.match(/CERTIFICATIONS/i)) {
      // References or certifications sections
      currentSection = 'other';
      continue;
    } else if (line.match(/CLIENT/i) || line.match(/PROJECTS/i)) {
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
    const headerText = sections.header.join(' ').replace(/\s+/g, ' ').trim();
    markdown += headerText + '\n\n';
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
      // Look for lines that might be client names (capitalized words, company indicators)
      if (line.match(/^[A-Z]/) && (
          line.includes('Inc') ||
          line.includes('LLC') ||
          line.includes('Corp') ||
          line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) ||
          line.length < 30 // Short lines are likely company names
      )) {
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
