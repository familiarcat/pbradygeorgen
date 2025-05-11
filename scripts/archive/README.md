# Archived Scripts

This directory contains legacy scripts that have been replaced by newer versions. These scripts are kept for reference purposes but are no longer actively used in the application's build and deployment process.

## Legacy PDF Processing Scripts

- **pdf-prebuild-processor.js**: Legacy script for processing PDFs during the build phase. Replaced by `new-pdf-prebuild-processor.js`.
- **s3-pdf-prebuild-processor.js**: Legacy script for processing PDFs from S3 during the build phase. Functionality integrated into `new-pdf-prebuild-processor.js`.
- **s3-openai-prebuild-processor.js**: Legacy script for analyzing PDFs with OpenAI from S3 during the build phase. Functionality integrated into `new-pdf-prebuild-processor.js`.
- **s3-complete-prebuild-processor.js**: Legacy script for complete PDF processing from S3 during the build phase. Functionality integrated into `new-pdf-prebuild-processor.js`.

## Legacy Environment Management Scripts

- **amplify-env-manager.js**: Legacy script for managing AWS Amplify environments. Functionality integrated into `unified-environment-setup.js`.

## Legacy Test Scripts

- **test-chatgpt-json.js**: Legacy script for testing ChatGPT JSON responses. No longer needed with the current OpenAI integration.
- **test-openai.js**: Legacy script for testing OpenAI API. No longer needed with the current OpenAI integration.
- **test-pdf-template.js**: Legacy script for testing PDF templates. No longer needed with the current PDF processing.
- **test-s3-cover-letter-generator.js**: Legacy script for testing S3 cover letter generation. Functionality integrated into the main application.
- **test-s3-openai-analyzer.js**: Legacy script for testing S3 OpenAI analysis. Functionality integrated into the main application.
- **test-s3-pdf-extractor.js**: Legacy script for testing S3 PDF extraction. Functionality integrated into the main application.
- **test-s3-storage-manager.js**: Legacy script for testing S3 storage management. Functionality integrated into the main application.

## Note on Usage

These scripts are kept for reference purposes only and should not be used in the current build and deployment process. They may contain outdated dependencies, APIs, or approaches that are no longer compatible with the current application architecture.

If you need to understand how certain functionality was implemented in the past, these scripts can provide valuable insights. However, for current development, please refer to the active scripts in the parent directory.
