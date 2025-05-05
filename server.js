const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');

// Determine environment
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Detect if we're running in AWS Amplify
const isAmplify = !!process.env.AWS_EXECUTION_ENV;

// Check if we're in the standalone directory
const isStandalone = fs.existsSync(path.join(__dirname, '.next', 'standalone'));
const isInStandaloneDir = __dirname.includes('standalone');

// Log environment information
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Running in AWS Amplify: ${isAmplify ? 'Yes' : 'No'}`);
console.log(`Node version: ${process.version}`);
console.log(`Is standalone build: ${isStandalone ? 'Yes' : 'No'}`);
console.log(`Is in standalone directory: ${isInStandaloneDir ? 'Yes' : 'No'}`);
console.log(`Current directory: ${__dirname}`);

// Determine the correct directory to use
let appDir = __dirname;
let pagesDir = null;

// Check if we're in the standalone directory or need to use it
if (isStandalone && !isInStandaloneDir) {
  // If we're using a standalone build but not in the standalone directory,
  // we should use the standalone directory
  console.log('Using standalone directory for Next.js app');
  appDir = path.join(__dirname, '.next', 'standalone');

  // Check if the standalone directory exists
  if (fs.existsSync(appDir)) {
    console.log(`Standalone directory exists: ${appDir}`);

    // List the contents of the standalone directory
    console.log('Standalone directory contents:');
    fs.readdirSync(appDir).forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.error(`Standalone directory does not exist: ${appDir}`);
  }
}

// Check for pages or app directory
const possiblePagesDirs = [
  path.join(appDir, 'pages'),
  path.join(appDir, 'app'),
  path.join(__dirname, 'pages'),
  path.join(__dirname, 'app'),
  path.join(__dirname, '.next', 'server', 'pages'),
  path.join(__dirname, '.next', 'server', 'app')
];

for (const dir of possiblePagesDirs) {
  if (fs.existsSync(dir)) {
    pagesDir = dir;
    console.log(`Found pages/app directory: ${dir}`);
    break;
  }
}

// Create the Next.js app with appropriate configuration
let app;

// If we're in a production environment with a standalone build
if (!dev && isStandalone) {
  console.log('Starting in production mode with standalone build');

  // Try to use the standalone server directly
  try {
    console.log('Attempting to use standalone server.js');

    // Check if the standalone server.js exists
    const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js');
    if (fs.existsSync(standaloneServerPath)) {
      console.log(`Standalone server.js exists at ${standaloneServerPath}`);
      console.log('Executing standalone server.js directly');

      // Execute the standalone server.js directly
      require(standaloneServerPath);

      // Exit this process since we're now running the standalone server
      process.exit(0);
    } else {
      console.log(`Standalone server.js not found at ${standaloneServerPath}`);
    }
  } catch (error) {
    console.error('Error starting standalone server:', error);
  }
}

// If we couldn't use the standalone server directly, initialize Next.js normally
console.log(`Initializing Next.js app with directory: ${appDir}`);
app = next({
  dev,
  hostname,
  port,
  dir: appDir,
  conf: {
    // Use the same configuration as next.config.js
    reactStrictMode: true,
    poweredByHeader: false,
    // In Amplify, we need to use the standalone output
    output: 'standalone',
  }
});

const handle = app.getRequestHandler();

// Ensure the extracted directory exists
// We need to check both the current directory and the standalone directory
const extractedDirs = [
  path.join(__dirname, 'public', 'extracted'),
  path.join(appDir, 'public', 'extracted')
];

extractedDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating extracted directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Extracted directory already exists: ${dir}`);
  }
});

// Prepare and start the server
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add CORS headers for API routes
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
      }

      // Parse the URL
      const parsedUrl = parse(req.url, true);

      // Handle static files from the public directory
      // This is especially important for the standalone build
      if (req.url.startsWith('/public/') || req.url.startsWith('/_next/')) {
        console.log(`Serving static file: ${req.url}`);
      }

      // Special handling for extracted files
      if (req.url.startsWith('/public/extracted/') || req.url.startsWith('/extracted/')) {
        // Normalize the path to handle both /public/extracted/ and /extracted/ URLs
        const normalizedPath = req.url.startsWith('/public/')
          ? req.url
          : `/public${req.url}`;

        // Try multiple possible locations for the file
        const possiblePaths = [
          // Direct path in current directory
          path.join(__dirname, normalizedPath),
          // Path in standalone directory
          path.join(__dirname, '.next', 'standalone', normalizedPath),
          // Alternative path without 'public' prefix
          path.join(__dirname, req.url),
          // Alternative path in standalone directory without 'public' prefix
          path.join(__dirname, '.next', 'standalone', req.url)
        ];

        // Try each possible path
        for (const filePath of possiblePaths) {
          console.log(`Looking for extracted file: ${filePath}`);

          if (fs.existsSync(filePath)) {
            console.log(`Serving extracted file: ${filePath}`);
            const content = fs.readFileSync(filePath);

            // Set appropriate content type
            if (filePath.endsWith('.json')) {
              res.setHeader('Content-Type', 'application/json');
            } else if (filePath.endsWith('.md')) {
              res.setHeader('Content-Type', 'text/markdown');
            } else if (filePath.endsWith('.pdf')) {
              res.setHeader('Content-Type', 'application/pdf');
            } else {
              res.setHeader('Content-Type', 'text/plain');
            }

            res.statusCode = 200;
            res.end(content);
            return;
          }
        }

        console.log(`File not found in any location: ${req.url}`);
      }

      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Serving from directory: ${__dirname}`);

    // Log available routes for debugging
    console.log('> Available directories:');
    fs.readdirSync(__dirname).forEach(file => {
      console.log(`  - ${file}`);
    });

    if (fs.existsSync(path.join(__dirname, 'public'))) {
      console.log('> Public directory contents:');
      fs.readdirSync(path.join(__dirname, 'public')).forEach(file => {
        console.log(`  - ${file}`);
      });
    }
  });
});
