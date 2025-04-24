# Environment Variable Synchronization

This project includes scripts to synchronize environment variables between your local development environment and AWS Amplify.

## Setup

1. **Configure AWS Credentials**

   Run the setup script to configure your AWS credentials:

   ```bash
   ./setup-aws-credentials.sh
   ```

   You will need:
   - AWS Access Key ID
   - AWS Secret Access Key
   - AWS Region (default: us-east-1)

2. **Update Amplify Configuration**

   Make sure the `amplify-env-config.json` file has the correct Amplify app ID and branch:

   ```json
   {
     "appId": "YOUR_AMPLIFY_APP_ID",
     "branch": "YOUR_DEFAULT_BRANCH",
     "profile": "default",
     "region": "us-east-1",
     "environments": {
       "dev": {
         "branch": "YOUR_DEV_BRANCH"
       },
       "staging": {
         "branch": "YOUR_STAGING_BRANCH"
       },
       "prod": {
         "branch": "YOUR_PROD_BRANCH"
       }
     }
   }
   ```

## Usage

### Pull Environment Variables from AWS Amplify

To pull environment variables from AWS Amplify to your local `.env.local` file:

```bash
npm run env:pull
```

Or for a specific environment:

```bash
npm run env:pull -- dev
npm run env:pull -- staging
npm run env:pull -- prod
```

### Push Environment Variables to AWS Amplify

To push environment variables from your local `.env.local` file to AWS Amplify:

```bash
npm run env:push
```

Or for a specific environment:

```bash
npm run env:push -- dev
npm run env:push -- staging
npm run env:push -- prod
```

### List Environment Variables in AWS Amplify

To list the environment variables currently set in AWS Amplify:

```bash
npm run env:list
```

Or for a specific environment:

```bash
npm run env:list -- dev
npm run env:list -- staging
npm run env:list -- prod
```

## Troubleshooting

If you encounter issues with the AWS CLI, make sure:

1. You have the AWS CLI installed:
   ```bash
   aws --version
   ```

2. Your AWS credentials are correctly configured:
   ```bash
   aws configure list
   ```

3. You have the necessary permissions to access the Amplify app.

4. The Amplify app ID and branch in `amplify-env-config.json` are correct.

## Security Notes

- Never commit your AWS credentials to version control
- Be careful with sensitive environment variables like API keys
- Consider using AWS Secrets Manager for highly sensitive information
