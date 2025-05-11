# Unified Environment for AlexAI

This document explains the unified environment approach for the AlexAI project, which ensures consistent behavior between local development and AWS Amplify deployment.

## Philosophical Framework

Our unified environment approach is guided by four philosophical frameworks:

1. **Hesse's Mathematical Approach**
   - Creating harmonious relationships between local and remote environments
   - Using mathematical principles to determine environment configuration
   - Ensuring consistent color theory application across environments

2. **Salinger's Philosophy of Authentic Design**
   - Ensuring authentic and predictable behavior across all environments
   - Maintaining simplified interfaces with predictive interactions
   - Providing a consistent user experience regardless of environment

3. **Derrida's Approach to Deconstruction**
   - Deconstructing the differences between environments
   - Reconstructing them in a unified way
   - Questioning assumptions about environment-specific behavior

4. **Dante's Methodical Logging**
   - Implementing consistent logging across environments
   - Using structured logging with emojis for visual scanning
   - Providing clear guidance through the "circles" of development and deployment

## Components of the Unified Environment

### 1. UnifiedEnvironment.ts

This utility provides a consistent way to detect and configure the environment:

```typescript
import { unifiedEnvironment } from './UnifiedEnvironment';

// Check if we're running in AWS Amplify
if (unifiedEnvironment.isAmplify) {
  // Amplify-specific code
}

// Check if we should use S3 storage
if (unifiedEnvironment.useS3) {
  // S3 storage code
}
```

Key features:
- Environment detection (development, production, test)
- Platform detection (local, amplify)
- Storage type determination (local, s3)
- Consistent configuration across client and server

### 2. UnifiedStorageService.ts

This service provides a unified interface for storage operations:

```typescript
import { unifiedStorage } from './UnifiedStorageService';

// Upload a file
const result = await unifiedStorage.uploadFile(fileBuffer, 'path/to/file.pdf');

// Upload text content
const result = await unifiedStorage.uploadText('Hello, world!', 'path/to/file.txt');

// Upload JSON content
const result = await unifiedStorage.uploadJson({ hello: 'world' }, 'path/to/file.json');
```

Key features:
- Works consistently across local development and AWS Amplify
- Automatically uses the appropriate storage mechanism (local file system or S3)
- Provides a unified interface for all storage operations
- Maintains metadata consistently across environments

### 3. Unified Environment Setup Script

This script sets up the environment consistently for both local development and AWS Amplify deployment:

```bash
# Set up for local development
npm run env:setup:local

# Set up for AWS Amplify deployment
npm run env:setup:amplify
```

Key features:
- Creates necessary directories
- Sets environment variables
- Configures S3 bucket if needed
- Provides guidance for next steps

## Usage

### Local Development

To set up and run the application for local development:

```bash
# Set up the environment for local development
npm run setup:local

# Or manually:
npm run env:setup:local
npm run dev:smart
```

This will:
1. Set up the environment for local development
2. Run the development server with hot reloading
3. Use local file system for storage
4. Use mock data for OpenAI if no API key is provided

### AWS Amplify Deployment

To set up and test the application for AWS Amplify deployment:

```bash
# Set up the environment for AWS Amplify deployment
npm run setup:amplify

# Or manually:
npm run env:setup:amplify
npm run build
npm run start
```

This will:
1. Set up the environment for AWS Amplify deployment
2. Build the application
3. Start the application in production mode
4. Use S3 for storage
5. Use OpenAI for analysis

## Environment Variables

The unified environment approach uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `AMPLIFY_USE_LOCAL` | Use local file system for storage | `true` for local, `false` for Amplify |
| `AMPLIFY_USE_STORAGE` | Use S3 for storage | `false` for local, `true` for Amplify |
| `S3_BUCKET_NAME` | S3 bucket name | `alexai-pdf-storage-prod` |
| `S3_REGION` | S3 region | `us-east-1` |
| `USE_OPENAI` | Use OpenAI for analysis | `false` for local, `true` for Amplify |
| `DEBUG_LOGGING` | Enable debug logging | `true` |

## Troubleshooting

### Local Development Issues

If you encounter issues with local development:

1. Check that the environment is set up correctly:
   ```bash
   npm run env:setup:local
   ```

2. Ensure that the necessary directories exist:
   ```
   public/extracted/
   public/analyzed/
   public/cover-letters/
   public/downloads/
   ```

3. Check that the default PDF exists:
   ```
   public/default_resume.pdf
   ```

### AWS Amplify Deployment Issues

If you encounter issues with AWS Amplify deployment:

1. Check that the environment is set up correctly:
   ```bash
   npm run env:setup:amplify
   ```

2. Ensure that the S3 bucket is configured:
   ```bash
   npm run env:s3
   ```

3. Check that the OpenAI API key is set:
   ```bash
   npm run env:openai
   ```

4. Test the Amplify build locally:
   ```bash
   npm run amplify:test
   ```

## Conclusion

The unified environment approach ensures that the AlexAI project behaves consistently across local development and AWS Amplify deployment. By following the philosophical frameworks of Hesse, Salinger, Derrida, and Dante, we create a harmonious, authentic, deconstructed, and methodical approach to environment management.
