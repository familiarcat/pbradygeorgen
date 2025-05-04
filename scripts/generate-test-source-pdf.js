/**
 * Test Source PDF Generator
 *
 * This script generates a test PDF file to use as a source PDF.
 * It creates a simple resume PDF with updated information.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

/**
 * Generates a test PDF file
 */
async function generateTestPdf() {
  log.info('Generating test source PDF...');

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set the font size
  const fontSize = 12;
  const titleSize = 24;
  const headingSize = 16;
  
  // Set the margins
  const margin = 50;
  
  // Set the line height
  const lineHeight = fontSize * 1.5;
  
  // Set the current position
  let y = page.getHeight() - margin;
  const x = margin;
  
  // Add the title
  page.drawText('P. Brady Georgen', {
    x,
    y,
    size: titleSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= titleSize * 1.5;
  
  // Add the subtitle
  page.drawText('Senior Software Developer', {
    x,
    y,
    size: fontSize + 2,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  y -= lineHeight * 1.5;
  
  // Add contact information
  page.drawText('Email: brady@example.com | Phone: (555) 123-4567 | St. Louis, MO', {
    x,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 2;
  
  // Add the summary heading
  page.drawText('PROFESSIONAL SUMMARY', {
    x,
    y,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 1.2;
  
  // Add the summary
  const summary = 'Experienced software developer with expertise in full-stack development, ' +
    'JavaScript/TypeScript, React, and AWS. Passionate about creating elegant solutions ' +
    'to complex problems and delivering high-quality software products.';
  
  // Split the summary into multiple lines
  const summaryLines = splitTextIntoLines(summary, font, fontSize, page.getWidth() - margin * 2);
  
  for (const line of summaryLines) {
    page.drawText(line, {
      x,
      y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Add the skills heading
  page.drawText('SKILLS', {
    x,
    y,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 1.2;
  
  // Add the skills
  const skills = [
    'JavaScript/TypeScript',
    'React/Next.js',
    'Node.js',
    'AWS (Amplify, Lambda, S3)',
    'GraphQL',
    'REST APIs',
    'Git',
    'CI/CD',
    'Agile/Scrum',
  ];
  
  for (const skill of skills) {
    page.drawText(`• ${skill}`, {
      x: x + 10,
      y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Add the experience heading
  page.drawText('WORK EXPERIENCE', {
    x,
    y,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 1.2;
  
  // Add the experience
  const experiences = [
    {
      title: 'Senior Software Developer',
      company: 'TechCorp Inc.',
      period: '2020 - Present',
      description: 'Developed and maintained full-stack web applications using React, ' +
        'Node.js, and AWS. Led a team of 5 developers and implemented CI/CD pipelines.',
    },
    {
      title: 'Software Developer',
      company: 'WebSolutions LLC',
      period: '2017 - 2020',
      description: 'Built responsive web applications using React and Redux. ' +
        'Implemented RESTful APIs using Node.js and Express.',
    },
    {
      title: 'Junior Developer',
      company: 'StartupTech',
      period: '2015 - 2017',
      description: 'Assisted in developing front-end components using HTML, CSS, and JavaScript. ' +
        'Participated in code reviews and agile development processes.',
    },
  ];
  
  for (const exp of experiences) {
    // Add the period
    page.drawText(exp.period, {
      x,
      y,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
    
    // Add the company
    page.drawText(exp.company, {
      x,
      y,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
    
    // Add the title
    page.drawText(exp.title, {
      x: x + 10,
      y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
    
    // Add the description
    const descLines = splitTextIntoLines(exp.description, font, fontSize, page.getWidth() - margin * 2 - 20);
    
    for (const line of descLines) {
      page.drawText(line, {
        x: x + 20,
        y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
    }
    
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Add the education heading
  page.drawText('EDUCATION', {
    x,
    y,
    size: headingSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 1.2;
  
  // Add the education
  page.drawText('Bachelor of Science in Computer Science', {
    x,
    y,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight;
  
  page.drawText('University of Technology', {
    x: x + 10,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight;
  
  page.drawText('2011 - 2015', {
    x: x + 10,
    y,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Create the source-pdfs directory if it doesn't exist
  const sourceDir = path.join(process.cwd(), 'source-pdfs');
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
  
  // Generate a unique filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test_resume_${timestamp}.pdf`;
  const filePath = path.join(sourceDir, filename);
  
  // Write the PDF to disk
  fs.writeFileSync(filePath, pdfBytes);
  
  log.success(`Generated test source PDF: ${filePath}`);
  
  return filePath;
}

/**
 * Splits text into multiple lines based on the available width
 */
function splitTextIntoLines(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Main function
 */
async function main() {
  try {
    log.info('Starting test source PDF generation...');
    
    // Generate the test PDF
    const pdfPath = await generateTestPdf();
    
    // Update the source PDF
    log.info('Updating source PDF with the generated test PDF...');
    log.info('To update the source PDF, run:');
    log.info(`node scripts/update-source-pdf.js update "${pdfPath}"`);
    
  } catch (error) {
    log.error(`Error generating test source PDF: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Execute main function
main();
