# Node.js Version Configuration for AWS Amplify

This document explains the multiple approaches implemented in this project to ensure AWS Amplify uses Node.js 18 for building the Next.js 15.3.1 application.

## Why Multiple Approaches?

AWS Amplify defaults to Node.js 14, but Next.js 15.3.1 requires Node.js 18+. We've implemented multiple approaches to ensure the correct Node.js version is used, regardless of Amplify's default settings.

## Implemented Approaches

### 1. amplify.yml Configuration

The `amplify.yml` file includes commands to:
- Source NVM
- Install Node.js 18
- Use Node.js 18 for the build

### 2. buildspec.yml Configuration

Similar to amplify.yml but with environment variables defined.

### 3. amplify.env.yml Configuration

An alternative configuration file that Amplify might use.

### 4. Package.json Configuration

- Added `engines` field specifying Node.js 18+ requirement
- Added `prebuild` script that runs before the build and ensures Node.js 18 is used

### 5. .npmrc Configuration

Added `engine-strict=true` to enforce the Node.js version requirement.

### 6. .nvmrc and .node-version Files

Simple files containing "18" to specify the Node.js version for version managers.

### 7. amplify-prebuild.sh Script

A script that runs before the build and ensures Node.js 18 is used.

### 8. .platform/hooks/prebuild/use-node-18.sh

A prebuild hook that ensures Node.js 18 is used (AWS Elastic Beanstalk style).

### 9. amplify-config.json

A configuration file that specifies the Node.js version and other build settings.

## How It Works

When Amplify builds the application, it will encounter at least one of these approaches and use Node.js 18 for the build. This ensures compatibility with Next.js 15.3.1 without requiring manual configuration in the AWS Amplify Console.

## Troubleshooting

If the build still fails with Node.js version issues:

1. Check the build logs to see which Node.js version is being used
2. Verify that the amplify.yml file is being used
3. Consider setting the Node.js version in the Amplify Console as a last resort
