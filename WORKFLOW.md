# Development Workflow Guide

This document provides a streamlined workflow for developing, testing, and deploying the application.

## Simplified Workflow

The development workflow has been simplified to two main commands:

1. **Build and Test**: `npm run build`
2. **Start and Verify**: `npm run start`

This workflow ensures that your code is thoroughly tested before pushing to git and deploying to AWS Amplify.

## Development Workflow Steps

### 1. Local Development (UI Changes)

For UI changes and rapid development with hot reloading:

```bash
npm run dev
```

This starts the development server with hot reloading at http://localhost:3000. It uses mock data for some features to avoid relying on external APIs.

### 2. Build and Test

When you're ready to test your changes more thoroughly:

```bash
npm run build
```

This consolidated build script:
- Runs linting to ensure code quality
- Cleans up previous build artifacts
- Runs the prebuild script (PDF extraction and analysis)
- Builds the application with Next.js
- Runs the postbuild script to copy extracted files
- Tests the download functionality
- Generates a detailed test report

The build process creates log files in the `logs` directory for troubleshooting.

### 3. Start and Verify

After a successful build, start the application in production mode:

```bash
npm run start
```

This consolidated start script:
- Starts the application in production mode
- Runs basic health checks to ensure the application is working correctly
- Provides real-time feedback on the application status

The application will be available at http://localhost:3000.

### 4. Commit and Push

Once you've verified that everything works correctly:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. Push to the repository:
   ```bash
   git push
   ```

## Automated Testing

The build process includes automated testing of the Download Resume functionality. You can also run these tests separately:

```bash
npm run test:download
```

This generates a detailed HTML report showing test results.

## Git Hooks

To automatically run tests before committing:

```bash
npm run setup:git-hooks
```

This will install a pre-commit hook that runs tests automatically when you try to commit changes.

## Philosophical Framework

The development workflow embodies our four philosophical principles:

- **Hesse (Structure and Balance)**: Structured, balanced approach to development and testing
- **Salinger (Authenticity)**: Authentic validation of functionality across different environments
- **Derrida (Deconstruction)**: Deconstructing the application to verify functionality at different levels
- **Dante (Navigation)**: Guided journey through development, testing, and deployment

## Troubleshooting

If you encounter issues:

1. Check the log files in the `logs` directory
2. Run `npm run lint:fix` to fix linting issues
3. Clear the build artifacts and try again:
   ```bash
   rm -rf .next
   rm -rf public/extracted/*
   npm run build
   ```

4. If you see 404 errors for static assets (CSS, JavaScript, fonts), run:
   ```bash
   npm run fix:static
   ```
   Then restart the application with `npm run start`

5. If the application won't start, check if another instance is already running:
   ```bash
   lsof -i :3000
   ```

## AWS Amplify Deployment

The application is configured for deployment to AWS Amplify. The deployment process is handled by AWS Amplify's CI/CD pipeline.

To manually trigger a build for AWS Amplify:

```bash
npm run amplify:build
```
