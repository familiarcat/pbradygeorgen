# PDF Selection and Management in AlexAI

## Overview

The PDF Selection and Management system in AlexAI provides a comprehensive set of tools for working with PDF files in the application. It allows you to:

- Select PDF files from the public folder and source-pdfs directory
- Extract content, colors, and fonts from PDFs
- Test the extraction process
- Build and test the application locally
- Deploy the application to AWS

## Features

### PDF Selection

The PDF selection process scans the public folder and source-pdfs directory for PDF files and presents them as options. You can select a PDF file to use as the default for the application.

Key features:
- Automatic scanning of public folder and source-pdfs directory
- Backup of the current default PDF
- Setting the selected PDF as the default
- Automatic extraction of content, colors, and fonts

### PDF Extraction

The PDF extraction process extracts text, colors, and fonts from a PDF file. The extracted content is used to generate markdown, which is displayed in the application. The extracted colors and fonts are used to style the application.

Key features:
- Text extraction with improved markdown generation
- Color extraction with theme generation
- Font extraction with CSS variable generation
- Comprehensive error handling and logging

### PDF Management

The PDF Manager provides a unified interface for all PDF-related functionality. It presents a menu-driven interface for selecting PDF files, extracting content, testing the extraction process, and deploying the application.

Key features:
- Menu-driven interface
- Current default PDF display
- Comprehensive error handling and logging
- Integration with build and deployment processes

### Command-Line Interface

The `alex` command provides a simplified interface for all PDF-related functionality. It follows the format: `npx alex <command> [params]`.

Key features:
- Simplified command syntax
- Comprehensive help documentation
- Integration with npm scripts
- Support for all PDF-related functionality

## Installation

The PDF Selection and Management system is included in the AlexAI project. To make the `alex` command available, run:

```bash
npm link
```

## Usage

### Using the PDF Manager

To open the PDF Manager, run:

```bash
npm run pdf
```

This will display a menu with the following options:

1. **Select a PDF file**: Scan the public folder and source-pdfs directory for PDF files and allow you to select one as the default.
2. **Extract content from the current PDF**: Extract text, colors, and fonts from the current default PDF.
3. **Test PDF extraction**: Run the PDF extraction test to verify that the extraction process works correctly.
4. **Build and test locally**: Build the application and start it locally for testing.
5. **Simulate deployment to AWS**: Simulate the deployment process to AWS Amplify.
6. **Deploy to AWS**: Deploy the application to AWS Amplify.
7. **Exit**: Exit the PDF Manager.

### Using the Command Line

To select a PDF file, run:

```bash
npm run pdf:select
```

To extract content from the default PDF, run:

```bash
npm run pdf:extract:default
```

To extract content from a specific PDF, run:

```bash
npm run pdf:extract:custom path/to/your/pdf
```

To test the PDF extraction process, run:

```bash
npm run test:pdf-extraction
```

To build and test the application locally, run:

```bash
npm run build
npm run start
```

To simulate deployment to AWS, run:

```bash
npm run deploy:simulate
```

To deploy to AWS, run:

```bash
npm run deploy:aws
```

### Using the Alex Command

To display help, run:

```bash
npx alex help
```

To open the PDF Manager, run:

```bash
npx alex pdf
```

To select a PDF file, run:

```bash
npx alex pdf:select
```

To extract content from a PDF, run:

```bash
npx alex pdf:extract [path]
```

To build the application, run:

```bash
npx alex build
```

To start the application, run:

```bash
npx alex start
```

To deploy to AWS, run:

```bash
npx alex deploy
```

To run tests, run:

```bash
npx alex test
```

## Documentation

For more detailed documentation, see:

- [PDF Workflow Guide](./PDF_WORKFLOW_GUIDE.md): Comprehensive guide to the PDF workflow
- [PDF Workflow Example](./PDF_WORKFLOW_EXAMPLE.md): Step-by-step example of the PDF workflow
- [PDF Workflow Quick Reference](./PDF_WORKFLOW_QUICKREF.md): Quick reference for common commands and workflows

## Architecture

The PDF Selection and Management system consists of the following components:

### Scripts

- `scripts/pdf-manager.sh`: Unified PDF Manager
- `scripts/select-pdf.sh`: PDF selection script
- `scripts/set-default-pdf.sh`: Script to set a PDF as the default
- `scripts/extract-pdf-all.sh`: Script to extract content from a PDF
- `scripts/extract-pdf-text-improved.js`: Script to extract text from a PDF
- `scripts/extract-pdf-colors.js`: Script to extract colors from a PDF
- `scripts/extract-pdf-fonts.js`: Script to extract fonts from a PDF
- `scripts/generate-improved-markdown.js`: Script to generate improved markdown
- `scripts/test-pdf-extraction.sh`: Script to test PDF extraction
- `scripts/deploy-to-aws.sh`: Script to deploy to AWS
- `scripts/simulate-aws-deploy.sh`: Script to simulate deployment to AWS
- `scripts/alex.js`: Alex command-line utility

### Directories

- `public/`: Public directory containing PDF files
- `public/test-pdfs/`: Directory containing test PDF files
- `public/backup/`: Directory containing backup PDF files
- `source-pdfs/`: Directory containing source PDF files
- `public/extracted/`: Directory containing extracted content

### Files

- `public/pbradygeorgen_resume.pdf`: Default PDF file
- `public/extracted/resume_content.txt`: Extracted text content
- `public/extracted/resume_content.md`: Extracted markdown content
- `public/extracted/resume_content_improved.md`: Improved markdown content
- `public/extracted/color_theory.json`: Extracted color theory
- `public/extracted/font_theory.json`: Extracted font theory
- `public/extracted/pdf_fonts.css`: CSS with font variables
- `public/extracted/font_info.json`: Font information

## Philosophical Framework

The PDF Selection and Management system follows the four philosophical frameworks:

### Salinger: Intuitive User Experience

The system provides an intuitive interface that guides users through the process. The menu-driven interface and clear command-line options make it easy to select PDFs, extract content, and test the results.

### Dante: Methodical Process

The system follows a methodical process with clear steps and comprehensive logging. Each step is logged with a prefix and color, making it easy to track the progress and identify issues.

### Hesse: Mathematical Precision

The color and font extraction processes use mathematical principles to analyze the PDF content. Colors are categorized based on their RGB values, and fonts are classified as serif, sans-serif, or monospace.

### Derrida: Deconstructing Content

The PDF extraction process deconstructs the PDF into its core elements: text, colors, and fonts. These elements are then reconstructed into a cohesive theme that is applied throughout the application.
