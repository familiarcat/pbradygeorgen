# AWS Amplify Deployment Checklist

This document provides a comprehensive checklist to ensure that your application is ready for deployment to AWS Amplify.

## Environment Setup

- [x] Node.js version is set to 20 (not 20.x) in Amplify console
- [x] Required environment variables are configured in Amplify:
  - [x] `OPENAI_API_KEY` is set
  - [x] `NEXT_PUBLIC_OPENAI_API_KEY` is set (if needed for client-side)
  - [x] `USE_OPENAI` is set to "true"
- [x] Amplify build settings are configured correctly:
  - [x] Build command: `npm run amplify:build`
  - [x] Start command: `npm run amplify:serve`
- [x] Branch configuration is correct in `amplify-env-config.json`

## Local Testing

- [x] Application builds successfully with `npm run build`
- [x] Application runs successfully in production mode with `npm run start`
- [x] Application builds successfully with Amplify build script: `npm run amplify:build`
- [x] Application runs successfully with Amplify serve script: `npm run amplify:serve`
- [x] Production testing script passes: `npm run test:prod`

## Feature Testing

- [x] Cover Letter functionality works correctly:
  - [x] Title shows "Cover Letter" instead of "Summary"
  - [x] PDF preview generates and displays correctly
  - [x] PDF download works and creates `pbradygeorgen_cover_letter.pdf`
  - [x] Markdown preview and download work correctly
  - [x] Text preview and download work correctly
- [x] Resume functionality works correctly:
  - [x] PDF preview displays correctly
  - [x] PDF download works and creates `pbradygeorgen_resume.pdf`
  - [x] Markdown preview and download work correctly
  - [x] Text preview and download work correctly

## Code Quality

- [x] No TypeScript errors or warnings
- [x] No ESLint errors or warnings
- [x] No console.log statements left in production code (except for intentional debugging)
- [x] No commented-out code blocks
- [x] All files are properly formatted

## Performance

- [x] Application loads quickly in production mode
- [x] PDF generation is performant
- [x] No memory leaks or excessive resource usage

## Pre-Deployment Steps

1. Ensure all changes are committed to the repository:
   ```bash
   git status
   git add .
   git commit -m "Prepare for deployment"
   ```

2. Push changes to the deployment branch:
   ```bash
   git push origin pdf-nextjs
   ```

3. Verify environment variables in Amplify:
   ```bash
   npm run env:list
   ```

4. If needed, push local environment variables to Amplify:
   ```bash
   npm run env:push
   ```

## Post-Deployment Verification

1. Wait for the Amplify build to complete
2. Visit the deployed application URL
3. Test the Cover Letter functionality
4. Test the Resume functionality
5. Verify that all styling is consistent with the Salinger design principles

## Troubleshooting

If deployment fails, check the following:

1. Amplify build logs for errors
2. Environment variables in Amplify console
3. Node.js version in Amplify console
4. Build and start commands in Amplify console
5. Branch configuration in Amplify console

If the application doesn't work as expected after deployment:

1. Check browser console for errors
2. Verify that environment variables are correctly set
3. Test with the same Node.js version locally
4. Check for any environment-specific code that might behave differently in production
