# AlexAI Scripts

This directory contains scripts used for building, deploying, and testing the AlexAI application. The scripts follow the four core philosophical approaches:

- **Dante (Structure)**: Hierarchical organization of build steps
- **Hesse (Precision)**: Technical precision and intellectual clarity
- **Salinger (Authenticity)**: Human-readable, authentic representation
- **Derrida (Deconstruction)**: Breaking down traditional build categories

## Core Scripts

These scripts are essential for the application's build and deployment process:

### Build Process

- **consolidated-build.sh**: The main build script that orchestrates the entire build process.
- **new-pdf-prebuild-processor.js**: Processes PDFs during the build phase, extracting content, analyzing it with OpenAI, and generating download formats.
- **create-standalone.js**: Creates the standalone directory structure for production deployment.
- **prepare-amplify-build.js**: Prepares the application for AWS Amplify deployment.

### Start Process

- **consolidated-start.sh**: Starts the application in production mode and runs basic health checks.
- **enhanced-start-logger.js**: Enhances the start output with proper Dante logging philosophy.

### Testing

- **test-download-functionality.js**: Tests the download functionality of the application.
- **run-download-tests.sh**: Runs the download functionality tests.
- **test-e2e-deployment.sh**: Tests the end-to-end deployment process.

### Environment Setup

- **unified-environment-setup.js**: Sets up the environment for local development or AWS Amplify deployment.
- **amplify-openai-setup.js**: Sets up the OpenAI API key for AWS Amplify.
- **setup-s3-bucket.js**: Sets up the S3 bucket for AWS Amplify.

## Utility Scripts

These scripts provide additional functionality:

- **enhanced-build-logger.js**: Enhances the build output with proper Dante logging philosophy.
- **ensure-extracted-content.js**: Ensures that extracted content exists.
- **force-refresh-pdf.js**: Forces a refresh of the PDF content.
- **fix-standalone-directory.js**: Fixes issues with the standalone directory structure.

## Archived Scripts

Legacy scripts that have been replaced by newer versions are stored in the `archive` directory.

## Usage

The scripts are typically invoked through npm scripts defined in package.json. For example:

```bash
# Build the application
npm run build

# Start the application
npm run start

# Test the download functionality
npm run test:download

# Set up the environment for local development
npm run setup:local
```

## Logging

Most scripts use the Dante and Hesse logging philosophies to provide structured, informative logs. Logs are stored in the `logs` directory with timestamps.

## Error Handling

Scripts follow the Derrida philosophy for error handling, breaking down errors into specific categories and providing clear error messages. Most scripts will continue execution even if non-critical errors occur, with appropriate warnings.

## Philosophical Alignment

The scripts are designed to align with the four core philosophical approaches:

- **Dante (Structure)**: Scripts are organized in a hierarchical structure, with clear dependencies and flow.
- **Hesse (Precision)**: Scripts are precise and technical, with clear documentation and error handling.
- **Salinger (Authenticity)**: Scripts provide human-readable output and authentic representation of the build process.
- **Derrida (Deconstruction)**: Scripts break down traditional build categories into smaller, more manageable components.
