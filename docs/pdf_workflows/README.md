# AlexAI PDF Workflow Documentation

Welcome to the AlexAI PDF Workflow documentation. This directory contains comprehensive documentation for the PDF selection, extraction, and management functionality in AlexAI.

## Table of Contents

1. [PDF Selection and Management](./PDF_SELECTION_README.md)
2. [PDF Workflow Guide](./PDF_WORKFLOW_GUIDE.md)
3. [PDF Workflow Example](./PDF_WORKFLOW_EXAMPLE.md)
4. [PDF Workflow Quick Reference](./PDF_WORKFLOW_QUICKREF.md)

## Overview

AlexAI processes PDF files to extract content, colors, and fonts, which are then used to generate styled content and apply PDF-driven theming throughout the application. The PDF workflow consists of several steps:

1. **Selection**: Choose a PDF file from the available options
2. **Extraction**: Extract text, colors, and fonts from the PDF
3. **Processing**: Generate markdown and apply styling
4. **Testing**: Verify the extraction and styling
5. **Deployment**: Build and deploy the application

All of these steps are integrated into a unified workflow that can be accessed through various commands.

## Quick Start

To get started with the PDF workflow, run:

```bash
npm run pdf
```

This will open the PDF Manager, which provides a menu-driven interface for all PDF-related functionality.

Alternatively, you can use the `alex` command:

```bash
npx alex pdf
```

For a quick reference of all available commands, see the [PDF Workflow Quick Reference](./PDF_WORKFLOW_QUICKREF.md).

## Example Script

We've included an example script that demonstrates how to use the PDF selection and management system programmatically:

```bash
node examples/pdf-workflow-example.js [pdf-path]
```

If no PDF path is provided, the script will use the first PDF it finds in the public folder or source-pdfs directory. The script demonstrates:

1. Finding PDF files in the project
2. Selecting a PDF file
3. Extracting content from the PDF
4. Testing the extraction process
5. Displaying the extracted content
6. Building the application

This example is useful for understanding how to integrate the PDF workflow into your own scripts and applications.

## Documentation Structure

- [PDF Selection and Management](./PDF_SELECTION_README.md): Overview of the PDF selection and management functionality
- [PDF Workflow Guide](./PDF_WORKFLOW_GUIDE.md): Comprehensive guide to the PDF workflow
- [PDF Workflow Example](./PDF_WORKFLOW_EXAMPLE.md): Step-by-step example of the PDF workflow
- [PDF Workflow Quick Reference](./PDF_WORKFLOW_QUICKREF.md): Quick reference for common commands and workflows

## Philosophical Framework

The PDF workflow in AlexAI follows four philosophical frameworks:

- **Salinger**: Intuitive user experience with a menu-driven interface and clear command-line options
- **Dante**: Methodical process with clear steps and comprehensive logging
- **Hesse**: Mathematical precision in color and font extraction
- **Derrida**: Deconstructing the PDF into its core elements of text, colors, and fonts
