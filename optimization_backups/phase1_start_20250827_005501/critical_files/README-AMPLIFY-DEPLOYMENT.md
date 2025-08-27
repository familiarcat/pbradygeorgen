# AWS Amplify Deployment Instructions (SSR Mode)

This document provides step-by-step instructions for deploying this Next.js application to AWS Amplify using Server-Side Rendering (SSR) capabilities.

## Important: Node.js Version Requirements

This Next.js 15.3.1 application requires **Node.js 18 or higher**. However, AWS Amplify defaults to Node.js 14, which is incompatible.

## SSR vs Static Export

This application is now configured for SSR deployment on Amplify, which provides better performance and SEO benefits compared to static export. AWS Amplify's compute SSR capabilities are specifically designed to work with Next.js applications.

## Deployment Steps

### 1. Initial Setup in AWS Amplify Console

1. Log in to the AWS Management Console
2. Navigate to AWS Amplify
3. Click "New app" > "Host web app"
4. Choose your repository provider (GitHub, BitBucket, etc.)
5. Select your repository and branch (e.g., pdf-next.js)

### 2. Configure Build Settings

**CRITICAL STEP**: You must update the Node.js version in the build settings:

1. In the "Build settings" step of the setup wizard, click "Edit"
2. Under "Build image settings", change the Node.js version to 18.x
3. Alternatively, you can use the provided amplify.yml file which includes `nvm use 18`

### 3. Advanced Settings (Optional but Recommended)

For more control over the build process:

1. In the Amplify Console, go to "App settings" > "Build settings"
2. Under "App build specification", you can override the build spec with:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 18
        - node -v
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. Environment Variables (If Needed)

If your application requires environment variables:

1. Go to "App settings" > "Environment variables"
2. Add any required variables
3. Remember to redeploy after adding variables

### 5. Custom Domain Setup

To use a custom domain with your application:

1. Go to "Hosting" > "Domain management"
2. Click "Add domain"
3. Follow the steps to configure your domain
4. In "Branch mappings", set the production branch to "pdf-next.js"

## Troubleshooting

If you encounter build failures:

1. Check the build logs for specific errors
2. Verify that Node.js 18 is being used during the build
   - Look for "Node version" in the logs
   - It should show v18.x.x, not v14.x.x
3. If Node.js 14 is still being used:
   - Double-check the build image settings
   - Ensure the amplify.yml file is being used
   - Try using the build specification override in the console

## Local Testing

Before deploying, test locally with:

```bash
# Ensure you're using Node.js 18+
node -v

# If needed, switch to Node.js 18
nvm use 18

# Run the Amplify build simulation
npm run amplify:build

# Serve the built files locally
npm run amplify:serve
```

This will help identify any issues before deployment.
