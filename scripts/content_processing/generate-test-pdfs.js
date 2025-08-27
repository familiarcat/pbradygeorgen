/**
 * Generate Test PDFs Script
 * 
 * This script generates placeholder PDFs for our test suite.
 * In a real implementation, these would be carefully designed PDFs,
 * but for now we'll create simple placeholders.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the test PDF categories and files
const TEST_PDFS = {
  color: [
    { id: 'monochromatic', name: 'Monochromatic Design' },
    { id: 'high-contrast', name: 'High Contrast Design' },
    { id: 'gradient', name: 'Gradient-Heavy Design' },
  ],
  typography: [
    { id: 'serif', name: 'Serif-Based Design' },
    { id: 'sans-serif', name: 'Sans-Serif Minimalist' },
    { id: 'mixed-typography', name: 'Mixed Typography' },
  ],
  layout: [
    { id: 'single-column', name: 'Single-Column Traditional' },
    { id: 'multi-column', name: 'Multi-Column Complex' },
    { id: 'infographic', name: 'Infographic Style' },
  ],
  special: [
    { id: 'image-heavy', name: 'Image-Heavy Design' },
    { id: 'table-based', name: 'Table-Based Content' },
    { id: 'special-chars', name: 'Special Characters' },
  ],
};

// Create a simple HTML template for a placeholder PDF
function createHtmlTemplate(title, category, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      ${category === 'color' && id === 'monochromatic' ? 'color: #2c3e50; background-color: #ecf0f1;' : ''}
      ${category === 'color' && id === 'high-contrast' ? 'color: #f1c40f; background-color: #2c3e50;' : ''}
      ${category === 'color' && id === 'gradient' ? 'background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);' : ''}
      ${category === 'typography' && id === 'serif' ? 'font-family: Georgia, serif;' : ''}
      ${category === 'typography' && id === 'sans-serif' ? 'font-family: Helvetica, Arial, sans-serif;' : ''}
      ${category === 'typography' && id === 'mixed-typography' ? '' : ''}
      ${category === 'layout' && id === 'single-column' ? 'max-width: 800px; margin: 0 auto;' : ''}
      ${category === 'layout' && id === 'multi-column' ? 'column-count: 2; column-gap: 40px;' : ''}
      ${category === 'layout' && id === 'infographic' ? '' : ''}
      ${category === 'special' && id === 'image-heavy' ? '' : ''}
      ${category === 'special' && id === 'table-based' ? '' : ''}
      ${category === 'special' && id === 'special-chars' ? '' : ''}
    }
    h1 {
      color: ${category === 'color' && id === 'high-contrast' ? '#f1c40f' : '#333'};
      ${category === 'typography' && id === 'serif' ? 'font-family: "Times New Roman", Times, serif;' : ''}
      ${category === 'typography' && id === 'sans-serif' ? 'font-family: Helvetica, Arial, sans-serif; font-weight: 300;' : ''}
      ${category === 'typography' && id === 'mixed-typography' ? 'font-family: "Playfair Display", serif;' : ''}
    }
    h2 {
      ${category === 'typography' && id === 'serif' ? 'font-family: Georgia, serif;' : ''}
      ${category === 'typography' && id === 'sans-serif' ? 'font-family: "Roboto", sans-serif; font-weight: 500;' : ''}
      ${category === 'typography' && id === 'mixed-typography' ? 'font-family: "Montserrat", sans-serif;' : ''}
    }
    p {
      ${category === 'typography' && id === 'serif' ? 'font-family: "Libre Baskerville", serif;' : ''}
      ${category === 'typography' && id === 'sans-serif' ? 'font-family: "Open Sans", sans-serif;' : ''}
      ${category === 'typography' && id === 'mixed-typography' ? 'font-family: "Lato", sans-serif;' : ''}
    }
    .container {
      ${category === 'layout' && id === 'multi-column' ? 'display: flex;' : ''}
    }
    .sidebar {
      ${category === 'layout' && id === 'multi-column' ? 'width: 30%; padding-right: 20px;' : ''}
    }
    .main-content {
      ${category === 'layout' && id === 'multi-column' ? 'width: 70%;' : ''}
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>This is a placeholder PDF for testing the ${title.toLowerCase()} interpretation.</p>
  
  ${category === 'layout' && id === 'multi-column' ? `
  <div class="container">
    <div class="sidebar">
      <h2>Sidebar</h2>
      <p>This is sidebar content for testing multi-column layouts.</p>
      <ul>
        <li>Sidebar item 1</li>
        <li>Sidebar item 2</li>
        <li>Sidebar item 3</li>
      </ul>
    </div>
    <div class="main-content">
      <h2>Main Content</h2>
      <p>This is the main content area for testing multi-column layouts.</p>
      <p>It contains multiple paragraphs to demonstrate how text flows in this layout.</p>
    </div>
  </div>
  ` : ''}
  
  ${category === 'special' && id === 'table-based' ? `
  <h2>Skills Table</h2>
  <table>
    <tr>
      <th>Skill</th>
      <th>Level</th>
      <th>Years</th>
    </tr>
    <tr>
      <td>JavaScript</td>
      <td>Expert</td>
      <td>5+</td>
    </tr>
    <tr>
      <td>React</td>
      <td>Advanced</td>
      <td>3+</td>
    </tr>
    <tr>
      <td>Node.js</td>
      <td>Intermediate</td>
      <td>2+</td>
    </tr>
  </table>
  ` : ''}
  
  ${category === 'special' && id === 'special-chars' ? `
  <h2>Special Characters</h2>
  <p>Latin: á é í ó ú ñ ç</p>
  <p>Cyrillic: Привет мир</p>
  <p>Greek: Γειά σου Κόσμε</p>
  <p>Symbols: © ® ™ € £ ¥ § ¶ • ★ ☆ ♠ ♣ ♥ ♦</p>
  ` : ''}
  
  <h2>Test Category: ${category}</h2>
  <p>Test ID: ${id}</p>
  
  <div>
    <h2>Experience</h2>
    <h3>Senior Developer - Example Company</h3>
    <p>January 2020 - Present</p>
    <ul>
      <li>Developed and maintained web applications</li>
      <li>Led a team of 5 developers</li>
      <li>Implemented CI/CD pipelines</li>
    </ul>
    
    <h3>Developer - Another Company</h3>
    <p>June 2017 - December 2019</p>
    <ul>
      <li>Built responsive web interfaces</li>
      <li>Worked with RESTful APIs</li>
      <li>Participated in code reviews</li>
    </ul>
  </div>
  
  <div>
    <h2>Education</h2>
    <h3>Bachelor of Science in Computer Science</h3>
    <p>Example University, 2013 - 2017</p>
  </div>
  
  <div>
    <h2>Skills</h2>
    <ul>
      <li>JavaScript / TypeScript</li>
      <li>React / Next.js</li>
      <li>Node.js</li>
      <li>HTML / CSS</li>
      <li>Git</li>
    </ul>
  </div>
  
  <div>
    <h2>Contact</h2>
    <p>Email: example@example.com</p>
    <p>Phone: (123) 456-7890</p>
    <p>Website: www.example.com</p>
  </div>
</body>
</html>
  `;
}

// Main function
async function main() {
  try {
    console.log('Generating test PDFs...');
    
    // Check if wkhtmltopdf is installed
    try {
      execSync('which wkhtmltopdf');
    } catch (error) {
      console.error('Error: wkhtmltopdf is not installed. Please install it to generate PDFs.');
      console.error('On macOS: brew install wkhtmltopdf');
      console.error('On Ubuntu: apt-get install wkhtmltopdf');
      process.exit(1);
    }
    
    // Create temp directory for HTML files
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Process each category and file
    for (const [category, pdfs] of Object.entries(TEST_PDFS)) {
      // Create category directory if it doesn't exist
      const categoryDir = path.join(__dirname, `../public/test-pdfs/${category}`);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Generate each PDF in the category
      for (const pdf of pdfs) {
        console.log(`Generating ${category}/${pdf.id}.pdf...`);
        
        // Create HTML file
        const htmlPath = path.join(tempDir, `${pdf.id}.html`);
        const pdfPath = path.join(categoryDir, `${pdf.id}.pdf`);
        
        // Generate HTML content
        const htmlContent = createHtmlTemplate(pdf.name, category, pdf.id);
        fs.writeFileSync(htmlPath, htmlContent);
        
        // Convert HTML to PDF
        try {
          execSync(`wkhtmltopdf "${htmlPath}" "${pdfPath}"`);
          console.log(`Created ${pdfPath}`);
        } catch (error) {
          console.error(`Error generating PDF for ${pdf.id}:`, error.message);
        }
      }
    }
    
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log('Test PDFs generated successfully!');
    
  } catch (error) {
    console.error('Error generating test PDFs:', error);
    process.exit(1);
  }
}

// Run the main function
main();
