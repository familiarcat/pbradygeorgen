# AlexAI PDF Workflow Guide

This guide provides detailed instructions for working with PDFs in the AlexAI project, including selecting PDFs, extracting content, testing, and deployment.

## Table of Contents

1. [Overview](#overview)
2. [PDF Selection and Processing Workflow](#pdf-selection-and-processing-workflow)
3. [Command Reference](#command-reference)
4. [Example Workflows](#example-workflows)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Usage](#advanced-usage)
7. [Philosophical Framework](#philosophical-framework)

## Overview

AlexAI processes PDF files to extract content, colors, and fonts, which are then used to generate styled content and apply PDF-driven theming throughout the application. The PDF workflow consists of several steps:

1. **Selection**: Choose a PDF file from the available options
2. **Extraction**: Extract text, colors, and fonts from the PDF
3. **Processing**: Generate markdown and apply styling
4. **Testing**: Verify the extraction and styling
5. **Deployment**: Build and deploy the application

All of these steps are integrated into a unified workflow that can be accessed through various commands.

## PDF Selection and Processing Workflow

### Step 1: Select a PDF

The first step is to select a PDF file to use as the source for content and styling. You can use the PDF Manager to browse available PDFs:

```bash
npm run pdf
```

Then select option 1 to choose a PDF file. Alternatively, you can use the direct command:

```bash
npm run pdf:select
```

This will scan the `public` folder and `source-pdfs` directory for PDF files and present them as options. Once selected, the PDF will be set as the default for the application.

### Step 2: Extract Content

After selecting a PDF, you need to extract its content. This happens automatically when selecting a PDF, but you can also run it manually:

```bash
npm run pdf:extract:default
```

This will extract:
- Text content (stored in `public/extracted/resume_content.txt`)
- Markdown content (stored in `public/extracted/resume_content.md`)
- Color theory (stored in `public/extracted/color_theory.json`)
- Font theory (stored in `public/extracted/font_theory.json`)

### Step 3: Test the Extraction

To verify that the extraction process worked correctly, run:

```bash
npm run test:pdf-extraction
```

This will check that all extraction scripts are working correctly and that the extracted content is valid.

### Step 4: Build and Test Locally

To build the application with the extracted content and styling:

```bash
npm run build
```

This will run the prebuild script, which includes PDF extraction, and then build the Next.js application. To test the application locally:

```bash
npm run start
```

### Step 5: Deploy

To deploy the application to AWS Amplify:

```bash
npm run deploy:aws
```

Or to simulate the deployment process:

```bash
npm run deploy:simulate
```

## Command Reference

### Unified Command

The `alex` command provides a simplified interface for all PDF-related functionality:

```bash
npx alex <command> [params]
```

Available commands:
- `pdf`: Open the PDF Manager
- `pdf:select`: Select a PDF file
- `pdf:extract [path]`: Extract content from a PDF
- `build`: Build the application
- `start`: Start the application
- `deploy`: Deploy to AWS
- `test`: Run tests
- `help`: Display help message

### npm Scripts

The following npm scripts are available for PDF management:

```bash
# PDF Management
npm run pdf                  # Open the PDF Manager
npm run pdf:select           # Select a PDF file
npm run pdf:extract          # Extract content from any PDF
npm run pdf:extract:default  # Extract content from the default PDF
npm run pdf:extract:custom   # Extract content from a custom PDF
npm run pdf:set-default      # Set a PDF as the default

# Testing
npm run test:pdf-extraction  # Test PDF extraction
npm run test:pdf-conversion  # Test PDF conversion

# Deployment
npm run deploy:aws           # Deploy to AWS
npm run deploy:simulate      # Simulate deployment to AWS
```

## Example Workflows

### 1. Testing a New Resume Design

Suppose you have a new resume design in `source-pdfs/new-resume.pdf` and want to test how it looks in AlexAI:

```bash
# Step 1: Select the new PDF
npx alex pdf:select
# Choose the new-resume.pdf from the list

# Step 2: Test the extraction
npx alex test

# Step 3: Build and test locally
npx alex build
npx alex start
# Open http://localhost:3000 in your browser

# Step 4: Deploy if satisfied
npx alex deploy
```

### 2. Batch Processing Multiple PDFs

To test multiple PDFs in sequence:

```bash
# Open the PDF Manager
npm run pdf

# For each PDF:
# 1. Select option 1 to choose a PDF
# 2. Select option 3 to test extraction
# 3. Select option 4 to build and test locally
# 4. Review the results
# 5. Repeat for the next PDF
```

### 3. Quick PDF Selection and Testing

For a streamlined workflow:

```bash
# Select a PDF and automatically process it
npm run pdf:select
# Choose the PDF from the list

# Build and start the application
npm run build
npm run start
```

## Troubleshooting

### Common Issues

1. **PDF extraction fails**
   - Check that the PDF is not password-protected
   - Verify that the PDF is not corrupted
   - Try a different PDF to see if the issue is specific to that file

2. **Colors or fonts not extracted**
   - Some PDFs use embedded images for content, which can't be extracted
   - Try a PDF with text-based content
   - Check the extraction logs for specific errors

3. **Build fails after PDF selection**
   - Check that the extraction process completed successfully
   - Verify that the extracted files exist in `public/extracted/`
   - Look for specific error messages in the build logs

### Debugging

To see detailed logs during the extraction process:

```bash
DEBUG=true npm run pdf:extract:default
```

## Advanced Usage

### Custom PDF Processing

You can process a specific PDF without setting it as the default:

```bash
npm run pdf:extract:custom path/to/your/pdf
```

### Adding New PDFs

To add new PDFs to the project:

1. Place the PDF in the `source-pdfs` directory
2. Run `npm run pdf:select` to select it
3. Follow the normal workflow for testing and deployment

### Customizing Extraction

The extraction process can be customized by editing the following scripts:

- `scripts/extract-pdf-text-improved.js`: Text extraction
- `scripts/extract-pdf-colors.js`: Color extraction
- `scripts/extract-pdf-fonts.js`: Font extraction
- `scripts/generate-improved-markdown.js`: Markdown generation

## Philosophical Framework

The PDF workflow in AlexAI follows four philosophical frameworks:

### Salinger: Intuitive User Experience

The PDF selection and management system provides an intuitive interface that guides users through the process. The menu-driven interface and clear command-line options make it easy to select PDFs, extract content, and test the results.

Example: The PDF Manager presents a clear menu with numbered options and displays the current default PDF.

### Dante: Methodical Process

The PDF workflow follows a methodical process with clear steps and comprehensive logging. Each step is logged with a prefix and color, making it easy to track the progress and identify issues.

Example: The extraction process logs each step (text, colors, fonts) with success or error messages.

### Hesse: Mathematical Precision

The color and font extraction processes use mathematical principles to analyze the PDF content. Colors are categorized based on their RGB values, and fonts are classified as serif, sans-serif, or monospace.

Example: The color extraction process calculates the luminance of each color to determine if it should be used as a background or text color.

### Derrida: Deconstructing Content

The PDF extraction process deconstructs the PDF into its core elements: text, colors, and fonts. These elements are then reconstructed into a cohesive theme that is applied throughout the application.

Example: The text extraction process separates the content into sections (header, about, skills, etc.) and reconstructs it as structured markdown.
