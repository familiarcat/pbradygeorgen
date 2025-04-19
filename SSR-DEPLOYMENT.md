# Next.js SSR Deployment on AWS Amplify (2025)

This document explains how this Next.js 15 application is configured for Server-Side Rendering (SSR) deployment on AWS Amplify.

## SSR vs Static Export

Previously, this application was configured as a static export using `output: 'export'` in next.config.ts. However, AWS Amplify in 2025 has improved support for Next.js SSR applications, which provides several benefits:

- **Better Performance**: Server-side rendering can improve performance for dynamic content
- **SEO Benefits**: Content is pre-rendered on the server, making it more accessible to search engines
- **Dynamic Content**: Ability to fetch data at request time rather than build time
- **API Routes**: Support for Next.js API routes

## Key Configuration Changes

1. **Removed `output: 'export'` from next.config.ts**:
   - This enables Next.js to generate both static and server-rendered content

2. **Updated amplify.yml**:
   - Changed `baseDirectory` from `out` to `.next`
   - Simplified the build configuration

3. **Updated package.json**:
   - Changed `start` script from `serve out` to `next start`
   - Updated `amplify:serve` script to use `next start`

4. **Added amplify.json**:
   - Explicitly set `"type": "ssr"` for the hosting configuration

## How It Works

When Amplify builds the application:

1. It runs `npm run build`, which generates the `.next` directory
2. It recognizes this as an SSR application based on the configuration
3. It sets up the necessary compute resources to handle server-side rendering
4. It serves static assets from the CDN and dynamic content from the compute resources

## Local Development

For local development, you can still use:

```bash
npm run dev
```

To test the production build locally:

```bash
npm run build
npm start
```

## Deployment

The deployment process is handled by AWS Amplify's CI/CD pipeline:

1. Push changes to the repository
2. Amplify detects the changes and starts the build process
3. The application is built and deployed to the Amplify hosting environment
4. The application is available at the provided URL

## Troubleshooting

If you encounter issues with the SSR deployment:

1. Check the Amplify build logs for errors
2. Verify that the Node.js version is set to 18 or higher
3. Make sure the amplify.yml file is correctly configured
4. Check that the `.next` directory is being generated correctly
