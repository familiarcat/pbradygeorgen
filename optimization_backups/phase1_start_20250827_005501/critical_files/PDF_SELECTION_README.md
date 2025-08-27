# PDF Selection and Management in AlexAI

This document provides an overview of the PDF selection and management functionality in AlexAI, which allows you to select PDF files from the public folder, extract content from them, and test the extraction process.

## Overview

AlexAI now includes a comprehensive set of tools for managing PDF files in the application. These tools allow you to:

1. Select a PDF file from the public folder or source-pdfs directory
2. Extract content, colors, and fonts from the selected PDF
3. Test the extraction process
4. Build and test the application locally
5. Deploy the application to AWS

## Command-Line Interface

AlexAI provides a unified command-line interface for all PDF-related functionality. You can access this interface using the following commands:

### Using npm scripts

```bash
# Open the PDF Manager
npm run pdf

# Select a PDF file
npm run pdf:select

# Extract content from the default PDF
npm run pdf:extract:default

# Extract content from a custom PDF
npm run pdf:extract:custom path/to/your/pdf

# Set a PDF as the default
npm run pdf:set-default path/to/your/pdf

# Test PDF extraction
npm run test:pdf-extraction

# Build and test locally
npm run build
npm run start

# Simulate deployment to AWS
npm run deploy:simulate

# Deploy to AWS
npm run deploy:aws
```

### Using the `alex` command

AlexAI also provides a simplified command-line utility that can be run with `npx alex`:

```bash
# Open the PDF Manager
npx alex pdf

# Select a PDF file
npx alex pdf:select

# Extract content from the default PDF
npx alex pdf:extract

# Extract content from a custom PDF
npx alex pdf:extract path/to/your/pdf

# Build the application
npx alex build

# Start the application
npx alex start

# Deploy to AWS
npx alex deploy

# Run tests
npx alex test

# Display help
npx alex help
```

## PDF Manager

The PDF Manager is a unified interface for all PDF-related functionality. It provides a menu-driven interface for selecting PDF files, extracting content, testing the extraction process, and deploying the application.

To open the PDF Manager, run:

```bash
npm run pdf
```

The PDF Manager will display a menu with the following options:

1. **Select a PDF file**: Scan the public folder and source-pdfs directory for PDF files and allow you to select one as the default.
2. **Extract content from the current PDF**: Extract text, colors, and fonts from the current default PDF.
3. **Test PDF extraction**: Run the PDF extraction test to verify that the extraction process works correctly.
4. **Build and test locally**: Build the application and start it locally for testing.
5. **Simulate deployment to AWS**: Simulate the deployment process to AWS Amplify.
6. **Deploy to AWS**: Deploy the application to AWS Amplify.
7. **Exit**: Exit the PDF Manager.

## PDF Selection Process

The PDF selection process scans the public folder and source-pdfs directory for PDF files and allows you to select one as the default. The selected PDF is copied to `public/pbradygeorgen_resume.pdf`, which is the default PDF used by the application.

The process also extracts content, colors, and fonts from the selected PDF, which are used to style the application.

## PDF Extraction Process

The PDF extraction process extracts text, colors, and fonts from a PDF file. The extracted content is used to generate markdown, which is displayed in the application. The extracted colors and fonts are used to style the application.

The extraction process consists of the following steps:

1. **Text extraction**: Extract text content from the PDF and generate markdown.
2. **Color extraction**: Extract colors from the PDF and generate a color theme.
3. **Font extraction**: Extract fonts from the PDF and generate a font theme.

## Testing

AlexAI includes comprehensive tests for the PDF extraction process. These tests verify that the extraction process works correctly and that the extracted content is valid.

To run the tests, use:

```bash
npm run test:pdf-extraction
```

## Deployment

AlexAI can be deployed to AWS Amplify. The deployment process ensures that the PDF extraction process runs before the build, so the extracted styles are available during server-side rendering.

To simulate the deployment process, use:

```bash
npm run deploy:simulate
```

To deploy to AWS Amplify, use:

```bash
npm run deploy:aws
```

## Philosophical Framework

The PDF selection and management functionality follows the four philosophical frameworks:

1. **Salinger**: Intuitive user interaction with a menu-driven interface and clear command-line options.
2. **Dante**: Methodical logging of the process with clear status messages and error handling.
3. **Hesse**: Mathematical precision in color and font extraction, with careful attention to detail.
4. **Derrida**: Deconstructing the PDF into its core elements of text, colors, and fonts.

## Next Steps

1. **Enhance the PDF selection process**: Add support for uploading PDFs directly from the command line.
2. **Improve the PDF extraction process**: Add support for extracting more information from PDFs, such as tables and images.
3. **Create a web interface for PDF management**: Add a web interface for selecting and managing PDFs.
4. **Implement more sophisticated styling**: Use the extracted colors and fonts to create more sophisticated styling for the application.
5. **Add support for multiple PDFs**: Allow the application to use multiple PDFs with different styles.
