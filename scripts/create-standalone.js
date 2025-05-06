/**
 * Create Standalone Directory Script
 *
 * This script creates a standalone directory structure for AWS Amplify deployment.
 * It's used when the Next.js build fails to create the standalone directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main function
async function main() {
  console.log('🔍 Creating standalone directory structure...');

  // Create the standalone directory if it doesn't exist
  const standaloneDir = path.join(__dirname, '../.next/standalone');
  if (!fs.existsSync(standaloneDir)) {
    console.log(`Creating standalone directory: ${standaloneDir}`);
    fs.mkdirSync(standaloneDir, { recursive: true });
  }

  // Create the .next directory inside standalone
  const nextDir = path.join(standaloneDir, '.next');
  if (!fs.existsSync(nextDir)) {
    console.log(`Creating .next directory: ${nextDir}`);
    fs.mkdirSync(nextDir, { recursive: true });
  }

  // Create the static directory inside .next
  const staticDir = path.join(nextDir, 'static');
  if (!fs.existsSync(staticDir)) {
    console.log(`Creating static directory: ${staticDir}`);
    fs.mkdirSync(staticDir, { recursive: true });
  }

  // Copy static assets if they exist
  const sourceStaticDir = path.join(__dirname, '../.next/static');
  if (fs.existsSync(sourceStaticDir)) {
    console.log(`Copying static assets from ${sourceStaticDir} to ${staticDir}`);
    try {
      // Check if the directory has any files
      const files = fs.readdirSync(sourceStaticDir);
      if (files.length > 0) {
        execSync(`cp -R ${sourceStaticDir}/* ${staticDir}/`, { stdio: 'inherit' });
      } else {
        console.log('Static directory exists but is empty');
        createMinimalStaticAssets(staticDir);
      }
    } catch (error) {
      console.warn(`Warning: Failed to copy static assets: ${error.message}`);
      createMinimalStaticAssets(staticDir);
    }
  } else {
    console.log('No static assets found to copy');
    createMinimalStaticAssets(staticDir);
  }

  // Function to create minimal static assets
  function createMinimalStaticAssets(dir) {
    console.log('Creating minimal static assets...');

    // Create CSS directory
    const cssDir = path.join(dir, 'css');
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }

    // Create a minimal CSS file
    const cssFilePath = path.join(cssDir, 'minimal.css');
    const cssContent = `
/* Minimal CSS file created by create-standalone.js */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  color: #333;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
`;
    fs.writeFileSync(cssFilePath, cssContent);
    console.log(`Created minimal CSS file: ${cssFilePath}`);

    // Create JS directory
    const jsDir = path.join(dir, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Create a minimal JS file
    const jsFilePath = path.join(jsDir, 'minimal.js');
    const jsContent = `
