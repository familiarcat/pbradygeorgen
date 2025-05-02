# Setting Up OpenAI API Key for AWS Amplify

This application uses OpenAI's API for analyzing PDF content. To ensure proper functionality when deployed on AWS Amplify, you need to set up the OpenAI API key as an environment variable.

## Automated Setup (Recommended)

We've created a script that automatically syncs your local OpenAI API key with AWS Amplify:

```bash
# Check and sync OpenAI API key with Amplify
npm run env:openai

# For a specific environment (dev, staging, prod)
npm run env:openai -- dev
```

This script will:
1. Check if the OpenAI API key is configured locally
2. Check if the OpenAI API key is configured in Amplify
3. If needed, push your local key to Amplify automatically

## Manual Setup

If the automated setup doesn't work, you can manually add the OpenAI API key to Amplify:

1. Log in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your application
3. Go to the "Environment variables" section
4. Add a new environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
5. Save the changes
6. Redeploy your application

Alternatively, you can use our environment variable management script:

```bash
# Push all environment variables from .env.local to Amplify
npm run env:push

# For a specific environment (dev, staging, prod)
npm run env:push -- dev
```

## Verifying the Environment Variable

After setting up the environment variable, you can verify it's working by:

1. Checking the build logs for any OpenAI-related warnings
2. Looking for the message "✅ ChatGPT analysis completed successfully" in the build logs
3. Running `npm run env:list` to see all configured environment variables

## Troubleshooting

If you see the warning "⚠️ OpenAI API key is not available, skipping analysis" in your build logs, it means:

1. The OpenAI API key environment variable is not set correctly
2. The application is falling back to using placeholder content

The application will still build and deploy successfully without the OpenAI API key, but the PDF analysis features will be limited.

## Local Development33a3aeb9-0a69-4958-b49c-acf998f7a871

For local development, you can set the OpenAI API key in a `.env.local` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

This file should not be committed to your repository.

If you're using zsh, you can add the OpenAI API key to your `.zshrc` file:

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

Then reload your shell configuration:

```bash
source ~/.zshrc
```
