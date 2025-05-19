#!/usr/bin/env node

/**
 * PDF Manager CLI
 * 
 * This script provides a command-line interface for managing PDFs in the AlexAI application.
 */

const { program } = require('commander');
const { createLogger } = require('../core/logger');
const { extractAll, setDefaultPdf, listPdfs } = require('../pdf/extractor');

const logger = createLogger('cli');

// Configure the program
program
  .name('pdf-manager')
  .description('PDF management tool for AlexAI')
  .version('1.0.0');

// Extract command
program
  .command('extract')
  .description('Extract information from a PDF file')
  .argument('<pdf-path>', 'Path to the PDF file')
  .option('-o, --output <dir>', 'Output directory')
  .option('-m, --no-markdown', 'Skip markdown generation')
  .option('-b, --no-backup', 'Skip backup of original PDF')
  .action(async (pdfPath, options) => {
    try {
      logger.info(`Extracting information from ${pdfPath}`);
      
      const result = await extractAll(pdfPath, {
        outputDir: options.output,
        generateMarkdown: options.markdown,
        backup: options.backup
      });
      
      if (result.success) {
        logger.success(`Extraction completed successfully. Files saved to ${result.outputDir}`);
      } else {
        logger.error(`Extraction failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      logger.error(`Extraction failed: ${error.message}`);
      process.exit(1);
    }
  });

// Set default command
program
  .command('set-default')
  .description('Set a PDF as the default')
  .argument('<pdf-path>', 'Path to the PDF file')
  .option('-e, --no-extract', 'Skip extraction after setting default')
  .action(async (pdfPath, options) => {
    try {
      const result = await setDefaultPdf(pdfPath, {
        extract: options.extract
      });
      
      if (result.success) {
        logger.success(`Set ${pdfPath} as the default PDF`);
      } else {
        logger.error(`Failed to set default PDF: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      logger.error(`Failed to set default PDF: ${error.message}`);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List available PDFs')
  .action(async () => {
    try {
      const result = listPdfs();
      
      if (result.success) {
        const { pdfs } = result;
        
        console.log('\nAvailable PDFs:');
        
        // Show default PDF
        if (pdfs.default) {
          console.log('\nDefault PDF:');
          console.log(`  - ${pdfs.default.name} (${formatSize(pdfs.default.size)})`);
        } else {
          console.log('\nNo default PDF found.');
        }
        
        // Show source PDFs
        if (pdfs.source.length > 0) {
          console.log('\nSource PDFs:');
          pdfs.source.forEach(pdf => {
            console.log(`  - ${pdf.name} (${formatSize(pdf.size)})`);
          });
        } else {
          console.log('\nNo source PDFs found.');
        }
        
        // Show test PDFs
        if (pdfs.test.length > 0) {
          console.log('\nTest PDFs:');
          
          // Group by category
          const categories = {};
          pdfs.test.forEach(pdf => {
            if (!categories[pdf.category]) {
              categories[pdf.category] = [];
            }
            categories[pdf.category].push(pdf);
          });
          
          // Display by category
          for (const category in categories) {
            console.log(`\n  ${category}:`);
            categories[category].forEach(pdf => {
              console.log(`    - ${pdf.name} (${formatSize(pdf.size)})`);
            });
          }
        } else {
          console.log('\nNo test PDFs found.');
        }
        
        console.log('');
      } else {
        logger.error(`Failed to list PDFs: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      logger.error(`Failed to list PDFs: ${error.message}`);
      process.exit(1);
    }
  });

// Helper function to format file size
function formatSize(size) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}

// Parse command line arguments
program.parse();