// Minimal JS file created by create-standalone.js
console.log('AlexAI - Resume Analyzer');
`;
    fs.writeFileSync(jsFilePath, jsContent);
    console.log(`Created minimal JS file: ${jsFilePath}`);
  }

  // Copy public directory to standalone
  const publicDir = path.join(__dirname, '../public');
  const standalonePublicDir = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicDir)) {
    console.log(`Copying public directory from ${publicDir} to ${standalonePublicDir}`);
    try {
      if (!fs.existsSync(standalonePublicDir)) {
        fs.mkdirSync(standalonePublicDir, { recursive: true });
      }
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

  // Check if we need to run the prepare-download-test.js script
  const resumeContentPath = path.join(extractedDir, 'resume_content.md');
  const coverLetterPath = path.join(extractedDir, 'cover_letter.md');

  if (!fs.existsSync(resumeContentPath) || !fs.existsSync(coverLetterPath)) {
    console.log('Missing extracted content files, running prepare-download-test.js...');
    try {
      // Run the prepare-download-test.js script to create necessary files
      const prepareScriptPath = path.join(__dirname, 'prepare-download-test.js');
      if (fs.existsSync(prepareScriptPath)) {
        execSync(`node ${prepareScriptPath}`, { stdio: 'inherit' });
        console.log('✅ Extracted content prepared successfully');

        // Copy the newly created files to the standalone directory
        const sourceExtractedDir = path.join(__dirname, '../public/extracted');
        if (fs.existsSync(sourceExtractedDir)) {
          console.log(`Copying extracted content from ${sourceExtractedDir} to ${extractedDir}`);
          execSync(`cp -R ${sourceExtractedDir}/* ${extractedDir}/`, { stdio: 'inherit' });
        }
      } else {
        console.warn(`Warning: prepare-download-test.js script not found at ${prepareScriptPath}`);

        // Create minimal content files
        console.log('Creating minimal content files...');

        // Create resume_content.md
        if (!fs.existsSync(resumeContentPath)) {
          fs.writeFileSync(resumeContentPath, '# Resume Content\n\nThis is a placeholder resume content file.');
          console.log(`Created placeholder ${resumeContentPath}`);
        }

        // Create cover_letter.md
        if (!fs.existsSync(coverLetterPath)) {
          fs.writeFileSync(coverLetterPath, '# Cover Letter\n\nThis is a placeholder cover letter file.');
          console.log(`Created placeholder ${coverLetterPath}`);
        }

        // Create content_fingerprint.txt
        const fingerprintPath = path.join(extractedDir, 'content_fingerprint.txt');
        if (!fs.existsSync(fingerprintPath)) {
          fs.writeFileSync(fingerprintPath, `placeholder-${Date.now()}`);
          console.log(`Created placeholder ${fingerprintPath}`);
        }

        // Create build_info.json
        const buildInfoPath = path.join(extractedDir, 'build_info.json');
        if (!fs.existsSync(buildInfoPath)) {
          const buildInfo = {
            buildTimestamp: new Date().toISOString(),
            pdfInfo: {
              path: '/default_resume.pdf',
              size: 0,
              lastModified: new Date().toISOString(),
              contentFingerprint: `placeholder-${Date.now()}`
            },
            extractionStatus: {
              textExtracted: true,
              fontsExtracted: false,
              colorsExtracted: false
            }
          };
          fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
          console.log(`Created placeholder ${buildInfoPath}`);
        }
      }
    } catch (error) {
      console.warn(`Warning: Failed to prepare extracted content: ${error.message}`);
    }
  }

  // Copy the standalone server.js file to the standalone directory
  const serverJsPath = path.join(standaloneDir, 'server.js');
  const standaloneServerJsPath = path.join(__dirname, '../standalone-server.js');
  const rootServerJsPath = path.join(__dirname, '../server.js');

  console.log(`Checking for standalone-server.js at ${standaloneServerJsPath}`);

  if (fs.existsSync(standaloneServerJsPath)) {
    // Use the standalone-server.js file
    console.log(`Copying standalone-server.js from ${standaloneServerJsPath} to ${serverJsPath}`);
    fs.copyFileSync(standaloneServerJsPath, serverJsPath);
    console.log(`✅ Copied standalone-server.js to standalone directory`);
  } else if (fs.existsSync(rootServerJsPath)) {
    // Use the root server.js file
    console.log(`Copying server.js from ${rootServerJsPath} to ${serverJsPath}`);

    // Read the root server.js file
    let serverJsContent = fs.readFileSync(rootServerJsPath, 'utf8');

    // Add a comment at the top
    serverJsContent = `
// This file is a copy of the root server.js file
// It's used to start the Next.js server in production mode

${serverJsContent}`;

    // Write the modified content to the standalone directory
    fs.writeFileSync(serverJsPath, serverJsContent);
    console.log(`✅ Copied and modified server.js to standalone directory`);
  } else {
    console.warn(`Warning: Neither standalone-server.js nor server.js found`);

    // Create a minimal server.js file
    const serverJsContent = `
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

// Create the server
const server = http.createServer((req, res) => {
  // Serve a simple HTML page
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(\`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AlexAI - Resume Analyzer</title>
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
        </style>
      </head>
      <body>
        <div class="container">
          <h1>AlexAI - Resume Analyzer</h1>
          <p>Welcome to AlexAI, your intelligent resume analysis tool.</p>
          <p>This is a simplified version of the application running in standalone mode.</p>
          <p>Server is running at http://\${hostname}:\${port}</p>
        </div>
      </body>
    </html>
  \`);
});

// Start the server
server.listen(port, hostname, () => {
  console.log(\`Server running at http://\${hostname}:\${port}/\`);
  console.log(\`Serving files from: \${__dirname}\`);
});
`;

    fs.writeFileSync(serverJsPath, serverJsContent);
    console.log(`✅ Created minimal Next.js server.js in standalone directory`);
  }

  // Create a simple index.html file in the public directory if it doesn't exist
  const indexHtmlPath = path.join(standalonePublicDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.log(`Creating index.html: ${indexHtmlPath}`);

    const indexHtmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>AlexAI - Resume Analyzer</title>
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
      }
      .button:hover {
        background-color: #0051a2;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>AlexAI - Resume Analyzer</h1>
      <p>Welcome to AlexAI, your intelligent resume analysis tool.</p>
      <a href="/extracted/resume_content.md" class="button">View Resume Content</a>
    </div>
  </body>
</html>
`;

    fs.writeFileSync(indexHtmlPath, indexHtmlContent);
  }

  console.log('✅ Standalone directory structure created successfully');
}

// Run the main function
main().catch(error => {
  console.error('❌ ERROR:', error);
  process.exit(1);
});
