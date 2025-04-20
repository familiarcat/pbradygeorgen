const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the directory if it doesn't exist
const publicDir = path.join(__dirname, '../public/pdf-worker');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Get the version from the installed pdf.js package
const pdfjs = require('pdfjs-dist/package.json');
const version = pdfjs.version;
console.log(`Downloading PDF.js worker for version ${version}`);

// Download the worker file from a CDN that supports CORS
// Try unpkg as the primary source
const workerUrl = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
const outputPath = path.join(publicDir, 'pdf.worker.min.js');

console.log(`Downloading from: ${workerUrl}`);
console.log(`Saving to: ${outputPath}`);

https.get(workerUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download worker file: ${response.statusCode} ${response.statusMessage}`);
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Download completed successfully');
  });
}).on('error', (err) => {
  console.error(`Error downloading worker file: ${err.message}`);
  process.exit(1);
});
