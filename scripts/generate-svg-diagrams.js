#!/usr/bin/env node

/**
 * Generate SVG Diagrams Script
 * 
 * This script extracts all Mermaid diagrams from markdown files and generates
 * SVG files for each one. It uses the mermaid-cli to generate the SVGs.
 * 
 * Usage:
 *   node scripts/generate-svg-diagrams.js
 * 
 * Requirements:
 *   - @mermaid-js/mermaid-cli must be installed globally
 *     npm install -g @mermaid-js/mermaid-cli
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Source files containing Mermaid diagrams
  sources: [
    'docs/application-architecture.md',
    'docs/script-structure.md',
    'docs/pdf-workflow/README.md'
  ],
  // Output directory for generated SVGs
  outputDir: 'docs/diagrams/svg',
  // Temporary directory for Mermaid files
  tempDir: 'temp'
};

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Extract Mermaid code blocks from a markdown file
function extractMermaidBlocks(filePath) {
  console.log(`Extracting Mermaid blocks from ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = [];
  
  // Regular expression to match Mermaid code blocks
  const regex = /```mermaid\s*([\s\S]*?)```/g;
  let match;
  let index = 1;
  
  while ((match = regex.exec(content)) !== null) {
    const code = match[1].trim();
    const fileName = path.basename(filePath, '.md');
    const blockName = `${fileName}_diagram_${index}`;
    
    blocks.push({
      code,
      name: blockName
    });
    
    index++;
  }
  
  console.log(`Found ${blocks.length} Mermaid blocks in ${filePath}`);
  return blocks;
}

// Generate SVG from Mermaid code
function generateSvg(code, name, outputDir) {
  const tempFile = path.join(config.tempDir, `${name}.mmd`);
  const outputFile = path.join(outputDir, `${name}.svg`);
  
  // Write Mermaid code to temporary file
  fs.writeFileSync(tempFile, code);
  
  try {
    // Generate SVG using mermaid-cli
    console.log(`Generating SVG for ${name}...`);
    
    // Configure mermaid with high contrast settings
    const configFile = path.join(config.tempDir, 'mermaid-config.json');
    const mermaidConfig = {
      theme: 'default',
      themeVariables: {
        primaryColor: '#bbf',
        primaryTextColor: '#000',
        primaryBorderColor: '#333',
        lineColor: '#333',
        secondaryColor: '#fbb',
        secondaryTextColor: '#000',
        secondaryBorderColor: '#333',
        tertiaryColor: '#bfb',
        tertiaryTextColor: '#000',
        tertiaryBorderColor: '#333',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      }
    };
    
    fs.writeFileSync(configFile, JSON.stringify(mermaidConfig));
    
    // Generate SVG with the config
    execSync(`mmdc -i ${tempFile} -o ${outputFile} -c ${configFile}`, { stdio: 'inherit' });
    
    console.log(`Successfully generated SVG: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error(`Error generating SVG for ${name}:`, error.message);
    return null;
  }
}

// Create an HTML index file for all SVGs
function createHtmlIndex(svgFiles) {
  const indexPath = path.join(config.outputDir, 'index.html');
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AlexAI Diagrams</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    .diagram-container {
      margin-bottom: 40px;
    }
    .diagram-title {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .diagram-frame {
      width: 100%;
      height: 600px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .diagram-link {
      display: block;
      margin-top: 10px;
    }
    .source-link {
      color: #0366d6;
      text-decoration: none;
    }
    .source-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>AlexAI Diagrams</h1>
  <p>This page contains all the diagrams from the AlexAI documentation. Click on any diagram to view it in full size.</p>
  
  <div id="diagrams">
`;

  // Group SVGs by source file
  const groupedSvgs = {};
  
  svgFiles.forEach(file => {
    const parts = path.basename(file, '.svg').split('_diagram_');
    const source = parts[0];
    
    if (!groupedSvgs[source]) {
      groupedSvgs[source] = [];
    }
    
    groupedSvgs[source].push(file);
  });
  
  // Add each group to the HTML
  for (const source in groupedSvgs) {
    const sourceTitle = source
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    html += `    <h2>${sourceTitle}</h2>\n`;
    
    groupedSvgs[source].forEach(file => {
      const fileName = path.basename(file);
      const relativePath = path.relative(config.outputDir, file);
      
      html += `    <div class="diagram-container">
      <div class="diagram-title">${fileName}</div>
      <iframe class="diagram-frame" src="${relativePath}"></iframe>
      <a class="diagram-link" href="${relativePath}" target="_blank">Open in new tab</a>
    </div>\n`;
    });
  }
  
  html += `  </div>
</body>
</html>`;

  fs.writeFileSync(indexPath, html);
  console.log(`Created HTML index: ${indexPath}`);
  
  return indexPath;
}

// Main function
async function main() {
  console.log('Generating SVG diagrams from Mermaid code...');
  
  try {
    // Check if Mermaid CLI is installed
    execSync('mmdc --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Mermaid CLI is not installed. Please install it using:');
    console.error('npm install -g @mermaid-js/mermaid-cli');
    process.exit(1);
  }
  
  // Ensure directories exist
  ensureDir(config.outputDir);
  ensureDir(config.tempDir);
  
  const allSvgFiles = [];
  
  // Process each source file
  for (const source of config.sources) {
    const filePath = path.join(process.cwd(), source);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Source file not found: ${filePath}`);
      continue;
    }
    
    // Extract Mermaid blocks
    const blocks = extractMermaidBlocks(filePath);
    
    // Generate SVG for each block
    for (const block of blocks) {
      const svgFile = generateSvg(block.code, block.name, config.outputDir);
      if (svgFile) {
        allSvgFiles.push(svgFile);
      }
    }
  }
  
  // Create HTML index
  if (allSvgFiles.length > 0) {
    createHtmlIndex(allSvgFiles);
  }
  
  // Clean up temporary files
  if (fs.existsSync(config.tempDir)) {
    fs.rmSync(config.tempDir, { recursive: true, force: true });
    console.log(`Removed temporary directory: ${config.tempDir}`);
  }
  
  console.log(`Generated ${allSvgFiles.length} SVG diagrams.`);
  console.log(`Open ${path.join(config.outputDir, 'index.html')} to view all diagrams.`);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
