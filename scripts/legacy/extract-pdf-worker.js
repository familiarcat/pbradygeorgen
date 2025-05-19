const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  try {
    // Get the version from the installed pdf.js package
    const pdfjs = require('pdfjs-dist/package.json');
    const version = pdfjs.version;
    console.log(`PDF.js version: ${version}`);
    
    // Create the output directory
    const publicDir = path.join(__dirname, '../public/pdf-worker');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Path to the worker file in node_modules
    const workerSrcPath = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
    const workerDestPath = path.join(publicDir, 'pdf.worker.min.js');
    
    // Check if the source file exists
    if (!fs.existsSync(workerSrcPath)) {
      console.error(`Worker file not found at: ${workerSrcPath}`);
      
      // Try alternative paths
      const altPaths = [
        path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
        path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.js'),
        path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js'),
        path.join(__dirname, '../node_modules/pdfjs-dist/lib/pdf.worker.js')
      ];
      
      let found = false;
      for (const altPath of altPaths) {
        if (fs.existsSync(altPath)) {
          console.log(`Found worker file at alternative path: ${altPath}`);
          fs.copyFileSync(altPath, workerDestPath);
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Create a simple stub worker as a last resort
        console.log('Creating a stub worker file as fallback');
        const stubWorker = `
/* PDF.js worker stub */
self.onmessage = function(event) {
  console.log('PDF Worker received message:', event.data);
  
  // Just send back a dummy response
  self.postMessage({
    type: 'ready'
  });
};
`;
        fs.writeFileSync(workerDestPath, stubWorker);
      }
    } else {
      // Copy the worker file
      fs.copyFileSync(workerSrcPath, workerDestPath);
      console.log(`Worker file copied from: ${workerSrcPath}`);
    }
    
    console.log(`Worker file saved to: ${workerDestPath}`);
    
  } catch (error) {
    console.error('Error extracting worker file:', error);
    process.exit(1);
  }
}

// Run the main function
main();
