# Development and Deployment Guide

This document outlines the unified development and deployment process for this Next.js application.

## Local Development

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   This will start the Next.js development server with Turbopack at http://localhost:3000.

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them locally.

3. **Run linting**:
   ```bash
   npm run lint
   ```

4. **Test the production build locally**:
   ```bash
   npm run build
   npm start
   ```

## Amplify Deployment Process

### Local Testing of Amplify Build

Before deploying to Amplify, you can simulate the Amplify build process locally:

```bash
# Run the Amplify build simulation
npm run amplify:build

# Serve the built files locally
npm run amplify:serve
```

This ensures that your changes will build successfully in the Amplify environment.

### Deployment to Amplify

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. **Deploy to Amplify**:
   ```bash
   ./deploy.sh pdf-next.js
   ```
   This script will:
   - Check out the pdf-next.js branch
   - Run a local build to verify everything works
   - Push to the remote branch, which triggers the Amplify deployment

3. **Monitor the deployment** in the AWS Amplify Console.

### Amplify Configuration

The Amplify build process is configured in `amplify.yml` with:

- **Build Commands**: Installs dependencies and builds the static site
- **Output Directory**: `out` directory containing the static files
- **Cache Settings**: Optimized for different file types
- **Redirects**: Configured for client-side routing

## Unified Workflow

This project uses a unified workflow that ensures consistency between local development and Amplify deployment:

1. **Same Build Output**: Both local and Amplify builds generate the same static output
2. **Consistent Dependencies**: Using package-lock.json ensures the same dependencies are used
3. **Environment Parity**: The build.sh script simulates the Amplify environment locally
4. **Automated Deployment**: The deploy.sh script streamlines the deployment process

## Troubleshooting

### Local Development Issues

- **Module not found errors**: Run `npm install` to ensure all dependencies are installed
- **Build errors**: Check the error messages and fix the issues in your code
- **Styling issues**: Make sure Tailwind CSS is properly configured

### Amplify Deployment Issues

- **Build failures**: Check the Amplify Console for detailed error logs
- **Missing files**: Verify that all required files are committed to the repository
- **Environment variables**: Ensure all required environment variables are set in the Amplify Console
- **Cache issues**: Try clearing the cache in the Amplify Console

## Best Practices

1. **Always test locally** before deploying to Amplify
2. **Use feature branches** for development
3. **Keep dependencies updated** regularly
4. **Monitor Amplify builds** for any issues
5. **Review Amplify logs** to optimize build performance

By following this unified workflow, you ensure a smooth development and deployment process that works consistently across environments.
