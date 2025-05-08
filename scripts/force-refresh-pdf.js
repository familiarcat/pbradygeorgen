#!/usr/bin/env node

/**
 * Force Refresh PDF Processing
 * 
 * This script forces a refresh of the PDF processing pipeline, bypassing any caches.
 * It's useful for testing the PDF processing pipeline with the current source PDF.
 * 
 * Philosophical Framework:
 * - Derrida: Deconstructing and reconstructing PDF content with precision
 * - Hesse: Balancing structure with flexibility in a harmonious system
 * - Salinger: Simplifying the user experience through reliable content
 * - Dante: Guiding the content through a complete transformative journey
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Dante emoji logger
const danteEmoji = {
  success: {
    basic: '😇☀️: ',
    core: '😇🌟: ',
    perfection: '😇🌈: '
  },
  error: {
    system: '👑💢: ',
    dataFlow: '⚠️⚡: ',
    validation: '⚠️🔥: '
  },
  warn: {
    deprecated: '⚠️🌊: ',
    performance: '⚠️⏱️: ',
    security: '⚠️🔒: '
  }
};

// Dante logger
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic}${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core}${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection}${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system}${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow}${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation}${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated}${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance}${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security}${message}${colors.reset}`)
  }
};

/**
 * Main function to force refresh PDF processing
 */
async function forceRefreshPdf() {
  try {
    console.log(`\n${colors.cyan}${colors.bright}🔄 FORCE REFRESH PDF PROCESSING${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    danteLogger.success.basic('Starting force refresh PDF processing');
    
    // 1. Clear cache directories
    console.log(`\n${colors.cyan}${colors.bright}🔄 CLEARING CACHE DIRECTORIES${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    const cacheDir = path.join(process.cwd(), '.cache');
    const extractedDir = path.join(process.cwd(), 'public', 'extracted');
    const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
    
    // Clear the cache directory
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      danteLogger.success.basic('Cleared cache directory');
    }
    
    // Clear the extracted directory
    if (fs.existsSync(extractedDir)) {
      fs.rmSync(extractedDir, { recursive: true, force: true });
      danteLogger.success.basic('Cleared extracted directory');
    }
    
    // Create the extracted directory
    fs.mkdirSync(extractedDir, { recursive: true });
    
    // Clear the downloads directory
    if (fs.existsSync(downloadsDir)) {
      fs.rmSync(downloadsDir, { recursive: true, force: true });
      danteLogger.success.basic('Cleared downloads directory');
    }
    
    // Create the downloads directory
    fs.mkdirSync(downloadsDir, { recursive: true });
    
    // 2. Run the enhanced PDF processor with force refresh
    console.log(`\n${colors.cyan}${colors.bright}🔄 RUNNING ENHANCED PDF PROCESSOR${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    // Set the FORCE_REFRESH environment variable
    process.env.FORCE_REFRESH = 'true';
    
    // Run the enhanced PDF processor
    const enhancedPdfProcessor = spawn('node', ['scripts/enhanced-pdf-processor.js'], {
      env: { ...process.env, FORCE_REFRESH: 'true' },
      stdio: 'inherit'
    });
    
    // Wait for the enhanced PDF processor to complete
    await new Promise((resolve, reject) => {
      enhancedPdfProcessor.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Enhanced PDF processor exited with code ${code}`));
        }
      });
    });
    
    // 3. Final output
    console.log(`\n${colors.green}${colors.bright}✅ FORCE REFRESH PDF PROCESSING COMPLETED${colors.reset}`);
    console.log(`${colors.green}=============================`);
    
    danteLogger.success.perfection('Force refresh PDF processing completed successfully');
    
    console.log(`\n${colors.cyan}${colors.bright}🔄 NEXT STEPS${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    console.log(`1. Run 'npm run dev' to start the development server`);
    console.log(`2. Open http://localhost:3000/download-test to view the Download Functionality Test page`);
    console.log(`3. Check that the OpenAI query and response are displayed correctly`);
    console.log(`4. Verify that the generated content is based on the current source PDF`);
    
    return {
      success: true
    };
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ FORCE REFRESH PDF PROCESSING FAILED${colors.reset}`);
    console.error(`${colors.red}=============================`);
    console.error(`Error: ${error.message}`);
    
    if (process.env.DEBUG_LOGGING === 'true') {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Run the main function
forceRefreshPdf();
