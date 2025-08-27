# Production Testing Guide

This guide explains how to test the application in a production-like environment that closely mirrors the AWS Amplify 2025 deployment environment.

## Why Test in Production Mode?

Testing in production mode offers several advantages:

1. **Environment Parity**: The production build process closely mirrors how the application will run on AWS Amplify
2. **Performance Testing**: Production builds have different performance characteristics than development builds
3. **Environment Variable Handling**: Production builds process environment variables differently
4. **Optimization Verification**: Next.js applies various optimizations during the build process
5. **Server-Side Rendering Validation**: Ensures server-side rendering works correctly in the production environment

## Automated Testing Script

We've created an automated testing script that handles the build, start, and testing process:

```bash
npm run test:prod
```

This script:

1. Checks for Node.js compatibility with AWS Amplify 2025 (Node.js 20)
2. Verifies environment variables are properly configured
3. Cleans previous builds
4. Runs the prebuild script (PDF content extraction)
5. Builds the application in production mode
6. Starts the application on an available port
7. Opens a browser for manual testing
8. Runs a basic health check
9. Provides instructions for manual testing

## Manual Testing Checklist

After running the automated script, perform these manual tests:

- [ ] Verify the application loads correctly in the browser
- [ ] Test the Cover Letter functionality
  - [ ] Preview works correctly
  - [ ] PDF download generates a properly formatted file
  - [ ] Markdown download works
  - [ ] Text download works
- [ ] Test the Resume download functionality
  - [ ] Preview works correctly
  - [ ] PDF download works
  - [ ] Markdown download works
  - [ ] Text download works
- [ ] Verify all styling is consistent with the Salinger design principles
- [ ] Check that server-side processing works correctly
- [ ] Verify that environment variables are properly accessed

## CI/CD Integration

This testing process is also integrated into our CI/CD pipeline through GitHub Actions. The workflow:

1. Runs on pushes to main and develop branches
2. Runs on pull requests to main and develop branches
3. Can be manually triggered
4. Sets up Node.js 20 (AWS Amplify 2025 compatible)
5. Builds the application
6. Starts the server and runs a health check
7. Uploads the build artifacts for inspection

## AWS Amplify 2025 Compatibility

To ensure compatibility with AWS Amplify 2025:

1. **Node.js Version**: Use Node.js 20 (not 20.x) in the Amplify console
2. **Environment Variables**: Ensure OPENAI_API_KEY is set in the Amplify environment
3. **Build Settings**: The build command should be `npm run amplify:build`
4. **Start Command**: The start command should be `npm run amplify:serve`

## Troubleshooting

If you encounter issues during production testing:

1. **Build Failures**: Check the console output for specific error messages
2. **Server Start Issues**: Verify no other process is using port 3000
3. **Environment Variables**: Ensure .env.local contains the necessary variables
4. **PDF Processing**: Verify the PDF file exists and is accessible
5. **API Calls**: Check network requests for any failed API calls

For more detailed troubleshooting, examine the server logs and browser console.
