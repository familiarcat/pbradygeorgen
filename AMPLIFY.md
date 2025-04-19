# AWS Amplify Deployment Guide

This document outlines how to deploy this Next.js 15 application to AWS Amplify using Server-Side Rendering (SSR).

## Deployment Configuration

This project is configured for SSR deployment on AWS Amplify. The build process generates both static assets and server-side components in the `.next` directory.

## Branch Configuration

- **Main Branch**: Production environment
- **pdf-next.js Branch**: Custom domain deployment

## Build Settings

The build settings are defined in `amplify.yml` at the project root. Key settings:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x or higher
- **Deployment Type**: SSR (Server-Side Rendering)

## Custom Domain Setup

1. In the Amplify Console, go to "Hosting" > "Domain management"
2. Select your custom domain
3. In "Branch mappings", update the production branch to "pdf-next.js"
4. Save changes

## Performance Optimizations

The deployment is optimized with:

- **Caching Strategies**: Different cache policies for static assets vs. HTML
- **Client-Side Routing**: Proper redirects for SPA navigation
- **Optimized PDF Viewing**: Native browser PDF viewer with custom UI

## Troubleshooting

If you encounter build issues:

1. Check the build logs for specific errors
2. Ensure Node.js version is compatible (18.x or higher)
   - The project requires Node.js 18+ due to Next.js 15.3.1 requirements
   - Amplify defaults to Node.js 14, which is incompatible
   - Our amplify.yml includes `nvm use 18` to switch to Node.js 18
   - You can also set the Node.js version in the Amplify Console under Build settings
3. Verify that the `output: 'export'` setting is NOT in next.config.ts (we want SSR capabilities)
4. Make sure package-lock.json is committed (not yarn.lock)

## Local Testing

To test the Amplify build process locally:

```bash
# Simulate the Amplify build process
npm run amplify:build

# Serve the built files locally
npm run amplify:serve
```

This simulates the same build process that Amplify will use.

## CI/CD Workflow

1. **Development**: Work on feature branches
2. **Testing**: Merge to development branch for testing
3. **Staging**: Deploy to staging environment (if applicable)
4. **Production**: Merge to pdf-next.js branch for production deployment

## Environment Variables

Any environment variables needed for the build should be configured in the Amplify Console:

1. Go to "Hosting" > "Environment variables"
2. Add variables needed for your build
3. These will be available during the build process

## Security Best Practices

- All traffic is served over HTTPS
- Cache-Control headers are set to appropriate values
- Content Security Policy is configured for optimal security
