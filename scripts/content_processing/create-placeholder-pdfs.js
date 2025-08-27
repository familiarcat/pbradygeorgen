/**
 * Create Placeholder PDFs Script
 * 
 * This script creates placeholder PDFs for each test category.
 * It uses a simple approach of copying the sample PDF to each test location.
 * In a real implementation, these would be carefully designed PDFs.
 */

const fs = require('fs');
const path = require('path');

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

// Main function
async function main() {
  try {
    console.log('Creating placeholder PDFs...');
    
    // Get the sample PDF path
    const samplePdfPath = path.join(__dirname, '../public/pbradygeorgen_resume.pdf');
    
    // Check if the sample PDF exists
    if (!fs.existsSync(samplePdfPath)) {
      console.error(`Sample PDF not found: ${samplePdfPath}`);
      process.exit(1);
    }
    
    // Process each category and file
    for (const [category, pdfs] of Object.entries(TEST_PDFS)) {
      // Create category directory if it doesn't exist
      const categoryDir = path.join(__dirname, `../public/test-pdfs/${category}`);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Create a placeholder file for each PDF in the category
      for (const pdf of pdfs) {
        console.log(`Creating ${category}/${pdf.id}.pdf...`);
        
        const pdfPath = path.join(categoryDir, `${pdf.id}.pdf`);
        
        // Copy the sample PDF to the test PDF location
        fs.copyFileSync(samplePdfPath, pdfPath);
        
        // Create a description file
        const descPath = path.join(categoryDir, `${pdf.id}.txt`);
        const description = `Test PDF: ${pdf.name}
Category: ${category}
ID: ${pdf.id}

This is a placeholder PDF for testing purposes.
In a real implementation, this would be a carefully designed PDF that tests ${pdf.name.toLowerCase()}.

For now, we're using a copy of the sample resume PDF.
`;
        
        fs.writeFileSync(descPath, description);
        
        console.log(`Created ${pdfPath}`);
      }
    }
    
    console.log('Placeholder PDFs created successfully!');
    
  } catch (error) {
    console.error('Error creating placeholder PDFs:', error);
    process.exit(1);
  }
}

// Run the main function
main();
