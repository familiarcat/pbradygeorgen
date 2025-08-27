# Environment Variables Management

This document explains how to manage environment variables between your local development environment and AWS Amplify deployments.

## Overview

Our application uses environment variables for configuration, including API keys, feature flags, and other settings. To ensure consistency between local development and deployed environments, we've implemented tools to sync these variables.

## Configuration

Environment variables are managed in the following files:

- `.env.local`: Local development environment variables (not committed to git)
- `.env.example`: Template for environment variables (committed to git)
- `amplify-env-config.json`: Configuration for AWS Amplify environments

## AWS Amplify Environment Variables

AWS Amplify stores environment variables at the branch level. These variables are:

1. Used during the build process
2. Available to server-side code at runtime
3. Can be accessed via `process.env.VARIABLE_NAME`

## Tools

We've created scripts to manage environment variables:

### Amplify Environment Manager

The `amplify-env-manager.js` script provides commands to:

1. **Pull** environment variables from AWS Amplify to your local `.env.local` file
2. **Push** environment variables from your local `.env.local` file to AWS Amplify
3. **List** environment variables currently set in AWS Amplify

### Usage

```bash
# Pull environment variables from AWS Amplify (default: dev environment)
npm run env:pull

# Pull environment variables from a specific environment
npm run env:pull -- prod

# Push environment variables to AWS Amplify (default: dev environment)
npm run env:push

# Push environment variables to a specific environment
npm run env:push -- prod

# List environment variables in AWS Amplify (default: dev environment)
npm run env:list

# List environment variables in a specific environment
npm run env:list -- prod
```

## Setup

Before using these tools, you need to:

1. Install the AWS CLI and configure it with appropriate credentials
2. Update `amplify-env-config.json` with your Amplify app ID and branch information

```json
{
  "appId": "YOUR_AMPLIFY_APP_ID",
  "branch": "main",
  "profile": "default",
  "region": "us-east-1",
  "environments": {
    "dev": {
      "branch": "develop"
    },
    "staging": {
      "branch": "staging"
    },
    "prod": {
      "branch": "main"
    }
  }
}
```

## Best Practices

1. **Never commit sensitive values** to git (API keys, secrets, etc.)
2. Always use `.env.local` for local development
3. Use `npm run env:pull` after cloning the repository or switching branches
4. Use `npm run env:push` when adding new environment variables
5. Update `.env.example` when adding new environment variables (without real values)
6. Use descriptive names for environment variables (e.g., `OPENAI_API_KEY` instead of `API_KEY`)

## Sensitive Variables

For sensitive variables like API keys:

1. Add them to `.env.local` locally
2. Push them to AWS Amplify using `npm run env:push`
3. Never commit them to git
4. Add them to `.env.example` with placeholder values

## Troubleshooting

If you encounter issues:

1. Ensure AWS CLI is installed and configured correctly
2. Check that `amplify-env-config.json` has the correct app ID and branch
3. Verify that you have the necessary permissions in AWS
4. Check the AWS Amplify console for any error messages
