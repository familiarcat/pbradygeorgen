const fs = require('fs');
const path = require('path');

// We'll use dynamic import for pdfjs-dist since it's an ES module

async function extractTextFromPDF(pdfPath) {
  try {
    console.log(`Extracting text from: ${pdfPath}`);

    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');

    // Configure the worker
    const workerPath = path.join(__dirname, '../public/pdf-worker/pdf.worker.min.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `file://${workerPath}`;

    // Read the PDF file
    const data = new Uint8Array(fs.readFileSync(pdfPath));

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    console.log(`PDF loaded with ${pdf.numPages} pages`);

    // Extract text from each page
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Concatenate the text items
      const pageText = textContent.items
        .map(item => item.str || '')
        .join(' ');

      fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

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

    // Extract text from the PDF
    const text = await extractTextFromPDF(pdfPath);

    // Save the text to a file
    fs.writeFileSync(outputPath, text);

    console.log(`Text extracted successfully and saved to: ${outputPath}`);
    console.log('\nExtracted content preview:');
    console.log(text.substring(0, 500) + '...');
  } catch (error) {
    console.error('Failed to extract text:', error);
    process.exit(1);
  }
}

// Run the main function
main();
