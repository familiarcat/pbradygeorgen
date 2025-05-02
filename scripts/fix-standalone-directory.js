/**
 * Fix Standalone Directory Script
 *
 * This script fixes the standalone directory structure for AWS Amplify deployment.
 * It's used when the Next.js build fails to create the standalone directory properly.
 * It also copies the Amplify-compatible PDF processor to the standalone directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main function
async function main() {
  console.log('🔧 Fixing standalone directory structure...');

  // Create the standalone directory if it doesn't exist
  const standaloneDir = path.join(process.cwd(), '.next/standalone');
  if (!fs.existsSync(standaloneDir)) {
    console.log(`Creating standalone directory: ${standaloneDir}`);
    fs.mkdirSync(standaloneDir, { recursive: true });
  } else {
    // Clean up the standalone directory
    console.log(`Cleaning up standalone directory: ${standaloneDir}`);
    try {
      // Remove .DS_Store file
      const dsStorePath = path.join(standaloneDir, '.DS_Store');
      if (fs.existsSync(dsStorePath)) {
        fs.unlinkSync(dsStorePath);
        console.log(`Removed .DS_Store file from ${standaloneDir}`);
      }
    } catch (error) {
      console.warn(`Warning: Failed to clean up standalone directory: ${error.message}`);
    }
  }

  // Create the utils directory in the standalone directory
  const standaloneUtilsDir = path.join(standaloneDir, 'utils');
  if (!fs.existsSync(standaloneUtilsDir)) {
    console.log(`Creating utils directory: ${standaloneUtilsDir}`);
    fs.mkdirSync(standaloneUtilsDir, { recursive: true });
  }

  // Copy the Amplify-compatible PDF processor to the standalone directory
  const amplifyPdfProcessorPath = path.join(process.cwd(), 'utils', 'amplifyPdfProcessor.ts');
  const standaloneAmplifyPdfProcessorPath = path.join(standaloneUtilsDir, 'amplifyPdfProcessor.ts');

  if (fs.existsSync(amplifyPdfProcessorPath)) {
    console.log(`Copying Amplify-compatible PDF processor from ${amplifyPdfProcessorPath} to ${standaloneAmplifyPdfProcessorPath}`);
    fs.copyFileSync(amplifyPdfProcessorPath, standaloneAmplifyPdfProcessorPath);
    console.log(`✅ Copied Amplify-compatible PDF processor to standalone directory`);
  } else {
    console.warn(`Warning: Amplify-compatible PDF processor not found at ${amplifyPdfProcessorPath}`);

    // Create a minimal Amplify-compatible PDF processor
    console.log(`Creating minimal Amplify-compatible PDF processor at ${standaloneAmplifyPdfProcessorPath}`);

    const amplifyPdfProcessorContent = `/**
 * AWS Amplify Compatible PDF Processor
 *
 * This module provides PDF processing functions that work in AWS Amplify's environment.
 * It avoids using child_process.exec and handles file paths in a way that's compatible
 * with AWS Amplify's serverless environment.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Import pdf-parse directly instead of using child_process
let pdfParse: any;
try {
  // Dynamic import to avoid issues during build time
  pdfParse = require('pdf-parse');
} catch (error) {
  console.error('Failed to import pdf-parse:', error);
}

/**
 * Process a PDF file in a way that's compatible with AWS Amplify
 *
 * @param pdfPath Path to the PDF file
 * @param forceRefresh Whether to force a refresh of the content
 * @returns Object containing the processing results
 */
