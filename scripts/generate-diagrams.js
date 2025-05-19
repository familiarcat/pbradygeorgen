#!/usr/bin/env node

/**
 * Diagram Generator Script
 * 
 * This script extracts Mermaid diagrams from markdown files and generates
 * SVG and PDF versions of them using the Mermaid CLI.
 * 
 * Usage:
 *   node scripts/generate-diagrams.js
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
    {
      file: 'docs/application-architecture.md',
      diagrams: [
        { name: 'application-structure', title: 'Application Structure Overview' }
      ]
    },
    {
      file: 'docs/script-structure.md',
      diagrams: [
        { name: 'script-structure', title: 'Script Structure Overview' },
        { name: 'pdf-processing-flow', title: 'PDF Processing Flow' }
      ]
    },
    {
      file: 'docs/pdf-workflow/README.md',
      diagrams: [
        { name: 'pdf-workflow', title: 'PDF Workflow Diagram' }
      ]
    }
  ],
  // Output directory for generated diagrams
  outputDir: 'docs/diagrams',
  // Temporary directory for Mermaid files
  tempDir: 'temp'
};

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Extract Mermaid code from markdown file
function extractMermaidCode(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const mermaidBlocks = [];
  
  // Regular expression to match Mermaid code blocks
  const regex = /```mermaid\s*([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    mermaidBlocks.push(match[1].trim());
  }
  
  return mermaidBlocks;
}

// Generate diagrams using Mermaid CLI
function generateDiagrams() {
  // Ensure output and temp directories exist
  ensureDir(config.outputDir);
  ensureDir(config.tempDir);
  
  // Process each source file
  config.sources.forEach(source => {
    const filePath = path.join(process.cwd(), source.file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Source file not found: ${filePath}`);
      return;
    }
    
    // Extract Mermaid code blocks
    const mermaidBlocks = extractMermaidCode(filePath);
    
    if (mermaidBlocks.length === 0) {
      console.warn(`No Mermaid code blocks found in ${filePath}`);
      return;
    }
    
    // Generate diagrams for each code block
    source.diagrams.forEach((diagram, index) => {
      if (index >= mermaidBlocks.length) {
        console.warn(`Not enough Mermaid code blocks in ${filePath} for diagram ${diagram.name}`);
        return;
      }
      
      const mermaidCode = mermaidBlocks[index];
      const tempFile = path.join(config.tempDir, `${diagram.name}.mmd`);
      const svgOutput = path.join(config.outputDir, `${diagram.name}.svg`);
      const pdfOutput = path.join(config.outputDir, `${diagram.name}.pdf`);
      
      // Write Mermaid code to temporary file
      fs.writeFileSync(tempFile, mermaidCode);
      
      try {
        // Generate SVG
        console.log(`Generating SVG for ${diagram.name}...`);
        execSync(`mmdc -i ${tempFile} -o ${svgOutput}`, { stdio: 'inherit' });
        
        // Generate PDF
        console.log(`Generating PDF for ${diagram.name}...`);
        execSync(`mmdc -i ${tempFile} -o ${pdfOutput}`, { stdio: 'inherit' });
        
        console.log(`Successfully generated diagrams for ${diagram.name}`);
      } catch (error) {
        console.error(`Error generating diagrams for ${diagram.name}:`, error.message);
      }
    });
  });
  
  // Clean up temporary files
  if (fs.existsSync(config.tempDir)) {
    fs.rmSync(config.tempDir, { recursive: true, force: true });
  }
}

// Main function
function main() {
  console.log('Generating diagrams from Mermaid code...');
  
  try {
    // Check if Mermaid CLI is installed
    execSync('mmdc --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Mermaid CLI is not installed. Please install it using:');
    console.error('npm install -g @mermaid-js/mermaid-cli');
    process.exit(1);
  }
  
  generateDiagrams();
  
  console.log('Diagram generation complete!');
}

// Run the main function
main();
