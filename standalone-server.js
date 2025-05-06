/**
 * Simplified standalone server for AlexAI
 * This server is used when a full Next.js build is not available
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const port = process.env.PORT || 3000;
const hostname = process.env.HOST || 'localhost';

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
  '.txt': 'text/plain'
};

// Create the server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  // Handle CORS for API routes
  if (req.url.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS requests for CORS preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Simple API response for all API routes
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      message: 'This is a simplified API response from the standalone server',
      endpoint: req.url,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Normalize the URL
  let url = req.url;

  // Default to enhanced PDF viewer for the root path
  if (url === '/') {
    // Check if enhanced-pdf-viewer.html exists
    const enhancedViewerPath = path.join(__dirname, 'public', 'enhanced-pdf-viewer.html');
    if (fs.existsSync(enhancedViewerPath)) {
      // Redirect to the enhanced PDF viewer page
      res.writeHead(302, { 'Location': '/enhanced-pdf-viewer.html' });
      res.end();
      return;
    } else {
      // Fall back to the basic PDF viewer page
      res.writeHead(302, { 'Location': '/pdf-viewer.html' });
      res.end();
      return;
    }
  }

  // Remove query parameters
  url = url.split('?')[0];

  // Determine the file path
  let filePath;

  if (url.startsWith('/public/')) {
    // Remove the /public prefix
    filePath = path.join(__dirname, url.substring(7));
  } else if (url.startsWith('/_next/')) {
    // Serve static assets from the .next/static directory
    filePath = path.join(__dirname, '.next', 'static', url.substring(7));
  } else {
    // Serve from the public directory
    filePath = path.join(__dirname, 'public', url);
  }

  // Get the file extension
  const extname = path.extname(filePath);

  // Set the content type based on the file extension
  const contentType = mimeTypes[extname] || 'text/plain';

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If the file doesn't exist, try to serve the index.html file
      if (err.code === 'ENOENT') {
        console.log(`File not found: ${filePath}`);

        // Try to serve index.html
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            // If index.html doesn't exist, return a 404
            res.writeHead(404);
            res.end('404 Not Found');
            return;
          }

          // Serve index.html
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
        return;
      }

      // For other errors, return a 500
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
      return;
    }

    // Serve the file
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Serving files from: ${__dirname}`);

  // Log available directories
  console.log('Available directories:');
  fs.readdirSync(__dirname).forEach(file => {
    if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
      console.log(`  - ${file}/`);
    } else {
      console.log(`  - ${file}`);
    }
  });

  // Log public directory contents if it exists
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory()) {
    console.log('Public directory contents:');
    fs.readdirSync(publicDir).forEach(file => {
      if (fs.statSync(path.join(publicDir, file)).isDirectory()) {
        console.log(`  - ${file}/`);
      } else {
        console.log(`  - ${file}`);
      }
    });
  }
});