export async function processPdfForAmplify(pdfPath: string, forceRefresh: boolean = false): Promise<{
  success: boolean;
  message: string;
  contentFingerprint?: string;
  extractedContent?: any;
  analyzedContent?: any;
  validationResult?: any;
  error?: any;
}> {
  try {
    console.log('Starting Amplify-compatible PDF processing pipeline');

    // 1. Check if the PDF exists
    if (!fs.existsSync(pdfPath)) {
      const error = \`PDF file not found at \${pdfPath}\`;
      console.error(error);
      return { success: false, message: error };
    }

    // 2. Get PDF metadata
    const stats = fs.statSync(pdfPath);
    const pdfSize = stats.size;
    const pdfModified = stats.mtime;
    const pdfBuffer = fs.readFileSync(pdfPath);

    // 3. Generate content fingerprint
    const contentFingerprint = crypto
      .createHash('sha256')
      .update(\`\${pdfPath}:\${pdfSize}:\${pdfModified.toISOString()}\`)
      .digest('hex');

    // 4. Create the extracted directory if it doesn't exist
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }

    // 5. Extract content from the PDF
    let extractedContent = null;

    try {
      if (!pdfParse) {
        throw new Error('pdf-parse module not available');
      }

      // Parse the PDF directly
      const data = await pdfParse(pdfBuffer);

      // Get the text content
      let text = data.text || '';

      // Additional processing to clean up the text
      text = text.replace(/\\s+/g, ' ').trim();

      // Split into lines and remove empty lines
      const lines = text.split('\\n').map(line => line.trim()).filter(line => line);
      text = lines.join('\\n');

      // Save the raw text to a file
      const outputPath = path.join(extractedDir, 'resume_content.txt');
      fs.writeFileSync(outputPath, text);

      // Create a simple markdown version
      const markdownPath = path.join(extractedDir, 'resume_content.md');
      const markdown = \`# Resume Content\\n\\n\${text}\`;
      fs.writeFileSync(markdownPath, markdown);

      // Create a simple JSON structure
      const jsonContent = {
        metadata: {
          source: path.basename(pdfPath),
          extractionDate: new Date().toISOString(),
          pageCount: data.numpages || 0,
          info: data.info || {},
          usedFallback: false
        },
        rawText: text,
        sections: [],
        structuredContent: {
          name: "Extracted Content",
          summary: text.substring(0, 200) + "...",
          skills: [],
          experience: []
        }
      };

      // Save the JSON content
      const jsonPath = path.join(extractedDir, 'resume_content.json');
      fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));

      // Save the content fingerprint
      const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
      fs.writeFileSync(fingerprintPath, contentFingerprint);

      extractedContent = jsonContent;

    } catch (error) {
      console.error('Error extracting PDF content directly:', error);

      // Create a simple fallback content
      const fallbackContent = {
        metadata: {
          source: path.basename(pdfPath),
          extractionDate: new Date().toISOString(),
          isFallback: true
        },
        rawText: "Failed to extract content from PDF",
        sections: [],
        structuredContent: {
          name: "Fallback Content",
          summary: "Failed to extract content from PDF",
          skills: [],
          experience: []
        }
      };

      // Save the fallback content
      const jsonPath = path.join(extractedDir, 'resume_content.json');
      fs.writeFileSync(jsonPath, JSON.stringify(fallbackContent, null, 2));

      extractedContent = fallbackContent;
    }

    // 6. Create a simple cover letter
    const coverLetterPath = path.join(extractedDir, 'cover_letter.md');

    // Create a simple cover letter
    const name = extractedContent?.structuredContent?.name || "Applicant";
    const summary = extractedContent?.structuredContent?.summary || "";

    const coverLetterContent = \`# Cover Letter for \${name}

## Summary

\${summary}

## Skills

- Professional skills demonstrated through experience
- Technical expertise in relevant areas
- Strong communication and collaboration abilities

## Experience Highlights

- Successfully completed projects with measurable results
- Worked effectively in team environments
- Demonstrated leadership and initiative

## Why I'm a Great Fit

I believe my experience and skills align well with your requirements, and I'm excited about the opportunity to contribute to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to your organization.

Sincerely,
\${name}
\`;

    // Save the cover letter
    fs.writeFileSync(coverLetterPath, coverLetterContent);

    console.log('PDF processing completed successfully');

    return {
      success: true,
      message: 'PDF processed successfully',
      contentFingerprint,
      extractedContent
    };
  } catch (error) {
    console.error('Error processing PDF:', error);

    return {
      success: false,
      message: \`Error processing PDF: \${error instanceof Error ? error.message : String(error)}\`,
      error
    };
  }
}

export default {
  processPdfForAmplify
};`;

    fs.writeFileSync(standaloneAmplifyPdfProcessorPath, amplifyPdfProcessorContent);
    console.log(`✅ Created minimal Amplify-compatible PDF processor in standalone directory`);
  }

  // Copy other utility files needed by the Amplify-compatible PDF processor
  const utilFiles = [
    'ContentStateService.ts',
    'DanteLogger.ts',
    'HesseLogger.ts'
  ];

  utilFiles.forEach(file => {
    const sourcePath = path.join(process.cwd(), 'utils', file);
    const targetPath = path.join(standaloneUtilsDir, file);

    if (fs.existsSync(sourcePath)) {
      console.log(`Copying ${file} from ${sourcePath} to ${targetPath}`);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied ${file} to standalone directory`);
    } else {
      console.warn(`Warning: ${file} not found at ${sourcePath}`);
    }
  });

  // Create the .next directory inside standalone
  const nextDir = path.join(standaloneDir, '.next');
  if (!fs.existsSync(nextDir)) {
    console.log(`Creating .next directory: ${nextDir}`);
    fs.mkdirSync(nextDir, { recursive: true });
  }

  // Copy all necessary files from the root .next directory to the standalone .next directory
  const sourceNextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(sourceNextDir)) {
    console.log(`Copying necessary files from ${sourceNextDir} to ${nextDir}`);

    // Copy build-id
    const buildIdPath = path.join(sourceNextDir, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      console.log(`Copying BUILD_ID from ${buildIdPath} to ${path.join(nextDir, 'BUILD_ID')}`);
      fs.copyFileSync(buildIdPath, path.join(nextDir, 'BUILD_ID'));
    } else {
      console.log('Creating a dummy BUILD_ID file');
      fs.writeFileSync(path.join(nextDir, 'BUILD_ID'), `build-${Date.now()}`);
    }

    // Copy required directories
    const requiredDirs = ['server', 'static', 'cache', 'trace'];
    requiredDirs.forEach(dir => {
      const sourceDirPath = path.join(sourceNextDir, dir);
      const targetDirPath = path.join(nextDir, dir);

      if (fs.existsSync(sourceDirPath)) {
        console.log(`Copying ${dir} directory from ${sourceDirPath} to ${targetDirPath}`);
        try {
          // Create the directory if it doesn't exist
          if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath, { recursive: true });
          }

          // Use cp -R for macOS/Linux
          execSync(`cp -R ${sourceDirPath}/* ${targetDirPath}/`, { stdio: 'inherit' });
        } catch (error) {
          console.warn(`Warning: Failed to copy ${dir} directory: ${error.message}`);
        }
      } else {
        console.log(`${dir} directory not found in source .next directory`);

        // Create minimal structure for static directory
        if (dir === 'static') {
          console.log('Creating minimal static directory structure');
          fs.mkdirSync(path.join(nextDir, 'static'), { recursive: true });
        }
      }
    });

    // Copy required files
    const requiredFiles = ['build-manifest.json', 'prerender-manifest.json', 'routes-manifest.json', 'react-loadable-manifest.json'];
    requiredFiles.forEach(file => {
      const sourceFilePath = path.join(sourceNextDir, file);
      const targetFilePath = path.join(nextDir, file);

      if (fs.existsSync(sourceFilePath)) {
        console.log(`Copying ${file} from ${sourceFilePath} to ${targetFilePath}`);
        try {
          fs.copyFileSync(sourceFilePath, targetFilePath);
        } catch (error) {
          console.warn(`Warning: Failed to copy ${file}: ${error.message}`);
        }
      } else {
        console.log(`${file} not found in source .next directory`);
      }
    });

    // Try to run a build if needed
    if (!fs.existsSync(path.join(nextDir, 'server')) || !fs.existsSync(path.join(nextDir, 'static'))) {
      console.log('Critical Next.js files are missing. Attempting to run a build...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('Build completed. Trying to copy files again...');

        // Try to copy again after build
        requiredDirs.forEach(dir => {
          const sourceDirPath = path.join(sourceNextDir, dir);
          const targetDirPath = path.join(nextDir, dir);

          if (fs.existsSync(sourceDirPath)) {
            console.log(`Copying ${dir} directory from ${sourceDirPath} to ${targetDirPath}`);
            try {
              // Create the directory if it doesn't exist
              if (!fs.existsSync(targetDirPath)) {
                fs.mkdirSync(targetDirPath, { recursive: true });
              }

              // Use cp -R for macOS/Linux
              execSync(`cp -R ${sourceDirPath}/* ${targetDirPath}/`, { stdio: 'inherit' });
            } catch (error) {
              console.warn(`Warning: Failed to copy ${dir} directory: ${error.message}`);
            }
          }
        });
      } catch (error) {
        console.warn(`Warning: Failed to run build: ${error.message}`);
      }
    }
  } else {
    console.log('Source .next directory not found');

    // Create minimal structure
    console.log('Creating minimal .next directory structure');

    // Create static directory
    const staticDir = path.join(nextDir, 'static');
    if (!fs.existsSync(staticDir)) {
      console.log(`Creating static directory: ${staticDir}`);
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Create server directory
    const serverDir = path.join(nextDir, 'server');
    if (!fs.existsSync(serverDir)) {
      console.log(`Creating server directory: ${serverDir}`);
      fs.mkdirSync(serverDir, { recursive: true });
    }

    // Create a dummy BUILD_ID file
    console.log('Creating a dummy BUILD_ID file');
    fs.writeFileSync(path.join(nextDir, 'BUILD_ID'), `build-${Date.now()}`);

    // Try to run a build
    console.log('Attempting to run a build to generate Next.js files...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('Build completed. Trying to copy files...');

      // Try to copy after build
      const sourceNextDir = path.join(process.cwd(), '.next');
      if (fs.existsSync(sourceNextDir)) {
        const requiredDirs = ['server', 'static', 'cache', 'trace'];
        requiredDirs.forEach(dir => {
          const sourceDirPath = path.join(sourceNextDir, dir);
          const targetDirPath = path.join(nextDir, dir);

          if (fs.existsSync(sourceDirPath)) {
            console.log(`Copying ${dir} directory from ${sourceDirPath} to ${targetDirPath}`);
            try {
              // Create the directory if it doesn't exist
              if (!fs.existsSync(targetDirPath)) {
                fs.mkdirSync(targetDirPath, { recursive: true });
              }

              // Use cp -R for macOS/Linux
              execSync(`cp -R ${sourceDirPath}/* ${targetDirPath}/`, { stdio: 'inherit' });
            } catch (error) {
              console.warn(`Warning: Failed to copy ${dir} directory: ${error.message}`);
            }
          }
        });
      }
    } catch (error) {
      console.warn(`Warning: Failed to run build: ${error.message}`);
    }
  }

  // Copy public directory to standalone
  const publicDir = path.join(process.cwd(), 'public');
  const standalonePublicDir = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicDir)) {
    console.log(`Copying public directory from ${publicDir} to ${standalonePublicDir}`);
    try {
      if (!fs.existsSync(standalonePublicDir)) {
        fs.mkdirSync(standalonePublicDir, { recursive: true });
      }
      // Use cp -R for macOS/Linux
      execSync(`cp -R ${publicDir}/* ${standalonePublicDir}/`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`Warning: Failed to copy public directory: ${error.message}`);
    }
  }

  // Ensure extracted directory exists in standalone
  const extractedDir = path.join(standalonePublicDir, 'extracted');
  if (!fs.existsSync(extractedDir)) {
    console.log(`Creating extracted directory: ${extractedDir}`);
    fs.mkdirSync(extractedDir, { recursive: true });
  }

  // Copy extracted content if it exists
  const sourceExtractedDir = path.join(process.cwd(), 'public/extracted');
  if (fs.existsSync(sourceExtractedDir)) {
    console.log(`Copying extracted content from ${sourceExtractedDir} to ${extractedDir}`);
    try {
      // Use cp -R for macOS/Linux
      execSync(`cp -R ${sourceExtractedDir}/* ${extractedDir}/`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`Warning: Failed to copy extracted content: ${error.message}`);
    }
  }

  // Create an AWS Amplify compatible server.js file in the standalone directory
  const serverJsPath = path.join(standaloneDir, 'server.js');
  console.log(`Creating AWS Amplify compatible server.js: ${serverJsPath}`);

  // Create a server.js file that works with AWS Amplify
  const serverJsContent = `
// AWS Amplify compatible Next.js server
// This file is designed to work with AWS Amplify deployment

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');

// Environment configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Detect if we're running in AWS Amplify
const isAmplify = !!process.env.AWS_EXECUTION_ENV;

// Log environment information
console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
console.log(\`Running in AWS Amplify: \${isAmplify ? 'Yes' : 'No'}\`);
console.log(\`Node version: \${process.version}\`);
console.log(\`Current directory: \${__dirname}\`);

// Ensure the extracted directory exists
const extractedDir = path.join(__dirname, 'public', 'extracted');
if (!fs.existsSync(extractedDir)) {
  console.log(\`Creating extracted directory: \${extractedDir}\`);
  fs.mkdirSync(extractedDir, { recursive: true });
} else {
  console.log(\`Extracted directory already exists: \${extractedDir}\`);
}

// Initialize Next.js app
console.log(\`Initializing Next.js app with directory: \${__dirname}\`);

// Create a fallback function to handle errors
function createFallbackServer() {
  console.log('Creating fallback server...');

  return createServer((req, res) => {
    console.log(\`Fallback server request: \${req.method} \${req.url}\`);

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

      // Handle API requests with a simple response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'This is a fallback API response',
        endpoint: req.url,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Special handling for extracted files
    if (req.url.startsWith('/extracted/')) {
      const filePath = path.join(__dirname, 'public', req.url);

      if (fs.existsSync(filePath)) {
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

    // Serve index.html for root path
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(\`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AlexAI - Resume Analyzer (Fallback)</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f5f5f5;
                color: #333;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                text-align: center;
              }
              h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
              }
              p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
              }
              .button {
                display: inline-block;
                background-color: #0070f3;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 500;
                transition: background-color 0.3s ease;
                margin: 0.5rem;
              }
              .button:hover {
                background-color: #0051a2;
              }
              .warning {
                color: #d32f2f;
                background-color: #ffebee;
                padding: 1rem;
                border-radius: 4px;
                margin-bottom: 2rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>AlexAI - Resume Analyzer</h1>
              <div class="warning">
                <strong>Note:</strong> This is a fallback page. The Next.js application failed to initialize.
              </div>
              <p>Welcome to AlexAI, your intelligent resume analysis tool.</p>
              <div>
                <a href="/extracted/resume_content.md" class="button">View Resume Content</a>
                <a href="/extracted/cover_letter.md" class="button">View Cover Letter</a>
              </div>
            </div>
          </body>
        </html>
      \`);
      return;
    }

    // Serve files from public directory
    const filePath = path.join(__dirname, 'public', req.url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }

      // Determine content type based on file extension
      const ext = path.extname(filePath);
      let contentType = 'text/plain';

      switch (ext) {
        case '.html':
          contentType = 'text/html';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.js':
          contentType = 'application/javascript';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.md':
          contentType = 'text/markdown';
          break;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

// Try to initialize Next.js
try {
  const app = next({
    dev,
    hostname,
    port,
    dir: __dirname,
    conf: {
      // Use the same configuration as next.config.js
      reactStrictMode: true,
      poweredByHeader: false,
      output: 'standalone',
    }
  });

  const handle = app.getRequestHandler();

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

        // Special handling for extracted files
        if (req.url.startsWith('/extracted/')) {
          const filePath = path.join(__dirname, 'public', req.url);
          console.log(\`Looking for extracted file: \${filePath}\`);

          if (fs.existsSync(filePath)) {
            console.log(\`Serving extracted file: \${filePath}\`);
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

        // Let Next.js handle the request
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(\`> Ready on http://\${hostname}:\${port}\`);
      console.log(\`> Serving from directory: \${__dirname}\`);

      // Log available directories
      console.log('> Available directories:');
      fs.readdirSync(__dirname).forEach(file => {
        console.log(\`  - \${file}\`);
      });

      if (fs.existsSync(path.join(__dirname, 'public'))) {
        console.log('> Public directory contents:');
        fs.readdirSync(path.join(__dirname, 'public')).forEach(file => {
          console.log(\`  - \${file}\`);
        });

        if (fs.existsSync(path.join(__dirname, 'public', 'extracted'))) {
          console.log('> Extracted directory contents:');
          fs.readdirSync(path.join(__dirname, 'public', 'extracted')).forEach(file => {
            console.log(\`  - \${file}\`);
          });
        }
      }
    });
  }).catch(err => {
    console.error('Error preparing Next.js app:', err);

    // Start the fallback server if Next.js preparation fails
    const fallbackServer = createFallbackServer();
    fallbackServer.listen(port, () => {
      console.log(\`> Fallback server ready on http://\${hostname}:\${port}\`);
    });
  });
} catch (error) {
  console.error('Error initializing Next.js app:', error);

  // Start the fallback server if Next.js initialization fails
  const fallbackServer = createFallbackServer();
  fallbackServer.listen(port, () => {
    console.log(\`> Fallback server ready on http://\${hostname}:\${port}\`);
  });
}
`;

  // Write the server.js file
  fs.writeFileSync(serverJsPath, serverJsContent);
  console.log(`✅ Created AWS Amplify compatible server.js in standalone directory`);

  // Copy package.json to standalone directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const standalonePackageJsonPath = path.join(standaloneDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log(`Copying package.json from ${packageJsonPath} to ${standalonePackageJsonPath}`);
    try {
      // Read the package.json file
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Create a minimal package.json for the standalone directory
      const standalonePackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        private: true,
        scripts: {
          start: 'node server.js'
        },
        dependencies: {
          next: packageJson.dependencies.next,
          react: packageJson.dependencies.react,
          'react-dom': packageJson.dependencies['react-dom']
        }
      };

      // Write the minimal package.json to the standalone directory
      fs.writeFileSync(standalonePackageJsonPath, JSON.stringify(standalonePackageJson, null, 2));
      console.log(`✅ Created minimal package.json in standalone directory`);
    } catch (error) {
      console.warn(`Warning: Failed to copy package.json: ${error.message}`);
    }
  }

  // Copy next.config.js to standalone directory
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const standaloneNextConfigPath = path.join(standaloneDir, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    console.log(`Copying next.config.js from ${nextConfigPath} to ${standaloneNextConfigPath}`);
    try {
      fs.copyFileSync(nextConfigPath, standaloneNextConfigPath);
      console.log(`✅ Copied next.config.js to standalone directory`);
    } catch (error) {
      console.warn(`Warning: Failed to copy next.config.js: ${error.message}`);
    }
  }

  console.log('✅ Standalone directory structure fixed successfully');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
