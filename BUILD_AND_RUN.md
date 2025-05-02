# Build and Run Instructions

This document provides instructions for building and running the application in different modes.

## Development Mode

Development mode is intended for UI changes and local development with hot reloading. It uses mock data for some features to avoid relying on external APIs.

```bash
npm run dev
```

This will start the development server with hot reloading at http://localhost:3000.

For a smarter development experience that includes a build step:

```bash
npm run dev:smart
```

## Production Mode (AWS Amplify Simulation)

To test the application in a way that closely mirrors the AWS Amplify deployment environment, use the following command:

```bash
npm run amplify:local
```

This script:
1. Checks for an OpenAI API key in your environment
2. Cleans up previous build artifacts
3. Runs the prebuild script (PDF extraction and analysis)
4. Builds the application with Next.js
5. Runs the postbuild script to copy extracted files
6. Starts the application in production mode

The application will be available at http://localhost:3000.

## Manual Build and Start

If you prefer to run the build and start steps separately:

```bash
# Build the application
npm run build:local

# Start the application
npm start
```

The `build:local` script includes a timeout mechanism to prevent hanging builds.

## Environment Variables

The application requires the following environment variables:

- `OPENAI_API_KEY`: The API key for OpenAI.

For local development, you can create a `.env.local` file with these variables:

```
OPENAI_API_KEY=your-api-key
```

The `amplify:local` script will attempt to source the OpenAI API key from your `.zshrc` file if available.

## Deployment to AWS Amplify

The application is configured for deployment to AWS Amplify. The deployment process is handled by AWS Amplify's CI/CD pipeline.

To manually trigger a build for AWS Amplify:

```bash
npm run amplify:build
```

## Troubleshooting

If you encounter issues with the build process:

1. Check that you have the correct Node.js version installed (see package.json for requirements)
2. Ensure that the OpenAI API key is correctly set
3. Check the logs for any error messages
4. Try cleaning the build artifacts and running the build again:

```bash
rm -rf .next
rm -rf public/extracted/*
npm run amplify:local
```

If the build process hangs, you can use the `build:local` script which includes a timeout mechanism:

```bash
npm run build:local
```
