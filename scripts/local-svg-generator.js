#!/usr/bin/env node

/**
 * Local SVG Generator
 * 
 * This script extracts Mermaid diagrams from markdown files and generates
 * SVG files that can be viewed locally in any browser.
 * 
 * Usage:
 *   node scripts/local-svg-generator.js
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
  outputDir: 'docs/diagrams/local-svg',
  // Temporary directory
  tempDir: 'temp-mermaid'
};

// Ensure a directory exists
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
    const fileName = path.basename(filePath, '.md').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const blockName = `${fileName}_diagram_${index}`;
    
    blocks.push({
      code,
      name: blockName,
      source: path.basename(filePath, '.md').replace(/_/g, ' ')
    });
    
    index++;
  }
  
  console.log(`Found ${blocks.length} Mermaid blocks in ${filePath}`);
  return blocks;
}

// Generate SVG from Mermaid code
function generateSvg(code, name) {
  const tempFile = path.join(config.tempDir, `${name}.mmd`);
  const outputFile = path.join(config.outputDir, `${name}.svg`);
  
  // Write Mermaid code to temporary file
  fs.writeFileSync(tempFile, code);
  
  try {
    // Create a config file for mermaid-cli with high contrast settings
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
        noteTextColor: '#000',
        noteBkgColor: '#fff5ad',
        noteBorderColor: '#333',
        edgeLabelBackground: '#fff',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      }
    };
    
    fs.writeFileSync(configFile, JSON.stringify(mermaidConfig));
    
    // Generate SVG using mermaid-cli
    console.log(`Generating SVG for ${name}...`);
    execSync(`mmdc -i ${tempFile} -o ${outputFile} -c ${configFile}`, { stdio: 'inherit' });
    
    console.log(`Successfully generated SVG: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error(`Error generating SVG for ${name}:`, error.message);
    return null;
  }
}

// Create a simple HTML viewer
function createHtmlViewer(diagrams) {
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
    .diagram-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .diagram-button {
      padding: 8px 12px;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .diagram-button:hover {
      background-color: #e0e0e0;
    }
    .diagram-button.active {
      background-color: #0366d6;
      color: white;
      border-color: #0366d6;
    }
    .diagram-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 20px;
    }
    .diagram-title {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .diagram-source {
      font-style: italic;
      color: #666;
      margin-bottom: 10px;
    }
    .diagram-svg {
      width: 100%;
      height: auto;
      max-height: 800px;
      overflow: auto;
      border: 1px solid #eee;
    }
    .controls {
      margin-bottom: 20px;
    }
    .zoom-control {
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <h1>AlexAI Diagrams</h1>
  <p>Click on a diagram name to view it. Use the zoom controls to adjust the size.</p>
  
  <div class="controls">
    <button id="zoom-in" class="zoom-control">Zoom In (+)</button>
    <button id="zoom-out" class="zoom-control">Zoom Out (-)</button>
    <button id="zoom-reset" class="zoom-control">Reset Zoom</button>
  </div>
  
  <div class="diagram-list" id="diagram-list">
    <!-- Diagram buttons will be inserted here -->
  </div>
  
  <div class="diagram-container" id="diagram-container">
    <div class="diagram-title" id="diagram-title">Select a diagram</div>
    <div class="diagram-source" id="diagram-source"></div>
    <div class="diagram-svg" id="diagram-svg">
      <!-- SVG will be inserted here -->
    </div>
  </div>
  
  <script>
    // Diagram data
    const diagrams = ${JSON.stringify(diagrams)};
    
    // Current zoom level
    let currentZoom = 100;
    
    // Initialize the viewer
    function initViewer() {
      const diagramList = document.getElementById('diagram-list');
      
      // Create buttons for each diagram
      diagrams.forEach((diagram, index) => {
        const button = document.createElement('button');
        button.className = 'diagram-button';
        button.textContent = diagram.name;
        button.onclick = () => showDiagram(index);
        diagramList.appendChild(button);
      });
      
      // Set up zoom controls
      document.getElementById('zoom-in').addEventListener('click', zoomIn);
      document.getElementById('zoom-out').addEventListener('click', zoomOut);
      document.getElementById('zoom-reset').addEventListener('click', resetZoom);
      
      // Show the first diagram if available
      if (diagrams.length > 0) {
        showDiagram(0);
      }
    }
    
    // Show a diagram
    function showDiagram(index) {
      const diagram = diagrams[index];
      
      // Update the title and source
      document.getElementById('diagram-title').textContent = diagram.name;
      document.getElementById('diagram-source').textContent = 'Source: ' + diagram.source;
      
      // Load the SVG
      const svgContainer = document.getElementById('diagram-svg');
      svgContainer.innerHTML = '<object type="image/svg+xml" data="' + diagram.file + '" style="width: 100%; height: 100%;"></object>';
      
      // Update active button
      const buttons = document.querySelectorAll('.diagram-button');
      buttons.forEach((button, i) => {
        if (i === index) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
      
      // Reset zoom
      resetZoom();
    }
    
    // Zoom in
    function zoomIn() {
      currentZoom += 10;
      applyZoom();
    }
    
    // Zoom out
    function zoomOut() {
      currentZoom = Math.max(50, currentZoom - 10);
      applyZoom();
    }
    
    // Reset zoom
    function resetZoom() {
      currentZoom = 100;
      applyZoom();
    }
    
    // Apply zoom
    function applyZoom() {
      const svgObject = document.querySelector('#diagram-svg object');
      if (svgObject) {
        svgObject.style.width = currentZoom + '%';
      }
    }
    
    // Initialize the viewer when the page loads
    window.onload = initViewer;
  </script>
</body>
</html>`;

  fs.writeFileSync(indexPath, html);
  console.log(`Created HTML viewer: ${indexPath}`);
  
  return indexPath;
}

// Main function
async function main() {
  console.log('Generating local SVG diagrams...');
  
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
  
  const allDiagrams = [];
  
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
      const svgFile = generateSvg(block.code, block.name);
      if (svgFile) {
        allDiagrams.push({
          name: block.name.replace(/_/g, ' '),
          file: path.basename(svgFile),
          source: block.source
        });
      }
    }
  }
  
  // Create HTML viewer
  if (allDiagrams.length > 0) {
    createHtmlViewer(allDiagrams);
  }
  
  // Clean up temporary files
  if (fs.existsSync(config.tempDir)) {
    fs.rmSync(config.tempDir, { recursive: true, force: true });
    console.log(`Removed temporary directory: ${config.tempDir}`);
  }
  
  console.log(`Generated ${allDiagrams.length} SVG diagrams.`);
  console.log(`Open ${path.join(config.outputDir, 'index.html')} in your browser to view all diagrams.`);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
